const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Opciones para imitar un navegador real
const requestOptions = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'es-ES,es;q=0.9',
    }
};

app.post('/api/info', async (req, res) => {
    try {
        const { url } = req.body;
        const info = await ytdl.getInfo(url, { requestOptions });
        res.json({ title: info.videoDetails.title });
    } catch (error) {
        res.status(500).json({ error: "No se pudo obtener la información" });
    }
});

app.get('/api/download', async (req, res) => {
    try {
        const { url, format } = req.query;
        const isMp3 = format === 'mp3';
        res.setHeader('Content-Disposition', `attachment; filename="descarga.${format}"`);
        ytdl(url, {
            quality: isMp3 ? 'highestaudio' : 'highest',
            filter: isMp3 ? 'audioonly' : 'videoandaudio',
            requestOptions
        }).pipe(res);
    } catch (error) {
        if (!res.headersSent) res.status(500).send("Error en descarga");
    }
});

// SOLO UNA VEZ: Encendido del servidor
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor listo en puerto ${PORT}`);
});
