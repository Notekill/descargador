// Selección de elementos del DOM
const urlInput = document.getElementById('urlInput');
const statusMessage = document.getElementById('statusMessage');
let selectedFormat = 'mp3'; // Por defecto

// Función para elegir formato (asegúrate de que tus botones HTML la llamen)
function setFormat(format) {
    selectedFormat = format;
    console.log("Formato seleccionado:", format);
}

async function iniciarDescarga() {
    const url = urlInput.value.trim();
    if (!url) {
        alert("Por favor, pega un link de YouTube");
        return;
    }

    // Mostrar mensaje de estado
    statusMessage.textContent = "Analizando video...";
    statusMessage.className = "status-bar info";
    statusMessage.classList.remove('hidden');

    try {
        // 1. Pedir información al servidor
        const res = await fetch('/api/info', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url })
        });

        const data = await res.json();

        if (res.ok) {
            statusMessage.textContent = "¡Descarga iniciada!";
            statusMessage.className = "status-bar success";

            // 2. REDIRECCIÓN DIRECTA: El navegador detecta el archivo y lo baja
            const downloadUrl = `/api/download?url=${encodeURIComponent(url)}&format=${selectedFormat}`;
            window.location.href = downloadUrl;
        } else {
            throw new Error(data.error || "Error en el servidor");
        }
    } catch (e) {
        console.error("Error:", e);
        statusMessage.textContent = "Error: " + e.message;
        statusMessage.className = "status-bar error";
    }
}
