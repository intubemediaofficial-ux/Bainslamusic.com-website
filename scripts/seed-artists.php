<?php
/**
 * One-off/idempotent seed for the artist roster: fills the social links,
 * contact numbers and display order supplied by the label owner.
 * Existing artists are matched by name and only the given fields are merged.
 *
 *   php scripts/seed-artists.php [path/to/content.json]
 */
if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    exit("CLI only\n");
}

$dataFile = $argv[1] ?? __DIR__ . '/../data/content.json';
$roster = [
    ['name' => 'DG Mawai', 'sort_order' => 1, 'role' => 'Singer - Rasiya'],
    [
        'name' => 'Rashmi Nishad', 'sort_order' => 2, 'role' => 'Singer',
        'spotify_url' => 'https://open.spotify.com/artist/2wL76UFPA2SsIqyRATmAG0',
        'apple_music_url' => 'https://music.apple.com/in/artist/rashmi-nishad/1547395089',
        'instagram_url' => 'https://www.instagram.com/rashminishadmusic_',
        'facebook_url' => 'https://www.facebook.com/share/1FR6hfjaYt/',
    ],
    [
        'name' => 'Bhupendra Khatana', 'sort_order' => 3, 'role' => 'Singer',
        'spotify_url' => 'https://open.spotify.com/artist/0t9BAALaO3f56xZsARkbKf',
        'apple_music_url' => 'https://music.apple.com/in/artist/bhupendra-khatana/1497860705',
        'instagram_url' => 'https://www.instagram.com/bhupendra_khatana_6605',
    ],
    [
        'name' => 'Krishan Sanwariya', 'sort_order' => 4, 'role' => 'Singer',
        'phone' => '+91 96028 24241',
        'spotify_url' => 'https://open.spotify.com/artist/0Gt9wZYqnYL5z9tUSiMHh1',
        'apple_music_url' => 'https://music.apple.com/us/artist/krishan-sanwariya/1443708933',
        'instagram_url' => 'https://www.instagram.com/krishan_sanwariya_official',
        'facebook_url' => 'https://www.facebook.com/share/19Hf6K4N1W/',
    ],
    [
        'name' => 'Satveer Gurjar', 'sort_order' => 5, 'role' => 'Singer - Folk',
        'spotify_url' => 'https://open.spotify.com/artist/7rLYHgie7IMlIZNTM3GLpL',
        'apple_music_url' => 'https://music.apple.com/in/artist/satveer-gurjar/1738722545',
        'instagram_url' => 'https://www.instagram.com/singer_satveer_gurjar',
        'facebook_url' => 'https://www.facebook.com/share/1DPKy7e7ww/',
    ],
    [
        'name' => 'Balli Bhalpur', 'sort_order' => 6, 'role' => 'Singer',
        'spotify_url' => 'https://open.spotify.com/artist/2TefQy6Eu8Dhc48CjUX7vG',
        'apple_music_url' => 'https://music.apple.com/in/artist/balli-bhalpur/1547798690',
        'instagram_url' => 'https://www.instagram.com/balli_bhalpur_official_',
        'facebook_url' => 'https://www.facebook.com/share/1EfVkrNXLa/',
    ],
    ['name' => 'Ajeet Bainsla', 'sort_order' => 7],
    ['name' => 'Bharti Choudhary', 'sort_order' => 8],
    ['name' => 'PS Queen', 'sort_order' => 9],
    ['name' => 'Bhumika Sharma', 'sort_order' => 10],
];

$data = json_decode(file_get_contents($dataFile), true);
if (!is_array($data)) {
    exit("Cannot read $dataFile\n");
}
if (!isset($data['associates']) || !is_array($data['associates'])) {
    $data['associates'] = [];
}

$norm = function ($s) {
    return strtolower(preg_replace('/\s+/', ' ', trim((string) $s)));
};

foreach ($roster as $entry) {
    $found = false;
    foreach ($data['associates'] as $i => $a) {
        if ($norm($a['name'] ?? '') === $norm($entry['name'])) {
            $data['associates'][$i] = array_merge($a, $entry);
            $found = true;
            echo "updated: {$entry['name']}\n";
            break;
        }
    }
    if (!$found) {
        $data['associates'][] = array_merge([
            'id' => uniqid(),
            'created_at' => date('Y-m-d H:i:s'),
            'description' => '',
            'image' => '',
            'phone' => '',
            'email' => '',
            'address' => '',
            'youtube_url' => '',
            'instagram_url' => '',
            'facebook_url' => '',
            'spotify_url' => '',
            'apple_music_url' => '',
        ], $entry);
        echo "added: {$entry['name']}\n";
    }
}

file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE), LOCK_EX);
echo "saved $dataFile\n";
