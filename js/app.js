const API_URL = 'https://codecyprus.org/th/api/'; // Base URL for API requests

let session = null; // Stores the session ID after starting the hunt
let score = 0; // Tracks the player's score
let currentQuestion = null; // Stores the current question object
let timer = 1800; // 30 minutes in seconds

// Function to start the treasure hunt session
async function startHunt(playerName, appName, treasureHuntId) {
    try {
        const response = await fetch(`${API_URL}start?player=${encodeURIComponent(playerName)}&app=${encodeURIComponent(appName)}&treasure-hunt-id=${encodeURIComponent(treasureHuntId)}`);
        const data = await response.json();

        if (data.status === 'OK') { // If the request is successful
            session = data.session; // Save the session ID
            fetchQuestion(); // Fetch the first question
        } else {
            console.error('Error starting hunt:', data.errorMessages); // Log error if hunt fails to start
        }
    } catch (error) {
        console.error('Network error while starting hunt:', error); // Handle network errors
    }
}

// Function to fetch the current question from the API
async function fetchQuestion() {
    if (!session) {
        console.error('Session not initialized.'); // Ensure a session exists
        return;
    }
    try {
        const response = await fetch(`${API_URL}question?session=${session}`);
        const data = await response.json();

        if (data.status === 'OK') {
            currentQuestion = data.question; // Save the current question
            displayQuestion(); // Display the question on the page
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
        console.error('No question available.');
        return;
    }
    document.getElementById('question-title').innerText = `Question ${currentQuestion.currentQuestionIndex + 1}`; // Update question title
    document.getElementById('question-text').innerHTML = currentQuestion.questionText; // Show question text
}

// Function to submit an answer to the API
async function submitAnswer() {
    const answer = document.getElementById('answer-input').value.trim(); // Get the user's answer
    if (!answer) {
        alert('Please enter an answer.'); // Ensure an answer is provided
        return;
    }
    try {
        const response = await fetch(`${API_URL}answer?session=${session}&answer=${encodeURIComponent(answer)}`);
        const data = await response.json();

        if (data.status === 'OK') {
            score = data.score; // Update the score
            document.getElementById('score').innerText = score; // Display the new score
            document.getElementById('feedback').innerText = data.correct ? 'Correct!' : 'Incorrect. Try again.'; // Show feedback

            if (data.completed) { // If the hunt is completed
                alert('Congratulations! You have completed the treasure hunt.');
            } else {
                fetchQuestion(); // Load the next question
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
        timer--; // Decrease the time
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        document.getElementById('timer').innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; // Format time display
    } else {
        alert('Time is up!'); // Notify the player when time runs out
    }
}

// Function to update the user's location (if needed)
async function updateLocation() {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser.'); // Check if geolocation is supported
        return;
    }
    navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
            const response = await fetch(`${API_URL}location?session=${session}&latitude=${latitude}&longitude=${longitude}`);
            const data = await response.json();

            if (data.status === 'OK') {
                document.getElementById('location-status').innerText = 'Location updated.'; // Notify user of update
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
    const playerName = prompt('Enter your name:'); // Ask for player's name
    const appName = 'TreasureHuntApp'; // Define the app name
    const treasureHuntId = sessionStorage.getItem('selectedTreasureHuntId'); // Retrieve the selected hunt ID from storage

    if (treasureHuntId) {
        startHunt(playerName, appName, treasureHuntId); // Start the hunt with the selected ID
        setInterval(updateTimer, 1000); // Start the timer countdown
        document.getElementById("submit-answer").addEventListener("click", submitAnswer); // Handle answer submission
        document.getElementById("get-location").addEventListener("click", updateLocation); // Handle location updates
    } else {
        alert('No treasure hunt selected! Returning to selection page.');
        window.location.href = 'start.html'; // Redirect if no hunt is selected
    }
});
