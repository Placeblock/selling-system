

onUpdate = products => {
    updateUpdateTimer()
    setCurrentPrice(products);
    updateGraph(products);
}

/** 
 * Last Update Timer
*/
const lastUpdateElement = document.getElementById("timer-value");
setInterval(updateUpdateTimer, 1000)
function updateUpdateTimer() {
    if (lastPriceUpdate == null) {
        lastUpdateElement.innerText = "Keine Daten"
    } else {
        const delta = getNextUpdateMillis();
        if (delta < 0) {
            lastUpdateElement.innerText = "In Kürze"
        } else {
            lastUpdateElement.innerText = DateTime.fromMillis(delta).toFormat("mm:ss")
        }
    }
}


function toggleCurrentPriceTab() {
    if (currentPriceContainer.hasAttribute('data-visible')) {
        currentPriceContainer.removeAttribute('data-visible')
    } else {
        currentPriceContainer.setAttribute('data-visible', '')
    }
}
