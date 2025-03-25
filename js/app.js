const API_URL = 'https://codecyprus.org/th/api/'; // Base URL for the API

let session = null; // Stores the session ID
let score = 0; // Keeps track of the player's score
let currentQuestion = null; // Holds the current question object
let timer = 1800; // Timer set to 30 minutes (1800 seconds)
let lastLocationUpdate = 0;

document.getElementById('skip-question').style.display = 'none'; // Hide skip button initially

// Function to start the treasure hunt session
async function startHunt(playerName, appName, treasureHuntId) {
    if (!treasureHuntId) {
        alert("Error: No Treasure Hunt ID selected!"); // Alert if no hunt is selected
        return;
    }

    try {
        // Send request to start a new game session
        const response = await fetch(`${API_URL}start?player=${encodeURIComponent(playerName)}&app=${encodeURIComponent(appName)}&treasure-hunt-id=${encodeURIComponent(treasureHuntId)}`);
        const data = await response.json(); // Parse JSON response

        if (data.status === 'OK') { // If session starts successfully
            session = data.session; // Store session ID
            fetchQuestion(); // Fetch the first question
        } else {
            alert('Error starting hunt: ' + (data.errorMessages || 'Unknown error')); // Show error message
        }
    } catch (error) {
        console.error('Network error while starting hunt:', error); // Log network error
        alert('Network error! Please try again.');
    }
}

// Function to fetch the current question from the API
async function fetchQuestion() {
    if (!session) {
        alert('Session not found. Please restart the hunt'); // Alert if session is missing
        return;
    }
    try {
        const response = await fetch(`${API_URL}question?session=${session}`); // Fetch question data
        const data = await response.json();

        if (data.status === 'OK') {
            currentQuestion = data; // Store current question object
            displayQuestion(); // Display question in UI
        } else {
            alert('Error fetching question: ' + (data.errorMessages || 'Unknown error'));
            window.location.href = 'index.html'; // Go back to index.html if by some reasons treasureHunt is not available for now
        }
    } catch (error) {
        console.error('Network error while fetching question:', error);
        alert('Network issue! Please try again');
    }
}

// Function to display the current question in the UI
function displayQuestion() {
    if (!currentQuestion) {
        alert('Error loading question.'); // Alert if question data is missing
        return;
    }

    document.getElementById('question-title').innerText = `Question ${currentQuestion.currentQuestionIndex + 1}`; // Display question number
    document.getElementById('question-text').innerHTML = currentQuestion.questionText; // Display question text
    document.getElementById('answer-input').value = ""; // Clear the answer input field

    // Show skip button if the question can be skipped
    if (currentQuestion.canBeSkipped) {
        document.getElementById('skip-question').style.display = 'block';
    } else {
        document.getElementById('skip-question').style.display = 'none';
    }
}

// Function to submit an answer
async function submitAnswer() {
    const answer = document.getElementById('answer-input').value.trim();
    if (!answer) {
        alert('Please enter an answer.');
        return;
    }
// Confirm submission
    const isConfirmed = confirm('Are you sure you want to submit this answer?');
    if (!isConfirmed) {
        return; // If not confirmed, exit the function
    }
    try {
        const response = await fetch(`${API_URL}answer?session=${session}&answer=${encodeURIComponent(answer)}`);
        const data = await response.json();

        if (data.status === 'OK') { // If submission is successful
            score += data.scoreAdjustment; // Taking score from API
            if (score < 0) { // In case if we have already 0 and answered the question incorrectly
                score = 0; // Then the score will not be negative
            }
            updateScore(score); // updating the score

            // Update UI with feedback
            document.getElementById('feedback').innerText = data.correct ? 'Correct!' : 'Incorrect!';
            if (data.completed) { // If the hunt is finished, go to leaderboard
                alert('Congrats! You complete te TreasureHunt Game!');
                window.location.href = "leaderboard.html"; // Redirect to leaderboard.html
            } else {
                fetchQuestion(); // Go to the next question
            }
        } else {
            alert('Error submitting answer: ' + (data.errorMessages || 'Unknown error'));
        }
    } catch (error) {
        console.error('Network error while submitting answer:', error);
        alert('Network issue! Please try again.');
    }
}

