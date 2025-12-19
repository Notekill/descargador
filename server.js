const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// --- ESTRATEGIA DE IDENTIDAD (PROXY-SIM) ---
// Generamos navegadores distintos para que YouTube no nos marque como servidor
function obtenerIdentidadHumana() {
    const identidades = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/120.0.0.0'
    ];
    return identidades[Math.floor(Math.random() * identidades.length)];
}

// --- RUTA 1: OBTENER INFO ---
app.post('/api/info', async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) return res.status(400).json({ error: "Pega una URL válida" });

        const info = await ytdl.getInfo(url, {
            requestOptions: {
                headers: {
                    'User-Agent': obtenerIdentidadHumana(),
                    'Accept': '*/*',
                    'Accept-Language': 'es-ES,es;q=0.9',
                    'Referer': 'https://www.youtube.com/',
                }
            }
        });

        res.json({
            title: info.videoDetails.title,
            thumbnail: info.videoDetails.thumbnails[0].url
        });
    } catch (error) {
        console.error("Error Info:", error.message);
        res.status(500).json({ error: "YouTube detectó tráfico inusual. Reintenta en unos segundos." });
    }
});

// --- RUTA 2: DESCARGA DIRECTA ---
app.get('/api/download', async (req, res) => {
    try {
        const { url, format } = req.query;
        if (!url) return res.status(400).send("Falta la URL");

        const isMp3 = format === 'mp3';
        const userAgent = obtenerIdentidadHumana();

        // Headers para forzar la descarga en el navegador
        res.setHeader('Content-Disposition', `attachment; filename="descarga_${Date.now()}.${format}"`);
        res.setHeader('Content-Type', isMp3 ? 'audio/mpeg' : 'video/mp4');

        const stream = ytdl(url, {
            quality: isMp3 ? 'highestaudio' : 'highest',
            filter: isMp3 ? 'audioonly' : 'videoandaudio',
            requestOptions: {
                headers: {
                    'User-Agent': userAgent,
                    'Accept': '*/*',
                    'Accept-Language': 'es-ES,es;q=0.9',
                    'Origin': 'https://www.youtube.com',
                    'Referer': 'https://www.youtube.com/',
                }
            }
        });

        stream.pipe(res);

        stream.on('error', (err) => {
            console.error("Error en el stream:", err.message);
            if (!res.headersSent) {
                res.status(500).send("Error al conectar con YouTube.");
            }
        });

    } catch (error) {
        console.error("Error General:", error.message);
        res.status(500).send("Error interno.");
    }
});

// Inicio del servidor en el puerto de Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor Profesional activo en puerto ${PORT}`);
});
