document.addEventListener('DOMContentLoaded', () => {
    const downloadBtn = document.getElementById('downloadBtn');
    const urlInput = document.getElementById('urlInput');
    const statusMessage = document.getElementById('statusMessage');
    const formatSpans = document.querySelectorAll('.pill-switch span');

    let selectedFormat = 'mp3';

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

        statusMessage.textContent = "Conectando con el servidor...";
        statusMessage.className = "status-bar info";
        statusMessage.classList.remove('hidden');

        try {
            const infoRes = await fetch('/api/info', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });

            if (infoRes.ok) {
                const data = await infoRes.json();
                statusMessage.textContent = `Descargando: ${data.title}`;
                statusMessage.className = "status-bar success";

                // Dispara la descarga usando la ruta de la API
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
