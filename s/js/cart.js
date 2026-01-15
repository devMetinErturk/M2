// Sepet sistemi
const Cart = {
    items: [],
    phoneNumber: '905050000000', // İşletme telefon numarası
    categoryOrder: ['Makarnalar', 'Burgerler', 'Izgaralar','Ekmek Arası Ürünler', 'Yan Ürünler', 'İçecekler'],

    init() {
        this.loadFromStorage();
        this.createCartPanel();
        this.setupProductButtons();
        this.updateCartUI();
        this.updateProductButtons();
    },

    loadFromStorage() {
        const saved = localStorage.getItem('melinas_cart');
        if (saved) {
            this.items = JSON.parse(saved);
        }
    },

    saveToStorage() {
        localStorage.setItem('melinas_cart', JSON.stringify(this.items));
    },

    createCartPanel() {
        // Sepet paneli HTML
        const cartPanel = document.createElement('div');
        cartPanel.id = 'cart-panel';
        cartPanel.innerHTML = `
            <div class="cart-header">
                <h2>Sepetim</h2>
                <button class="cart-close">&times;</button>
            </div>
            <div class="cart-items">
                <p class="cart-empty">Sepetiniz bos</p>
            </div>
            <div class="cart-footer">
                <div class="cart-total">
                    <span>Toplam:</span>
                    <strong>0 TL</strong>
                </div>
                <div class="cart-actions">
                    <button class="btn-whatsapp">
                        <img src="s/img/whatsapp.png" alt="WhatsApp" width="20" height="20">
                        WhatsApp ile Gonder
                    </button>
                    <button class="btn-telegram">
                        <img src="s/img/telegram.png" alt="Telegram" width="20" height="20">
                        Telegram ile Gonder
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(cartPanel);

        // Sepet butonu (floating)
        const cartButton = document.createElement('button');
        cartButton.id = 'cart-button';
        cartButton.innerHTML = `
            <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
            <span class="cart-count">0</span>
        `;
        document.body.appendChild(cartButton);

        // Event listeners
        cartButton.addEventListener('click', () => this.togglePanel());
        cartPanel.querySelector('.cart-close').addEventListener('click', () => this.closePanel());
        cartPanel.querySelector('.btn-whatsapp').addEventListener('click', () => this.sendWhatsApp());
        cartPanel.querySelector('.btn-telegram').addEventListener('click', () => this.sendTelegram());
    },

    setupProductButtons() {
        // Her ürün için buton wrapper oluştur
        document.querySelectorAll('main > details > ul > li').forEach(li => {
            const button = li.querySelector('button');
            if (!button) return;

            const name = li.querySelector('a > p').textContent.trim();
            const priceText = li.querySelector('b').textContent.trim();
            const price = parseInt(priceText.replace(/[^0-9]/g, ''));
            const imgEl = li.querySelector('a > img');
            const image = imgEl ? imgEl.src : '';
            const detailsEl = li.closest('details');
            const category = detailsEl ? detailsEl.querySelector('summary').textContent.trim() : 'Diger';

            // Wrapper div oluştur
            const wrapper = document.createElement('div');
            wrapper.className = 'product-btn-wrapper';
            wrapper.dataset.productName = name;
            wrapper.dataset.productPrice = price;
            wrapper.dataset.productImage = image;

            // Sepete ekle butonu
            const addBtn = document.createElement('button');
            addBtn.className = 'add-to-cart-btn';
            addBtn.textContent = 'Sepete Ekle';

            // Miktar kontrolleri
            const qtyControls = document.createElement('div');
            qtyControls.className = 'product-qty-controls';
            qtyControls.innerHTML = `
                <button class="product-qty-btn minus">-</button>
                <span class="product-qty">0</span>
                <button class="product-qty-btn plus">+</button>
            `;

            wrapper.appendChild(addBtn);
            wrapper.appendChild(qtyControls);

            // Eski butonu wrapper ile değiştir
            button.replaceWith(wrapper);

            // Event listeners
            addBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.addItem(name, price, image, category);
            });

            qtyControls.querySelector('.minus').addEventListener('click', (e) => {
                e.preventDefault();
                this.updateQuantity(name, -1);
            });

            qtyControls.querySelector('.plus').addEventListener('click', (e) => {
                e.preventDefault();
                this.updateQuantity(name, 1);
            });
        });
    },

    updateProductButtons() {
        // Tüm ürün butonlarını güncelle
        document.querySelectorAll('.product-btn-wrapper').forEach(wrapper => {
            const name = wrapper.dataset.productName;
            const addBtn = wrapper.querySelector('.add-to-cart-btn');
            const qtyControls = wrapper.querySelector('.product-qty-controls');
            const qtySpan = wrapper.querySelector('.product-qty');

            const item = this.items.find(item => item.name === name);

            if (item && item.quantity > 0) {
                // Sepette var - kontrolleri göster
                addBtn.style.display = 'none';
                qtyControls.style.display = 'flex';
                qtySpan.textContent = item.quantity;
            } else {
                // Sepette yok - butonu göster
                addBtn.style.display = 'block';
                qtyControls.style.display = 'none';
            }
        });
    },

    addItem(name, price, image, category = '') {
        const existingItem = this.items.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.items.push({
                name: name,
                price: price,
                image: image || '',
                category: category || 'Diger',
                quantity: 1
            });
        }

        this.saveToStorage();
        this.updateCartUI();
        this.updateProductButtons();
        this.showAddedFeedback();
    },

    removeItem(name) {
        this.items = this.items.filter(item => item.name !== name);
        this.saveToStorage();
        this.updateCartUI();
        this.updateProductButtons();
    },

    updateQuantity(name, delta) {
        const item = this.items.find(item => item.name === name);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                this.removeItem(name);
            } else {
                this.saveToStorage();
                this.updateCartUI();
                this.updateProductButtons();
            }
        }
    },

    getTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },

    getTotalItems() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    },

    formatPrice(price) {
        return price.toLocaleString('tr-TR');
    },

    updateCartUI() {
        const cartCount = document.querySelector('.cart-count');
        const cartItems = document.querySelector('.cart-items');
        const cartTotal = document.querySelector('.cart-total strong');
        const cartActions = document.querySelector('.cart-actions');

        if (cartCount) {
            cartCount.textContent = this.getTotalItems();
            cartCount.style.display = this.getTotalItems() > 0 ? 'flex' : 'none';
        }

        if (cartItems) {
            if (this.items.length === 0) {
                cartItems.innerHTML = '<p class="cart-empty">Sepetiniz bos</p>';
                if (cartActions) cartActions.style.display = 'none';
            } else {
                // Kategoriye göre grupla
                const groupedItems = {};
                this.items.forEach(item => {
                    const cat = item.category || 'Diger';
                    if (!groupedItems[cat]) {
                        groupedItems[cat] = [];
                    }
                    groupedItems[cat].push(item);
                });

                // Sabit sıraya göre HTML oluştur
                let html = '';
                this.categoryOrder.forEach(category => {
                    if (groupedItems[category]) {
                        html += `<div class="cart-category-header">${category}</div>`;
                        groupedItems[category].forEach(item => {
                            html += this.renderCartItem(item);
                        });
                        delete groupedItems[category];
                    }
                });

                // Kalan kategoriler (Diger vs)
                Object.keys(groupedItems).forEach(category => {
                    html += `<div class="cart-category-header">${category}</div>`;
                    groupedItems[category].forEach(item => {
                        html += this.renderCartItem(item);
                    });
                });

                // Sepeti Temizle butonu
                html += `
                    <div class="btn-clear-cart-wrapper">
                        <button class="btn-clear-cart">Sepeti Temizle</button>
                    </div>
                `;

                cartItems.innerHTML = html;
                if (cartActions) cartActions.style.display = 'flex';

                // Event listeners for quantity buttons
                cartItems.querySelectorAll('.cart-item').forEach(itemEl => {
                    const name = itemEl.dataset.name;
                    itemEl.querySelector('.minus').addEventListener('click', () => this.updateQuantity(name, -1));
                    itemEl.querySelector('.plus').addEventListener('click', () => this.updateQuantity(name, 1));
                    itemEl.querySelector('.remove-btn').addEventListener('click', () => this.removeItem(name));
                });

                // Sepeti temizle butonu event listener
                const btnClear = cartItems.querySelector('.btn-clear-cart');
                if (btnClear) {
                    btnClear.addEventListener('click', () => this.clearCart());
                }
            }
        }

        if (cartTotal) {
            cartTotal.textContent = this.formatPrice(this.getTotal()) + ' TL';
        }
    },

    renderCartItem(item) {
        const itemTotal = item.price * item.quantity;
        const imageHtml = item.image ? `<img src="${item.image}" alt="${item.name}" class="cart-item-image">` : '';
        return `
            <div class="cart-item" data-name="${item.name}">
                ${imageHtml}
                <div class="cart-item-content">
                    <div class="cart-item-info">
                        <span class="cart-item-name">${item.name}</span>
                        <span class="cart-item-calc">${this.formatPrice(item.price)} TL x ${item.quantity} = <strong>${this.formatPrice(itemTotal)} TL</strong></span>
                    </div>
                    <div class="cart-item-controls">
                        <button class="qty-btn minus">-</button>
                        <span class="qty">${item.quantity}</span>
                        <button class="qty-btn plus">+</button>
                        <button class="remove-btn">&times;</button>
                    </div>
                </div>
            </div>
        `;
    },

    showAddedFeedback() {
        const cartButton = document.getElementById('cart-button');
        if (cartButton) {
            cartButton.classList.add('added');
            setTimeout(() => cartButton.classList.remove('added'), 300);
        }
    },

    togglePanel() {
        const panel = document.getElementById('cart-panel');
        panel.classList.toggle('open');
    },

    closePanel() {
        const panel = document.getElementById('cart-panel');
        panel.classList.remove('open');
    },

    clearCart() {
        this.showConfirmModal(
            'Sepeti Temizle',
            'Sepeti temizlemek istediğinize emin misiniz?',
            () => {
                this.items = [];
                this.saveToStorage();
                this.updateCartUI();
                this.updateProductButtons();
            }
        );
    },

    showConfirmModal(title, message, onConfirm) {
        // Mevcut modalı kaldır
        const existingModal = document.querySelector('.confirm-overlay');
        if (existingModal) {
            existingModal.remove();
        }

        // Modal HTML oluştur
        const overlay = document.createElement('div');
        overlay.className = 'confirm-overlay';
        overlay.innerHTML = `
            <div class="confirm-modal">
                <div class="confirm-icon">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                </div>
                <h3 class="confirm-title">${title}</h3>
                <p class="confirm-message">${message}</p>
                <div class="confirm-buttons">
                    <button class="confirm-btn cancel">Vazgec</button>
                    <button class="confirm-btn confirm">Evet</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Animasyon için kısa gecikme
        setTimeout(() => overlay.classList.add('show'), 10);

        // Event listeners
        const closeModal = () => {
            overlay.classList.remove('show');
            setTimeout(() => overlay.remove(), 300);
        };

        overlay.querySelector('.confirm-btn.cancel').addEventListener('click', closeModal);
        overlay.querySelector('.confirm-btn.confirm').addEventListener('click', () => {
            closeModal();
            if (onConfirm) onConfirm();
        });

        // Overlay'e tıklayınca kapat
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });
    },

    generateOrderMessage() {
        if (this.items.length === 0) return '';

        let message = "Merhaba, siparis vermek istiyorum:\n\n";

        this.items.forEach(item => {
            const itemTotal = item.price * item.quantity;
            message += `${item.name}\n`;
            message += `${this.formatPrice(item.price)} TL x ${item.quantity} adet = ${this.formatPrice(itemTotal)} TL\n\n`;
        });

        message += `-------------------\n`;
        message += `TOPLAM TUTAR: ${this.formatPrice(this.getTotal())} TL`;

        return message;
    },

    sendWhatsApp() {
        if (this.items.length === 0) {
            alert('Sepetiniz bos!');
            return;
        }

        const message = encodeURIComponent(this.generateOrderMessage());
        const url = `https://wa.me/${this.phoneNumber}?text=${message}`;
        window.open(url, '_blank');
    },

    sendTelegram() {
        if (this.items.length === 0) {
            alert('Sepetiniz bos!');
            return;
        }

        const message = encodeURIComponent(this.generateOrderMessage());
        const url = `https://t.me/+${this.phoneNumber}?text=${message}`;
        window.open(url, '_blank');
    }
};

// Sayfa yuklendiginde baslat
document.addEventListener('DOMContentLoaded', () => {
    Cart.init();
});
