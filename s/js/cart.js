// Sepet sistemi
const Cart = {
    items: [],
    phoneNumber: '905050000000', // İşletme telefon numarası

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
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        WhatsApp ile Gonder
                    </button>
                    <button class="btn-telegram">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                        </svg>
                        Telegram ile Gonder
                    </button>
                </div>
                <button class="btn-clear-cart">Sepeti Temizle</button>
            </div>
        `;
        document.body.appendChild(cartPanel);

        // Sepet butonu (floating)
        const cartButton = document.createElement('button');
        cartButton.id = 'cart-button';
        cartButton.innerHTML = `
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
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
        cartPanel.querySelector('.btn-clear-cart').addEventListener('click', () => this.clearCart());
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
                this.addItem(name, price, image);
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

    addItem(name, price, image) {
        const existingItem = this.items.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.items.push({
                name: name,
                price: price,
                image: image || '',
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

    updateCartUI() {
        const cartCount = document.querySelector('.cart-count');
        const cartItems = document.querySelector('.cart-items');
        const cartTotal = document.querySelector('.cart-total strong');
        const cartActions = document.querySelector('.cart-actions');
        const btnClear = document.querySelector('.btn-clear-cart');

        if (cartCount) {
            cartCount.textContent = this.getTotalItems();
            cartCount.style.display = this.getTotalItems() > 0 ? 'flex' : 'none';
        }

        if (cartItems) {
            if (this.items.length === 0) {
                cartItems.innerHTML = '<p class="cart-empty">Sepetiniz bos</p>';
                if (cartActions) cartActions.style.display = 'none';
                if (btnClear) btnClear.style.display = 'none';
            } else {
                let html = '';
                this.items.forEach(item => {
                    const itemTotal = item.price * item.quantity;
                    const imageHtml = item.image ? `<img src="${item.image}" alt="${item.name}" class="cart-item-image">` : '';
                    html += `
                        <div class="cart-item" data-name="${item.name}">
                            ${imageHtml}
                            <div class="cart-item-content">
                                <div class="cart-item-info">
                                    <span class="cart-item-name">${item.name}</span>
                                    <span class="cart-item-calc">${item.price} TL x ${item.quantity} = <strong>${itemTotal} TL</strong></span>
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
                });
                cartItems.innerHTML = html;
                if (cartActions) cartActions.style.display = 'flex';
                if (btnClear) btnClear.style.display = 'block';

                // Event listeners for quantity buttons
                cartItems.querySelectorAll('.cart-item').forEach(itemEl => {
                    const name = itemEl.dataset.name;
                    itemEl.querySelector('.minus').addEventListener('click', () => this.updateQuantity(name, -1));
                    itemEl.querySelector('.plus').addEventListener('click', () => this.updateQuantity(name, 1));
                    itemEl.querySelector('.remove-btn').addEventListener('click', () => this.removeItem(name));
                });
            }
        }

        if (cartTotal) {
            cartTotal.textContent = this.getTotal() + ' TL';
        }
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
            message += `${item.price} TL x ${item.quantity} adet = ${itemTotal} TL\n\n`;
        });

        message += `-------------------\n`;
        message += `TOPLAM TUTAR: ${this.getTotal()} TL`;

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
