document.addEventListener('DOMContentLoaded', function() {
    // URL'den ürün adını al (örn: ?product=izgara-kofte)
    const urlParams = new URLSearchParams(window.location.search);
    const productUrl = urlParams.get('product');

    if (!productUrl) {
        document.querySelector('section').innerHTML = '<p>Ürün bulunamadı.</p>';
        return;
    }

    // XML dosyasını yükle
    fetch('melinas.xml')
        .then(response => response.text())
        .then(xmlText => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(xmlText, 'text/xml');

            // Tüm ürünleri al
            const products = xml.querySelectorAll('product');
            let foundProduct = null;

            // URL'e göre ürünü bul
            products.forEach(product => {
                const urlName = product.querySelector('url_name').textContent;
                if (urlName === productUrl) {
                    foundProduct = product;
                }
            });

            if (!foundProduct) {
                document.querySelector('section').innerHTML = '<p>Ürün bulunamadı.</p>';
                return;
            }

            // Ürün bilgilerini çek
            const name = foundProduct.querySelector('name').textContent;
            const category = foundProduct.querySelector('category').textContent;
            const categoryUrl = foundProduct.querySelector('category_url').textContent;
            const price = foundProduct.querySelector('price').textContent;
            const htmlDesc = foundProduct.querySelector('html_desc').textContent;
            const shortDesc = foundProduct.querySelector('short_desc').textContent;
            const weight = foundProduct.querySelector('weightInGrams').textContent;
            const image = foundProduct.querySelector('images > image').textContent;

            // Detayları al
            const details = foundProduct.querySelectorAll('details > detail');
            let detailsHtml = '<div class="details-grid">';
            details.forEach(detail => {
                const title = detail.getAttribute('title');
                const items = detail.querySelectorAll('items > item');
                let itemsHtml = '<ul>';
                items.forEach(item => {
                    itemsHtml += `<li>${item.textContent}</li>`;
                });
                itemsHtml += '</ul>';
                detailsHtml += `<div class="detail-box"><h3>${title}</h3>${itemsHtml}</div>`;
            });
            detailsHtml += '</div>';

            // Navigasyonu güncelle
            const nav = document.querySelector('nav');
            nav.innerHTML = `
                <a href="index.html" title="Anasayfa'ya Dön">Anasayfa</a>&nbsp;&rarr;&nbsp;
                <a href="index.html#${categoryUrl}">${category}</a>&nbsp;&rarr;&nbsp;
                <u>${name}</u>
            `;

            // Section'ı doldur
            const section = document.querySelector('section');
            section.innerHTML = `
                <article>
                    <div class="product-header">
                        <h1>${name}</h1>
                        <div class="product-btn-wrapper" data-product-name="${name}" data-product-price="${price}" data-product-image="s/img/${image}">
                            <button class="add-to-cart-btn">Sepete Ekle</button>
                            <div class="product-qty-controls">
                                <button class="product-qty-btn minus">-</button>
                                <span class="product-qty">0</span>
                                <button class="product-qty-btn plus">+</button>
                            </div>
                        </div>
                    </div>
                    <img src="s/img/${image}" alt="${name}" />
                    <div class="product-meta">
                        <span><strong>Kategori:</strong> ${category}</span>
                        <span><strong>Fiyat:</strong> ${price} ₺</span>
                        <span><strong>Gramaj:</strong> ${weight} gr</span>
                    </div>
                    <p>${htmlDesc}</p>
                    <p>${shortDesc}</p>
                    ${detailsHtml}
                </article>
            `;

            // Sepete ekle butonunu aktif et
            const wrapper = section.querySelector('.product-btn-wrapper');
            const addBtn = wrapper.querySelector('.add-to-cart-btn');
            const qtyControls = wrapper.querySelector('.product-qty-controls');
            const qtySpan = wrapper.querySelector('.product-qty');
            const minusBtn = wrapper.querySelector('.minus');
            const plusBtn = wrapper.querySelector('.plus');
            const priceNum = parseInt(price);

            // Sepetteki mevcut durumu kontrol et
            function updateButtonState() {
                const item = Cart.items.find(i => i.name === name);
                if (item && item.quantity > 0) {
                    addBtn.style.display = 'none';
                    qtyControls.style.display = 'flex';
                    qtySpan.textContent = item.quantity;
                } else {
                    addBtn.style.display = 'block';
                    qtyControls.style.display = 'none';
                }
            }

            addBtn.addEventListener('click', () => {
                Cart.addItem(name, priceNum, 's/img/' + image, category);
                updateButtonState();
            });

            minusBtn.addEventListener('click', () => {
                Cart.updateQuantity(name, -1);
                updateButtonState();
            });

            plusBtn.addEventListener('click', () => {
                Cart.updateQuantity(name, 1);
                updateButtonState();
            });

            // Sayfa yüklendiğinde durumu güncelle
            updateButtonState();
        })
        .catch(error => {
            console.error('XML yüklenirken hata:', error);
            document.querySelector('section').innerHTML = '<p>Ürün bilgileri yüklenemedi.</p>';
        });
});
