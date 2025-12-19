document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos de la Interfaz ---
    const downloadBtn = document.getElementById('downloadBtn');
    const urlInput = document.getElementById('urlInput');
    const statusMessage = document.getElementById('statusMessage');
    const formatSpans = document.querySelectorAll('.pill-switch span');
    const queueList = document.getElementById('queueList');

    // Variables de Estado
    let selectedFormat = 'mp3';

    // --- Lógica de Selección de Formato ---
    formatSpans.forEach(span => {
        span.addEventListener('click', () => {
            formatSpans.forEach(s => s.classList.remove('active'));
            span.classList.add('active');
            selectedFormat = span.textContent.trim().toLowerCase();
        });
    });

    // --- Función Principal: Descargar ---
    async function iniciarDescarga() {
        const url = urlInput.value.trim();

        if (!url) {
            showStatus('Por favor, pega un enlace de YouTube', 'error');
            return;
        }

        // Regex básica para validar YouTube
        const ytRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
        if (!ytRegex.test(url)) {
            showStatus('Enlace de YouTube no válido', 'error');
            return;
        }

        showStatus('Procesando descarga...', 'info');

        try {
            // 1. Primero obtenemos la información (Título y miniatura)
            const infoResponse = await fetch('/api/info', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });

            if (infoResponse.ok) {
                const data = await infoResponse.json();
                showStatus(`Descargando: ${data.title}`, 'success');

                // 2. DISPARAR LA DESCARGA REAL
                // Redirigimos al endpoint de descarga. Esto hará que el navegador 
                // reciba el archivo y lo guarde en la carpeta "Descargas" del usuario.
                const downloadUrl = `/api/download?url=${encodeURIComponent(url)}&format=${selectedFormat}`;
                window.location.href = downloadUrl;

                // Limpiar input después de un momento
                setTimeout(() => { urlInput.value = ''; }, 3000);
            } else {
                showStatus('Error al analizar el video', 'error');
            }
        } catch (e) {
            console.error(e);
            showStatus('Error de conexión con el servidor', 'error');
        }
    }

    // Eventos de los botones
    downloadBtn.addEventListener('click', iniciarDescarga);

    // Permitir descargar al presionar "Enter"
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') iniciarDescarga();
    });

    // --- Utilidad de Mensajes ---
    function showStatus(msg, type) {
        statusMessage.textContent = msg;
        statusMessage.className = `status-bar ${type}`; 
        statusMessage.classList.remove('hidden');
        
        // Auto-ocultar si es éxito
        if (type === 'success' || type === 'error') {
            setTimeout(() => {
                statusMessage.classList.add('hidden');
            }, 5000);
        }
    }
});
