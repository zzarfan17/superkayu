// Global Scroll Reveal Function (accessible by other scripts like produk.html)
function reveal() {
    const reveals = document.querySelectorAll(".reveal");
    const windowHeight = window.innerHeight;
    const elementVisible = 100;
    reveals.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
            el.classList.add("active");
        }
    });
}
window.reveal = reveal; // Make it explicitly global

// Listen to scroll to trigger reveal
window.addEventListener("scroll", reveal);

document.addEventListener('DOMContentLoaded', () => {

    // Trigger initial reveal and a small timeout to account for image loads
    reveal();
    setTimeout(reveal, 200);

    // 1. SCROLL PROGRESS INDICATOR
    // Inject progress bar element to DOM
    const progressBar = document.createElement('div');
    progressBar.id = 'scrollProgress';
    document.body.appendChild(progressBar);

    // Update progress bar width on scroll
    window.addEventListener('scroll', () => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
        progressBar.style.width = pct + '%';
    });

    // 2. BACK TO TOP BUTTON
    // Inject Back to Top button
    const backBtn = document.createElement('button');
    backBtn.id = 'backToTop';
    backBtn.className = 'btn-primary';
    backBtn.innerHTML = '↑ Top';
    document.body.appendChild(backBtn);

    // Show/hide button on scroll
    window.addEventListener('scroll', () => {
        backBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
    });

    // Scroll to top on click
    backBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 3. LIVE SEARCH FOR PRODUCTS (Only runs on produk.html)
    const productGrid = document.querySelector('.product-list-container');
    if (productGrid) {
        // Find if we are really on product page by checking if page-1 exists
        if (document.getElementById('page-1')) {
            // Inject search input before the first product list container
            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.id = 'productSearch';
            searchInput.placeholder = 'Cari produk kayu...';
            
            // Insert it before the product list
            productGrid.parentNode.insertBefore(searchInput, productGrid);

            // Live filter logic
            searchInput.addEventListener('input', () => {
                const term = searchInput.value.toLowerCase();
                
                // When searching, we should show all cards across all pages
                // to make search effective, but for simplicity, we'll just filter what's visible
                // or we can override pagination
                const allCards = document.querySelectorAll('.product-list-card');
                
                if (term.trim() !== '') {
                    // Hide pagination if searching
                    const pagination = document.querySelector('.pagination');
                    if(pagination) pagination.style.display = 'none';
                    
                    // Show both pages temporarily
                    document.getElementById('page-1').style.display = 'flex';
                    document.getElementById('page-2').style.display = 'flex';

                    allCards.forEach(card => {
                        const name = card.querySelector('h3').textContent.toLowerCase();
                        card.style.display = name.includes(term) ? 'flex' : 'none';
                    });
                } else {
                    // Reset to normal pagination state
                    const pagination = document.querySelector('.pagination');
                    if(pagination) pagination.style.display = 'flex';
                    
                    // Re-trigger the active page
                    const activeBtn = document.querySelector('.pagination button.active');
                    if (activeBtn) {
                        activeBtn.click();
                    }
                    
                    // Reset all cards display
                    allCards.forEach(card => card.style.display = 'flex');
                }
            });
        }
    }

    // 4. WHATSAPP AUTO-NAME PROMPT (Only runs on detail.html)
    const orderBtn = document.getElementById('btnOrder');
    if (orderBtn) {
        orderBtn.addEventListener('click', (e) => {
            const name = prompt('Masukkan nama Anda (Opsional, boleh dikosongkan):');
            if (name && name.trim() !== '') {
                // Parse the existing href to safely add the name
                try {
                    const url = new URL(orderBtn.href);
                    const currentText = decodeURIComponent(url.searchParams.get('text') || '');
                    url.searchParams.set('text', currentText + ' (Nama: ' + name.trim() + ')');
                    orderBtn.href = url.toString();
                } catch (err) {
                    // Fallback if URL parsing fails
                    orderBtn.href = orderBtn.href + ' (Nama: ' + encodeURIComponent(name.trim()) + ')';
                }
            }
        });
    }

    // 5. TOOLTIPS ON PRIMARY BUTTONS
    // Add simple title attributes to any primary button that doesn't have one
    const actionBtns = document.querySelectorAll('.btn-primary');
    actionBtns.forEach(btn => {
        if (!btn.hasAttribute('title')) {
            if (btn.textContent.includes('Lihat Detail')) {
                btn.setAttribute('title', 'Lihat informasi lengkap tentang kayu ini');
            } else if (btn.textContent.includes('Order')) {
                btn.setAttribute('title', 'Pesan sekarang via WhatsApp');
            } else if (btn.textContent.includes('Tentang Kami')) {
                btn.setAttribute('title', 'Pelajari lebih lanjut tentang SUPERKAYU');
            }
        }
    });

    // 6. HAMBURGER MENU INTERACTION WITH TOGGLE ANIMATION
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            menuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
                menuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });

        // Close menu when clicking a link
        const navItems = navLinks.querySelectorAll('a');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                menuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

});
