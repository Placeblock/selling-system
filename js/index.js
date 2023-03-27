var DateTime = luxon.DateTime;

/** 
 * Last Update Timer
*/
const lastUpdateElement = document.getElementById("timer-value");
var lastPriceUpdate = null;
setInterval(updateUpdateTimer, 1000)
function updateUpdateTimer() {
    if (lastPriceUpdate == null) {
        lastUpdateElement.innerText = "Keine Daten"
    } else {
        const delta = 1000*60*10 - (new Date() - lastPriceUpdate)
        if (delta < 0) {
            lastUpdateElement.innerText = "In Kürze"
        } else {
            lastUpdateElement.innerText = DateTime.fromMillis(delta).toFormat("mm:ss")
        }
    }
}

/**
 * Current Price
 */
const currentPriceContainer = document.getElementById("current-price-container");

function setCurrentPrice(products) {
    for (product of products.values()) {
        const productElement = getProductElement(product);
        const sellDataLength = product.price_data.length;
        if (sellDataLength > 0) {
            var last_price = product.price_data[sellDataLength-1].price/100 + "€";
            productElement.innerHTML = "<span>"+product.name+"</span>: " + last_price;
        }
    }
}

function getProductElement(product) {
    const elementid = "current-price-" + product.name;
    var productElement = document.getElementById(elementid);
    if (productElement == null) {
        productElement = document.createElement("p");
        productElement.id = elementid;
        currentPriceContainer.appendChild(productElement);
    }
    return productElement;
}

function toggleCurrentPriceTab() {
    if (currentPriceContainer.hasAttribute('data-visible')) {
        currentPriceContainer.removeAttribute('data-visible')
    } else {
        currentPriceContainer.setAttribute('data-visible', '')
    }
}

/** 
 * Chart
*/

const url = 'https://wirtschaft.codelix.de/api?';
var lastLoad = new Date(0);
const priceChart = initGraph();
loadData();
setInterval(loadData, 20 * 1000);

function loadData() {
    var now = new Date();
    fetch(url + new URLSearchParams({
        'from': lastLoad.toISOString(),
        'to': now.toISOString()
    }))
    .then(data => data.json())
    .then(json => {
        var products = new Map();
        for (const jsonProduct of json) {
            const product = jsonProduct;
            products.set(product.id, product);
        }
        console.log(products)
        for (const product of products.values()) {
            const priceDataLength = product.price_data.length
            if (priceDataLength > 0) {
                const lastPriceData = new Date(product.price_data[0].created_at)
                if (lastPriceUpdate == null || lastPriceData > lastPriceUpdate) {
                    lastPriceUpdate = lastPriceData
                }
            }
        }
        updateUpdateTimer()

        setCurrentPrice(products);
        updateGraph(products);
    });

    lastLoad = now;
}

function initGraph() {
    const ctx = document.getElementById('price-chart');

    return new Chart(ctx, {
        type: 'line',
        data: {},
        options: {
            animation: false,
            parsing: false,
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        tooltipFormat:'HH:mm:ss',
                        displayFormats: {
                            millisecond: 'HH:mm:ss',
                            second: 'HH:mm:ss',
                            minute: 'HH:mm:ss',
                            hour: "HH:mm:ss",
                            day: "HH:mm:ss"
                        }
                    }
                },
                y: {
                    beginAtZero: true
                }
            },
            datasets: {
                line: {
                    fill: false,
                    cubicInterpolationMode: 'monotone',
                    tension: 0.4,
                    indexAxis: 'x'
                }
            },
            indexAxis: 'x'
        }
    });
}

function updateGraph(products) {
    for (const [id, product] of products) {
        if (!hasChartProduct(id)) {
            priceChart.data.datasets.push({
                id: id,
                label: product.name,
                data: mapToPoints(product.price_data)
            });
        } else {
            const dataset = priceChart.data.datasets.find(dataset => dataset.id === id);
            dataset.data.push(...mapToPoints(product.price_data));
            console.log(dataset.data[dataset.data.length - 2])
            console.log(dataset.data[dataset.data.length - 1])
        }
    }

    priceChart.update();
}

function mapToPoints(priceData) {
    return priceData.map(priceData => {
        return {
            x: new Date(priceData.created_at).getTime(),
            y: priceData.price
        }
    });
}

function hasChartProduct(id) {
    return priceChart.data.datasets.find(dataset => dataset.id === id);
}