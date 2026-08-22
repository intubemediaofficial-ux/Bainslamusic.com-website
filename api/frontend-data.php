<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

// Only accept POST for inquiry submissions
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

$input = json_decode(file_get_contents('php://input'), true);
if (!$input || empty($input['name'])) {
    jsonResponse(['error' => 'Name is required'], 400);
}

$data = readData();
if (!isset($data['inquiries'])) $data['inquiries'] = [];

$inquiry = [
    'id' => uniqid(),
    'name' => $input['name'] ?? '',
    'email' => $input['email'] ?? '',
    'phone' => $input['phone'] ?? '',
    'type' => $input['type'] ?? 'General',
    'message' => $input['message'] ?? '',
    'created_at' => date('Y-m-d H:i:s')
];

$data['inquiries'][] = $inquiry;
writeData($data);

// Inquiry ki copy email pe bhi bhejo (mail.json configured ho to)
require_once 'mailer.php';
$esc = function ($v) { return htmlspecialchars((string) $v, ENT_QUOTES, 'UTF-8'); };
$body = '<h2 style="font-family:Arial">Nayi inquiry — bainslamusic.com</h2><table style="font-family:Arial;font-size:14px" cellpadding="6">'
    . '<tr><td><b>Name</b></td><td>' . $esc($inquiry['name']) . '</td></tr>'
    . '<tr><td><b>Email</b></td><td>' . $esc($inquiry['email']) . '</td></tr>'
    . '<tr><td><b>Phone</b></td><td>' . $esc($inquiry['phone']) . '</td></tr>'
    . '<tr><td><b>Subject</b></td><td>' . $esc($inquiry['type']) . '</td></tr>'
    . '<tr><td><b>Message</b></td><td>' . nl2br($esc($inquiry['message'])) . '</td></tr>'
    . '<tr><td><b>Time</b></td><td>' . $esc($inquiry['created_at']) . '</td></tr></table>';
$mailed = sendMailSmtp('Website inquiry: ' . ($inquiry['name'] ?: 'Unknown') . ' — ' . $inquiry['type'], $body, $inquiry['email']);
if ($mailed !== true) {
    error_log('inquiry mail failed: ' . $mailed);
}

jsonResponse(['success' => true, 'message' => 'Inquiry submitted successfully', 'mailed' => $mailed === true]);
