document.addEventListener('DOMContentLoaded', function() {
    const filterCheckboxes = document.querySelectorAll('main > nav > label > input[type="checkbox"]')
    const categories = document.querySelectorAll('main > details[data-category]')

    function filterCategories() {
        const selectedFilters = []

        filterCheckboxes.forEach(function(checkbox) {
            if (checkbox.checked) {
                selectedFilters.push(checkbox.dataset.filter)
            }
        })

        categories.forEach(function(detail) {
            if (selectedFilters.length === 0) {
                detail.hidden = false
            } else {
                detail.hidden = !selectedFilters.includes(detail.dataset.category)
            }
        })
    }

    filterCheckboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', filterCategories)
    })

    filterCategories()
})
