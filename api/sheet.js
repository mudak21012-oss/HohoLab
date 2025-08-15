// /api/sheet.js
export default async function handler(req, res) {
  try {
    const format = (req.query.format || 'csv').toLowerCase();
    const url =
      format === 'json'
        ? process.env.SHEET_JSON_URL
        : process.env.SHEET_CSV_URL;

    if (!url) return res.status(500).json({ error: 'Faltan variables SHEET_*' });

    const r = await fetch(url, { cache: 'no-store' });
    const text = await r.text();

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    res.setHeader('Content-Type',
      format === 'json'
        ? 'application/json; charset=utf-8'
        : 'text/csv; charset=utf-8'
    );

    return res.status(200).send(text);
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}
