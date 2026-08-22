<?php
/**
 * Chhota SMTP client — "Get In Touch" form ki inquiry email bhejne ke liye.
 * Config server pe data/mail.json mein rehta hai (repo mein commit nahi hota):
 *
 * {
 *   "host": "smtp.gmail.com", "port": 587, "secure": "tls",
 *   "user": "you@gmail.com", "pass": "app-password",
 *   "from": "you@gmail.com", "from_name": "Bainsla Music Website",
 *   "to": "you@gmail.com"
 * }
 */

function mailConfig() {
    $file = DATA_DIR . 'mail.json';
    if (!file_exists($file)) {
        return null;
    }
    $conf = json_decode(file_get_contents($file), true);
    if (!is_array($conf) || empty($conf['host']) || empty($conf['to'])) {
        return null;
    }
    return array_replace([
        'port' => 587,
        'secure' => 'tls',
        'user' => '',
        'pass' => '',
        'from' => $conf['user'] ?? '',
        'from_name' => 'Bainsla Music Website',
        'reply_to' => '',
    ], $conf);
}

function smtpRead($fp) {
    $out = '';
    while (($line = fgets($fp, 515)) !== false) {
        $out .= $line;
        if (strlen($line) < 4 || $line[3] !== '-') {
            break;
        }
    }
    return $out;
}

function smtpCmd($fp, $cmd, $expect) {
    if ($cmd !== null) {
        fwrite($fp, $cmd . "\r\n");
    }
    $res = smtpRead($fp);
    return in_array((int) substr($res, 0, 3), (array) $expect, true) ? true : $res;
}

/**
 * @return true|string  true on success, error string otherwise
 */
function sendMailSmtp($subject, $bodyHtml, $replyTo = '') {
    $c = mailConfig();
    if (!$c) {
        return 'mail.json config missing';
    }

    $transport = ($c['secure'] === 'ssl') ? 'ssl://' : '';
    $fp = @stream_socket_client($transport . $c['host'] . ':' . $c['port'], $errno, $errstr, 20);
    if (!$fp) {
        return "connect failed: $errstr";
    }
    stream_set_timeout($fp, 20);

    $steps = [[null, 220], ['EHLO bainslamusic.com', 250]];
    foreach ($steps as [$cmd, $expect]) {
        $r = smtpCmd($fp, $cmd, $expect);
        if ($r !== true) { fclose($fp); return "smtp: $r"; }
    }

    if ($c['secure'] === 'tls') {
        $r = smtpCmd($fp, 'STARTTLS', 220);
        if ($r !== true) { fclose($fp); return "starttls: $r"; }
        if (!stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
            fclose($fp);
            return 'tls handshake failed';
        }
        $r = smtpCmd($fp, 'EHLO bainslamusic.com', 250);
        if ($r !== true) { fclose($fp); return "ehlo: $r"; }
    }

    if ($c['user'] !== '') {
        $r = smtpCmd($fp, 'AUTH LOGIN', 334);
        if ($r !== true) { fclose($fp); return "auth: $r"; }
        $r = smtpCmd($fp, base64_encode($c['user']), 334);
        if ($r !== true) { fclose($fp); return "auth user: $r"; }
        $r = smtpCmd($fp, base64_encode($c['pass']), 235);
        if ($r !== true) { fclose($fp); return 'auth failed'; }
    }

    $reply = $replyTo ?: $c['reply_to'];
    $headers = [
        'From: ' . sprintf('%s <%s>', $c['from_name'], $c['from']),
        'To: ' . $c['to'],
        'Subject: =?UTF-8?B?' . base64_encode($subject) . '?=',
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        'Content-Transfer-Encoding: base64',
        'Date: ' . date('r'),
    ];
    if ($reply && filter_var($reply, FILTER_VALIDATE_EMAIL)) {
        $headers[] = 'Reply-To: ' . $reply;
    }
    $message = implode("\r\n", $headers) . "\r\n\r\n" . chunk_split(base64_encode($bodyHtml), 76, "\r\n");

    $r = smtpCmd($fp, 'MAIL FROM:<' . $c['from'] . '>', 250);
    if ($r !== true) { fclose($fp); return "mail from: $r"; }
    foreach (preg_split('/\s*,\s*/', $c['to']) as $rcpt) {
        $r = smtpCmd($fp, 'RCPT TO:<' . $rcpt . '>', [250, 251]);
        if ($r !== true) { fclose($fp); return "rcpt: $r"; }
    }
    $r = smtpCmd($fp, 'DATA', 354);
    if ($r !== true) { fclose($fp); return "data: $r"; }
    fwrite($fp, $message . "\r\n.\r\n");
    $r = smtpCmd($fp, null, 250);
    if ($r !== true) { fclose($fp); return "send: $r"; }
    smtpCmd($fp, 'QUIT', [221, 250]);
    fclose($fp);
    return true;
}
