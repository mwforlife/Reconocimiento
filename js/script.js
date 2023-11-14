async function startVideo() {
    const video = document.getElementById('inputVideo');
    const overlay = document.getElementById('overlay');
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        video.srcObject = stream;

        video.addEventListener('loadedmetadata', () => {
            const displaySize = { width: video.videoWidth, height: video.videoHeight };

            faceapi.matchDimensions(overlay, displaySize);

            setInterval(async () => {
                const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors();
                if (detections.length > 0) {
                    console.log('¡Cara detectada!');
                }else{
                    console.log('No hay caras');
                }
                const resizedDetections = faceapi.resizeResults(detections, displaySize);
                overlay.getContext('2d').clearRect(0, 0, overlay.width, overlay.height);
                faceapi.draw.drawDetections(overlay, resizedDetections);
                faceapi.draw.drawFaceLandmarks(overlay, resizedDetections);
                faceapi.draw.drawFaceDescriptors(overlay, resizedDetections);
            }, 100); // Actualiza cada 100ms
        });

    } catch (error) {
        console.error('Error al acceder a la cámara: ', error);
    }
}

startVideo();
