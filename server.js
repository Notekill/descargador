const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
const app = express();

app.use(cors());
app.use(express.json());

// Ruta para obtener información del video
app.post('/api/info', async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) return res.status(400).json({ error: "URL requerida" });
        
        const info = await ytdl.getInfo(url);
        res.json({ title: info.videoDetails.title });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener info" });
    }
});

// Ruta para la descarga directa
app.get('/api/download', async (req, res) => {
    try {
        const { url, format } = req.query;
        if (!url) return res.status(400).send("URL requerida");

        const options = format === 'mp3' 
            ? { format: 'mp3', filter: 'audioonly', quality: 'highestaudio' }
            : { format: 'mp4', quality: 'highestvideo' };

        res.setHeader('Content-Disposition', `attachment; filename="video.${format}"`);
        ytdl(url, options).pipe(res);
    } catch (error) {
        res.status(500).send("Error en la descarga");
    }
});

module.exports = app;
