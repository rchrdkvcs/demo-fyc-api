export default class ProductsController {
  index() {
    return {
      data: [
        { id: 1, name: 'Clavier', price: 49.9 },
        { id: 2, name: 'Souris', price: 24.9 },
        { id: 3, name: 'Écran', price: 199.9 },
      ],
    }
  }
}
