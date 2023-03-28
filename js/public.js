
/**
 * Current Price
 */
const currentPriceContainer = document.getElementById("current-price-container");

function setCurrentPrice(products) {
    for (product of products.values()) {
        const productElement = getProductElement(product);
        const currentPrice = getCurrentPrice(product);
        if (currentPrice != null) {
            productElement.innerHTML = "<span>"+product.name+"</span>: " + getPriceString(currentPrice);
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


/**
 * Graph
 */
const priceChart = initGraph();

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
                    ticks: {
                        callback: function(value, index, values) {
                            return getPriceString(value);
                        }
                    },
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
            indexAxis: 'x',
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem, data) {
                            return getPriceString(tooltipItem.formattedValue);
                        }
                    }
                }
            }
        }
    });
}

function updateGraph(products) {
    for (const [id, product] of products) {
        if (!hasChartProduct(priceChart, id)) {
            priceChart.data.datasets.push({
                id: id,
                label: product.name,
                data: mapToPoints(product.price_data, (data) => data.price)
            });
        } else {
            const dataset = priceChart.data.datasets.find(dataset => dataset.id === id);
            dataset.data.push(...mapToPoints(product.price_data, (data) => data.price));
        }
    }

    priceChart.update();
}

function mapToPoints(priceDatas, dataFunction) {
    return priceDatas.map((priceData, index) => {
        return {
            x: new Date(priceData.created_at).getTime(),
            y: dataFunction(priceData, index)
        }
    });
}

function hasChartProduct(chart, id) {
    return chart.data.datasets.find(dataset => dataset.id === id);
}