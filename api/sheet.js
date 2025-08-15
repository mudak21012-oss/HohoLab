// /api/sheet.js
export default async function handler(req, res) {
  try {
    const format = (req.query.format || 'csv').toLowerCase();
    const source = (req.query.source || 'printers').toLowerCase();

    const urls = {
      colors: {
        csv: process.env.SHEET_CSV_URL_COLORS,
        json: process.env.SHEET_JSON_URL_COLORS
      },
      printers: {
        csv: process.env.SHEET_CSV_URL_PRINTERS,
        json: process.env.SHEET_JSON_URL_PRINTERS
      }
    };

    const url = urls[source]?.[format];
    if (!url) return res.status(500).json({ error: 'Faltan variables de entorno para esa hoja/formato' });

    const r = await fetch(url, { cache: 'no-store' });
    const body = await r.text();

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    res.setHeader('Content-Type',
      format === 'json'
        ? 'application/json; charset=utf-8'
        : 'text/csv; charset=utf-8'
    );

    return res.status(200).send(body);
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}
