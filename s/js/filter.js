document.addEventListener('DOMContentLoaded', function() {
    const filterCheckboxes = document.querySelectorAll('main > nav > label > input[type="checkbox"]')
    const categories = document.querySelectorAll('main > details[data-category]')
    const noSelectionMessage = document.querySelector('.no-selection-message')

    function getRandomProduct() {
        const makarnalar = document.querySelectorAll('details[data-category="makarnalar"] > ul > li')
        const burgerler = document.querySelectorAll('details[data-category="burgerler"] > ul > li')
        const allProducts = [...makarnalar, ...burgerler]
        const randomIndex = Math.floor(Math.random() * allProducts.length)
        return allProducts[randomIndex]
    }

    function showDailyRecommendation() {
        const product = getRandomProduct()
        const productName = product.querySelector('a > p').textContent
        const productImg = product.querySelector('img').src
        const productDesc = product.querySelector('a + p').textContent
        const productPrice = product.querySelector('b').textContent
        const productLink = product.querySelector('a').href

        noSelectionMessage.innerHTML = `
            <div class="no-selection-warning">Menüyü görüntülemek için bir mutfak seçiniz</div>
            <div class="daily-recommendation">
                <h2>Şefin Önerisi</h2>
                <a href="${productLink}" class="product-name">${productName}</a>
                <div class="product-content">
                    <img src="${productImg}" alt="${productName}">
                    <div class="product-info">
                        <p>${productDesc}</p>
                        <b>${productPrice}</b>
                        <button>Sepete Ekle</button>
                    </div>
                </div>
            </div>
        `
    }

    function filterCategories() {
        const selectedFilters = []

        filterCheckboxes.forEach(function(checkbox) {
            if (checkbox.checked) {
                selectedFilters.push(checkbox.dataset.filter)
            }
        })

        if (selectedFilters.length === 0) {
            categories.forEach(function(detail) {
                detail.hidden = true
            })
            showDailyRecommendation()
            noSelectionMessage.hidden = false
        } else {
            noSelectionMessage.hidden = true
            categories.forEach(function(detail) {
                detail.hidden = !selectedFilters.includes(detail.dataset.category)
            })
        }
    }

    filterCheckboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', filterCategories)
    })

    filterCategories()
})
