async function iniciarDescarga() {
    const url = urlInput.value.trim();
    if (!url) {
        alert("Por favor, pega un link de YouTube");
        return;
    }

    statusMessage.textContent = "Conectando con el servidor...";
    statusMessage.className = "status-bar info";
    statusMessage.classList.remove('hidden');

    try {
        console.log("Enviando petición para:", url);
        const infoRes = await fetch('/api/info', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url })
        });

        const data = await infoRes.json();

        if (infoRes.ok) {
            statusMessage.textContent = `Preparando: ${data.title}`;
            statusMessage.className = "status-bar success";
            
            // Redirección directa para descargar
            const downloadUrl = `/api/download?url=${encodeURIComponent(url)}&format=${selectedFormat}`;
            window.location.href = downloadUrl;
        } else {
            throw new Error(data.error || "Error en el servidor");
        }
    } catch (e) {
        console.error("Error detallado:", e);
        statusMessage.textContent = "Error: El servidor no responde. Revisa los logs de Vercel.";
        statusMessage.className = "status-bar error";
    }
}
