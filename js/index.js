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
            }
        }
    });
}

function updateGraph(products) {
    for (const [id, product] of products) {
        if (!hasChartProduct(id)) {
            priceChart.data.datasets.push({
                id: id,
                label: product.name,
                data: mapToPoints(product.price_data),
                fill: false,
                cubicInterpolationMode: 'monotone',
                tension: 0.4
            });
        } else {
            const dataset = priceChart.data.datasets.find(dataset => dataset.id === id);
            dataset.data.push(...mapToPoints(product.price_data));
        }
    }

    priceChart.update();
}

function mapToPoints(priceData) {
    return priceData.map(priceData => {
        return {
            x: new Date(priceData.created_at),
            y: priceData.price
        }
    });
}

function hasChartProduct(id) {
    return priceChart.data.datasets.find(dataset => dataset.id === id);
}