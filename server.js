const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
const app = express();

app.use(cors());
app.use(express.json());

// Función para obtener info con "agente de usuario" para evitar bloqueos
app.post('/api/info', async (req, res) => {
    try {
        const { url } = req.body;
        const info = await ytdl.getInfo(url, {
            requestOptions: {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            }
        });
        res.json({ title: info.videoDetails.title });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "YouTube bloqueó la petición. Intenta de nuevo." });
    }
});

app.get('/api/download', async (req, res) => {
    try {
        const { url, format } = req.query;
        const videoName = "video-" + Date.now();
        
        res.setHeader('Content-Disposition', `attachment; filename="${videoName}.${format}"`);
        
        ytdl(url, {
            format: format === 'mp3' ? 'highestaudio' : 'highest',
            filter: format === 'mp3' ? 'audioonly' : 'videoandaudio',
            requestOptions: {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            }
        }).pipe(res);
    } catch (error) {
        res.status(500).send("Error en la descarga");
    }
});

module.exports = app;
