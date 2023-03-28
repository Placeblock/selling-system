var DateTime = luxon.DateTime;
var onUpdate = null


/** 
 * Data
*/

const url = 'https://wirtschaft.codelix.de/api?';
var lastLoad = new Date(0);
var lastPriceUpdate = null;
loadData();

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
        for (const product of products.values()) {
            const priceDataLength = product.price_data.length
            if (priceDataLength > 0) {
                const lastPriceData = new Date(product.price_data[priceDataLength-1].created_at)
                if (lastPriceUpdate == null || lastPriceData > lastPriceUpdate) {
                    lastPriceUpdate = lastPriceData
                }
            }
        }

        if (onUpdate != null) {
            onUpdate(products);
        }
        setTimeout(loadData, getNextUpdateMillis());
    });

    lastLoad = now;
}

function getNextUpdateMillis() {
    if (lastPriceUpdate == null) {
        return 1000*10;
    }
    return 1000*10 - (new Date() - lastPriceUpdate)
}

function getCurrentPrice(product) {
    const sellDataLength = product.price_data.length;
    if (sellDataLength > 0) {
        var last_price = product.price_data[sellDataLength-1].price;
        return last_price
    }
    return null;
}

function getPriceString(price) {
    return (Math.round((price/10))/10).toLocaleString('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        style: "currency",
        currency: "EUR"
    });
}