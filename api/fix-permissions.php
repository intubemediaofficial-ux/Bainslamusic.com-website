<?php
// Quick diagnostic & permission fixer for Hostinger
header('Content-Type: application/json');

$dataDir = __DIR__ . '/../data/';
$file = $dataDir . 'content.json';
$result = [];

// Check directory
$result['data_dir_exists'] = is_dir($dataDir);
$result['data_dir_writable'] = is_writable($dataDir);
$result['data_dir_perms'] = substr(sprintf('%o', fileperms($dataDir)), -4);

// Check file
$result['file_exists'] = file_exists($file);
if (file_exists($file)) {
    $result['file_writable'] = is_writable($file);
    $result['file_perms'] = substr(sprintf('%o', fileperms($file)), -4);
    $result['file_size'] = filesize($file);
    $result['file_owner'] = posix_getpwuid(fileowner($file))['name'] ?? fileowner($file);
}

// Current PHP user
$result['php_user'] = get_current_user();
$result['php_uid'] = getmyuid();

// Session info
session_start();
$result['session_save_path'] = session_save_path();
$result['session_writable'] = is_writable(session_save_path() ?: sys_get_temp_dir());

// Try to fix permissions
if (!is_writable($dataDir)) {
    @chmod($dataDir, 0755);
    $result['fix_dir'] = is_writable($dataDir) ? 'fixed' : 'failed';
}
if (file_exists($file) && !is_writable($file)) {
    @chmod($file, 0644);
    $result['fix_file'] = is_writable($file) ? 'fixed' : 'failed';
}

// Test write
$testFile = $dataDir . '.write_test_' . time();
$testResult = @file_put_contents($testFile, 'test');
$result['write_test'] = $testResult !== false ? 'OK' : 'FAILED';
if ($testResult !== false) @unlink($testFile);

echo json_encode($result, JSON_PRETTY_PRINT);
