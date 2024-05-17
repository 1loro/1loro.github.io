let cart = [];

function addToCart(productName, productPrice, productImage) {
    const product = cart.find(item => item.name === productName);
    if (product) {
        product.quantity += 1;
    } else {
        cart.push({ name: productName, price: productPrice, quantity: 1, image: productImage });
    }
    updateCartDisplay();
    showNotification("Producto agregado correctamente");
}

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cartItems');
    const checkoutButton = document.querySelector('.btn-comprar');

    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = '';
        let totalPrice = 0;

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'articulo';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="container">
                <h4>${item.name}</h4>
                <p>Precio: $${item.price}</p>
                <p>
                    Cantidad:
                    <br> 
                    <button class="btn-decrease" onclick="changeQuantity('${item.name}', -1)">-</button>
                    ${item.quantity}
                    <button class="btn-increase" onclick="changeQuantity('${item.name}', 1)">+</button>
                </p>
            `;
            cartItemsContainer.appendChild(itemElement);
            totalPrice += item.price * item.quantity;
        });

        document.getElementById('totalPrice').innerText = totalPrice.toLocaleString();

        // habilitar / deshabilitar botón
        if (cart.length === 0) {
            checkoutButton.disabled = true;
            checkoutButton.innerText = "Carrito Vacío";
            checkoutButton.style.backgroundColor = "#dddddd";
            checkoutButton.style.cursor = "not-allowed";
        } else {
            checkoutButton.disabled = false;
            checkoutButton.innerText = "Proceder al Pago";
            checkoutButton.style.backgroundColor = "black";
            checkoutButton.style.cursor = "pointer";
        }
    }
    document.getElementById('cartCount').innerText = getCartItemCount();
}

function changeQuantity(productName, change) {
    const product = cart.find(item => item.name === productName);
    if (product) {
        product.quantity += change;
        if (product.quantity <= 0) {
            if (confirm("Eliminarás el producto, ¿Deseas continuar?")) {
                removeFromCart(productName);
            } else {
                product.quantity = 1; // Restablecer cantidad a 1 si el usuario cancela
            }
        }
    }
    updateCartDisplay();
}

function removeFromCart(productName) {
    const initialCartLength = cart.length;
    cart = cart.filter(item => item.name !== productName);
    if (cart.length !== initialCartLength) {
        updateCartDisplay();
    }
}

function getCartItemCount() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

function checkout() {
    if (cart.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    // Vaciamos el carrito y actualizamos la visualización
    cart = [];
    updateCartDisplay();
    localStorage.removeItem('cart');

    // Redirigimos a la página de datos de envío
    window.location.href = 'datos_envio.html';
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.innerHTML = message + '<span class="close-btn" onclick="closeNotification()">&times;</span>';
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 2000);
}

function closeNotification() {  
    const notification = document.getElementById('notification');
    notification.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
        updateCartDisplay();
    }
});

window.addEventListener('beforeunload', () => {
    localStorage.setItem('cart', JSON.stringify(cart));
});

// validación del contacto xd
document.getElementById('contactForm').addEventListener('submit', function(event) {
    var nombre = document.getElementById('nombre').value.trim();
    var correo = document.getElementById('correo').value.trim();
    var mensaje = document.getElementById('mensaje').value.trim();
    var errorMessage = document.getElementById('errorMessage');

    if (nombre === '' || correo === '' || mensaje === '') {
        errorMessage.textContent = 'Por favor, completa todos los campos.';
        event.preventDefault();
    } else if (!isValidEmail(correo)) {
        errorMessage.textContent = 'Por favor, ingresa un correo electrónico válido.';
        event.preventDefault();
    } else {
        errorMessage.textContent = '';
    }
});

function isValidEmail(email) {
    // función validación de correo, la saqué de google
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
