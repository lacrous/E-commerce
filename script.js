// Sample product data
const products = [
    {
        id: 1,
        name: "Premium Wireless Headphones",
        price: 299.99,
        description: "High-quality wireless headphones with active noise cancellation, 30-hour battery life, and premium sound quality.",
        image: "https://placehold.co/600x400/6C63FF/FFFFFF?text=Headphones",
        rating: 4.5,
        badge: "NEW"
    },
    {
        id: 2,
        name: "Smart Fitness Watch",
        price: 199.99,
        description: "Advanced smartwatch with heart rate monitoring, GPS tracking, and 7-day battery life. Water resistant up to 50m.",
        image: "https://placehold.co/600x400/4A44C6/FFFFFF?text=Smart+Watch",
        rating: 4.7,
        badge: "SALE"
    },
    {
        id: 3,
        name: "Designer Leather Bag",
        price: 149.99,
        description: "Genuine leather handbag with elegant design, spacious interior compartments, and premium craftsmanship.",
        image: "https://placehold.co/600x400/FF6584/FFFFFF?text=Leather+Bag",
        rating: 4.3,
        badge: "HOT"
    },
    {
        id: 4,
        name: "4K Ultra HD Smart TV",
        price: 799.99,
        description: "55-inch 4K resolution smart TV with HDR, voice control, and streaming apps. Crystal clear picture quality.",
        image: "https://placehold.co/600x400/28a745/FFFFFF?text=Smart+TV",
        rating: 4.8,
        badge: "BEST"
    },
    {
        id: 5,
        name: "Professional Camera Lens",
        price: 449.99,
        description: "24-70mm f/2.8 professional lens for DSLR cameras with image stabilization and premium glass elements.",
        image: "https://placehold.co/600x400/6C63FF/FFFFFF?text=Camera+Lens",
        rating: 4.9,
        badge: "PRO"
    },
    {
        id: 6,
        name: "Luxury Perfume Set",
        price: 89.99,
        description: "Set of 3 premium fragrances for men and women in elegant packaging. Long-lasting scent with unique notes.",
        image: "https://placehold.co/600x400/FF6584/FFFFFF?text=Perfume+Set",
        rating: 4.2,
        badge: "GIFT"
    }
];

// Shopping cart array
let cart = [];

// DOM Elements
let productGrid;
let cartIcon;
let cartCount;
let backToTop;
let productModal;
let cartModal;

// Quantity selector elements
let decreaseQtyBtn;
let increaseQtyBtn;
let quantityInput;
let addToCartBtn;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    productGrid = document.getElementById('productGrid');
    cartIcon = document.getElementById('cartIcon');
    cartCount = document.querySelector('.cart-count');
    backToTop = document.getElementById('backToTop');
    productModal = document.getElementById('productModal');
    cartModal = document.getElementById('cartModal');
    
    // Get quantity selector elements
    decreaseQtyBtn = document.getElementById('decreaseQty');
    increaseQtyBtn = document.getElementById('increaseQty');
    quantityInput = document.getElementById('quantityInput');
    addToCartBtn = document.getElementById('addToCartBtn');
    
    // Load products and set up event listeners
    loadProducts();
    updateCartCount();
    setupScrollAnimations();
    setupNavbarScroll();
    setupEventListeners();
    
    // Load cart from localStorage if available
    const savedCart = localStorage.getItem('shoppingCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
});

