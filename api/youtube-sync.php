<?php
/**
 * Bainsla Music YouTube channel se naye release "Latest Releases" mein le aata hai.
 * CLI only, cron se chalta hai:
 *
 *   *\/15 * * * * php /var/www/bainslamusic.com/api/youtube-sync.php
 *
 * Channel ka public RSS feed use hota hai (koi API key nahi chahiye). Naye videos
 * hi add hote hain (video_id se dedup), admin ke manually edit kiye gaye releases
 * chhede nahi jaate. Config: data/youtube-sync.json
 */
if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    exit("CLI only\n");
}

$dataFile = __DIR__ . '/../data/content.json';
$confFile = __DIR__ . '/../data/youtube-sync.json';

$conf = array_replace([
    'handle' => '@bainslaofficial',
    'channel_id' => 'UC3kNEJgTMm9teWwXQOEh1EA',
    'max_releases' => 40,
    'default_artist' => 'Bainsla Music',
], file_exists($confFile) ? (json_decode(file_get_contents($confFile), true) ?: []) : []);

function httpGet($url) {
    if (!function_exists('curl_init')) {
        $ctx = stream_context_create(['http' => [
            'timeout' => 30,
            'header' => "User-Agent: Mozilla/5.0 (compatible; BainslaMusicBot/1.0)\r\n",
        ]]);
        $body = @file_get_contents($url, false, $ctx);
        return $body === false ? null : $body;
    }
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_USERAGENT => 'Mozilla/5.0 (compatible; BainslaMusicBot/1.0)',
    ]);
    $body = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return ($code === 200 && $body !== false) ? $body : null;
}

/** Handle (@name) se channel id (UC...) nikaalta hai */
function resolveChannelId($handle) {
    $html = httpGet('https://www.youtube.com/' . ltrim($handle, '/'));
    if ($html === null) {
        return null;
    }
    // RSS/canonical link sabse bharosemand hai (recommended channels ke ids se bachne ke liye)
    if (preg_match('/channel_id=(UC[\w-]{20,})/', $html, $m)) {
        return $m[1];
    }
    if (preg_match('/"channelId":"(UC[\w-]{20,})"/', $html, $m)) {
        return $m[1];
    }
    return null;
}

if ($conf['channel_id'] === '') {
    $conf['channel_id'] = resolveChannelId($conf['handle']) ?: '';
    if ($conf['channel_id'] === '') {
        exit("channel id resolve nahi hui\n");
    }
}

$xml = httpGet('https://www.youtube.com/feeds/videos.xml?channel_id=' . $conf['channel_id']);
if ($xml === null) {
    exit("feed fetch fail\n");
}

$feed = @simplexml_load_string($xml);
if (!$feed) {
    exit("feed parse fail\n");
}
$media = $feed->getNamespaces(true)['media'] ?? 'http://search.yahoo.com/mrss/';
$yt = $feed->getNamespaces(true)['yt'] ?? 'http://www.youtube.com/xml/schemas/2015';

$data = json_decode(file_get_contents($dataFile), true);
if (!is_array($data)) {
    exit("content.json unreadable\n");
}
if (!isset($data['releases']) || !is_array($data['releases'])) {
    $data['releases'] = [];
}

$existing = [];
foreach ($data['releases'] as $r) {
    $vid = $r['video_id'] ?? '';
    if ($vid === '' && !empty($r['url']) && preg_match('/(?:v=|youtu\.be\/|\/shorts\/|\/embed\/)([\w-]{11})/', $r['url'], $m)) {
        $vid = $m[1];
    }
    if ($vid !== '') {
        $existing[$vid] = true;
    }
}

$fresh = [];
foreach ($feed->entry as $entry) {
    $ytData = $entry->children($yt);
    $mediaGroup = $entry->children($media)->group;
    $vid = (string) $ytData->videoId;
    if ($vid === '' || isset($existing[$vid])) {
        continue;
    }
    $title = trim((string) $entry->title);
    $published = substr((string) $entry->published, 0, 10);
    $views = '';
    if (isset($mediaGroup->community->statistics)) {
        $count = (int) $mediaGroup->community->statistics->attributes()->views;
        if ($count >= 1000000) {
            $views = round($count / 1000000, 1) . 'M';
        } elseif ($count >= 1000) {
            $views = round($count / 1000, 1) . 'K';
        } elseif ($count > 0) {
            $views = (string) $count;
        }
    }
    // "Artist | Song" ya "Song | Artist" jaisa title ho to pehla hissa title rehta hai.
    $fresh[] = [
        'id' => 'yt_' . $vid,
        'title' => $title,
        'artist' => $conf['default_artist'],
        'image' => "https://img.youtube.com/vi/$vid/hqdefault.jpg",
        'video_id' => $vid,
        'views' => $views,
        'date' => $published,
        'url' => "https://www.youtube.com/watch?v=$vid",
        'source' => 'youtube-sync',
    ];
    $existing[$vid] = true;
}

if (!$fresh) {
    echo date('c') . " koi naya release nahi\n";
    file_put_contents($confFile, json_encode($conf, JSON_PRETTY_PRINT), LOCK_EX);
    exit;
}

// Naye pehle, phir purane; date ke hisaab se sort aur cap.
$data['releases'] = array_merge($fresh, $data['releases']);
usort($data['releases'], function ($a, $b) {
    return strcmp($b['date'] ?? '', $a['date'] ?? '');
});
$data['releases'] = array_slice($data['releases'], 0, (int) $conf['max_releases']);

file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
file_put_contents($confFile, json_encode($conf, JSON_PRETTY_PRINT), LOCK_EX);

echo date('c') . ' ' . count($fresh) . " naye release add hue: " .
    implode(', ', array_column($fresh, 'video_id')) . "\n";