async function Leaderboard() {
    console.log("Fetching leaderboard...");

    let sessionId = session || sessionStorage.getItem('session');
    let treasureHuntId = sessionStorage.getItem('selectedTreasureHuntId');

    // Проверяем, какой параметр передавать
    let queryParam = sessionId ? `session=${sessionId}` : `treasure-hunt-id=${treasureHuntId}`;

    try {
        const response = await fetch(`${API_URL}leaderboard?${queryParam}&sorted=true&limit=10`); // Request to API

        const data = await response.json();
        console.log("Leaderboard data:", data); // checking JSON in console

        if (data.status === 'OK') {
            const leaderboardContainer = document.getElementById('leaderboard');
            leaderboardContainer.innerHTML = `<h2>Leaderboard - ${data.treasureHuntName}</h2><ul>`;

            data.leaderboard.forEach((entry, index) => {
                // Recreate time in mm:ss
                let timeFormatted = entry.completionTime > 0 ?
                    new Date(entry.completionTime).toISOString().substr(14, 5) : 'N/A';

                leaderboardContainer.innerHTML += `
                    <li><b>${index + 1}. ${entry.player}</b> - ${entry.score} points 
                    (Time: ${timeFormatted})</li>`;
            });

            leaderboardContainer.innerHTML += '</ul>';
            leaderboardContainer.innerHTML += `<button onclick="goBack()">Back to Home</button>`;

            document.getElementById('game-container').style.display = 'none'; // hide TreasureHunt
            leaderboardContainer.style.display = 'block'; // showing leaderboard
        } else {
            alert('Error fetching leaderboard: ' + (data.errorMessages || 'Unknown error'));
        }
    } catch (error) {
        console.error('Network error while fetching leaderboard:', error);
        alert('Network issue! Please try again.');
    }
}
// Call the function to fetch and display the leaderboard when the page is loaded
document.addEventListener('DOMContentLoaded', Leaderboard);

// Function to returning into index.html
function goBack() {
    window.location.href = 'index.html';
}

// Function to update and display the player's score
function updateScore(newScore) {
    document.getElementById('score').innerText = newScore; // Update score in UI
}

// Function to skip a question
async function skipQuestion() {
    try {
        const response = await fetch(`${API_URL}skip?session=${session}`); // Request to skip the question
        const data = await response.json();

        if (data.status === 'OK') {
            score += data.scoreAdjustment; // Also taking from API the current score
            updateScore(score); // Update UI score display
            document.getElementById('feedback').innerText = 'You skipped this question!'; // Show skip feedback
            fetchQuestion(); // Fetch next question
        } else {
            alert('Error skipping question: ' + (data.errorMessages || 'Unknown error'));
        }
    } catch (error) {
        console.error('Network error while skipping question:', error);
        alert('Network issue! Please try again.');
    }
}

// Function to update the countdown timer every second
function updateTimer() {
    if (timer > 0) {
        timer--; // Reduce timer by 1 second
        document.getElementById('timer').innerText = new Date(timer * 1000).toISOString().substring(14, 19); // Display time in MM:SS format
    } else {
        alert('Time is up!'); // Notify player when time runs out
    }
}

// Function to update player's location using Geolocation API
async function updateLocation() {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser.'); // Alert if geolocation is not available
        return;
    }

    //Checking for updating location
    const now = Date.now();
    if (now - lastLocationUpdate < 30000) {
        alert('Update your location every 30 seconds');
        return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords; // Extract latitude and longitude

        if (currentQuestion.requiresLocation){
            submitAnswer();
        }

        try {
            const response = await fetch(`${API_URL}location?session=${session}&latitude=${latitude}&longitude=${longitude}`);
            const data = await response.json();

            if (data.status === 'OK') {
                document.getElementById('location-status').innerText = `Location updated: ${latitude}, ${longitude}`; // Update location status in UI which showing coords
            } else {
                alert('Error updating location: ' + (data.errorMessages || 'Unknown error'));
            }
        } catch (error) {
            console.error('Network error while updating location:', error);
            alert('Network issue! Please try again.');
        }
    }, (error) => {
        alert('Error getting location: ' + error.message); // Alert on geolocation error
    });
}

// Function to initialize the game when the page loads
document.addEventListener("DOMContentLoaded", () => {
    const playerName = prompt('Enter your name:'); // Prompt player to enter their name
    const appName = 'TreasureHuntApp'; // Define the application name
    const treasureHuntId = sessionStorage.getItem('selectedTreasureHuntId'); // Retrieve treasure hunt ID from session storage

    if (treasureHuntId) {
        startHunt(playerName, appName, treasureHuntId); // Start the treasure hunt
        setInterval(updateTimer, 1000); // Start the countdown timer (updates every second)

        // Attach event listeners to UI buttons
        document.getElementById("submit-answer").addEventListener("click", submitAnswer);
        document.getElementById("get-location").addEventListener("click", updateLocation);

    } else {
        alert('No treasure hunt selected! Returning to selection page.'); // Alert if no game was selected
        window.location.href = 'index.html'; // Go back to list.html after completed treasureHunt
    }
});
