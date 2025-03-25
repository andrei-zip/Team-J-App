function showCustomAlert(message) {
    document.getElementById('alertMessage').innerHTML = message;
    document.getElementById('alertOverlay').style.display = 'block';
    document.getElementById('customAlert').style.display = 'block';
}

function hideCustomAlert() {
    document.getElementById('alertOverlay').style.display = "none";
    document.getElementById('customAlert').style.display = 'none';
}

window.onload = () => {
    document.getElementById('alertOverlay').style.display = 'none';
    document.getElementById('customAlert').style.display = 'none';
};