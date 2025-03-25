
/** Custom alerts javascript **/
/* displays the custom alert*/
function showCustomAlert(message) {
    document.getElementById('alertMessage').innerHTML = message;
    document.getElementById('alertOverlay').style.display = 'block';
    document.getElementById('customAlert').style.display = 'block';
}
/* hides custom alert*/
function hideCustomAlert() {
    document.getElementById('alertOverlay').style.display = "none";
    document.getElementById('customAlert').style.display = 'none';
}
/* makes custom alert invisible originally*/
window.onload = () => {
    document.getElementById('alertOverlay').style.display = 'none';
    document.getElementById('customAlert').style.display = 'none';
};