<?php
require_once 'config.php';
requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

if (!isset($_FILES['image'])) {
    jsonResponse(['error' => 'No file uploaded'], 400);
}

define('MAX_UPLOAD_BYTES', 5 * 1024 * 1024 * 1024); // 5 GB

$file = $_FILES['image'];
if (($file['error'] ?? UPLOAD_ERR_OK) !== UPLOAD_ERR_OK) {
    jsonResponse(['error' => 'Upload error code ' . $file['error']], 400);
}

$folder = preg_replace('/[^a-zA-Z0-9_-]/', '', $_POST['folder'] ?? 'uploads') ?: 'uploads';
$allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'webm', 'mov', 'avi', 'mkv', 'm4v'];

// Large files arrive as chunks so nginx/PHP request limits are never hit.
$chunkTotal = (int) ($_POST['chunk_total'] ?? 1);
$chunkIndex = (int) ($_POST['chunk_index'] ?? 0);
$uploadId = preg_replace('/[^a-zA-Z0-9]/', '', $_POST['upload_id'] ?? '');
$origName = $_POST['filename'] ?? $file['name'];

$ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION));
if (!in_array($ext, $allowed)) {
    jsonResponse(['error' => 'Invalid file type. Allowed: ' . implode(', ', $allowed)], 400);
}

$uploadDir = __DIR__ . '/../images/' . $folder . '/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0775, true);
}

$finalName = uniqid() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', $origName);
$publicUrl = function ($name) use ($folder) {
    return '/images/' . $folder . '/' . $name;
};

if ($chunkTotal <= 1) {
    if ($file['size'] > MAX_UPLOAD_BYTES) {
        jsonResponse(['error' => 'File too large (max 5 GB)'], 413);
    }
    if (!move_uploaded_file($file['tmp_name'], $uploadDir . $finalName)) {
        jsonResponse(['error' => 'Upload failed'], 500);
    }
    @chmod($uploadDir . $finalName, 0644);
    jsonResponse(['success' => true, 'url' => $publicUrl($finalName), 'filename' => $finalName]);
}

if ($uploadId === '') {
    jsonResponse(['error' => 'upload_id required for chunked upload'], 400);
}

$tmpDir = DATA_DIR . 'tmp/';
if (!is_dir($tmpDir)) {
    mkdir($tmpDir, 0775, true);
}
$partFile = $tmpDir . $uploadId . '.part';

if ($chunkIndex === 0) {
    @unlink($partFile);
}
if ($chunkIndex > 0 && !file_exists($partFile)) {
    jsonResponse(['error' => 'Upload session lost, please retry'], 409);
}
$alreadyStored = file_exists($partFile) ? filesize($partFile) : 0;
if ($alreadyStored + $file['size'] > MAX_UPLOAD_BYTES) {
    @unlink($partFile);
    jsonResponse(['error' => 'File too large (max 5 GB)'], 413);
}

$in = fopen($file['tmp_name'], 'rb');
$out = fopen($partFile, 'ab');
if (!$in || !$out) {
    jsonResponse(['error' => 'Could not write chunk'], 500);
}
flock($out, LOCK_EX);
stream_copy_to_stream($in, $out);
flock($out, LOCK_UN);
fclose($in);
fclose($out);

if ($chunkIndex < $chunkTotal - 1) {
    jsonResponse(['success' => true, 'received' => $chunkIndex + 1, 'of' => $chunkTotal]);
}

if (!rename($partFile, $uploadDir . $finalName)) {
    jsonResponse(['error' => 'Could not finalise upload'], 500);
}
@chmod($uploadDir . $finalName, 0644);
jsonResponse(['success' => true, 'url' => $publicUrl($finalName), 'filename' => $finalName]);
