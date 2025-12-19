const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
const app = express();

app.use(cors());
app.use(express.json());

// Ruta para obtener info (La que llama tu script.js)
app.post('/api/info', async (req, res) => {
    try {
        const info = await ytdl.getInfo(req.body.url);
        res.json({ title: info.videoDetails.title });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Ruta para descargar (La que dispara el navegador)
app.get('/api/download', async (req, res) => {
    const { url, format } = req.query;
    res.setHeader('Content-Disposition', `attachment; filename="video.${format}"`);
    ytdl(url, { format: format === 'mp3' ? 'highestaudio' : 'highest' }).pipe(res);
});

module.exports = app; // Necesario para Vercel
