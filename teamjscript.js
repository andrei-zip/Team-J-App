const THE_BASE_ULR = 'https://codecyprus.org/th/api/';

async function letsHunt() {
    const response = await fetch(THE_BASE_ULR + 'list');
    const json = await response.json();

    let treasureHuntArray = json.treasureHunts;

    let ListHTML = "<ul>"

    for (let i =0; i < treasureHuntArray.length; i++) {
        listHTML +=
            "<li>" +
            "<b>" + treasureHuntArray[i].name + "</b><br>" +
            treasureHuntArray[i].description + "<br>" +
            "<button onclick=''>START</button>" +
            "</li>";
    }
    listHTML += "</ul>";
    document.getElementById("treasureHunts").innerHTML = listHTML;
}
letsHunt();