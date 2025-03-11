async function startSession(treasureHuntId) {
    const playerName = document.getElementById("playerName").value.trim();

    const appId = "Team-J-App"; // ID приложения
    const startUrl = `${THE_LIST_BASE_URL}start?player=${encodeURIComponent(playerName)}&app=${encodeURIComponent(appId)}&treasure-hunt-id=${encodeURIComponent(treasureHuntId)}`;

    try {
        console.log("Запрос на создание сессии:", startUrl);
        const response = await fetch(startUrl);
        const data = await response.json();

        if (data.status === "OK") {
            localStorage.setItem("sessionId", data.sessionId);
            console.log("Сессия успешно создана:", data.sessionId);
            window.location.href = "app.html";
        } else {
            console.error("Ошибка создания сессии:", data.errorMessages);
            alert("Error: " + data.errorMessages.join(", "));
        }
    } catch (error) {
        console.error("Network error while creating session:", error);
        alert("Network error. Check your connection.");
    }
}

/**
 * Функция для получения sessionId. Function for receiving sessionId
 */
function getSessionId() {
    return localStorage.getItem("sessionId");
}


function endSession() {
    localStorage.removeItem("sessionId");
    console.log("Session ended.");
}