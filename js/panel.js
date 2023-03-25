function onButtonSold(index) {
    const counterElement = document.getElementById('counter' + index);
    const count = parseInt(counterElement.innerText.replace('x', ''));
    counterElement.innerText = count + 1 + 'x';

}