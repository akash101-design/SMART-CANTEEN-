const foods = [

  // BREAKFAST
  {id:1,name:"Masala Dosa",price:45,cat:"Breakfast",emoji:"🥞",rating:4.8},
  {id:2,name:"Idli Sambar",price:35,cat:"Breakfast",emoji:"🍘",rating:4.7},
  {id:3,name:"Pongal",price:40,cat:"Breakfast",emoji:"🍚",rating:4.6},
  {id:4,name:"Poori Masala",price:50,cat:"Breakfast",emoji:"🥯",rating:4.7},
  {id:5,name:"Vada Sambar",price:30,cat:"Breakfast",emoji:"🍩",rating:4.5},

  // MEALS
  {id:6,name:"Veg Meals",price:80,cat:"Meals",emoji:"🍛",rating:4.8},
  {id:7,name:"Chicken Rice",price:100,cat:"Meals",emoji:"🍗",rating:4.9},
  {id:8,name:"Paneer Rice",price:90,cat:"Meals",emoji:"🍚",rating:4.7},
  {id:9,name:"Curd Rice",price:45,cat:"Meals",emoji:"🥣",rating:4.5},
  {id:10,name:"Sambar Rice",price:50,cat:"Meals",emoji:"🍲",rating:4.6},

  // FAST FOOD
  {id:11,name:"Classic Burger",price:90,cat:"Fast Food",emoji:"🍔",rating:4.9},
  {id:12,name:"Cheese Burger",price:110,cat:"Fast Food",emoji:"🍔",rating:4.8},
  {id:13,name:"Veg Pizza",price:120,cat:"Fast Food",emoji:"🍕",rating:4.7},
  {id:14,name:"Chicken Pizza",price:150,cat:"Fast Food",emoji:"🍕",rating:4.9},
  {id:15,name:"Veg Noodles",price:75,cat:"Fast Food",emoji:"🍜",rating:4.6},
  {id:16,name:"Chicken Noodles",price:100,cat:"Fast Food",emoji:"🍜",rating:4.8},
  {id:17,name:"Veg Sandwich",price:60,cat:"Fast Food",emoji:"🥪",rating:4.5},
  {id:18,name:"Chicken Roll",price:85,cat:"Fast Food",emoji:"🌯",rating:4.7},

  // SNACKS
  {id:19,name:"French Fries",price:55,cat:"Snacks",emoji:"🍟",rating:4.8},
  {id:20,name:"Samosa",price:20,cat:"Snacks",emoji:"🔺",rating:4.6},
  {id:21,name:"Veg Puff",price:25,cat:"Snacks",emoji:"🥐",rating:4.5},
  {id:22,name:"Chicken Puff",price:35,cat:"Snacks",emoji:"🥐",rating:4.7},
  {id:23,name:"Spring Roll",price:50,cat:"Snacks",emoji:"🥖",rating:4.6},

  // DRINKS
  {id:24,name:"Fresh Lime",price:30,cat:"Drinks",emoji:"🍋",rating:4.7},
  {id:25,name:"Mango Juice",price:45,cat:"Drinks",emoji:"🥭",rating:4.8},
  {id:26,name:"Orange Juice",price:45,cat:"Drinks",emoji:"🍊",rating:4.7},
  {id:27,name:"Cold Coffee",price:60,cat:"Drinks",emoji:"🥤",rating:4.9},
  {id:28,name:"Milkshake",price:70,cat:"Drinks",emoji:"🥛",rating:4.8},
  {id:29,name:"Tea",price:15,cat:"Drinks",emoji:"☕",rating:4.5},

  // DESSERT
  {id:30,name:"Chocolate Cake",price:60,cat:"Dessert",emoji:"🍰",rating:4.9},
  {id:31,name:"Ice Cream",price:50,cat:"Dessert",emoji:"🍦",rating:4.8},
  {id:32,name:"Gulab Jamun",price:40,cat:"Dessert",emoji:"🍮",rating:4.7},
  {id:33,name:"Brownie",price:65,cat:"Dessert",emoji:"🍫",rating:4.9}

];

let cart = JSON.parse(localStorage.getItem("smartCart")) || [];
let currentCategory = "All";

/* DISPLAY FOOD */

function displayFoods(list = foods) {

  const grid = document.getElementById("foodGrid");

  grid.innerHTML = "";

  if(list.length === 0) {
    grid.innerHTML = "<h3>No food found 😢</h3>";
    return;
  }

  list.forEach(food => {

    grid.innerHTML += `

      <div class="food-card">

        <div class="food-img">
          ${food.emoji}
        </div>

        <h3>${food.name}</h3>

        <small>⭐ ${food.rating} • ${food.cat}</small>

        <div class="food-info">

          <span class="price">₹${food.price}</span>

          <button
            class="add-btn"
            onclick="addToCart(${food.id})">
            + Add
          </button>

        </div>

      </div>

    `;
  });
}

/* ADD CART */

