async function startSession(treasureHuntId) {
    const playerName = document.getElementById("playerName").value.trim();

    const appId = "Team-J-App"; // ID application
    const startUrl = `${THE_LIST_BASE_URL}start?player=${encodeURIComponent(playerName)}&app=${encodeURIComponent(appId)}&treasure-hunt-id=${encodeURIComponent(treasureHuntId)}`;

    try {
        console.log("Request of creating session:", startUrl);
        const response = await fetch(startUrl);
        const data = await response.json();

        if (data.status === "OK") {
            localStorage.setItem("sessionId", data.sessionId);
            console.log("Session successfully created:", data.sessionId);
            window.location.href = "start.html";
        } else {
            console.error("Error of creating session:", data.errorMessages);
            alert("Error: " + data.errorMessages.join(", "));
        }
    } catch (error) {
        console.error("Network error while creating session:", error);
        alert("Network error. Check your connection.");
    }
}

/**
 * Function for receiving sessionId
 */
function getSessionId() {
    return localStorage.getItem("sessionId");
}


function endSession() {
    localStorage.removeItem("sessionId");
    console.log("Session ended.");
}