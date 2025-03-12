const API_URL = 'https://codecyprus.org/th/api/'; // Base API URL

let session = null; // Stores the session ID
let score = 0; // Tracks the player's score
let currentQuestion = null; // Stores the current question object
let timer = 1800; // 30 minutes in seconds

// Function to start the treasure hunt session
async function startHunt(playerName, appName, treasureHuntId) {
    console.log("Selected Treasure Hunt ID:", treasureHuntId);

    if (!treasureHuntId) {
        console.error("Error: treasureHuntId is undefined!");
        return;
    }

    try {
        const response = await fetch(`${API_URL}start?player=${encodeURIComponent(playerName)}&app=${encodeURIComponent(appName)}&treasure-hunt-id=${encodeURIComponent(treasureHuntId)}`);
        const data = await response.json();

        if (data.status === 'OK') {
            session = data.session;
            fetchQuestion();
        } else {
            console.error('Error starting hunt:', data.errorMessages);
        }
    } catch (error) {
        console.error('Network error while starting hunt:', error);
    }
}

// Function to fetch the current question
async function fetchQuestion() {
    if (!session) {
        console.error('Error: Session is not initialized.');
        return;
    }
    try {
        const response = await fetch(`${API_URL}question?session=${session}`);
        const data = await response.json();
        console.log('Fetched question data:', data); // Checking Api-answer

        if (data.status === 'OK') {
            currentQuestion = data; // We took entire object
            console.log('Current question:', currentQuestion); // Checking
            displayQuestion();
        } else {
            console.error('Error fetching question:', data.errorMessages);
        }
    } catch (error) {
        console.error('Network error while fetching question:', error);
    }
}

// Function to display the current question in the UI
function displayQuestion() {
    if (!currentQuestion) {
        console.error('No available question.');
        document.getElementById('question-text').innerText = 'Error loading question.';
        return;
    }
    document.getElementById('question-title').innerText = `Question ${currentQuestion.currentQuestionIndex + 1}`;
    document.getElementById('question-text').innerHTML = currentQuestion.questionText;

    document.getElementById('answer-input').value = "";
}
//Its for updating our current score
function updateScore(newScore) {
    document.getElementById('score').innerText = `Your Score: ${newScore}`;
}

// Function to submit an answer
async function submitAnswer() {
    const answer = document.getElementById('answer-input').value.trim();
    if (!answer) {
        alert('Please enter an answer.');
        return;
    }
    try {
        const response = await fetch(`${API_URL}answer?session=${session}&answer=${encodeURIComponent(answer)}`);
        const data = await response.json();

        if (data.status === 'OK') {
            score = data.score;
            document.getElementById('score').innerText = score;
            document.getElementById('feedback').innerText = data.correct ? 'Correct! You are goody :)' : 'Incorrect. But who said that it could be easy? ;)';

            updateScore(score);

            if (data.completed) {
                alert('Congratulations! You have completed the treasure hunt.');
            } else {
                fetchQuestion();

            }
        } else {
            console.error('Error submitting answer:', data.errorMessages);
        }
    } catch (error) {
        console.error('Network error while submitting answer:', error);
    }
}

// Function to update the timer every second
function updateTimer() {
    if (timer > 0) {
        timer--;
        document.getElementById('timer').innerText = new Date(timer * 1000).toISOString().substring(14, 19);
    } else {
        alert('Time is up!');
    }
}

// Function to update the user's location
async function updateLocation() {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser.');
        return;
    }
    navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
            const response = await fetch(`${API_URL}location?session=${session}&latitude=${latitude}&longitude=${longitude}`);
            const data = await response.json();

            if (data.status === 'OK') {
                document.getElementById('location-status').innerText = 'Location updated.';
            } else {
                console.error('Error updating location:', data.errorMessages);
            }
        } catch (error) {
            console.error('Network error while updating location:', error);
        }
    }, (error) => {
        console.error('Error getting location:', error);
    });
}

// Function to initialize the app when the page loads
document.addEventListener("DOMContentLoaded", () => {
    const playerName = prompt('Enter your name:');
    const appName = 'TreasureHuntApp';
    const treasureHuntId = sessionStorage.getItem('selectedTreasureHuntId');

    if (treasureHuntId) {
        startHunt(playerName, appName, treasureHuntId);
        setInterval(updateTimer, 1000);
        document.getElementById("submit-answer").addEventListener("click", submitAnswer);
        document.getElementById("get-location").addEventListener("click", updateLocation);
    } else {
        alert('No treasure hunt selected! Returning to selection page.');
        window.location.href = 'start.html';
    }
});
