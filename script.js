document.addEventListener("alpine:init", () => {
  Alpine.data("pizzaCartWithAPIWidget", function () {
    return {
      title: "Pizza Cart",
      pizzas: [],
      username: "Mkhululi97",
      cartId: "g9Q90A1Lk4",
      cartPizzas: [],
      cartTotal: 0.0,
      getCart() {
        const getCartUrl = `https://pizza-api.projectcodex.net/api/pizza-cart/${this.cartId}/get`;
        return axios.get(getCartUrl);
      },
      addPizza(pizzaId) {
        return axios.post(
          "https://pizza-api.projectcodex.net/api/pizza-cart/add",
          {
            cart_code: this.cartId,
            pizza_id: pizzaId,
          }
        );
      },
      showCartData() {
        this.getCart().then((result) => {
          let cartData = result.data;
          this.cartPizzas = cartData.pizzas;
          this.cartTotal = cartData.total;
        });
      },
      init() {
        /* GET ALL THE PIZZAS FROM THE API */
        axios
          .get("https://pizza-api.projectcodex.net/api/pizzas")
          .then((result) => (this.pizzas = result.data.pizzas));
        /* SHOW ALL THE PIZZAS IN THE CART CURRENTLY */
        this.showCartData();
      },
      addPizzaToCart(pizzaId) {
        this.addPizza(pizzaId).then(this.showCartData());
      },
      // removePizzaFromCart()
    };
  });
});
