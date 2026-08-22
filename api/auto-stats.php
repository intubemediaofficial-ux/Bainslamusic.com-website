<?php
/**
 * Daily growth for the homepage stats bar. CLI only, meant for cron:
 *
 *   10 0 * * * php /var/www/bainslamusic.com/api/auto-stats.php >> /var/log/bainsla-auto-stats.log 2>&1
 *
 * Every stat is derived from a baseline value + elapsed days, so running twice
 * in a day changes nothing and a missed day self-corrects. Config lives in
 * data/auto-stats.json; if an admin edits a stat by hand, that value becomes
 * the new baseline instead of being overwritten.
 */
if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    exit("CLI only\n");
}

$dataFile = __DIR__ . '/../data/content.json';
$confFile = __DIR__ . '/../data/auto-stats.json';
$today = date('Y-m-d');

$defaults = [
    'company_since' => 2015,
    'base' => [
        'clients' => 244,
        'songs' => 15752,
        'videos' => 12543,
        'subscribers' => 10000000,
        'views' => 1500000000,
    ],
    'per_day' => [
        'clients' => 3 / 7,
        'songs' => 9,
        'videos' => 3,
        'subscribers' => 7000,
        'views' => 1000000,
    ],
    'baseline_date' => [],
    'last_written' => [],
];

$conf = file_exists($confFile) ? (json_decode(file_get_contents($confFile), true) ?: []) : [];
$conf = array_replace_recursive($defaults, $conf);

$data = json_decode(file_get_contents($dataFile), true);
if (!is_array($data)) {
    exit("content.json unreadable\n");
}
if (!isset($data['settings']) || !is_array($data['settings'])) {
    $data['settings'] = [];
}

/** "12.5 M" / "1.5 B" / "15752" -> plain number */
function parseStat($raw) {
    if (!preg_match('/^\s*([\d.]+)\s*\+?\s*([A-Za-z]*)\+?\s*$/', (string) $raw, $m)) {
        return null;
    }
    $mult = ['' => 1, 'K' => 1000, 'M' => 1000000, 'B' => 1000000000];
    $suffix = strtoupper($m[2]);
    if (!isset($mult[$suffix])) {
        return null;
    }
    return (float) $m[1] * $mult[$suffix];
}

function formatStat($value) {
    if ($value >= 1000000000) {
        return number_format($value / 1000000000, 2, '.', '') . ' B';
    }
    if ($value >= 1000000) {
        return number_format($value / 1000000, 2, '.', '') . ' M';
    }
    if ($value >= 100000) {
        return number_format($value / 1000, 1, '.', '') . ' K';
    }
    return (string) (int) floor($value);
}

function daysSince($from, $to) {
    $diff = (new DateTime($from))->diff(new DateTime($to));
    return $diff->invert ? 0 : (int) $diff->days;
}

foreach ($conf['base'] as $key => $baseValue) {
    $field = 'stats_' . $key;
    $current = $data['settings'][$field] ?? null;
    $lastWritten = $conf['last_written'][$key] ?? null;

    // Admin changed this stat by hand -> adopt it as the new baseline.
    if ($current !== null && $lastWritten !== null && $current !== $lastWritten) {
        $manual = parseStat($current);
        if ($manual !== null) {
            $baseValue = $manual;
            $conf['base'][$key] = $manual;
            $conf['baseline_date'][$key] = $today;
        }
    }
    if (empty($conf['baseline_date'][$key])) {
        $conf['baseline_date'][$key] = $today;
    }

    $days = daysSince($conf['baseline_date'][$key], $today);
    $formatted = formatStat($baseValue + $conf['per_day'][$key] * $days);
    $data['settings'][$field] = $formatted;
    $conf['last_written'][$key] = $formatted;
}

// Experience rolls over on 1 January.
$years = (int) date('Y') - (int) $conf['company_since'];
$data['settings']['stats_experience'] = $years . ' Yr';

file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
file_put_contents($confFile, json_encode($conf, JSON_PRETTY_PRINT), LOCK_EX);

echo date('c') . ' stats updated: ' . json_encode($conf['last_written']) . " experience={$years} Yr\n";
