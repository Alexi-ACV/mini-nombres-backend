import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./nombres.db');

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS nombres (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT)");
});

app.get('/nombres', (req, res) => {
  db.all("SELECT * FROM nombres", (err, rows) => {
    if (err) return res.status(500).send(err);
    res.json(rows);
  });
});

app.post('/nombres', (req, res) => {
  const { nombre } = req.body;
  db.run("INSERT INTO nombres (nombre) VALUES (?)", [nombre], function(err) {
    if (err) return res.status(500).send(err);
    res.status(201).json({ id: this.lastID, nombre });
  });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en puerto ${port}`);
});
