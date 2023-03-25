class Product {
    id;
    name;
    start_price;
    sell_data;
    price_data;

    constructor(id, name, start_price, sell_data, price_data) {
        this.id = id;
        this.name = name;
        this.start_price = start_price;
        this.sell_data = sell_data;
        this.price_data = price_data;
    }

    static fromJson(json) {
        return Object.assign(new Product(), json);
    }
}

class SellData {
    created_at;

    constructor(created_at) {
        this.created_at = created_at;
    }
}

class PriceData {
    created_at;
    price;

    constructor(created_at, price) {
        this.created_at = created_at;
        this.price = price;
    }
}