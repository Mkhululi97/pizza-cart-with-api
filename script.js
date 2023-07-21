document.addEventListener("alpine:init", () => {
  Alpine.data("pizzaCartWithAPIWidget", function () {
    return {
      title: "Pizza Cart",
      msg: "",
      pizzas: [],
      username: "",
      cartId: "",
      cartPizzas: [],
      cartTotal: 0.0,
      paymentAmount: "",
      login() {
        if (this.username.length > 2) {
          localStorage["username"] = this.username;
          this.createCart();
        } else {
          alert("username shot");
        }
      },
      logout() {
        if (confirm("logout?")) {
          this.username = "";
          this.cartId = "";
          localStorage["cartId"] = "";
          localStorage["username"] = "";
        }
      },
      createCart() {
        if (!this.username) {
          this.cartId = "No username to create cart for";
          return;
        }
        const cartId = localStorage["cartId"];
        // create a new cart id, if local storage doesn't have one.
        if (cartId) {
          this.cartId = cartId;
        } else {
          return axios
            .get(
              `https://pizza-api.projectcodex.net/api/pizza-cart/create?username=${this.username}`
            )
            .then((result) => {
              this.cartId = result.data.cart_code;
              localStorage["cartId"] = this.cartId;
            });
        }
      },
      getCart() {
        const getCartUrl = `https://pizza-api.projectcodex.net/api/pizza-cart/${this.cartId}/get`;
        return axios.get(getCartUrl);
      },
      addPizza(pizzaId) {
        return axios.post(
          "https://pizza-api.projectcodex.net/api/pizza-cart/add",
          { cart_code: this.cartId, pizza_id: pizzaId }
        );
      },
      removePizza(pizzaId) {
        return axios.post(
          "https://pizza-api.projectcodex.net/api/pizza-cart/remove",
          { cart_code: this.cartId, pizza_id: pizzaId }
        );
      },
      pay(amount) {
        return axios.post(
          "https://pizza-api.projectcodex.net/api/pizza-cart/pay",
          {
            cart_code: this.cartId,
            amount,
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
        const storedUsername = localStorage["username"];
        if (storedUsername) this.username = storedUsername;
        /* GET ALL THE PIZZAS FROM THE API */
        axios
          .get("https://pizza-api.projectcodex.net/api/pizzas")
          .then((result) => (this.pizzas = result.data.pizzas));
        /* SHOW ALL THE PIZZAS IN THE CART CURRENTLY */
        if (!this.cartId) {
          this.createCart().then((result) => {
            this.showCartData();
          });
        }
      },
      addPizzaToCart(pizzaId) {
        this.addPizza(pizzaId).then(() => this.showCartData());
      },
      removePizzaFromCart(pizzaId) {
        this.removePizza(pizzaId).then(() => this.showCartData());
      },
      payForCart() {
        this.pay(this.paymentAmount).then((result) => {
          if (result.data.status === "failure") {
            this.msg = result.data.message;
            setTimeout(() => (this.msg = ""), 3000);
          } else {
            // reset values to starting conditions
            this.msg = result.data.message;
            this.paymentAmount = "";
            setTimeout(() => {
              this.msg = "";
              this.cartPizzas = [];
              this.cartTotal = 0.0;
              this.cartId = "";
              localStorage["cartId"] = "";
              this.createCart();
            }, 3000);
          }
        });
      },
    };
  });
});
