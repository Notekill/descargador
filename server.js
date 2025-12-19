const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
const fs = require('fs');
const path = require('path');

const app = express();

// Configuración básica
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Esto sirve tu carpeta public automáticamente

// --- MANEJO DE COOKIES ---
const cookiePath = path.join(__dirname, 'cookies.json');
let youtubeCookies = [];

if (fs.existsSync(cookiePath)) {
    try {
        const rawCookies = JSON.parse(fs.readFileSync(cookiePath, 'utf8'));
        // Convertimos el JSON de cookies al formato de texto que entiende ytdl
        youtubeCookies = rawCookies.map(c => `${c.name}=${c.value}`).join('; ');
        console.log("✅ Cookies cargadas correctamente.");
    } catch (err) {
        console.error("❌ Error al leer cookies.json:", err);
    }
} else {
    console.warn("⚠️ No se encontró cookies.json. YouTube podría bloquear la descarga.");
}

// --- RUTA 1: OBTENER INFO DEL VÍDEO ---
app.post('/api/info', async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) return res.status(400).json({ error: "Falta la URL" });

        console.log("Obteniendo info de:", url);

        const info = await ytdl.getInfo(url, {
            requestOptions: {
                headers: {
                    cookie: youtubeCookies,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            }
        });

        res.json({
            title: info.videoDetails.title,
            thumbnail: info.videoDetails.thumbnails[0].url
        });
    } catch (error) {
        console.error("Error en /api/info:", error.message);
        res.status(500).json({ error: "YouTube bloqueó la petición. Actualiza las cookies." });
    }
});

// --- RUTA 2: DESCARGAR ---
app.get('/api/download', async (req, res) => {
    try {
        const { url, format } = req.query;
        if (!url) return res.status(400).send("Falta la URL");

        const isMp3 = format === 'mp3';
        
        // Configuramos las cabeceras de respuesta para el navegador
        res.setHeader('Content-Disposition', `attachment; filename="archivo.${format}"`);

        ytdl(url, {
            quality: isMp3 ? 'highestaudio' : 'highest',
            filter: isMp3 ? 'audioonly' : 'videoandaudio',
            requestOptions: {
                headers: {
                    cookie: youtubeCookies,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            }
        }).pipe(res);

    } catch (error) {
        console.error("Error en /api/download:", error.message);
        res.status(500).send("Error al procesar la descarga.");
    }
});

// --- INICIO DEL SERVIDOR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor funcionando en http://localhost:${PORT}`);
});
