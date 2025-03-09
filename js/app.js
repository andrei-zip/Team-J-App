const API_URL = 'https://codecyprus.org/th/api/';

let score = 0;
let currentQuestion = null;
let timer = 1800; // 30 minutes per seconds

document.addEventListener("DOMContentLoaded", () => {
    fetchQuestion();
    setInterval(updateTimer, 1000);
    document.getElementById("submit-answer").addEventListener("click", submitAnswer);
    document.getElementById("get-location").addEventListener("click", updateLocation);
});