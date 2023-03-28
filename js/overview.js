
onUpdate = products => {
    setCurrentPrice(products);
    updateGraph(products);
    updateSellsGraph(products);
}


/**
 * Graph
 */
const sellsChart = initSellsGraph();

function initSellsGraph() {
    const ctx = document.getElementById('sells-chart');

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

function updateSellsGraph(products) {
    for (const [id, product] of products) {
        if (!hasChartProduct(sellsChart, id)) {
            sellsChart.data.datasets.push({
                id: id,
                label: product.name,
                data: mapToPoints(product.sell_data, (data, i) => product.stock-i)
            });
        } else {
            const dataset = sellsChart.data.datasets.find(dataset => dataset.id === id);
            dataset.data.push(...mapToPoints(product.sell_data, (data, i) => product.stock-dataset.data.length-i));
        }
    }

    sellsChart.update();
}