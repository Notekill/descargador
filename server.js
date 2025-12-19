const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configuración de cabeceras para evitar bloqueos de YouTube
const requestOptions = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'es-ES,es;q=0.9',
    }
};

// Ruta para obtener información del video
app.post('/api/info', async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) return res.status(400).json({ error: "URL requerida" });

        const info = await ytdl.getInfo(url, { requestOptions });
        res.json({ title: info.videoDetails.title });
    } catch (error) {
        console.error("Error Info:", error.message);
        res.status(500).json({ error: "No se pudo obtener la info del video" });
    }
});

// Ruta para la descarga física del archivo
app.get('/api/download', async (req, res) => {
    try {
        const { url, format } = req.query;
        if (!url) return res.status(400).send("URL requerida");

        const isMp3 = format === 'mp3';
        
        res.setHeader('Content-Disposition', `attachment; filename="download.${format}"`);
        res.setHeader('Content-Type', isMp3 ? 'audio/mpeg' : 'video/mp4');

        ytdl(url, {
            quality: isMp3 ? 'highestaudio' : 'highest',
            filter: isMp3 ? 'audioonly' : 'videoandaudio',
            requestOptions
        }).pipe(res);

    } catch (error) {
        console.error("Error Download:", error.message);
        if (!res.headersSent) res.status(500).send("Error en la descarga");
    }
});

// ÚNICO punto de encendido del servidor
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor funcionando en puerto ${PORT}`);
});
