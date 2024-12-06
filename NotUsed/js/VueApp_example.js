
var data = [
    { "id": 1,  "name": "Raddishes",   "icon": "raddish",    "price": { "USD": 3.26, "NOK": 17.43 }, "type": "vegetable" },
    { "id": 2,  "name": "Artichokes",  "icon": "artichoke",  "price": { "USD": 9.44, "NOK": 15.82 }, "type": "vegetable" },
    { "id": 3,  "name": "Broccoli",    "icon": "broccoli",   "price": { "USD": 5.20, "NOK": 16.66 }, "type": "vegetable" },
    { "id": 5,  "name": "Cabbages",    "icon": "cabbage",    "price": { "USD": 0.95, "NOK": 62.33 }, "type": "vegetable" },
    { "id": 6,  "name": "Cherries",    "icon": "cherry",     "price": { "USD": 1.04, "NOK": 62.50 }, "type": "fruit"     },
    { "id": 7,  "name": "Carrots",     "icon": "carrot",     "price": { "USD": 4.82, "NOK": 72.74 }, "type": "vegetable" },
    { "id": 8,  "name": "Corn",        "icon": "corn",       "price": { "USD": 7.53, "NOK": 99.43 }, "type": "vegetable" },
    { "id": 9,  "name": "Grapes",      "icon": "grapes",     "price": { "USD": 4.94, "NOK": 88.29 }, "type": "fruit"     },
    { "id": 10, "name": "Onions",      "icon": "onion",      "price": { "USD": 6.45, "NOK": 69.53 }, "type": "vegetable" },
    { "id": 11, "name": "Oranges",     "icon": "orange",     "price": { "USD": 9.95, "NOK": 96.53 }, "type": "fruit"     },
    { "id": 12, "name": "Peas",        "icon": "peas",       "price": { "USD": 2.61, "NOK": 65.74 }, "type": "vegetable" },
    { "id": 13, "name": "Pineapples",  "icon": "pineapple",  "price": { "USD": 1.62, "NOK": 35.22 }, "type": "fruit"     },
    { "id": 14, "name": "Steaks",      "icon": "steak",      "price": { "USD": 8.32, "NOK": 83.08 }, "type": "meat"      },
    { "id": 15, "name": "Watermelons", "icon": "watermelon", "price": { "USD": 5.08, "NOK": 89.69 }, "type": "fruit"     },
    { "id": 16, "name": "Sausages",    "icon": "sausage",    "price": { "USD": 3.69, "NOK": 26.68 }, "type": "meat"      }
  ]

  function VueApp_example (id) {
    let app = Vue.createApp({
        data: function() {
            return {
                showSidebar :false,
                inventory: [],
                cart: {
                }                
            }
        },
        computed: {
            totalQuantity() {
                return Object.values(this.cart).reduce((acc, curr) => {
                    return acc + curr
                }, 0)
            }
        },        
        methods: {
            addToCart: function(name, index) {
                if (!this.cart[name]){
                    this.cart[name] = 0;
                }
                this.cart[name] += this.inventory[index].quantity;
                this.inventory[index].quantity = 0;
                console.log (this.cart);
            },
            toggleSidebar () {
                this.showSidebar = !this.showSidebar;
            }
        },

        mounted() {
          this.inventory = data;
        },
        created() {
            console.log('created')

        },
        unmounted() {
            console.log('unmounted')
        },        
        updated() {
            console.log('updated')
        }
    })
    app.component ('sidebar', {
        props: ['toggle', 'cart', 'inventory'],
        computed : {
            cartTotal() {
                var total =  (this.cart.carrots * 4.82).toFixed(2);
                return total;
            }
        },
        template : HTMLComponent(),
        methods: {
            getPrice(name) {
                const product = this.inventory.find((product) => {
                    return product.name == name
                })
                return product.price.USD;
            },
            calculateTotal() {
                var total =  Object.entries(this.cart).reduce((acc, curr, index) => {
                    return acc + (curr[1] * this.getPrice(curr[0]))        
                }, 0)
                return total.toFixed(2);
            },
            removeItem (name) {
                delete this.cart[name];
            }
        }
    })
    app.component ('topbar', {
        props: [],
        computed : {

        },
//        template : BarPanel(),
        methods: {

        }
    })    
    app.mount('#' + id);

    return app;
}

