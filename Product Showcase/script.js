// ========================
// Variables
// ========================
let cart = {};
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const itemsPerPage = 5;

// ========================
// Local Storage
// ========================
function loadCartFromStorage() {
    const storedCart = localStorage.getItem('cart');
    cart = storedCart ? JSON.parse(storedCart) : {};
}

function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// ========================
// Load Products
// ========================
async function loadProducts() {
    try {
        const response = await fetch('script.json'); // your JSON file
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        allProducts = await response.json();
        filteredProducts = [...allProducts];
        currentPage = 1;
        applySorting();
        displayProducts(filteredProducts);
        renderCartDrawer();
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('product-list').innerHTML = '<p>Failed to load products.</p>';
    }
}

// ========================
// Display Products with Pagination
// ========================
function displayProducts(products) {
    const container = document.getElementById('product-list');
    container.innerHTML = '';

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = products.slice(start, end);

    pageItems.forEach(product => {
        const quantity = cart[product.id] || 0;
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" />
            <h2>${product.name}</h2>
            <p class="price">$${product.price.toFixed(2)}</p>
            <p>${product.description || ''}</p>
            <div class="button-group">
                <button onclick="addToCart(${product.id}, '${product.name}')">Add</button>
                <button onclick="removeOne(${product.id}, '${product.name}')">Remove 1</button>
                <button onclick="removeAll(${product.id})">Remove All</button>
            </div>
            <p id="cart-message-${product.id}" class="cart-message">
                ${quantity > 0 ? `${product.name} (x ${quantity}) in cart.` : ''}
            </p>
        `;
        container.appendChild(card);
    });

    renderPaginationButtons(products.length);
}

// ========================
// Pagination
// ========================
function renderPaginationButtons(totalItems) {
    const container = document.getElementById('pagination-buttons');
    container.innerHTML = '';

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return;

    const prevBtn = document.createElement('button');
    prevBtn.textContent = 'Previous';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => { currentPage--; displayProducts(filteredProducts); };

    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => { currentPage++; displayProducts(filteredProducts); };

    const pageDisplay = document.createElement('span');
    pageDisplay.id = 'pagination-pages';
    pageDisplay.textContent = `Page ${currentPage} of ${totalPages}`;

    container.appendChild(prevBtn);
    container.appendChild(pageDisplay);
    container.appendChild(nextBtn);
}

// ========================
// Search & Filter
// ========================
document.getElementById('search-box').addEventListener('input', e => {
    const term = e.target.value.toLowerCase();
    filteredProducts = allProducts.filter(p => p.name.toLowerCase().includes(term));
    currentPage = 1;
    applySorting();
    displayProducts(filteredProducts);
});

// ========================
// Sorting
// ========================
document.getElementById('sort-dropdown').addEventListener('change', () => {
    applySorting();
    displayProducts(filteredProducts);
});

function applySorting() {
    const value = document.getElementById('sort-dropdown').value;
    if (value === 'price-asc') filteredProducts.sort((a, b) => a.price - b.price);
    else if (value === 'price-desc') filteredProducts.sort((a, b) => b.price - a.price);
    else if (value === 'name-asc') filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
}

// ========================
// Cart Functions
// ========================
function addToCart(id, name) {
    cart[id] = (cart[id] || 0) + 1;
    saveCartToStorage();
    updateCartMessage(id, `${name} (x ${cart[id]}) in cart.`);
    displayProducts(filteredProducts);
    renderCartDrawer();
}

function removeOne(id, name) {
    if (cart[id]) {
        cart[id]--;
        if (cart[id] <= 0) delete cart[id];
        saveCartToStorage();
        updateCartMessage(id, cart[id] ? `${name} (x ${cart[id]}) in cart.` : '');
        displayProducts(filteredProducts);
        renderCartDrawer();
    }
}

function removeAll(id) {
    if (cart[id]) {
        delete cart[id];
        saveCartToStorage();
        updateCartMessage(id, '');
        displayProducts(filteredProducts);
        renderCartDrawer();
    }
}

function updateCartMessage(id, msg) {
    const message = document.getElementById(`cart-message-${id}`);
    if (message) {
        message.textContent = msg;
        message.style.color = '#6a4c93';
        message.style.fontWeight = 'bold';
    }
}

// ========================
// Cart Drawer
// ========================
function renderCartDrawer() {
    const cartList = document.getElementById('cart-items');
    cartList.innerHTML = '';

    const cartEntries = Object.entries(cart).filter(([_, qty]) => qty > 0);
    if (cartEntries.length === 0) {
        cartList.innerHTML = '<li>Your cart is empty.</li>';
        return;
    }

    let total = 0;
    cartEntries.forEach(([id, qty]) => {
        const product = allProducts.find(p => p.id == id);
        const itemTotal = product.price * qty;
        total += itemTotal;

        const li = document.createElement('li');
        li.innerHTML = `
            ${product.name} - $${itemTotal.toFixed(2)} (x ${qty})<br>
            <button onclick="removeOne(${product.id},'${product.name}')">Remove 1</button>
            <button onclick="removeAll(${product.id})">Remove All</button>
        `;
        cartList.appendChild(li);
    });

    const totalDisplay = document.createElement('li');
    totalDisplay.style.marginTop = '15px';
    totalDisplay.style.fontWeight = 'bold';
    totalDisplay.textContent = `Total: $${total.toFixed(2)}`;
    cartList.appendChild(totalDisplay);

    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'Empty Cart';
    clearBtn.className = 'empty-cart-btn';
    clearBtn.onclick = () => {
        cart = {};
        saveCartToStorage();
        displayProducts(filteredProducts);
        renderCartDrawer();
    };
    cartList.appendChild(clearBtn);
}

// ========================
// Cart Toggle Button
// ========================
const cartToggleBtn = document.getElementById('toggle-cart');
cartToggleBtn.addEventListener('click', () => {
    const drawer = document.getElementById('cart-drawer');
    drawer.classList.toggle('open');
    document.body.classList.toggle('drawer-open');
    cartToggleBtn.textContent = drawer.classList.contains('open') ? '❌ Close Cart' : '🛒 View Cart';
});

// ========================
// Initialize
// ========================
loadCartFromStorage();
loadProducts();
