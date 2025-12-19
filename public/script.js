// Dentro de tu función iniciarDescarga, después del if(res.ok)
if (res.ok) {
    statusMessage.textContent = "¡Descarga iniciada!";
    statusMessage.className = "status-bar success";
    
    // REDIRECCIÓN DIRECTA: Es la forma más fiable en Render
    const downloadUrl = `/api/download?url=${encodeURIComponent(url)}&format=${selectedFormat}`;
    window.location.href = downloadUrl;
}
