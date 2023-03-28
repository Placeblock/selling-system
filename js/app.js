var DateTime = luxon.DateTime;
var onUpdate = null


/** 
 * Data
*/

const url = 'https://wirtschaft.codelix.de/api?';
var lastLoad = new Date(0);
var lastPriceUpdate = null;
const gproducts = new Map();
loadData();

function loadData() {
    var now = new Date();
    fetch(url + new URLSearchParams({
        'from': lastLoad.toISOString(),
        'to': now.toISOString()
    }))
    .then(data => data.json())
    .then(json => {
        if (onUpdate != null) {
            var products = new Map();
            for (const jsonProduct of json) {
                const product = jsonProduct;
                products.set(product.id, product);
            }
            for (const [id, product] of products) {
                const priceDataLength = product.price_data.length
                if (priceDataLength > 0) {
                    const lastPriceData = new Date(product.price_data[priceDataLength-1].created_at)
                    if (lastPriceUpdate == null || lastPriceData > lastPriceUpdate) {
                        lastPriceUpdate = lastPriceData
                    }
                }
                if (gproducts.has(id)) {
                    gproducts.get(id).sell_data.push(...product.sell_data);
                    gproducts.get(id).price_data.push(...product.price_data);
                } else {
                    gproducts.set(id, product);
                }
            }

            onUpdate(products);
        }
        setTimeout(loadData, getNextUpdateMillis());
    });

    lastLoad = now;
}

function isOutsold(product) {
    return (gproducts.get(product.id).sell_data.length) >= product.stock
}

function getNextUpdateMillis() {
    if (lastPriceUpdate == null) {
        return 1000*10;
    }
    if (new Date() - lastPriceUpdate > 1000*10) {
        return 1000*10
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