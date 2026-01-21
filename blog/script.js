// ========================================
// Blog Data - NRI Finance Questions
// ========================================
const blogPosts = [
    {
        id: 1,
        title: "I'm an NRI and totally confused about how to invest in Indian stocks. How are people doing this?",
        category: "Investing",
        date: "Jan 20, 2026",
        thumbnail: "images/1.webp",
        url: "posts/1.html"
    },
    {
        id: 2,
        title: "Do I need to pay tax in India on money I send from abroad to my family?",
        category: "Tax",
        date: "Jan 20, 2026",
        thumbnail: "images/2.webp",
        url: "posts/2.html"
    },
    {
        id: 3,
        title: "Can someone explain NRE vs NRO accounts in very simple terms?",
        category: "Banking",
        date: "Jan 20, 2026",
        thumbnail: "images/3.webp",
        url: "posts/3.html"
    },
    {
        id: 4,
        title: "Is it mandatory to convert my Indian savings account to NRO after becoming NRI?",
        category: "Banking",
        date: "Jan 20, 2026",
        thumbnail: "images/4.webp",
        url: "posts/4.html"
    },
    {
        id: 5,
        title: "Is interest on NRE FD really tax-free in India? Do I still need to report it abroad?",
        category: "Tax",
        date: "Jan 20, 2026",
        thumbnail: "images/5.webp",
        url: "posts/5.html"
    },
    {
        id: 6,
        title: "How many days can I stay in India without losing my NRI status for tax purposes?",
        category: "Tax",
        date: "Jan 20, 2026",
        thumbnail: "images/6.webp",
        url: "posts/6.html"
    },
    {
        id: 7,
        title: "If I stay in India for 5-6 months in a year, what happens to my tax status?",
        category: "Tax",
        date: "Jan 20, 2026",
        thumbnail: "images/7.webp",
        url: "posts/7.html"
    },
    {
        id: 8,
        title: "Do I need to file an Income Tax Return (ITR) in India if I only have small interest/rent income?",
        category: "Tax",
        date: "Jan 20, 2026",
        thumbnail: "images/8.webp",
        url: "posts/8.html"
    },
    {
        id: 9,
        title: "I have rental income from India – how is it taxed and what about TDS?",
        category: "Tax",
        date: "Jan 20, 2026",
        thumbnail: "images/9.webp",
        url: "posts/9.html"
    },
    {
        id: 10,
        title: "If I sell a property in India, why is TDS so high for NRIs?",
        category: "Property",
        date: "Jan 20, 2026",
        thumbnail: "images/10.webp",
        url: "posts/10.html"
    },
    {
        id: 11,
        title: "After selling property, how do I take the money abroad?",
        category: "Property",
        date: "Jan 20, 2026",
        thumbnail: "images/11.webp",
        url: "posts/11.html"
    },
    {
        id: 12,
        title: "Can I invest in Indian Mutual Funds as an NRI?",
        category: "Investing",
        date: "Jan 20, 2026",
        thumbnail: "images/12.webp",
        url: "posts/12.html"
    },
    {
        id: 13,
        title: "Why do some mutual funds block US/Canada NRIs because of FATCA?",
        category: "Investing",
        date: "Jan 20, 2026",
        thumbnail: "images/13.webp",
        url: "posts/13.html"
    },
    {
        id: 14,
        title: "My SIPs got stopped after I became NRI – why and how to fix it?",
        category: "Investing",
        date: "Jan 20, 2026",
        thumbnail: "images/14.webp",
        url: "posts/14.html"
    },
    {
        id: 15,
        title: "What exactly is FATCA and why does every bank ask for it?",
        category: "Banking",
        date: "Jan 20, 2026",
        thumbnail: "images/15.webp",
        url: "posts/15.html"
    },
    {
        id: 16,
        title: "Can I still claim 80C deductions in India as an NRI?",
        category: "Tax",
        date: "Jan 20, 2026",
        thumbnail: "images/16.webp",
        url: "posts/16.html"
    },
    {
        id: 17,
        title: "Can I continue investing in PPF after becoming NRI?",
        category: "Investing",
        date: "Jan 20, 2026",
        thumbnail: "images/17.webp",
        url: "posts/17.html"
    }
];

// ========================================
// Render Blog Posts
// ========================================
function renderBlogPosts(posts) {
    const blogList = document.getElementById('blogList');

    if (!posts || posts.length === 0) {
        blogList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <p class="empty-state-text">No posts yet. Check back soon!</p>
            </div>
        `;
        return;
    }

    const postsHTML = posts.map(post => `
        <a href="${post.url}" class="blog-item" data-id="${post.id}">
            <div class="blog-thumbnail-wrapper">
                <img 
                    src="${post.thumbnail}" 
                    alt="${post.title}" 
                    class="blog-thumbnail"
                    loading="lazy"
                    onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%23e8e8e8%22 width=%22100%22 height=%22100%22/><text x=%2250%22 y=%2250%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2240%22>📄</text></svg>'"
                >
            </div>
            <div class="blog-content">
                <h2 class="blog-title">${post.title}</h2>
                <div class="blog-meta">
                    <span class="blog-category">${post.category}</span>
                    <span class="blog-date">${post.date}</span>
                </div>
            </div>
        </a>
    `).join('');

    blogList.innerHTML = postsHTML;
}

// ========================================
// Initialize
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    renderBlogPosts(blogPosts);
});
