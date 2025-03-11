const THE_LIST_BASE_URL = 'https://codecyprus.org/th/api/';

// Функция для запуска охоты и создания сессии
async function startSession(treasureHuntId) {

    const playerName = document.getElementById("playerName").value.trim();
    const appId = "Team-J-App"; // ID application

    // Формируем URL для запроса сессии
    const startUrl = `${API_URL}start?player=${encodeURIComponent(playerName)}&app=${encodeURIComponent(appId)}&treasure-hunt-id=${encodeURIComponent(treasureHuntId)}`;

    try {
        console.log("Запрос на создание сессии:", startUrl);
        const response = await fetch(startUrl);
        const data = await response.json();

        if (data.status === "OK") {
            localStorage.setItem("sessionId", data.session);
            console.log("Сессия успешно создана:", data.session);
            window.location.href = "app.html";
        } else {
            console.error("Ошибка создания сессии:", data.errorMessages);
            alert("Ошибка при запуске охоты: " + data.errorMessages.join(", "));
        }
    } catch (error) {
        console.error("Ошибка сети при создании сессии:", error);
        alert("Ошибка сети. Проверьте соединение.");
    }
}

// Функция для получения идентификатора сессии
function getSessionId() {
    return localStorage.getItem("sessionId");
}

// Функция для завершения охоты (если потребуется)
function endSession() {
    localStorage.removeItem("sessionId");
    console.log("Сессия завершена.");
}