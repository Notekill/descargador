async function iniciarDescarga() {
    const url = urlInput.value.trim();
    if (!url) return alert("Pega un link");

    statusMessage.textContent = "Analizando...";
    statusMessage.className = "status-bar info";
    statusMessage.classList.remove('hidden');

    try {
        const res = await fetch('/api/info', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
        });
        const data = await res.json();

        if (res.ok) {
            statusMessage.textContent = "¡Descarga iniciada!";
            // Este es el truco para que el navegador descargue de verdad:
            window.location.href = `/api/download?url=${encodeURIComponent(url)}&format=${selectedFormat}`;
        } else {
            throw new Error(data.error);
        }
    } catch (e) {
        statusMessage.textContent = "Error: " + e.message;
        statusMessage.className = "status-bar error";
    }
}
