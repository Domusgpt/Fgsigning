
document.getElementById('image-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const fileInput = document.getElementById('image-file');
    const file = fileInput.files[0];
    if (!file) {
        showError('Please select an image file.');
        return;
    }
    console.log("File selected:", file.name);
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageUrl = e.target.result;
        const signatureUrl = 'https://i.imgur.com/L9TaQjM.png'; // Updated signature image URL

        console.log("Image URL:", imageUrl);
        processImage(imageUrl, signatureUrl);
    };
    reader.onerror = function(error) {
        console.error("Error reading file:", error);
        showError('Error reading the selected image file.');
    };
    reader.readAsDataURL(file);
});

function processImage(imageUrl, signatureUrl) {
    showLoading(true);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const image = new Image();
    image.src = imageUrl;

    image.onload = function() {
        console.log("Image loaded successfully.");
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

        const signature = new Image();
        signature.src = signatureUrl;
        signature.crossOrigin = 'Anonymous';
        signature.onload = function() {
            console.log("Signature image loaded successfully.");
            const signatureWidth = image.width * 0.3; // 30% of the image width
            const signatureHeight = signature.height * (signatureWidth / signature.width);
            const randomX = Math.random() * (canvas.width - signatureWidth);
            const randomY = Math.random() * (canvas.height - signatureHeight);

            ctx.globalAlpha = 1.0; // Make the signature completely opaque
            ctx.drawImage(signature, randomX, randomY, signatureWidth, signatureHeight);

            const resultImage = canvas.toDataURL('image/png');
            localStorage.setItem('resultImage', resultImage);

            const messages = [
                "We thank you for the right to your image and name for use in perpetuity",
                "We copyrighted your face",
                "Thanks, now we have your soul",
                "Slaughter a goat in the full moon and chant our names while burning this picture",
                "Put this in a museum",
                "We are sure those hairs you find in the shower mean you're going bald"
            ];

            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            localStorage.setItem('randomMessage', randomMessage);

            console.log("Image processing complete. Redirecting to result page.");
            window.location.href = 'result.html';
        };
        signature.onerror = function() {
            console.error("Error loading signature image.");
            showError('Error loading the signature image.');
            showLoading(false);
        };
    };
    image.onerror = function() {
        console.error("Error loading main image.");
        showError('Error loading the uploaded image.');
        showLoading(false);
    };
}

function showLoading(show) {
    const spinner = document.getElementById('loading-spinner');
    if (show) {
        spinner.classList.remove('hidden');
    } else {
        spinner.classList.add('hidden');
    }
}

function showError(message) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.innerText = message;
    errorMessage.classList.remove('hidden');
}

window.addEventListener('load', function() {
    const resultImage = localStorage.getItem('resultImage');
    const randomMessage = localStorage.getItem('randomMessage');

    if (resultImage) {
        console.log("Displaying result image.");
        document.getElementById('result-image').src = resultImage;
    }
    if (randomMessage) {
        console.log("Displaying random message.");
        document.getElementById('random-message').innerText = randomMessage;
    }
});
