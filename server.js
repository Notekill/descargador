const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
function obtenerIdentidadHumana() {
    const identidades = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/120.0.0.0'
    ];
    return identidades[Math.floor(Math.random() * identidades.length)];
}

// Función para obtener headers actualizados
const getOptions = () => {
    let cookies = '';
    const cookiePath = path.join(__dirname, 'cookies.json');
    if (fs.existsSync(cookiePath)) {
        const raw = JSON.parse(fs.readFileSync(cookiePath, 'utf8'));
        cookies = raw.map(c => `${c.name}=${c.value}`).join('; ');
const opciones = {
    quality: isMp3 ? 'highestaudio' : 'highest',
    filter: isMp3 ? 'audioonly' : 'videoandaudio',
    requestOptions: {
        headers: {
            'User-Agent': obtenerIdentidadHumana(),
            'Accept': '*/*',
            'Accept-Language': 'es-ES,es;q=0.9',
            'Referer': 'https://www.youtube.com/',
            'Origin': 'https://www.youtube.com/'
        }
    }
};

ytdl(url, opciones).pipe(res);
        
    }
    
    return {
        requestOptions: {
            headers: {
                'cookie': cookies,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': '*/*',
                'Accept-Language': 'es-ES,es;q=0.9',
            }
        }
    };
};

app.post('/api/info', async (req, res) => {
    try {
        const info = await ytdl.getInfo(req.body.url, getOptions());
        res.json({ title: info.videoDetails.title });
    } catch (error) {
        console.error("Error Info:", error.message);
        res.status(500).json({ error: "YouTube requiere verificación. Intentando bypass..." });
    }
});

app.get('/api/download', async (req, res) => {
    try {
        const { url, format } = req.query;
        const isMp3 = format === 'mp3';
        
        res.setHeader('Content-Disposition', `attachment; filename="video.${format}"`);
        
        ytdl(url, {
            quality: isMp3 ? 'highestaudio' : 'highest',
            filter: isMp3 ? 'audioonly' : 'videoandaudio',
            ...getOptions()
        }).pipe(res);
    } catch (error) {
        res.status(500).send("Error en la descarga");
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));