// Setup event listeners
function setupEventListeners() {
    // Cart icon click
    cartIcon.addEventListener('click', function(e) {
        e.preventDefault();
        displayCartItems();
        const modal = new bootstrap.Modal(cartModal);
        modal.show();
    });
    
    // Back to top button
    backToTop.addEventListener('click', function() {
        window.scrollTo({top: 0, behavior: 'smooth'});
    });
    
    // Quantity selector buttons
    if (decreaseQtyBtn) {
        decreaseQtyBtn.addEventListener('click', function() {
            if (quantityInput.value > 1) quantityInput.value--;
        });
    }
    
    if (increaseQtyBtn) {
        increaseQtyBtn.addEventListener('click', function() {
            quantityInput.value++;
        });
    }
    
    // Window scroll events
    window.addEventListener('scroll', function() {
        // Navbar scroll effect
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Back to top visibility
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
}

// Setup scroll animations
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// Setup navbar scroll effect
function setupNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Load products into the grid with proper spacing
function loadProducts() {
    productGrid.innerHTML = '';
    products.forEach(product => {
        const productCard = `
            <div class="col-lg-4 col-md-6 product-grid-item">
                <div class="card product-card h-100">
                    <div class="product-badge">${product.badge}</div>
                    <div class="product-img-container">
                        <img src="${product.image}" class="product-img" alt="${product.name}">
                        <div class="product-overlay">
                            <button class="quick-view-btn" data-product-id="${product.id}">
                                Quick View
                            </button>
                        </div>
                    </div>
                    <div class="product-body">
                        <h5 class="product-title">${product.name}</h5>
                        <div class="product-rating">
                            ${generateStars(product.rating)}
                            <span class="text-muted ms-2">(${Math.floor(Math.random() * 200) + 50})</span>
                        </div>
                        <p class="product-price">$${product.price.toFixed(2)}</p>
                        <div class="product-actions">
                            <button class="btn btn-add-cart" data-product-id="${product.id}" data-product-name="${product.name}">
                                <i class="fas fa-shopping-cart me-2"></i>Add to Cart
                            </button>
                            <button class="btn btn-wishlist" aria-label="Add to wishlist">
                                <i class="far fa-heart"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        productGrid.innerHTML += productCard;
    });
    
    // Add event listeners to the dynamically created buttons
    document.querySelectorAll('.quick-view-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-product-id'));
            showProductDetails(productId);
        });
    });
    
    document.querySelectorAll('.btn-add-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-product-id'));
            const productName = this.getAttribute('data-product-name');
            addToCart(productId, 1, productName);
        });
    });
}

// Generate star ratings
function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Show product details in modal
function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        document.getElementById('modalProductImg').src = product.image;
        document.getElementById('modalProductImg').alt = product.name;
        document.getElementById('modalProductName').textContent = product.name;
        document.getElementById('modalProductPrice').textContent = `$${product.price.toFixed(2)}`;
        document.getElementById('modalProductDesc').textContent = product.description;
        
        // Update add to cart button with product info
        addToCartBtn.dataset.productId = product.id;
        addToCartBtn.dataset.productName = product.name;
        
        // Reset quantity input
        quantityInput.value = 1;
        
        const modal = new bootstrap.Modal(productModal);
        modal.show();
    }
}

// Add product to cart
function addToCart(productId, quantity, productName = '') {
    const product = products.find(p => p.id === productId);
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }
        updateCartCount();
        saveCartToLocalStorage();
        
        // Animate cart icon
        animateCartIcon();
        
        // Show notification
        const message = productName || product.name;
        showNotification(`${message} added to cart!`);
    }
}

// Animate cart icon
function animateCartIcon() {
    cartIcon.classList.add('pulse');
    setTimeout(() => {
        cartIcon.classList.remove('pulse');
    }, 500);
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'alert alert-success position-fixed';
    notification.setAttribute('role', 'alert');
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        border-radius: 10px;
        padding: 15px 25px;
        animation: slideIn 0.3s ease;
    `;
    notification.innerHTML = `
        <i class="fas fa-check-circle me-2"></i>${message}
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Update cart count display
function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Save cart to localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
}

// Display cart items
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-shopping-cart fa-3x mb-3 text-muted"></i>
                <h5>Your cart is empty</h5>
                <p class="text-muted">Add some products to your cart</p>
            </div>
        `;
        document.getElementById('subtotal').textContent = '$0.00';
        document.getElementById('total').textContent = '$0.00';
        return;
    }
    
    let cartHTML = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        cartHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h6 class="cart-item-title">${item.name}</h6>
                    <p class="cart-item-price">$${item.price.toFixed(2)} × ${item.quantity}</p>
                </div>
                <div class="cart-item-actions">
                    <strong>$${itemTotal.toFixed(2)}</strong>
                    <span class="remove-item" data-product-id="${item.id}" aria-label="Remove item">
                        <i class="fas fa-trash"></i>
                    </span>
                </div>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = cartHTML;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('total').textContent = `$${subtotal.toFixed(2)}`;
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-product-id'));
            removeFromCart(productId);
        });
    });
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    saveCartToLocalStorage();
    displayCartItems();
}

// Add CSS for notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes cartPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
    
    .cart-icon.pulse {
        animation: cartPulse 0.5s ease;
    }
`;
document.head.appendChild(style);

// Event delegation for dynamically added elements
document.addEventListener('click', function(e) {
    // Handle add to cart button in product modal
    if (e.target && e.target.id === 'addToCartBtn') {
        const productId = parseInt(e.target.dataset.productId);
        const quantity = parseInt(quantityInput.value);
        addToCart(productId, quantity);
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(productModal);
        if (modal) modal.hide();
    }
});