const {faker} = require('@faker-js/faker');

class ProdMock {

    constructor(cantidad) {
        this.cantidad = cantidad;
    }
    randomProducts() {
        const randomProducts = [];
        
        for (let i = 0; i < this.cantidad; i++) {
            const randomProduct = {
                id: faker.datatype.uuid(),
                title: faker.commerce.product(),
                price: faker.datatype.number({min: 1000, max: 10000}),
                image: faker.image.imageUrl(20,20,'Bici', true)
            }
            randomProducts.push(randomProduct);        
        }
        return randomProducts;
    }
}

module.exports = ProdMock;