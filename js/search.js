document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('product-search');
    const accordionItems = document.querySelectorAll('.accordion-item');
    const productItems = document.querySelectorAll('.product-item');

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();

        // 1. Filter Individual Product Items
        productItems.forEach(item => {
            const productName = item.textContent.toLowerCase();
            if (productName.includes(searchTerm)) {
                item.style.display = 'flex';
                item.classList.add('animate-up');
            } else {
                item.style.display = 'none';
                item.classList.remove('animate-up');
            }
        });

        // 2. Hide Empty Accordion Items
        accordionItems.forEach(accordion => {
            const hasVisibleProducts = Array.from(accordion.querySelectorAll('.product-item'))
                .some(item => item.style.display !== 'none');

            if (hasVisibleProducts) {
                accordion.style.display = 'block';
                // Automatically expand if searching
                if (searchTerm.length > 2) {
                    accordion.classList.add('active');
                } else {
                    accordion.classList.remove('active');
                }
            } else {
                accordion.style.display = 'none';
            }
        });

        // 3. Handle Empty State
        const anyVisible = Array.from(accordionItems).some(acc => acc.style.display !== 'none');
        let emptyMsg = document.getElementById('search-empty-msg');
        
        if (!anyVisible) {
            if (!emptyMsg) {
                emptyMsg = document.createElement('div');
                emptyMsg.id = 'search-empty-msg';
                emptyMsg.style.textAlign = 'center';
                emptyMsg.style.padding = '40px';
                emptyMsg.style.color = 'var(--light-text)';
                emptyMsg.innerHTML = '<i class="fas fa-search" style="font-size: 40px; margin-bottom: 20px; display: block;"></i><p>No medicines found matching your search.</p>';
                document.getElementById('accordion-container').appendChild(emptyMsg);
            }
        } else if (emptyMsg) {
            emptyMsg.remove();
        }
    });
});
