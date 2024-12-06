function ExampleApp (id) {
var content =    
'<div id="' + id + '">' +
'    <header class="top-bar spread">' +
'    <nav class="top-bar-nav">' +
'      <a href="#" class="top-bar-link">' +
'        <i class="icofont-spoon-and-fork"></i>' +
'        <span>Home</span>' +
'      </a>' +
'      <a href="views/products.html" class="top-bar-link">' +
'        <span>Products</span>' +
'      </a>' +
'      <a href="views/past-orders.html" class="top-bar-link">' +
'        <span>Past Orders</span>' +
'      </a>' +
'    </nav>' +
'    <a @click="toggleSidebar" class="top-bar-cart-link">' +
'      <i class="icofont-cart-alt icofont-1x"></i>' +
'      <span>Cart ({{totalQuantity}})</span>' +
'    </a>' +
'  </header>' +

'  <div class="splash-container">' +
'    <topbar></topbar>' +

'    <div class="splash">' +
'      <h1>Splendid Food</h1>' +
'    </div>' +
'  </div>' + 

'  <main class="wrapper">' +

'    <div class="card-container">' +
'      <div v-for="(product, i) in inventory" :key= "product.id" class="card">' +
'        <div class="card-title">' +
'          {{product.name}}' +
'        </div>' +
'        <div class="card-body">' +
'          <i class="icofont-10x icofont-{{product.icon}}"></i>' +
'          <form>' +
'            <div class="row">' +
'              <div class="cell">' +
'                <label>Type:</label>' +
'              </div>' +
'              <div class="cell">' +
'                <em>{{product.type}}</em>' +
'              </div>' +
'            </div>' +
'            <div class="row">' +
'              <div class="cell">' +
'                <label>Price:</label>' +
'              </div>' +
'              <div class="cell">' +
'                {{product.price.USD}}' +
'              </div>' +
'            </div>' +
'            <div class="row">' +
'              <div class="cell">' +
'                <label>Quantity:</label>' +
'              </div>' +
'              <div class="cell">' +
'                <input type="number" v-model.number="product.quantity">' +
'              </div>' +
'            </div>' +
'          </form>' +
'        </div>' +
'        <div class="card-footer">' +
'          <button @click="addToCart(product.name, i)" class="btn btn-light">' +
'            Add to cart' +
'          </button>' +
'        </div>' +
'      </div>' +
'    </div>' +
'  </main>' +
'  <sidebar v-if="showSidebar" :toggle="toggleSidebar" :cart="cart" :inventory="inventory"/>' +
'  <footer>' +
'  </footer>' +
'</div>';
return content;
}


function HTMLComponent () {
    var content = 
    `<aside class="cart-container">
    <div class="cart">
      <h1 class="cart-title spread">
        <span>
          Cart
          <i class="icofont-cart-alt icofont-1x"></i>
        </span>
        <button @click="toggle" class="cart-close">&times;</button>
      </h1>

      <div class="cart-body">
        <table class="cart-table">
          <thead>
            <tr>
              <th><span class="sr-only">Product Image</span></th>
              <th>Product</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total</th>
              <th><span class="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(value, key, i) in cart" :key="i">
              <td><i class="icofont-carrot icofont-3x"></i></td>
              <td>{{key}}</td>
              <td>\${{getPrice(key)}}</td>
              <td class="center">{{value}}</td>
              <td>\${{(getPrice(key)* value).toFixed(2)}}</td>
              <td class="center">
                <button @click="removeItem(key)" class="btn btn-light cart-remove">
                  &times;
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <p v-if="Object.keys(cart).length == 0" class="center"><em>No items in cart</em></p>
        <div class="spread">
          <span><strong>Total:</strong>\${{calculateTotal()}}</span>
          <button class="btn btn-light">Checkout</button>
        </div>
      </div>
    </div>
  </aside>`;
  return content;
}

