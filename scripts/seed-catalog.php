<?php
/**
 * Seeds the platform list (Our Presence) and the music categories, and clears
 * the Our Clients & Partners list so the owner can add their own entries.
 * Idempotent: presence/categories are matched by name, only missing ones are added.
 *
 *   php scripts/seed-catalog.php [path/to/content.json]
 */
if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    exit("CLI only\n");
}

$dataFile = $argv[1] ?? __DIR__ . '/../data/content.json';

$audio = [
    ['Spotify', 'spotify', 'https://open.spotify.com/artist/4uLGJavHBsutDtDOzNG18s'],
    ['Apple Music', 'apple-music', 'https://music.apple.com/us/artist/dg-mawai/1576320122'],
    ['YouTube Music', 'youtube-music', 'https://music.youtube.com/'],
    ['JioSaavn', 'jiosaavn', 'https://www.jiosaavn.com/'],
    ['Gaana', 'gaana', 'https://gaana.com/'],
    ['Wynk Music', 'wynk', 'https://wynk.in/music'],
    ['Hungama', 'hungama', 'https://www.hungama.com/'],
    ['Amazon Music', 'amazon-music', 'https://music.amazon.com/'],
    ['Resso', 'resso', 'https://www.resso.com/'],
    ['Deezer', 'deezer', 'https://www.deezer.com/'],
    ['Tidal', 'tidal', 'https://tidal.com/'],
    ['SoundCloud', 'soundcloud', 'https://soundcloud.com/'],
    ['Pandora', 'pandora', 'https://www.pandora.com/'],
    ['Anghami', 'anghami', 'https://www.anghami.com/'],
    ['Boomplay', 'boomplay', 'https://www.boomplay.com/'],
    ['Audiomack', 'audiomack', 'https://audiomack.com/'],
    ['iHeartRadio', 'iheartradio', 'https://www.iheart.com/'],
    ['Napster', 'napster', 'https://www.napster.com/'],
    ['Shazam', 'shazam', 'https://www.shazam.com/'],
    ['Qobuz', 'qobuz', 'https://www.qobuz.com/'],
    ['Saregama', 'saregama', 'https://www.saregama.com/'],
    ['Intube Music', 'intube-music', 'https://www.intubemusic.com/'],
];
$video = [
    ['YouTube', 'youtube', 'https://www.youtube.com/@bainslaofficial'],
    ['Instagram', 'instagram', 'https://www.instagram.com/bainsla_music_company'],
    ['Facebook', 'facebook', 'https://facebook.com/bainslamusic'],
    ['TikTok', 'tiktok', 'https://www.tiktok.com/'],
    ['Snapchat', 'snapchat', 'https://www.snapchat.com/'],
    ['Moj', 'moj', 'https://mojapp.in/'],
    ['ShareChat', 'sharechat', 'https://sharechat.com/'],
    ['Josh', 'josh', 'https://share.myjosh.in/'],
    ['Roposo', 'roposo', 'https://www.roposo.com/'],
    ['MX Player', 'mx-player', 'https://www.mxplayer.in/'],
    ['Dailymotion', 'dailymotion', 'https://www.dailymotion.com/'],
    ['Vimeo', 'vimeo', 'https://vimeo.com/'],
    ['Triller', 'triller', 'https://triller.co/'],
    ['JioTV', 'jiotv', 'https://www.jiocinema.com/'],
    ['Intube Music', 'intube-music', 'https://www.intubemusic.com/'],
];

$categories = [
    ['Hindi', 'Hindi film, pop and independent music from our labels and artists.'],
    ['Gurjar Rasiya', 'The biggest catalogue of Gurjar Rasiya folk hits and viral tracks.'],
    ['Rajasthani', 'Rajasthani folk, love songs and traditional festival music.'],
    ['Marwadi', 'Marwadi songs, lokgeet and wedding classics.'],
    ['Shekhawati', 'Shekhawati regional folk music and cultural songs.'],
    ['Devotional', 'Bhajan, aarti, katha and devotional collections.'],
    ['Haryanvi', 'Haryanvi dance numbers, ragni and desi beats.'],
    ['Bhojpuri', 'Bhojpuri hits, folk songs and film music.'],
];

$data = json_decode(file_get_contents($dataFile), true);
if (!is_array($data)) {
    exit("Cannot read $dataFile\n");
}
foreach (['presence', 'categories', 'clients'] as $k) {
    if (!isset($data[$k]) || !is_array($data[$k])) {
        $data[$k] = [];
    }
}

$norm = function ($s) {
    return strtolower(preg_replace('/\s+/', ' ', trim((string) $s)));
};

$order = 0;
foreach ([['audio', $audio], ['video', $video]] as [$type, $list]) {
    $i = 0;
    foreach ($list as [$name, $slug, $url]) {
        $i++;
        $found = false;
        foreach ($data['presence'] as $idx => $p) {
            if ($norm($p['name'] ?? '') === $norm($name) && ($p['type'] ?? 'audio') === $type) {
                $data['presence'][$idx] = array_merge($p, [
                    'image' => '/images/platforms/' . $slug . '.svg',
                    'sort_order' => $i,
                    'type' => $type,
                    'published' => true,
                ]);
                if (empty($p['url'])) {
                    $data['presence'][$idx]['url'] = $url;
                }
                $found = true;
                break;
            }
        }
        if (!$found) {
            $data['presence'][] = [
                'id' => uniqid(),
                'created_at' => date('Y-m-d H:i:s'),
                'name' => $name,
                'image' => '/images/platforms/' . $slug . '.svg',
                'type' => $type,
                'url' => $url,
                'sort_order' => $i,
                'published' => true,
            ];
            echo "presence added: $name ($type)\n";
        }
    }
}

$i = 0;
foreach ($categories as [$name, $desc]) {
    $i++;
    $found = false;
    foreach ($data['categories'] as $idx => $c) {
        if ($norm($c['name'] ?? '') === $norm($name)) {
            $data['categories'][$idx] = array_merge($c, ['sort_order' => $i]);
            $found = true;
            break;
        }
    }
    if (!$found) {
        $data['categories'][] = [
            'id' => uniqid(),
            'created_at' => date('Y-m-d H:i:s'),
            'name' => $name,
            'description' => $desc,
            'image' => '',
            'url' => '',
            'sort_order' => $i,
            'published' => true,
        ];
        echo "category added: $name\n";
    }
}

$removed = count($data['clients']);
$data['clients'] = [];
echo "clients cleared: $removed\n";

file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE), LOCK_EX);
echo "saved $dataFile\n";
