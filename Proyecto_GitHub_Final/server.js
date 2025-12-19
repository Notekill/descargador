const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core'); // Usamos esta versión porque está más actualizada
const app = express();

app.use(cors());
app.use(express.json());

// 1. Endpoint para obtener la info del video (Miniatura y Título)
app.post('/api/info', async (req, res) => {
    try {
        const { url } = req.body;
        if (!ytdl.validateURL(url)) return res.status(400).json({ error: 'URL no válida' });

        const info = await ytdl.getInfo(url);
        res.json({
            title: info.videoDetails.title,
            thumbnail: info.videoDetails.thumbnails[0].url,
            duration: info.videoDetails.lengthSeconds
        });
    } catch (e) {
        res.status(500).json({ error: 'Error al obtener información' });
    }
});

// 2. Endpoint de descarga real
app.get('/api/download', async (req, res) => {
    try {
        const { url, format } = req.query;
        if (!url) return res.status(400).send('URL requerida');

        const info = await ytdl.getInfo(url);
        const title = info.videoDetails.title.replace(/[^\x00-\x7F]/g, ""); 

        if (format === 'mp3') {
            res.header('Content-Disposition', `attachment; filename="${title}.mp3"`);
            ytdl(url, { filter: 'audioonly', quality: 'highestaudio' }).pipe(res);
        } else {
            res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
            ytdl(url, { filter: 'audioandvideo', quality: 'highest' }).pipe(res);
        }
    } catch (e) {
        console.error(e);
        res.status(500).send('Error en la descarga. YouTube a veces bloquea servidores de nube.');
    }
});

// Para que funcione en Vercel
module.exports = app;
