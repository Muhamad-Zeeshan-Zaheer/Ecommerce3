document.addEventListener("DOMContentLoaded", function() {
  const cartItemsBody = document.getElementById('cart-items-body');
  const totalPriceSpan = document.getElementById('total-price');

  console.log("Cart.js is loaded"); // Debugging statement

  // Load cart items from localStorage
  loadCart();

  // Event listener for adding items to the cart
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function(event) {
      const itemId = event.target.dataset.itemId;
      const itemName = event.target.dataset.itemName;
      const itemPrice = parseFloat(event.target.dataset.itemPrice);

      console.log(`Adding item: ${itemId}, ${itemName}, ${itemPrice}`); // Debugging statement

      // Add item to localStorage (if it's not already in the cart)
      addItemToCart(itemId, itemName, itemPrice);
    });
  });

  // Event listener for increasing or decreasing the quantity of an item
  cartItemsBody.addEventListener('click', function(event) {
    if (event.target.classList.contains('increase-quantity') || event.target.classList.contains('decrease-quantity')) {
      const itemId = event.target.dataset.itemId;
      console.log(`Updating quantity for item: ${itemId}`); // Debugging statement
      updateItemQuantity(itemId, event.target.classList.contains('increase-quantity'));
    }

    if (event.target.classList.contains('remove-from-cart')) {
      const itemId = event.target.dataset.itemId;
      console.log(`Removing item: ${itemId}`); // Debugging statement
      removeItemFromCart(itemId);
    }
  });

  // Function to add an item to the cart
  function addItemToCart(itemId, itemName, itemPrice) {
    let cart = JSON.parse(localStorage.getItem('cart')) || {};
    if (cart[itemId]) {
      // Item already in the cart, increase quantity
      cart[itemId].quantity += 1;
    } else {
      // New item, add it to the cart
      cart[itemId] = { id: itemId, name: itemName, price: itemPrice, quantity: 1 };
    }

    console.log("Cart after addition:", cart); // Debugging statement

    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Re-render cart
    loadCart();
  }

  // Function to remove an item from the cart
  function removeItemFromCart(itemId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || {};
    delete cart[itemId];
    localStorage.setItem('cart', JSON.stringify(cart));

    // Re-render cart
    loadCart();
  }

  // Function to update item quantity in the cart
  function updateItemQuantity(itemId, increase = true) {
    let cart = JSON.parse(localStorage.getItem('cart')) || {};
    if (cart[itemId]) {
      if (increase) {
        cart[itemId].quantity += 1;
      } else {
        cart[itemId].quantity = Math.max(1, cart[itemId].quantity - 1);
      }

      console.log("Cart after quantity update:", cart); // Debugging statement

      // Save updated cart to localStorage
      localStorage.setItem('cart', JSON.stringify(cart));

      // Re-render cart
      loadCart();
    }
  }

  // Function to load cart items from localStorage and render them
  function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    cartItemsBody.innerHTML = ''; // Clear existing items

    console.log("Cart loaded:", cart); // Debugging statement

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

    // Update total price
    updateTotalPrice();
  }

  // Function to update the total price of the cart
  function updateTotalPrice() {
    let total = 0;
    document.querySelectorAll('.item-total').forEach(itemTotal => {
      total += parseFloat(itemTotal.textContent);
    });
    totalPriceSpan.textContent = total.toFixed(2);
  }
});
