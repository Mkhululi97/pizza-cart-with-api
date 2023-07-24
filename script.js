document.addEventListener("alpine:init", () => {
  Alpine.data("pizzaCartWithAPIWidget", function () {
    return {
      logged_in: false,
      title: "Pizza Cart",
      msg: "",
      pizzas: [],
      username: "",
      cartId: "",
      cartPizzas: [],
      cartTotal: 0.0,
      paymentAmount: "",
      username_map: {},
      names: [],
      createCart() {
        return axios.get(
          `https://pizza-api.projectcodex.net/api/pizza-cart/create?username=${this.username}`
        );
      },
      login() {
        // CREATE CART IF USER NAME LENGTH GREATER THAN 2
        if (this.username.length > 2) {
          this.logged_in = true;
          // ONLY PUSH USERNAMES THAT AREN'T ON THE ARRAY ALREADY.
          Object.values(this.names).includes(this.username)
            ? ""
            : this.names.push(this.username);
          this.createCart().then((result) => {
            // GENERATE CART CODE FOR EACH USER.
            !this.username_map[this.username] //outputs username:username_cartId
              ? (this.username_map[this.username] = result.data.cart_code)
              : this.username_map[this.username];
            Object.values(this.names).forEach(() => {
              // SET CART ID, TO CURRENT USERS CART CODE.
              this.cartId = this.username_map[this.username];
              // SHOW CART OF THE LOGGED IN USER.
              this.showCartData();
            });
          });
        }
      },
      logout() {
        if (confirm("logout?")) {
          this.logged_in = false;
          // ONCE USER HAVE PAID OUT THE CART USER TO RETURN TO INITIAL CONDITIONS, NOT WHEN USER LOGSOUT ADD FUNCTIONALITY TO PAY BUTTON
          // this.username = "";
          // this.cartId = "";
          // localStorage["cartId"] = "";
          // localStorage["username"] = "";
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
              // localStorage["cartId"] = "";

              let namesArr = Object.values(this.names);
              namesArr.forEach((name) => {
                if (name === this.username) {
                  this.msg = "";
                  this.cartPizzas = [];
                  this.cartTotal = 0.0;
                  namesArr.splice(namesArr.indexOf(this.username), 1);
                  this.names = namesArr;
                  this.username = "";
                  this.cartId = "";
                  this.createCart();
                }
              });
            }, 3000);
          }
        });
      },
    };
  });
});
