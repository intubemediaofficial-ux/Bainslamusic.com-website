<?php
/**
 * Dynamic sitemap. Served at /sitemap.xml via an nginx rewrite so that
 * lastmod always tracks the latest admin content update.
 */
header('Content-Type: application/xml; charset=utf-8');

$base = 'https://bainslamusic.com';
$dataFile = __DIR__ . '/data/content.json';
$homeFile = __DIR__ . '/index.html';

$stamps = [];
foreach ([$dataFile, $homeFile] as $f) {
    if (is_file($f)) { $stamps[] = filemtime($f); }
}
$lastmod = date('Y-m-d', $stamps ? max($stamps) : time());

require_once __DIR__ . '/api/content-lib.php';

$urls = [
    ['loc' => $base . '/', 'changefreq' => 'daily', 'priority' => '1.0'],
    ['loc' => $base . '/services', 'changefreq' => 'weekly', 'priority' => '0.8'],
];
foreach (publishedServices(loadContent()) as $service) {
    $urls[] = ['loc' => $base . '/services/' . $service['_slug'], 'changefreq' => 'monthly', 'priority' => '0.7'];
}

echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
foreach ($urls as $u) {
    echo "  <url>\n";
    echo '    <loc>' . htmlspecialchars($u['loc'], ENT_XML1) . "</loc>\n";
    echo '    <lastmod>' . $lastmod . "</lastmod>\n";
    echo '    <changefreq>' . $u['changefreq'] . "</changefreq>\n";
    echo '    <priority>' . $u['priority'] . "</priority>\n";
    echo "  </url>\n";
}
echo "</urlset>\n";
