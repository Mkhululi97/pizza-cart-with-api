document.addEventListener("alpine:init", () => {
  Alpine.data("pizzaCartWithAPIWidget", function () {
    return {
      title: "Pizza Cart",
      pizzas: [],
      init() {
        axios
          .get("https://pizza-api.projectcodex.net/api/pizzas")
          .then((result) => (this.pizzas = result.data.pizzas));
      },
    };
  });
});
