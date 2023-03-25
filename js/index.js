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
                const product = Product.fromJson(jsonProduct);
                products.set(product.id, product);
            }

            updateGraph(products);
        });

    lastLoad = now;
}

function initGraph() {
    const ctx = document.getElementById('myChart');

    return new Chart(ctx, {
        type: 'line',
        data: {},
        options: {
            scales: {
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
                borderColor: 'red',
                tension: 0.1
            });
        } else {
            const dataset = priceChart.data.datasets.find(dataset => dataset.id === id);
            dataset.data.push(mapToPoints(product.price_data));
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