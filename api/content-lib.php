<?php
/**
 * Shared content helpers. Header-free (no session/JSON headers) so ki
 * public HTML pages (service.php, sitemap.php) bhi isko use kar sakein.
 */

define('CONTENT_FILE', __DIR__ . '/../data/content.json');

function loadContent() {
    if (!is_file(CONTENT_FILE)) return [];
    $raw = file_get_contents(CONTENT_FILE);
    if ($raw === false) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function slugify($text) {
    $text = strtolower(trim((string) $text));
    $text = preg_replace('/[^a-z0-9]+/', '-', $text);
    return trim((string) $text, '-');
}

/** Service ka slug — admin ka diya slug, warna naam se banaya gaya. */
function serviceSlug(array $service) {
    $slug = slugify($service['slug'] ?? '');
    if ($slug !== '') return $slug;
    $slug = slugify($service['name'] ?? '');
    return $slug !== '' ? $slug : (string) ($service['id'] ?? '');
}

/** Published services, sort_order ke hisaab se. */
function publishedServices(array $data) {
    $services = [];
    foreach ($data['services'] ?? [] as $i => $service) {
        if (!is_array($service)) continue;
        if (($service['published'] ?? true) === false) continue;
        if (trim((string) ($service['name'] ?? '')) === '') continue;
        $service['_slug'] = serviceSlug($service);
        $service['_order'] = isset($service['sort_order']) ? (float) $service['sort_order'] : $i;
        $services[] = $service;
    }
    usort($services, function ($a, $b) { return $a['_order'] <=> $b['_order']; });
    return $services;
}

function findServiceBySlug(array $data, $slug) {
    $slug = slugify($slug);
    foreach (publishedServices($data) as $service) {
        if ($service['_slug'] === $slug) return $service;
    }
    return null;
}

/** Admin content: sirf safe tags rehte hain; script, event handlers aur javascript: URL hat jaate hain. */
function sanitizeRichText($html) {
    $html = (string) $html;
    $html = preg_replace('#<\s*(script|style|iframe|object|embed|form)\b.*?<\s*/\s*\1\s*>#is', '', $html);
    $allowed = '<p><br><b><strong><i><em><u><ul><ol><li><h2><h3><h4><blockquote><a><span><hr>';
    $html = strip_tags($html, $allowed);
    $html = preg_replace('/\son[a-z]+\s*=\s*("[^"]*"|\'[^\']*\'|[^\s>]+)/i', '', $html);
    $html = preg_replace('/(href|src)\s*=\s*("|\')\s*javascript:[^"\']*\2/i', '$1="#"', $html);
    return trim((string) $html);
}

/** Plain text (newline-separated) ko paragraphs mein badalta hai. */
function richTextToHtml($text) {
    $text = (string) $text;
    if ($text === '') return '';
    if (preg_match('/<[a-z][^>]*>/i', $text)) return sanitizeRichText($text);
    $blocks = preg_split('/\n\s*\n/', trim($text));
    $out = '';
    foreach ($blocks as $block) {
        $block = trim($block);
        if ($block === '') continue;
        $out .= '<p>' . nl2br(htmlspecialchars($block, ENT_QUOTES, 'UTF-8')) . '</p>';
    }
    return $out;
}

/** Relative path ko site-root path banata hai; external/data URL waise hi. */
function assetUrl($value) {
    $value = trim((string) $value);
    if ($value === '') return '';
    if (preg_match('#^(https?:)?//#i', $value) || strpos($value, 'data:') === 0 || $value[0] === '/') return $value;
    return '/' . ltrim($value, './');
}

/** Gallery: array ya newline/comma separated string dono chalte hain. */
function galleryList($value) {
    if (is_array($value)) $items = $value;
    else $items = preg_split('/[\r\n,]+/', (string) $value);
    $out = [];
    foreach ($items as $item) {
        $url = assetUrl(is_array($item) ? ($item['url'] ?? '') : $item);
        if ($url !== '') $out[] = $url;
    }
    return $out;
}
