const productsContainer = document.getElementById('product-container');

const currentPrices = new Map();
var password = "";

onUpdate = newproducts => {
    for (let [id, product] of newproducts) {
        const elementid = "product-" + id;
        productElement = document.getElementById(elementid);
        if (productElement == null) {
            productElement = document.createElement("li");
            productElement.classList.add("product");
            productElement.id = elementid;
            productsContainer.appendChild(productElement);
        }
        var currentPrice = getCurrentPrice(product);
        if (currentPrice != null) {
            currentPrices.set(id, currentPrice);
        }
        currentPrice = currentPrices.get(id);
        var priceString;
        if (currentPrice != null) {
            priceString = getPriceString(currentPrice);
        } else {
            priceString = getPriceString(product.start_price);
        }           
        const outsold = isOutsold(product);
        if (outsold) {
            productElement.innerHTML = "<span>"+product.name+" (AUSVERKAUFT)</span>";
        } else {
            productElement.innerHTML = "<span>"+product.name+" ("+priceString+")</span><button onclick='sellProduct("+id+")'>Verkaufen</button>";
        }


    }
}

function sellProduct(id) {
    fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "id": id, "password": password })
    })
       .then(response => response.json())
       .then(response => console.log(JSON.stringify(response)))
}

function submitPassword() {
    password = document.getElementById("pass-input").value;
    document.getElementById("auth").style.display = "none";
}