function addToCart(id) {

  const existing = cart.find(item => item.id === id);

  if(existing) {
    existing.qty++;
  } else {

    const food = foods.find(item => item.id === id);

    cart.push({
      ...food,
      qty: 1
    });

  }

  saveCart();
  updateCart();

}

/* CART */

function updateCart() {

  document.getElementById("cartCount").innerText =
    cart.reduce((sum,item) => sum + item.qty,0);

  const container = document.getElementById("cartItems");

  container.innerHTML = "";

  if(cart.length === 0) {

    container.innerHTML = `
      <div style="text-align:center;margin-top:100px">
        <div style="font-size:60px">🛒</div>
        <h3>Your cart is empty</h3>
        <p>Add something delicious!</p>
      </div>
    `;

  }

  cart.forEach(item => {

    container.innerHTML += `

      <div class="cart-item">

        <span class="emoji">${item.emoji}</span>

        <div style="flex:1">
          <b>${item.name}</b>
          <p>₹${item.price}</p>
        </div>

        <div class="qty">

          <button onclick="changeQty(${item.id},-1)">
            −
          </button>

          <b>${item.qty}</b>

          <button onclick="changeQty(${item.id},1)">
            +
          </button>

        </div>

      </div>

    `;

  });

  calculateBill();

}

/* QUANTITY */

function changeQty(id, change) {

  const item = cart.find(item => item.id === id);

  if(!item) return;

  item.qty += change;

  if(item.qty <= 0) {
    cart = cart.filter(item => item.id !== id);
  }

  saveCart();
  updateCart();

}

/* BILL */

function calculateBill() {

  let subtotal = cart.reduce(
    (sum,item) => sum + item.price * item.qty,
    0
  );

  // Smart discount
  let discount = subtotal >= 300
    ? Math.round(subtotal * .10)
    : 0;

  let total = subtotal - discount;

  document.getElementById("subtotal").innerText = subtotal;
  document.getElementById("discount").innerText = discount;
  document.getElementById("total").innerText = total;

}

/* CART OPEN */

function openCart() {

  document.getElementById("cart").classList.add("show");
  document.getElementById("cartOverlay").classList.add("show");

}

function closeCart() {

  document.getElementById("cart").classList.remove("show");
  document.getElementById("cartOverlay").classList.remove("show");

}

/* SEARCH */

function searchFood() {

  const text =
    document.getElementById("search").value.toLowerCase();

  let result = foods.filter(food => {

    const matchesText =
      food.name.toLowerCase().includes(text);

    const matchesCategory =
      currentCategory === "All" ||
      food.cat === currentCategory;

    return matchesText && matchesCategory;

  });

  displayFoods(result);

}

/* CATEGORY */

function filterFood(category, button) {

  currentCategory = category;

  document.querySelectorAll(".categories button")
    .forEach(btn => btn.classList.remove("active"));

  button.classList.add("active");

  searchFood();

}

/* ORDER */

function placeOrder() {

  if(cart.length === 0) {

    alert("Your cart is empty! 🍔");

    return;
  }

  const orderID =
    "SC" +
    Date.now().toString().slice(-6);

  document.getElementById("orderId").innerText =
    orderID;

  localStorage.setItem(
    "lastOrder",
    JSON.stringify({
      id: orderID,
      items: cart,
      time: new Date().toLocaleString()
    })
  );

  cart = [];

  saveCart();
  updateCart();
  closeCart();

  document.getElementById("orderModal")
    .classList.add("show");

}

function closeOrder() {

  document.getElementById("orderModal")
    .classList.remove("show");

}

/* THEME */

function toggleTheme() {

  document.body.classList.toggle("dark");

  const dark =
    document.body.classList.contains("dark");

  localStorage.setItem("darkMode", dark);

}

/* SCROLL */

function scrollToFood() {

  document.getElementById("menu")
    .scrollIntoView({
      behavior:"smooth"
    });

}

/* SAVE */

function saveCart() {

  localStorage.setItem(
    "smartCart",
    JSON.stringify(cart)
  );

}

/* SMART RECOMMENDATION */

function smartRecommendation() {

  const lastOrder =
    JSON.parse(localStorage.getItem("lastOrder"));

  const recommendation =
    document.getElementById("recommendation");

  if(!lastOrder) {

    recommendation.innerText =
      "🔥 Try our Classic Burger + Cold Coffee";

    return;

  }

  const previous =
    lastOrder.items[0];

  const suggestions = {

    "Classic Burger":
      "🍟 Add French Fries with your burger!",

    "Masala Dosa":
      "☕ Masala Dosa + Tea is a perfect combo!",

    "Chicken Rice":
      "🥤 Try Chicken Rice + Fresh Lime!",

    "Pizza":
      "🥤 Complete your meal with Cold Coffee!"

  };

  recommendation.innerText =
    suggestions[previous.name] ||
    "✨ You may love our Chocolate Cake!";

}

/* START */

if(localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
}

displayFoods();
updateCart();
smartRecommendation();
