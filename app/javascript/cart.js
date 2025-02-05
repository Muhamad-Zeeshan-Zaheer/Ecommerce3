document.addEventListener("DOMContentLoaded", function() {
  const cartItemsBody = document.getElementById('cart-items-body');
  const totalPriceSpan = document.getElementById('total-price');
  const placeOrderButton = document.getElementById('place-order-button');

  loadCart();

  // Listen for clicks on 'Add to Cart' buttons directly
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function(event) {
      event.preventDefault(); // Prevent link from causing page reload
      const itemId = event.target.dataset.itemId;
      const itemName = event.target.dataset.itemName;
      const itemPrice = parseFloat(event.target.dataset.itemPrice);
      addItemToCart(itemId, itemName, itemPrice);
    });
  });

  // Add Item to Cart
  function addItemToCart(itemId, itemName, itemPrice) {
    let cart = JSON.parse(localStorage.getItem('cart')) || {};
    if (cart[itemId]) {
      cart[itemId].quantity += 1;
    } else {
      cart[itemId] = { id: itemId, name: itemName, price: itemPrice, quantity: 1 };
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
  }

  // Load Cart and Update Cart View
  function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    cartItemsBody.innerHTML = '';

    Object.values(cart).forEach(item => {
      const cartItemRow = document.createElement('tr');
      cartItemRow.id = `cart-item-${item.id}`;

      cartItemRow.innerHTML = `
        <td>No image</td>
        <td>${item.name}</td>
        <td class="item-price">${item.price}</td>
        <td>
          <button class="btn btn-secondary decrease-quantity" data-item-id="${item.id}">-</button>
          <span class="item-quantity">${item.quantity}</span>
          <button class="btn btn-secondary increase-quantity" data-item-id="${item.id}">+</button>
        </td>
        <td class="item-total">${(item.price * item.quantity).toFixed(2)}</td>
        <td>
          <button class="btn btn-danger remove-from-cart" data-item-id="${item.id}">Remove</button>
        </td>
      `;
      cartItemsBody.appendChild(cartItemRow);
    });

    // Attach event listeners for quantity buttons
    document.querySelectorAll('.increase-quantity').forEach(button => {
      button.addEventListener('click', function(event) {
        const itemId = event.target.dataset.itemId;
        updateItemQuantity(itemId, 1);
      });
    });

    document.querySelectorAll('.decrease-quantity').forEach(button => {
      button.addEventListener('click', function(event) {
        const itemId = event.target.dataset.itemId;
        updateItemQuantity(itemId, -1);
      });
    });

    // Attach event listeners for remove buttons
    document.querySelectorAll('.remove-from-cart').forEach(button => {
      button.addEventListener('click', function(event) {
        const itemId = event.target.dataset.itemId;
        removeItemFromCart(itemId);
      });
    });

    updateTotalPrice();
  }

  // Update Item Quantity
  function updateItemQuantity(itemId, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || {};
    if (cart[itemId]) {
      cart[itemId].quantity += change;
      if (cart[itemId].quantity <= 0) {
        delete cart[itemId]; // Remove item if quantity is 0 or less
      }
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
  }

  // Remove Item from Cart
  function removeItemFromCart(itemId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || {};
    delete cart[itemId];
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
  }

  // Update Total Price
  function updateTotalPrice() {
    let total = 0;
    document.querySelectorAll('.item-total').forEach(itemTotal => {
      total += parseFloat(itemTotal.textContent);
    });
    totalPriceSpan.textContent = total.toFixed(2);
  }

  // Place Order Now
  placeOrderButton.addEventListener('click', function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    if (Object.keys(cart).length === 0) {
      alert('Your cart is empty. Please add some items before placing an order.');
    } else {
      alert('Your order has been placed successfully!');
      localStorage.removeItem('cart'); // Clear the cart after placing the order
      loadCart(); // Reload the cart view to show an empty cart
    }
  });
});
