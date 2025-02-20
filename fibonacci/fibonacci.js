function compute() {
    let v = document.getElementById("x").value; // get form's value
    let x = parseInt(v); // convert value to int
    if(x >= 1 && x <= 100) {
        let y = fibonacci(x);
        document.getElementById("numberX").innerText = x;
        document.getElementById("answerY").innerText = y;
    }
}

function fibonacci(x) {
    return 1; // todo implement recursive algorithm
}