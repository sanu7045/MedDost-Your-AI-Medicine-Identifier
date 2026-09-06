const COMMONS_API = 'https://commons.wikimedia.org/w/api.php';
const WIKI_API = 'https://en.wikipedia.org/w/api.php';
const NEGATIVE = ['structure', 'formula', 'skeletal', 'molecule', 'diagram', 'logo', 'map', 'graph', 'chart'];
const WEAK = new Set(['tablet', 'tablets', 'capsule', 'capsules', 'pill', 'pills', 'medicine', 'medicines', 'drug', 'drugs', 'pharmaceutical', 'strip', 'pack', 'bottle', 'syrup', 'injection', 'mg', 'ml', 'ip', 'usp', 'bp']);

const normalize = (v) => v.toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
const tokens = (name) => normalize(name).split(' ').filter(t => t.length > 2 && !WEAK.has(t));
const cleanTitle = (t) => t.replace(/^File:/i, '').replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ').trim();
export const isDedicatedMedicineImage = (img, name) => {
  const t = tokens(name);
  const h = normalize(`${img.title} ${img.alt}`);
  const hTokens = h.split(' ').filter(Boolean);
  return t.length && !NEGATIVE.some(n => h.includes(n)) && t.some(x => hTokens.some(ht => ht.startsWith(x)));
};
const score = (img, name) => {
  const t = tokens(name);
  const h = normalize(`${img.title} ${img.alt}`);
  const hTokens = h.split(' ').filter(Boolean);
  let s = t.reduce((a, x) => a + (hTokens.some(ht => ht.startsWith(x)) ? 4 : 0), 0);
  if (h.includes('tablet') || h.includes('pill') || h.includes('capsule')) s += 2;
  if (h.includes('pack') || h.includes('strip') || h.includes('bottle')) s += 2;
  if (img.mime === 'image/jpeg') s += 1;
  return s;
};

const searchCommons = async (query, signal) => {
  const p = new URLSearchParams({ action: 'query', format: 'json', formatversion: '2', origin: '*', generator: 'search', gsrnamespace: '6', gsrlimit: '20', gsrsearch: query, prop: 'imageinfo', iiprop: 'url|mime', iiurlwidth: '900' });
  const r = await fetch(`${COMMONS_API}?${p}`, { signal });
  if (!r.ok) throw new Error('Unable to load medicine images');
  const d = await r.json();
  return (d.query?.pages || []).map(page => {
    const info = page.imageinfo?.[0];
    const src = info?.thumburl || info?.url;
    const mime = info?.mime || '';
    if (!src || !mime.startsWith('image/') || src.toLowerCase().includes('.svg')) return null;
    return { src, fullSrc: info?.url || src, alt: cleanTitle(page.title), title: page.title, mime };
  }).filter(Boolean);
};

const fetchWiki = async (name, signal) => {
  const p = new URLSearchParams({ action: 'query', format: 'json', formatversion: '2', origin: '*', titles: name, prop: 'pageimages', pithumbsize: '900' });
  const r = await fetch(`${WIKI_API}?${p}`, { signal });
  if (!r.ok) return null;
  const d = await r.json();
  const page = (d.query?.pages || [])[0];
  if (page.thumbnail?.source) return { src: page.thumbnail.source, fullSrc: page.thumbnail.source, alt: `${page.title || name} - Wikipedia reference image`, title: page.title || name };
  return null;
};

export const fetchDedicatedMedicineImages = async (medicineName, signal, limit = 5) => {
  const imagesBySrc = new Map();
  const queries = [`"${medicineName}"`, `"${medicineName}" tablet`, `"${medicineName}" capsule`, `"${medicineName}" medicine`];
  for (const q of queries) {
    const images = await searchCommons(q, signal);
    images.forEach(img => { if (isDedicatedMedicineImage(img, medicineName) && !imagesBySrc.has(img.src)) imagesBySrc.set(img.src, img); });
    if (imagesBySrc.size >= limit) break;
  }
  if (!imagesBySrc.size) {
    try { const w = await fetchWiki(medicineName, signal); if (w) imagesBySrc.set(w.src, w); }
    catch (e) { if (e.name !== 'AbortError') console.error('Wikipedia fallback failed:', e); }
  }
  return [...imagesBySrc.values()].sort((a, b) => score(b, medicineName) - score(a, medicineName)).slice(0, limit);
};

export const fetchPrimaryMedicineImage = async (medicineName, signal) => {
  try { return (await fetchDedicatedMedicineImages(medicineName, signal, 1))[0] || null; }
  catch (e) { console.error('Image fetch failed:', e); return null; }
};
