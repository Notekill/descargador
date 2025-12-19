const urlInput = document.getElementById('urlInput');
const statusMessage = document.getElementById('statusMessage');
let selectedFormat = 'mp3';

function setFormat(format) {
    selectedFormat = format;
    console.log("Formato cambiado a:", format);
}

async function iniciarDescarga() {
    const url = urlInput.value.trim();
    if (!url) {
        alert("Por favor, pega un link de YouTube");
        return;
    }

    statusMessage.textContent = "Procesando...";
    statusMessage.className = "status-bar info";
    statusMessage.classList.remove('hidden');

    try {
        const res = await fetch('/api/info', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
        });

        if (res.ok) {
            statusMessage.textContent = "¡Iniciando descarga!";
            statusMessage.className = "status-bar success";
            
            // Redirección directa para que el navegador descargue el archivo
            window.location.href = `/api/download?url=${encodeURIComponent(url)}&format=${selectedFormat}`;
        } else {
            const errorData = await res.json();
            throw new Error(errorData.error || "Error en el servidor");
        }
    } catch (e) {
        statusMessage.textContent = "Error: " + e.message;
        statusMessage.className = "status-bar error";
    }
}
