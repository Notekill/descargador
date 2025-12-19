const urlInput = document.getElementById('urlInput');
const statusMessage = document.getElementById('statusMessage');
let selectedFormat = 'mp3';

function setFormat(format) {
    selectedFormat = format;
    console.log("Formato:", format);
}

async function iniciarDescarga() {
    const url = urlInput.value.trim();
    if (!url) return alert("Pega un link de YouTube");

    statusMessage.textContent = "Procesando con Proxy...";
    statusMessage.className = "status-bar info";
    statusMessage.classList.remove('hidden');

    try {
        const res = await fetch('/api/info', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        statusMessage.textContent = "¡Listo! Iniciando descarga...";
        
        // DISPARO DE DESCARGA (Evita bloqueos del navegador)
        const downloadUrl = `/api/download?url=${encodeURIComponent(url)}&format=${selectedFormat}`;
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = ""; 
        document.body.appendChild(a);
        a.click();
        a.remove();

    } catch (e) {
        statusMessage.textContent = "Error: " + e.message;
        statusMessage.className = "status-bar error";
    }
}
