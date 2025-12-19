const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
const app = express();

app.use(cors());
app.use(express.json());

// Endpoint para obtener la miniatura y título
app.post('/api/info', async (req, res) => {
    try {
        const { url } = req.body;
        if (!ytdl.validateURL(url)) return res.status(400).json({ error: 'URL no válida' });
        const info = await ytdl.getInfo(url);
        res.json({
            title: info.videoDetails.title,
            thumbnail: info.videoDetails.thumbnails[0].url
        });
    } catch (e) {
        res.status(500).json({ error: 'Error al conectar con YouTube' });
    }
});

// Endpoint que activa la descarga en el navegador
app.get('/api/download', async (req, res) => {
    try {
        const { url, format } = req.query;
        const info = await ytdl.getInfo(url);
        const title = info.videoDetails.title.replace(/[^\x00-\x7F]/g, ""); 
        
        const contentType = format === 'mp3' ? 'audio/mpeg' : 'video/mp4';
        res.header('Content-Disposition', `attachment; filename="${title}.${format}"`);
        res.header('Content-Type', contentType);

        ytdl(url, { 
            format: format, 
            filter: format === 'mp3' ? 'audioonly' : 'audioandvideo', 
            quality: 'highest' 
        }).pipe(res);
    } catch (e) {
        res.status(500).send('Error en la descarga');
    }
});

module.exports = app;
