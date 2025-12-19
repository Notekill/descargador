const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// Función para transformar cookies al formato que entiende ytdl
function getYoutubeCookies() {
    const cookiePath = path.join(process.cwd(), 'cookies.json');
    if (fs.existsSync(cookiePath)) {
        return JSON.parse(fs.readFileSync(cookiePath, 'utf8'));
    }
    return [];
}

app.post('/api/info', async (req, res) => {
    try {
        const { url } = req.body;
        const info = await ytdl.getInfo(url, {
            requestOptions: {
                headers: {
                    cookie: getYoutubeCookies().map(c => `${c.name}=${c.value}`).join('; ')
                }
            }
        });
        res.json({ title: info.videoDetails.title });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error de YouTube. Intenta de nuevo." });
    }
});

app.get('/api/download', async (req, res) => {
    try {
        const { url, format } = req.query;
        res.setHeader('Content-Disposition', `attachment; filename="video.${format}"`);
        
        ytdl(url, {
            format: format === 'mp3' ? 'highestaudio' : 'highest',
            filter: format === 'mp3' ? 'audioonly' : 'videoandaudio',
            requestOptions: {
                headers: {
                    cookie: getYoutubeCookies().map(c => `${c.name}=${c.value}`).join('; ')
                }
            }
        }).pipe(res);
    } catch (error) {
        res.status(500).send("Error en la descarga");
    }
});

module.exports = app;
