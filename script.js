let cart = [];

function addToCart(name, price) {
    cart.push({ name, price });
    displayCart();
}

function displayCart() {
    const cartList = document.getElementById('cart-items');
    cartList.innerHTML = '';
    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - ${item.price.toFixed(2)} €`;
        cartList.appendChild(li);
    });
}

// PayPal Button
paypal.Buttons({
    createOrder: function(data, actions) {
        return actions.order.create({
            purchase_units: [{
                amount: {
                    currency_code: 'EUR',
                    value: cart.reduce((total, item) => total + item.price, 0).toFixed(2),
                    breakdown: {
                        item_total: {
                            currency_code: 'EUR',
                            value: cart.reduce((total, item) => total + item.price, 0).toFixed(2)
                        }
                    }
                },
                items: cart.map(item => ({
                    name: item.name,
                    unit_amount: { currency_code: 'EUR', value: item.price.toFixed(2) },
                    quantity: 1
                }))
            }]
        });
    },
    onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
            alert('Paiement réussi, merci ' + details.payer.name.given_name + ' !');
            cart = [];
            displayCart();
        });
    }
}).render('#paypal-button-container');

// Formulaire de contact avec EmailJS
document.addEventListener('DOMContentLoaded', () => {
    emailjs.init("VOTRE_PUBLIC_KEY"); // Remplacez par votre clé publique EmailJS

    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        emailjs.sendForm('VOTRE_SERVICE_ID', 'VOTRE_TEMPLATE_ID', form)
            .then(() => {
                status.textContent = "✅ Message envoyé avec succès !";
                form.reset();
            }, (error) => {
                status.textContent = "❌ Une erreur est survenue. Réessayez.";
                console.error("Erreur EmailJS:", error);
            });
    });
});
