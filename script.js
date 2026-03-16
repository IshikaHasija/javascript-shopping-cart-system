const productBox = document.getElementById('product-container');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartItemsContainer = document.getElementById('cart-items');
const totalAmountElement = document.getElementById('total-amount');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

const products= [
    {
        id: 1,
        name: 'Apple Watch Series 9',    
        price: '41,900',
        image: 'images/img1'
    },
    {
        id: 2,
        name: 'Samsung Galaxy Watch 6',    
        price: '29,900',
        image: 'images/img2'
    },
    {
        id: 3,
        name: 'Noise ColorFit Pro 4',    
        price: '4,999',
        image: 'images/img3'
    },
    {
        id: 4,
        name: 'Fire‑Boltt Ninja Call Pro',    
        price: '2,499',
        image: 'images/img4'
    },
    {
        id: 5,
        name: 'boAt Wave Call Smartwatch',    
        price: '1,999',
        image: 'images/img5'
    },
    {
        id: 6,
        name: 'Amazfit GTS 4',    
        price: '7,999',
        image: 'images/img6'
    },
    {
        id: 7,
        name: 'Fitbit Versa 4',    
        price: '19,999',
        image: 'images/img7'
    },
    {
        id: 8,
        name: 'Realme Watch 3 Pro',    
        price: '₹5,999',
        image: 'images/img8'
    }
];

function displayProducts() {
    products.forEach(product => {
    let card= `
        <div class="product-box">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <div class="product-details-product-page">
                <p class="product-price">₹${product.price}</p>
                <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
            </div>
            </div>
        </div>
    `
    ;
    productBox.innerHTML += card;
    });
    
    const addBtns = document.querySelectorAll('.add-to-cart-btn');
    addBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            let id = parseInt(e.target.getAttribute('data-id'));
            AddtoCart(id, e.target);
        });
    });
}

if (productBox) {
    displayProducts();
}

function AddtoCart(id, btnElement) {
    const product = products.find(p => p.id === id);
    
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    btnElement.textContent = '️ Added ✅';
    btnElement.classList.add('added-to-cart');
    btnElement.disabled = true;
    
    setTimeout(() => {
        btnElement.textContent = 'Add to Cart';
        btnElement.classList.remove('added-to-cart');
        btnElement.disabled = false;
    }, 2000);
}

function displayCartItems() {
    if (!cartItemsContainer) return; 
    
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; padding: 20px;">Your cart is empty.</p>';
        calculateTotal();
        return;
    }

    cart.forEach(item => {
        let cleanPrice = item.price.replace(/[^\d.,]/g, '');
        
        let cartItemHTML = `
            <div class="product">
                <img src="${item.image}" alt="${item.name}">
                <div class="product-details">
                    <h3>${item.name}</h3>
                    <p>₹${cleanPrice}</p>
                    <div class="buttons">
                        <div class="quantity-selector">
                            <button class="minus-item" data-id="${item.id}">-</button>
                            <span class="item-quantity">${item.quantity}</span>
                            <button class="plus-item" data-id="${item.id}">+</button>
                        </div>
                        <button class="remove-item" data-id="${item.id}" title="Remove item"></button>
                    </div>
                </div>
            </div>
        `;
        cartItemsContainer.innerHTML += cartItemHTML;
    });
    
    attachCartEvents();
    
    calculateTotal();
}

function attachCartEvents() {
    document.querySelectorAll('.plus-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            let id = parseInt(e.target.getAttribute('data-id'));
            updateQuantity(id, 1);
        });
    });

    document.querySelectorAll('.minus-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            let id = parseInt(e.target.getAttribute('data-id'));
            updateQuantity(id, -1);
        });
    });

    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            let id = parseInt(e.target.getAttribute('data-id'));
            removeFromCart(id);
        });
    });
}

function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
            return;
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
}

function calculateTotal() {
    if (!totalAmountElement) return;
    
    let total = 0;
    cart.forEach(item => {
        let numericPrice = parseFloat(item.price.replace(/[^\d.]/g, ''));
        total += numericPrice * item.quantity;
    });
    
    totalAmountElement.textContent = '₹' + total.toLocaleString('en-IN');
}

if (cartItemsContainer) {
    displayCartItems();
}