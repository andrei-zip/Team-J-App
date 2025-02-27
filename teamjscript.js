async function letsHunt(){
    const response = await
        fetch('https://codecyprus.org/th/api/list');

    const reply = await response.text();

    document.getElementById("myDiv").innerHTML = reply;
}
letsHunt();

