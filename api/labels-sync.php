<?php
/**
 * Pulls live subscriber / video / view counts for every label that has a
 * YouTube channel URL in the admin panel and writes them back to
 * data/content.json (labels[].subs, .views, .songs).
 *
 * CLI only, meant for cron:
 *
 *   10 *\/6 * * * php /var/www/bainslamusic.com/api/labels-sync.php
 *
 * The public channel page is scraped, so no API key is needed. Labels without
 * a YouTube URL keep whatever the admin entered by hand.
 */
if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    exit("CLI only\n");
}

$dataFile = __DIR__ . '/../data/content.json';

function ytHttpGet($url)
{
    $ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36';
    if (!function_exists('curl_init')) {
        $ctx = stream_context_create(['http' => [
            'timeout' => 30,
            'header' => "User-Agent: $ua\r\nAccept-Language: en-US,en;q=0.9\r\n",
        ]]);
        $body = @file_get_contents($url, false, $ctx);
        return $body === false ? null : $body;
    }
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_USERAGENT => $ua,
        CURLOPT_HTTPHEADER => ['Accept-Language: en-US,en;q=0.9'],
    ]);
    $body = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return ($code === 200 && $body !== false) ? $body : null;
}

/** 525390039 => "525.4M", 682 => "682" */
function compactCount($n)
{
    $n = (float) $n;
    if ($n >= 1000000000) {
        return rtrim(rtrim(number_format($n / 1000000000, 2, '.', ''), '0'), '.') . 'B';
    }
    if ($n >= 1000000) {
        return rtrim(rtrim(number_format($n / 1000000, 1, '.', ''), '0'), '.') . 'M';
    }
    if ($n >= 10000) {
        return rtrim(rtrim(number_format($n / 1000, 1, '.', ''), '0'), '.') . 'K';
    }
    return (string) (int) $n;
}

/** Channel URL (handle, /channel/UC..., /c/...) => ['subs','views','songs'] or null */
function channelStats($url)
{
    $url = trim($url);
    if ($url === '' || !preg_match('~^https?://(www\.)?youtube\.com/~i', $url)) {
        return null;
    }
    $base = preg_replace('~/(about|videos|featured|streams|playlists)/?$~i', '', $url);
    $html = ytHttpGet(rtrim($base, '/') . '/about');
    if ($html === null) {
        return null;
    }
    $stats = [];
    if (preg_match('/"subscriberCountText":"([^"]+)"/', $html, $m)) {
        $stats['subs'] = trim(preg_replace('/subscribers?/i', '', $m[1]));
    }
    if (preg_match('/"videoCountText":"([^"]+)"/', $html, $m)) {
        $stats['songs'] = trim(preg_replace('/videos?/i', '', str_replace(',', '', $m[1])));
    }
    if (preg_match('/"viewCountText":"([^"]+)"/', $html, $m)) {
        $stats['views'] = compactCount(preg_replace('/[^\d]/', '', $m[1]));
    }
    return $stats ?: null;
}

$data = json_decode(file_get_contents($dataFile), true);
if (!is_array($data) || empty($data['labels'])) {
    exit("No labels to sync\n");
}

$changed = false;
foreach ($data['labels'] as $i => $label) {
    $stats = channelStats($label['youtube_url'] ?? '');
    if (!$stats) {
        continue;
    }
    foreach ($stats as $k => $v) {
        if ((string) ($label[$k] ?? '') !== (string) $v) {
            $data['labels'][$i][$k] = $v;
            $changed = true;
        }
    }
    $data['labels'][$i]['yt_synced_at'] = date('Y-m-d H:i:s');
    printf("%s: subs=%s videos=%s views=%s\n", $label['name'] ?? $i, $stats['subs'] ?? '-', $stats['songs'] ?? '-', $stats['views'] ?? '-');
}

if ($changed) {
    file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE), LOCK_EX);
    echo "content.json updated\n";
} else {
    echo "Nothing changed\n";
}
