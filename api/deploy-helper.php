<?php
// One-time deploy helper - downloads fixed files and applies them
// DELETE THIS FILE AFTER USE
header('Content-Type: text/html; charset=utf-8');
echo "<h2>🔧 Bainsla Music — Admin Fix Deploy</h2><pre>\n";

$base = dirname(__DIR__);

// Step 1: Fix api/config.php directly
echo "Step 1: Updating api/config.php...\n";
$configCode = <<<'PHPCODE'
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
define('ADMIN_USER', 'admin');
define('ADMIN_PASS', 'Bainsla@2024');

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
    if (!is_dir(DATA_DIR)) {
        mkdir(DATA_DIR, 0755, true);
    }
    if (!is_writable(DATA_DIR)) {
        @chmod(DATA_DIR, 0755);
    }
    if (file_exists($file) && !is_writable($file)) {
        @chmod($file, 0644);
    }
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    if ($json === false) {
        jsonResponse(['error' => 'Failed to encode data: ' . json_last_error_msg()], 500);
    }
    $result = file_put_contents($file, $json, LOCK_EX);
    if ($result === false) {
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
PHPCODE;

$r = file_put_contents($base . '/api/config.php', $configCode);
echo $r !== false ? "✅ config.php updated ({$r} bytes)\n" : "❌ config.php FAILED\n";

// Step 2: Fix permissions on data directory
echo "\nStep 2: Fixing permissions...\n";
$dataDir = $base . '/data/';
$dataFile = $dataDir . 'content.json';

if (is_dir($dataDir)) {
    @chmod($dataDir, 0755);
    echo "  data/ dir: " . (is_writable($dataDir) ? '✅ writable' : '❌ NOT writable') . " (perms: " . substr(sprintf('%o', fileperms($dataDir)), -4) . ")\n";
} else {
    mkdir($dataDir, 0755, true);
    echo "  data/ dir: ✅ created\n";
}

if (file_exists($dataFile)) {
    @chmod($dataFile, 0644);
    echo "  content.json: " . (is_writable($dataFile) ? '✅ writable' : '❌ NOT writable') . " (perms: " . substr(sprintf('%o', fileperms($dataFile)), -4) . ", size: " . filesize($dataFile) . " bytes)\n";
}

// Step 3: Test write operation
echo "\nStep 3: Testing write...\n";
$testFile = $dataDir . '.write_test';
$wr = @file_put_contents($testFile, 'test_' . time());
echo $wr !== false ? "  ✅ Write test PASSED\n" : "  ❌ Write test FAILED\n";
if ($wr !== false) @unlink($testFile);

// Step 4: Test full CRUD flow
echo "\nStep 4: Testing full CRUD flow...\n";
$data = json_decode(file_get_contents($dataFile), true);
if ($data) {
    $origName = $data['labels'][0]['name'] ?? 'Unknown';
    $data['labels'][0]['name'] = 'TEST_' . $origName;
    $w1 = file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
    if ($w1 !== false) {
        // Verify
        $verify = json_decode(file_get_contents($dataFile), true);
        if (($verify['labels'][0]['name'] ?? '') === 'TEST_' . $origName) {
            echo "  ✅ CRUD test PASSED (write + read verified)\n";
            // Revert
            $data['labels'][0]['name'] = $origName;
            file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
            echo "  ✅ Reverted test change\n";
        } else {
            echo "  ❌ CRUD test FAILED (write succeeded but read mismatch)\n";
        }
    } else {
        echo "  ❌ CRUD test FAILED (write failed)\n";
    }
} else {
    echo "  ❌ Could not read content.json\n";
}

// Step 5: Session test
echo "\nStep 5: Testing sessions...\n";
session_start();
$_SESSION['deploy_test'] = 'ok';
echo "  Session ID: " . session_id() . "\n";
echo "  Session save path: " . (session_save_path() ?: sys_get_temp_dir()) . "\n";
echo "  Session writable: " . (is_writable(session_save_path() ?: sys_get_temp_dir()) ? '✅ YES' : '❌ NO') . "\n";

// Environment info
echo "\n--- Environment ---\n";
echo "PHP: " . PHP_VERSION . "\n";
echo "Server: " . ($_SERVER['SERVER_SOFTWARE'] ?? 'unknown') . "\n";
echo "User: " . get_current_user() . " (UID: " . getmyuid() . ")\n";

echo "\n</pre>";
echo "<h3 style='color:green'>🎉 Deploy complete!</h3>";
echo "<p><a href='/admin/' style='font-size:20px;color:blue'>➡️ Go to Admin Panel</a></p>";
echo "<p style='color:red;font-weight:bold'>⚠️ DELETE this file from File Manager after testing! (api/deploy-helper.php)</p>";
