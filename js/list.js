const THE_LIST_BASE_URL = 'https://codecyprus.org/th/api/';

async function letsHunt() {
    const response = await fetch(THE_LIST_BASE_URL + 'list');
    const json = await response.json();

    let treasureHuntArray = json.treasureHunts;

    let listHTML = "<ul>"

    for (let i =0; i < treasureHuntArray.length; i++) {
        listHTML +=
            "<li>" +
            "<b>" + treasureHuntArray[i].name + "</b><br>" +
            treasureHuntArray[i].description + "<br>" +
            "<a class='button' onclick='startFunction()'>START</a>" +
            "</li>";
    }
    listHTML += "</ul>";
    document.getElementById("treasureHunts").innerHTML = listHTML;
}
letsHunt();

