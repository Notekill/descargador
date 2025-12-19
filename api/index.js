const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

const cookiePath = path.join(process.cwd(), 'cookies.json');
let youtubeCookies = '';
if (fs.existsSync(cookiePath)) {
    const raw = JSON.parse(fs.readFileSync(cookiePath, 'utf8'));
    youtubeCookies = raw.map(c => `${c.name}=${c.value}`).join('; ');
}

// Ruta para obtener info
app.post('/api/info', async (req, res) => {
    try {
        const { url } = req.body;
        const info = await ytdl.getInfo(url, {
            requestOptions: { headers: { cookie: youtubeCookies } }
        });
        res.json({ title: info.videoDetails.title });
    } catch (error) {
        res.status(500).json({ error: "Error de YouTube o Cookies" });
    }
});

// Ruta para descargar
app.get('/api/download', async (req, res) => {
    try {
        const { url, format } = req.query;
        res.setHeader('Content-Disposition', `attachment; filename="video.${format}"`);
        ytdl(url, {
            format: format === 'mp3' ? 'highestaudio' : 'highest',
            filter: format === 'mp3' ? 'audioonly' : 'videoandaudio',
            requestOptions: { headers: { cookie: youtubeCookies } }
        }).pipe(res);
    } catch (error) {
        res.status(500).send("Error descarga");
    }
});

module.exports = app;

