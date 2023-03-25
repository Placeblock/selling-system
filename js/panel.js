function onButtonBuy(index) {
    var counterElement = document.getElementById('counter' + index);
    var count = parseInt(counterElement.innerText);
    counterElement.innerText = count + 1;
}