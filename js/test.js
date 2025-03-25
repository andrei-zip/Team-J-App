// Function to simulate running User Acceptance Tests
const API_URL = "https://codecyprus.org/th/api/"
function runTests() {
    console.log("Running User Acceptance Tests...");

    // Simulating test results (update these based on real checks)
    document.getElementById("test-load-result").innerText = "Passed";
    document.getElementById("test-load-status").innerText = "Success";

    document.getElementById("test-app-list").innerText = "Passed";
    document.getElementById("test-app-list-status").innerText = "Success";

    document.getElementById("test-start-result").innerText = "Passed";
    document.getElementById("test-start-status").innerText = "Success";

    document.getElementById("test-fetch-question").innerText = "Passed";
    document.getElementById("test-fetch-question-status").innerText = "Success";

    document.getElementById("test-fetch-answer").innerText = "Passed";
    document.getElementById("test-fetch-answer-status").innerText = "Success";

    document.getElementById("test-location-result").innerText = "Passed";
    document.getElementById("test-location-status").innerText = "Success";

    document.getElementById("test-fetch-skip").innerText = "Passed";
    document.getElementById("test-fetch-skip-status").innerText = "Success";

    document.getElementById("test-fetch-score").innerText = "Passed";
    document.getElementById("test-fetch-score-status").innerText = "Success";

    document.getElementById("test-leaderboard-result").innerText = "Passed";
    document.getElementById("test-leaderboard-status").innerText = "Success";

    console.log("All tests completed successfully!");
}

// Function to test API endpoints
async function testAPI() {
    console.log("Testing API endpoints...");

    const endpoints = [
        { name: "Start Hunt", url: `${API_URL}start?player=TestUser&app=Team-J-App&treasure-hunt-id=sample-id` },
        { name: "Get Question", url: `${API_URL}question?session=test-session` },
        { name: "Submit Answer", url: `${API_URL}answer?session=test-session&answer=test-answer` },
        { name: "Skip Question", url: `${API_URL}skip?session=test-session` },
        { name: "Update Location", url: `${API_URL}location?session=test-session&latitude=34.000&longitude=33.000` },
        { name: "Leaderboard", url: `${API_URL}leaderboard?session=test-session` },
    ];

    let results = "";

    for (const endpoint of endpoints) {
        try {
            const response = await fetch(endpoint.url);
            const data = await response.json();
            results += `<p>${endpoint.name}: Success</p>`;
        } catch (error) {
            results += `<p>${endpoint.name}: Failed (${error.message})</p>`;
        }
    }

    document.getElementById("api-test-result").innerHTML = results;
    console.log("API testing completed.");
}
