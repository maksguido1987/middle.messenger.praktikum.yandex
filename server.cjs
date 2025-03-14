const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

// Раздача статических файлов из папки dist
app.use(express.static(path.join(__dirname, "dist")));

// Для SPA: перенаправление всех запросов на index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
