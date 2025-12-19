const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
const app = express();

app.use(cors());
app.use(express.json());

// Agente de usuario real para evitar bloqueos básicos
const agentOptions = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
    }
};

app.post('/api/info', async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) return res.status(400).json({ error: "URL requerida" });
        
        // Intentamos obtener la info con el agente de usuario
        const info = await ytdl.getInfo(url, { requestOptions: agentOptions });
        res.json({ title: info.videoDetails.title });
    } catch (error) {
        console.error('Error en info:', error.message);
        res.status(500).json({ error: "YouTube bloqueó la petición. Intenta con otro video corto." });
    }
});

app.get('/api/download', async (req, res) => {
    try {
        const { url, format } = req.query;
        if (!url) return res.status(400).send("URL requerida");

        const options = format === 'mp3' 
            ? { filter: 'audioonly', quality: 'highestaudio', requestOptions: agentOptions }
            : { quality: 'highest', requestOptions: agentOptions };

        res.setHeader('Content-Disposition', `attachment; filename="descarga.${format}"`);
        ytdl(url, options).pipe(res);
    } catch (error) {
        console.error('Error en descarga:', error.message);
        res.status(500).send("Error en la descarga");
    }
});

module.exports = app;
