const THE_LIST_BASE_URL = 'https://codecyprus.org/th/api/';

function letsHunt() {
    fetch(THE_LIST_BASE_URL + 'list')
        .then(response => response.json())
        .then(json => {
            let treasureHuntArray = json.treasureHunts;
            let listHTML = "<ul>";

            for (let i = 0; i < treasureHuntArray.length; i++) {
                const huntId = treasureHuntArray[i].uuid; // Receiving UUID for Hunt
                listHTML +=
                    `<li>
                        <b>${treasureHuntArray[i].name}</b><br>
                        ${treasureHuntArray[i].description}<br>
                        <a class='button' onclick='startFunction("${huntId}")'>START</a>
                    </li>`;
            }
            listHTML += "</ul>";
            document.getElementById("treasureHunts").innerHTML = listHTML;
        })
        .catch(error => console.error("Error fetching hunts:", error));
}

// Function Saving UUID choosing of Hunt and passes into app.html
function startFunction(treasureHuntId) {
    console.log("Saving selected Treasure Hunt ID:", treasureHuntId);
    sessionStorage.setItem('selectedTreasureHuntId', treasureHuntId);
    window.location.href = 'app.html';
}
