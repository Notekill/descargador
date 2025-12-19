document.addEventListener('DOMContentLoaded', () => {
    const downloadBtn = document.getElementById('downloadBtn');
    const urlInput = document.getElementById('urlInput');
    const statusMessage = document.getElementById('statusMessage');
    const formatSpans = document.querySelectorAll('.pill-switch span');

    let selectedFormat = 'mp3';

    // Selección de formato (MP3 o MP4)
    formatSpans.forEach(span => {
        span.addEventListener('click', () => {
            formatSpans.forEach(s => s.classList.remove('active'));
            span.classList.add('active');
            selectedFormat = span.textContent.trim().toLowerCase();
        });
    });

    async function iniciarDescarga() {
        const url = urlInput.value.trim();
        if (!url) return alert("Pega un link de YouTube");

        // Cambiamos el mensaje de "Error de conexión" por uno de carga
        statusMessage.textContent = "Conectando con el servidor...";
        statusMessage.className = "status-bar info";
        statusMessage.classList.remove('hidden');

        try {
            // 1. Pedir info del video
            const infoRes = await fetch('/api/info', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });

            if (infoRes.ok) {
                const data = await infoRes.json();
                statusMessage.textContent = `Descargando: ${data.title}`;
                statusMessage.className = "status-bar success";

                // 2. DISPARAR DESCARGA AL NAVEGADOR
                window.location.href = `/api/download?url=${encodeURIComponent(url)}&format=${selectedFormat}`;
            } else {
                throw new Error();
            }
        } catch (e) {
            statusMessage.textContent = "Error al procesar el video. Intenta con otro link.";
            statusMessage.className = "status-bar error";
        }
    }

    downloadBtn.addEventListener('click', iniciarDescarga);
});
