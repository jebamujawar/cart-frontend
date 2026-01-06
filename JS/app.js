const API_URL = "http://localhost:5000/api"; // backend URL

// -------------------- SIGNUP --------------------
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async e => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Signup successful! Login now.");
        window.location.href = "login.html";
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong!");
    }
  });
}

// -------------------- LOGIN --------------------
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async e => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("Login successful!");
        window.location.href = "index.html";
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong!");
    }
  });
}

// -------------------- FETCH PRODUCTS --------------------
async function loadProducts() {
  try {
    const res = await fetch(`${API_URL}/products`);
    const products = await res.json();
    displayProducts(products);
  } catch (err) {
    console.log(err);
  }
}

// -------------------- DISPLAY PRODUCTS --------------------
function displayProducts(products) {
  const container = document.getElementById("productList");
  if (!container) return;

  container.innerHTML = "";
  products.forEach(p => {
    container.innerHTML += `
      <div class="col-md-3">
        <div class="product-card">
          <img src="${p.image}" class="img-fluid">
          <h5>${p.name}</h5>
          <p>₹${p.price}</p>
          <button class="btn btn-info" onclick="addToCart('${p._id}','${p.name}',${p.price})">Add to Cart</button>
        </div>
      </div>
    `;
  });
}

// -------------------- SEARCH --------------------
const searchInput = document.getElementById("search");
if (searchInput) {
  searchInput.addEventListener("keyup", async function() {
    const value = this.value.toLowerCase();
    try {
      const res = await fetch(`${API_URL}/products`);
      const products = await res.json();
      const filtered = products.filter(p => p.name.toLowerCase().includes(value));
      displayProducts(filtered);
    } catch (err) {
      console.log(err);
    }
  });
}

// -------------------- CART --------------------
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(id, name, price) {
  cart.push({ id, name, price });
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart!");
}

// Load products on page load
loadProducts();
