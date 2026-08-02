<?php
// Fix session for Hostinger/LiteSpeed
ini_set('session.cookie_httponly', 1);
ini_set('session.use_strict_mode', 1);
ini_set('session.cookie_samesite', 'Lax');
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

define('DATA_DIR', __DIR__ . '/../data/');
define('ADMIN_USER', 'shivlalbainslaofficial@gmail.com');
define('ADMIN_PASS', 'AjeetKing@7616061273');

function readData() {
    $file = DATA_DIR . 'content.json';
    if (!file_exists($file)) {
        return ['banners' => [], 'artists' => [], 'releases' => [], 'videos' => [], 'catalogue' => [], 'settings' => [], 'inquiries' => []];
    }
    $content = file_get_contents($file);
    if ($content === false) {
        return ['banners' => [], 'artists' => [], 'releases' => [], 'videos' => [], 'catalogue' => [], 'settings' => [], 'inquiries' => []];
    }
    return json_decode($content, true) ?: [];
}

function writeData($data) {
    $file = DATA_DIR . 'content.json';
    // Ensure directory exists with proper permissions
    if (!is_dir(DATA_DIR)) {
        mkdir(DATA_DIR, 0755, true);
    }
    // Ensure directory is writable
    if (!is_writable(DATA_DIR)) {
        @chmod(DATA_DIR, 0755);
    }
    // Ensure file is writable if it exists
    if (file_exists($file) && !is_writable($file)) {
        @chmod($file, 0644);
    }
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    if ($json === false) {
        jsonResponse(['error' => 'Failed to encode data: ' . json_last_error_msg()], 500);
    }
    // Use LOCK_EX to prevent race conditions
    $result = file_put_contents($file, $json, LOCK_EX);
    if ($result === false) {
        // Retry with permission fix
        @chmod(DATA_DIR, 0755);
        if (file_exists($file)) @chmod($file, 0644);
        $result = file_put_contents($file, $json, LOCK_EX);
        if ($result === false) {
            $err = error_get_last();
            jsonResponse(['error' => 'Write failed: ' . ($err['message'] ?? 'Unknown error') . '. Dir writable: ' . (is_writable(DATA_DIR) ? 'yes' : 'no') . ', File writable: ' . (file_exists($file) && is_writable($file) ? 'yes' : 'no')], 500);
        }
    }
}

function jsonResponse($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function requireAuth() {
    if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
        jsonResponse(['error' => 'Unauthorized. Please login again.', 'session_id' => session_id(), 'session_status' => session_status()], 401);
    }
}
