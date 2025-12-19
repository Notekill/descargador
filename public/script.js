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
            statusMessage.textContent = "¡Descarga iniciada!";
            statusMessage.className = "status-bar success";
            window.location.href = `/api/download?url=${encodeURIComponent(url)}&format=${selectedFormat}`;
        } else {
            throw new Error("Error en el servidor");
        }
    } catch (e) {
        statusMessage.textContent = "Error: " + e.message;
        statusMessage.className = "status-bar error";
    }
}
