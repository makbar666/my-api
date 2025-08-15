import mysql from "mysql2/promise";

// config DB dari Environment Variables di Vercel
const DB_CONFIG = {
  host: process.env.DB_HOST,     // contoh: mysql.railway.internal
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  try {
    const conn = await mysql.createConnection(DB_CONFIG);

    // Contoh endpoint: /api/db?path=petugas/list
    const { path } = req.query;

    let result;
    if (path === "petugas/list") {
      [result] = await conn.execute("SELECT * FROM petugas");
    } 
    else if (path === "petugas/insert" && req.method === "POST") {
      const body = req.body;
      await conn.execute(
        "INSERT INTO petugas (id, nama_petugas, jabatan_petugas) VALUES (?, ?, ?)",
        [body.id, body.nama_petugas, body.jabatan_petugas]
      );
      result = { success: true };
    } 
    else {
      result = { error: "Invalid path or method" };
    }

    await conn.end();

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
