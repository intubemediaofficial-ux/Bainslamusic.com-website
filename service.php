<?php
/**
 * Service pages. Nginx `/services` aur `/services/<slug>` ko yahan bhejta hai.
 * Saara content admin panel (data/content.json → services[]) se aata hai.
 */
require_once __DIR__ . '/api/content-lib.php';

$data = loadContent();
$settings = is_array($data['settings'] ?? null) ? $data['settings'] : [];
$services = publishedServices($data);
$slug = isset($_GET['slug']) ? slugify($_GET['slug']) : '';
$service = $slug !== '' ? findServiceBySlug($data, $slug) : null;

if ($slug !== '' && !$service) {
    http_response_code(404);
}

function e($v) { return htmlspecialchars((string) $v, ENT_QUOTES, 'UTF-8'); }

$base = 'https://bainslamusic.com';
$company = $settings['company_name'] ?? 'Bainsla Music Private Limited';
$listUrl = $base . '/services';

if ($service) {
    $canonical = $listUrl . '/' . $service['_slug'];
    $pageTitle = trim((string) ($service['seo_title'] ?? '')) !== ''
        ? $service['seo_title']
        : $service['name'] . ' — ' . $company;
    $pageDesc = trim((string) ($service['seo_description'] ?? '')) !== ''
        ? $service['seo_description']
        : (string) ($service['description'] ?? '');
    $ogImage = assetUrl($service['image'] ?? $service['thumbnail'] ?? '');
} else {
    $canonical = $listUrl;
    $pageTitle = ($slug !== '' ? 'Service not found — ' : 'Our Services — ') . $company;
    $pageDesc = 'Music distribution, production house, artist management aur digital services — Bainsla Music Private Limited.';
    $ogImage = '';
}
if ($ogImage === '' || $ogImage[0] === '/') {
    $ogImage = $base . ($ogImage !== '' ? $ogImage : '/images/og-cover.jpg');
}
?>
<!DOCTYPE html>
<html lang="hi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><?= e($pageTitle) ?></title>
<meta name="description" content="<?= e($pageDesc) ?>">
<meta name="robots" content="<?= $service || $slug === '' ? 'index, follow, max-image-preview:large' : 'noindex, follow' ?>">
<link rel="canonical" href="<?= e($canonical) ?>">
<meta property="og:type" content="website">
<meta property="og:site_name" content="<?= e($company) ?>">
<meta property="og:url" content="<?= e($canonical) ?>">
<meta property="og:title" content="<?= e($pageTitle) ?>">
<meta property="og:description" content="<?= e($pageDesc) ?>">
<meta property="og:image" content="<?= e($ogImage) ?>">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#cc0000">
<link rel="icon" href="/favicon.ico" sizes="any">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
<?php if ($service): ?>
<script type="application/ld+json">
<?= json_encode([
  '@context' => 'https://schema.org',
  '@type' => 'Service',
  'name' => $service['name'],
  'description' => $pageDesc,
  'url' => $canonical,
  'image' => $ogImage,
  'provider' => ['@type' => 'Organization', 'name' => $company, 'url' => $base . '/'],
  'areaServed' => 'IN'
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) ?>
</script>
<?php endif; ?>
<style>
:root{--red:#c00;--red2:#a00;--dark:#1a1a1a;--gray:#666;--light:#f7f7f7;--white:#fff;--shadow:0 4px 24px rgba(0,0,0,.07);--radius:14px}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Poppins',sans-serif;background:var(--white);color:#333}
a{text-decoration:none;color:inherit}
img{max-width:100%;display:block}
.container{max-width:1120px;margin:0 auto;padding:0 24px}
.corp-bar{background:linear-gradient(90deg,#0a0a0a,#1d1d1d 55%,#0a0a0a)}
.corp-inner{max-width:1280px;margin:0 auto;padding:6px 24px;display:flex;align-items:center;justify-content:space-between;gap:14px}
.corp-txt{font-size:10px;font-weight:500;letter-spacing:1.4px;text-transform:uppercase;color:rgba(255,255,255,.6)}
.corp-txt a{color:#fff;font-weight:700}
.corp-cta{font-size:9.5px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#fff;border:1px solid rgba(255,255,255,.32);padding:4px 13px;border-radius:50px;white-space:nowrap}
.header{background:#fff;box-shadow:0 2px 20px rgba(0,0,0,.07);position:sticky;top:0;z-index:50}
.header-inner{max-width:1280px;margin:0 auto;padding:0 24px;height:64px;display:flex;align-items:center;justify-content:space-between;gap:16px}
.logo{display:flex;align-items:center;gap:10px}
.logo img{height:42px;width:42px;border-radius:50%;border:2px solid var(--red)}
.logo-text{font-weight:800;font-size:15px;color:var(--red);letter-spacing:.5px;text-transform:uppercase}
.logo-sub{font-size:8px;color:var(--gray);letter-spacing:2.5px}
.nav-menu{display:flex;flex-wrap:wrap}
.nav-menu a{padding:10px 14px;font-size:11px;font-weight:700;color:#444;letter-spacing:1.5px;text-transform:uppercase}
.nav-menu a:hover,.nav-menu a.active{color:var(--red)}
.svc-hero{background:linear-gradient(135deg,#111,#2a0000 60%,#111);color:#fff;padding:52px 0 46px}
.crumbs{font-size:10.5px;letter-spacing:1.2px;text-transform:uppercase;color:rgba(255,255,255,.55);margin-bottom:14px}
.crumbs a:hover{color:#fff}
.svc-hero .badge{display:inline-block;font-size:9.5px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);padding:4px 11px;border-radius:50px;margin-bottom:12px}
.svc-hero h1{font-size:clamp(26px,4vw,42px);font-weight:900;letter-spacing:.5px;margin-bottom:10px}
.svc-hero p{color:rgba(255,255,255,.72);font-size:14px;line-height:1.75;max-width:720px}
.svc-body{padding:48px 0 10px}
.svc-layout{display:grid;grid-template-columns:1.6fr .9fr;gap:36px;align-items:start}
.svc-thumb{border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow);margin-bottom:26px}
.svc-thumb img{width:100%;max-height:420px;object-fit:cover}
.rich{font-size:14px;line-height:1.85;color:#444}
.rich p{margin-bottom:14px}
.rich h2{font-size:20px;color:var(--dark);margin:22px 0 10px}
.rich h3,.rich h4{font-size:16px;color:var(--dark);margin:18px 0 8px}
.rich ul,.rich ol{margin:0 0 14px 20px}
.rich li{margin-bottom:6px}
.rich a{color:var(--red);font-weight:600}
.gallery{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:12px;margin-top:24px}
.gallery img{border-radius:12px;height:150px;width:100%;object-fit:cover;box-shadow:var(--shadow)}
.side-card{background:var(--light);border-radius:var(--radius);padding:24px;margin-bottom:18px}
.side-card h3{font-size:14px;font-weight:800;letter-spacing:.4px;text-transform:uppercase;color:var(--dark);margin-bottom:14px}
.side-card li{list-style:none;margin-bottom:9px;font-size:12.5px}
.side-card li a{color:#555}
.side-card li a:hover,.side-card li.current a{color:var(--red);font-weight:700}
.btn-cta{display:inline-block;background:var(--red);color:#fff;font-size:12px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;padding:14px 26px;border-radius:50px;transition:all .3s}
.btn-cta:hover{background:var(--red2);transform:translateY(-2px)}
.ci{font-size:12px;color:var(--gray);line-height:1.9}
.ci a{color:#444}
.svc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:22px;padding:12px 0 56px}
.svc-card{display:block;background:var(--white);border:1px solid #eee;border-radius:var(--radius);padding:30px 24px;text-align:center;transition:all .3s}
.svc-card:hover{box-shadow:0 12px 40px rgba(0,0,0,.1);transform:translateY(-4px)}
.svc-icon{width:62px;height:62px;border-radius:50%;background:rgba(204,0,0,.08);display:flex;align-items:center;justify-content:center;margin:0 auto 14px;font-size:24px;color:var(--red);overflow:hidden}
.svc-icon img{width:100%;height:100%;object-fit:cover}
.svc-card h3{font-size:15px;font-weight:700;color:var(--dark);margin-bottom:8px}
.svc-card p{font-size:12px;color:var(--gray);line-height:1.65}
.svc-link{display:inline-block;margin-top:12px;font-size:10.5px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:var(--red)}
.sec-head{border-left:4px solid var(--red);padding-left:14px;margin:44px 0 22px}
.sec-head h2{font-size:24px;font-weight:800;text-transform:uppercase;color:var(--dark)}
.sec-head p{font-size:12px;color:var(--gray);margin-top:4px}
.footer{background:#111;color:#bbb;padding:44px 0 16px;margin-top:20px}
.ft-grid{display:grid;grid-template-columns:2fr 1fr 1fr;gap:28px;margin-bottom:24px}
.footer h4{color:#fff;font-size:13px;font-weight:700;margin-bottom:12px;text-transform:uppercase}
.footer p,.footer li{font-size:11px;color:#888;line-height:1.8;list-style:none}
.footer a:hover{color:var(--red)}
.ft-bottom{border-top:1px solid rgba(255,255,255,.06);padding-top:14px;text-align:center;font-size:10px;color:#555}
.notfound{padding:70px 0;text-align:center}
.notfound h1{font-size:28px;color:var(--dark);margin-bottom:10px}
.notfound p{color:var(--gray);font-size:13px;margin-bottom:20px}
@media(max-width:900px){.svc-layout{grid-template-columns:1fr}.corp-txt{display:none}.nav-menu a{padding:8px 9px;font-size:10px}}
</style>
</head>
<body>

<header class="header">
<div class="corp-bar"><div class="corp-inner">
  <div class="corp-txt">Bainsla Music &mdash; Part of the <a href="https://intubemedia.com" target="_blank" rel="noopener">Intube Media</a> Network</div>
  <a class="corp-cta" href="https://intubemedia.com" target="_blank" rel="noopener">Visit Intube Media &#8599;</a>
</div></div>
<div class="header-inner">
  <a href="/" class="logo">
    <img src="https://yt3.googleusercontent.com/E8YM429FWSAHbNIKYFSzR-Yv8KW3J79oHXCbK6WUkqJthWXvpObtc-UMy0TMSjx1b7gQyefwJu4=s176-c-k-c0x00ffffff-no-rj" alt="<?= e($company) ?>">
    <div><div class="logo-text">Bainsla Music</div><div class="logo-sub">PRIVATE LIMITED</div></div>
  </a>
  <nav class="nav-menu">
    <a href="/">Home</a>
    <a href="/#about">About</a>
    <a href="/#catalogue">Catalogue</a>
    <a href="/#artists">Artists</a>
    <a href="/services" class="active">Services</a>
    <a href="/#connect">Connect</a>
  </nav>
</div>
</header>

<?php if ($slug !== '' && !$service): ?>
<div class="container notfound">
  <h1>Service not found</h1>
  <p>Ye service uplabdh nahi hai ya hata di gayi hai.</p>
  <a class="btn-cta" href="/services">All Services</a>
</div>
<?php elseif ($service):
  $thumb = assetUrl($service['image'] ?? $service['thumbnail'] ?? '');
  $detail = richTextToHtml($service['content'] ?? $service['detail'] ?? '');
  $gallery = galleryList($service['gallery'] ?? '');
  $ctaText = trim((string) ($service['cta_text'] ?? '')) !== '' ? $service['cta_text'] : 'Get In Touch';
  $ctaUrl = trim((string) ($service['cta_url'] ?? '')) !== '' ? $service['cta_url'] : '/#connect';
  $partner = trim((string) ($service['partner'] ?? ''));
?>
<section class="svc-hero">
  <div class="container">
    <div class="crumbs"><a href="/">Home</a> &nbsp;/&nbsp; <a href="/services">Services</a> &nbsp;/&nbsp; <?= e($service['name']) ?></div>
    <?php if ($partner !== ''): ?><div class="badge">Powered by <?= e($partner) ?></div><?php endif; ?>
    <h1><?= e($service['name']) ?></h1>
    <?php if (trim((string) ($service['description'] ?? '')) !== ''): ?><p><?= e($service['description']) ?></p><?php endif; ?>
  </div>
</section>

<section class="svc-body"><div class="container"><div class="svc-layout">
  <div>
    <?php if ($thumb !== ''): ?><div class="svc-thumb"><img src="<?= e($thumb) ?>" alt="<?= e($service['name']) ?>"></div><?php endif; ?>
    <div class="rich"><?= $detail !== '' ? $detail : '<p>' . e($service['description'] ?? '') . '</p>' ?></div>
    <?php if ($gallery): ?>
    <div class="gallery">
      <?php foreach ($gallery as $i => $img): ?>
      <img src="<?= e($img) ?>" alt="<?= e($service['name']) ?> <?= $i + 1 ?>" loading="lazy">
      <?php endforeach; ?>
    </div>
    <?php endif; ?>
    <p style="margin:28px 0 10px"><a class="btn-cta" href="<?= e($ctaUrl) ?>"<?= preg_match('#^https?://#i', (string) $ctaUrl) ? ' target="_blank" rel="noopener"' : '' ?>><?= e($ctaText) ?></a></p>
  </div>
  <aside>
    <div class="side-card">
      <h3>All Services</h3>
      <ul>
        <?php foreach ($services as $s): ?>
        <li class="<?= $s['_slug'] === $service['_slug'] ? 'current' : '' ?>"><a href="/services/<?= e($s['_slug']) ?>"><?= e($s['name']) ?></a></li>
        <?php endforeach; ?>
      </ul>
    </div>
    <div class="side-card">
      <h3>Contact</h3>
      <div class="ci">
        <?php $phone = $settings['contact_phone'] ?? $settings['phone'] ?? ''; $mail = $settings['contact_email'] ?? $settings['email'] ?? ''; ?>
        <?php if ($phone): ?><div><i class="fas fa-phone"></i> <a href="tel:<?= e(preg_replace('/[^0-9+]/', '', $phone)) ?>"><?= e($phone) ?></a></div><?php endif; ?>
        <?php if ($mail): ?><div><i class="fas fa-envelope"></i> <a href="mailto:<?= e($mail) ?>"><?= e($mail) ?></a></div><?php endif; ?>
        <?php if (!empty($settings['contact_address'] ?? $settings['address'] ?? '')): ?><div><i class="fas fa-location-dot"></i> <?= e($settings['contact_address'] ?? $settings['address']) ?></div><?php endif; ?>
      </div>
    </div>
  </aside>
</div></div></section>
<?php else: ?>
<section class="svc-hero">
  <div class="container">
    <div class="crumbs"><a href="/">Home</a> &nbsp;/&nbsp; Services</div>
    <h1>Our Services</h1>
    <p>Music distribution, production, artist management aur digital solutions — ek hi network se.</p>
  </div>
</section>
<div class="container">
  <div class="svc-grid">
    <?php foreach ($services as $s):
      $external = trim((string) ($s['url'] ?? ''));
      $href = $external !== '' ? $external : '/services/' . $s['_slug'];
      $icon = assetUrl($s['icon_image'] ?? '');
      $thumb = assetUrl($s['image'] ?? $s['thumbnail'] ?? '');
    ?>
    <a class="svc-card" href="<?= e($href) ?>"<?= $external !== '' ? ' target="_blank" rel="noopener"' : '' ?>>
      <div class="svc-icon"><?php if ($icon || $thumb): ?><img src="<?= e($icon ?: $thumb) ?>" alt="<?= e($s['name']) ?>"><?php else: ?><i class="<?= e($s['icon'] ?? 'fas fa-cog') ?>"></i><?php endif; ?></div>
      <h3><?= e($s['name']) ?></h3>
      <p><?= e($s['description'] ?? '') ?></p>
      <span class="svc-link"><?= $external !== '' ? e($s['link_text'] ?? 'Explore') : 'View Details' ?> &rarr;</span>
    </a>
    <?php endforeach; ?>
    <?php if (!$services): ?><p style="color:#666">Services abhi add nahi ki gayi hain.</p><?php endif; ?>
  </div>
</div>
<?php endif; ?>

<footer class="footer"><div class="container">
  <div class="ft-grid">
    <div>
      <h4><?= e($company) ?></h4>
      <p><?= e($settings['description'] ?? "India's leading Devotional, Folk & Rasiya music label.") ?></p>
      <p>Bainsla Music is part of the <a href="https://intubemedia.com" target="_blank" rel="noopener" style="color:#fff">Intube Media Network</a>.</p>
    </div>
    <div>
      <h4>Services</h4>
      <ul>
        <?php foreach (array_slice($services, 0, 6) as $s): ?>
        <li><a href="/services/<?= e($s['_slug']) ?>"><?= e($s['name']) ?></a></li>
        <?php endforeach; ?>
      </ul>
    </div>
    <div>
      <h4>Quick Links</h4>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/services">All Services</a></li>
        <li><a href="/#artists">Artists</a></li>
        <li><a href="/#connect">Contact</a></li>
      </ul>
    </div>
  </div>
  <div class="ft-bottom">&copy; 2024-<?= date('Y') ?> <?= e($company) ?>. All Rights Reserved.</div>
</div></footer>
</body>
</html>
