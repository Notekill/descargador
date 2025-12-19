const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const requestOptions = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'es-ES,es;q=0.9',
    }
};

app.post('/api/info', async (req, res) => {
    try {
        const info = await ytdl.getInfo(req.body.url, { requestOptions });
        res.json({ title: info.videoDetails.title });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener info" });
    }
});

app.get('/api/download', async (req, res) => {
    try {
        const { url, format } = req.query;
        res.setHeader('Content-Disposition', `attachment; filename="archivo.${format}"`);
        ytdl(url, {
            quality: format === 'mp3' ? 'highestaudio' : 'highest',
            filter: format === 'mp3' ? 'audioonly' : 'videoandaudio',
            requestOptions
        }).pipe(res);
    } catch (error) {
        if (!res.headersSent) res.status(500).send("Error de descarga");
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Servidor listo en puerto ${PORT}`));

app.post('/api/info', async (req, res) => {
    try {
        const info = await ytdl.getInfo(req.body.url, getOptions());
        res.json({ title: info.videoDetails.title });
    } catch (error) {
        res.status(500).json({ error: "YouTube bloqueó la IP de Render. Intenta de nuevo." });
    }
});

app.get('/api/download', async (req, res) => {
    try {
        const { url, format } = req.query;
        res.setHeader('Content-Disposition', `attachment; filename="video.${format}"`);
        ytdl(url, {
            quality: format === 'mp3' ? 'highestaudio' : 'highest',
            filter: format === 'mp3' ? 'audioonly' : 'videoandaudio',
            ...getOptions()
        }).pipe(res);
    } catch (error) {
        if (!res.headersSent) res.status(500).send("Error en descarga");
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
