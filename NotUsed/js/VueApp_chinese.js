


function VueApp_chinese (id) {
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
          this.inventory = hsk3;
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
        template : HTMLComponent1(),
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
