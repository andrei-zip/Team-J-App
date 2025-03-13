const API_URL = 'https://codecyprus.org/th/api/'; // Base API URL

let session = null; // Stores the session ID
let score = 0; // Tracks the player's score
let currentQuestion = null; // Stores the current question object
let timer = 1800; // 30 minutes in seconds



document.getElementById('skip-question').style.display = 'none';
// Function to start the treasure hunt session
async function startHunt(playerName, appName, treasureHuntId) {
    console.log("Selected Treasure Hunt ID:", treasureHuntId); //Log the selected treasureHunt ID

    if (!treasureHuntId) {
        console.error("Error: treasureHuntId is undefined!");
        return;
    }

    try {
        //send the request to start a new session
        const response = await fetch(`${API_URL}start?player=${encodeURIComponent(playerName)}&app=${encodeURIComponent(appName)}&treasure-hunt-id=${encodeURIComponent(treasureHuntId)}`);
        const data = await response.json();

        if (data.status === 'OK') { //If the session starts successfully
            session = data.session; //Then we store the session ID
            fetchQuestion(); //And fetch the first (or not) question
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
        //Request the nex question from API
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
    //Here we display number or text question number or text in UI
    document.getElementById('question-title').innerText = `Question ${currentQuestion.currentQuestionIndex + 1}`;
    document.getElementById('question-text').innerHTML = currentQuestion.questionText;
    //Clear the answer input filed for the new question
    document.getElementById('answer-input').value = "";

    if (currentQuestion.canBeSkipped){
        document.getElementById('skip-question').style.display = 'block';

    }
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


        if (data.status === 'OK') { //If the submission is successful
            if (data.correct) {
                score += data.score; //then we update the score

            }
            else {
                score -= 5;

            }
            if (score <= 0){
                score = 0;
            }


            document.getElementById('score').innerText = score; //And we display the updated score
            document.getElementById('feedback').innerText = score ? 'Correct! You are goody :)' : 'Incorrect. But who said that it could be easy? ;)';

            updateScore(score); //And call function to update score in UI

            if (data.completed) { //Check if the TreasureHunt is entire completed
                alert('Congratulations! You have completed the treasure hunt.');
            } else {
                fetchQuestion(); //And after that we fetch the next question

            }
        } else {
            console.error('Error submitting answer:', data.errorMessages);
        }
    } catch (error) {
        console.error('Network error while submitting answer:', error);
    }
}

//It's for updating our current player's score
function updateScore(newScore) {
    document.getElementById('score').innerText = `${newScore}`;
}
async function skipQuestion() {
    const response = await fetch(`${API_URL}skip?session=${session}`);
    const data = await response.json();

    if (data.status === 'OK'){
        score = data.score
        updateScore(score);

        document.getElementById('feedback').innerText = 'You skipped this question! -5 points!';
        fetchQuestion();
    }
}
// Function to update the timer every second
    function updateTimer() {
        if (timer > 0) { //There is time left
            timer--;
            document.getElementById('timer').innerText = new Date(timer * 1000).toISOString().substring(14, 19); //Convert the remaining time into a mm:ss format and update UI
        } else {
            alert('Time is up!'); //And we notify if time ran out
        }
    }

// Function to update the user's location
    async function updateLocation() {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
        }
        navigator.geolocation.getCurrentPosition(async (position) => {
            const {latitude, longitude} = position.coords; //We extract latitude and longitude
            try {
                //And then we send location data to API
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
        const playerName = prompt('Enter your name:'); //Prompt user to enter its name
        const appName = 'TreasureHuntApp'; //Set the app name (TreasureHunt Games Name)
        const treasureHuntId = sessionStorage.getItem('selectedTreasureHuntId'); //After that it retrieve treasure hunt ID from session storage

        if (treasureHuntId) { //If ID's Hunt exists
            startHunt(playerName, appName, treasureHuntId); //Then finally starts the TreasureHunt
            setInterval(updateTimer, 1000); //Countdown timer
            document.getElementById("submit-answer").addEventListener("click", submitAnswer);
            document.getElementById("get-location").addEventListener("click", updateLocation);
        } else {
            alert('No treasure hunt selected! Returning to selection page.'); //We alert user if Game isn't selected yet
            window.location.href = 'list.html'; //And redirect back to the start.html to select game
        }
    });
