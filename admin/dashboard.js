/**
 * Admin Dashboard
 * ================
 * Main JavaScript for the admin panel.
 * Handles authentication, leads management, and blog posts.
 */

import { supabase } from '../js/supabase-client.js';
import { formatDate, slugify, $, $id } from '../js/utils.js';

// ========================================
// DOM Elements
// ========================================
const elements = {
    loginScreen: $id('login-screen'),
    dashboard: $id('dashboard'),
    emailInput: $id('email-input'),
    passwordInput: $id('password-input'),
    loginBtn: $id('login-btn'),
    errorMsg: $id('error-msg'),
    leadsBody: $id('leads-body'),
    postsList: $id('posts-list'),
    postTitle: $id('post-title'),
    postContent: $id('post-content'),
};

// ========================================
// Authentication
// ========================================
async function checkSession() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        showDashboard();
    }
}

async function handleLogin() {
    const email = elements.emailInput?.value;
    const password = elements.passwordInput?.value;

    if (!email || !password) {
        showError('Please enter both email and password');
        return;
    }

    setButtonLoading(elements.loginBtn, true, 'Logging in...');
    hideError();

    try {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        showDashboard();
    } catch (error) {
        console.error('Login error:', error);
        showError(error.message || 'Invalid credentials');
    } finally {
        setButtonLoading(elements.loginBtn, false, 'Login');
    }
}

async function handleLogout() {
    try {
        await supabase.auth.signOut();
        location.reload();
    } catch (error) {
        console.error('Logout error:', error);
        alert('Error logging out');
    }
}

function showDashboard() {
    elements.loginScreen?.classList.add('hidden');
    elements.dashboard?.classList.add('active');
    elements.dashboard.style.display = 'block';
    loadLeads();
    loadPosts();
}

// ========================================
// Leads Management
// ========================================
async function loadLeads() {
    const tbody = elements.leadsBody;
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">Loading leads...</td></tr>';

    try {
        const { data: leads, error } = await supabase
            .from('leads')
            .select('*')
            .order('submitted_at', { ascending: false });

        if (error) throw error;

        if (!leads?.length) {
            tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No leads submitted yet.</td></tr>';
            return;
        }

        tbody.innerHTML = leads.map(lead => `
      <tr>
        <td>${lead.submitted_at ? formatDate(lead.submitted_at) : '-'}</td>
        <td>
          ${lead.name || '-'}
          <br><small class="country-info">${lead.country || '-'}</small>
        </td>
        <td><span class="status-badge">${lead.status || '-'}</span></td>
        <td>${lead.amount ? '₹' + lead.amount.toLocaleString('en-IN') : '-'}</td>
        <td>${lead.goal || '-'}</td>
        <td>${lead.horizon || '-'}</td>
        <td class="contact-info">${formatContact(lead)}</td>
      </tr>
    `).join('');

    } catch (error) {
        console.error('Error loading leads:', error);
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--color-error);">Error: ${error.message}</td></tr>`;
    }
}

function formatContact(lead) {
    if (lead.contact_method === 'whatsapp') {
        return `📱 ${lead.phone || ''}`;
    }
    return `📧 ${lead.email || ''}`;
}

// ========================================
// Blog Management
// ========================================
async function loadPosts() {
    const container = elements.postsList;
    if (!container) return;

    container.innerHTML = '<div style="padding: 1rem; text-align: center;">Loading posts...</div>';

    try {
        const { data: posts, error } = await supabase
            .from('posts')
            .select('*')
            .order('published_at', { ascending: false })
            .limit(10);

        if (error) throw error;

        if (!posts?.length) {
            container.innerHTML = '<div class="empty-state">No posts yet.</div>';
            return;
        }

        container.innerHTML = posts.map(post => `
      <div class="post-item">
        <span class="post-title">${post.title}</span>
        <span class="post-date">${formatDate(post.published_at)}</span>
      </div>
    `).join('');

    } catch (error) {
        console.error('Error loading posts:', error);
        container.innerHTML = '<div class="empty-state" style="color: var(--color-error);">Error loading posts</div>';
    }
}

async function createPost() {
    const title = elements.postTitle?.value?.trim();
    const content = elements.postContent?.value?.trim();

    if (!title || !content) {
        alert('Please fill in title and content');
        return;
    }

    const slug = slugify(title);

    try {
        const { error } = await supabase
            .from('posts')
            .insert([{
                title,
                slug,
                content,
                thumbnail_url: 'images/placeholder.webp',
                published_at: new Date().toISOString()
            }]);

        if (error) throw error;

        // Purge edge cache so the new post is immediately visible
        try {
            await fetch('/api/purge', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env?.VITE_PURGE_SECRET || ''}`
                },
                body: JSON.stringify({ slug })
            });
        } catch (purgeErr) {
            console.warn('Cache purge failed (non-critical):', purgeErr);
        }

        alert('Post published successfully!');
        elements.postTitle.value = '';
        elements.postContent.value = '';
        loadPosts();

    } catch (error) {
        console.error('Error publishing post:', error);
        alert('Failed to publish: ' + error.message);
    }
}

// ========================================
// UI Helpers
// ========================================
function showError(message) {
    if (elements.errorMsg) {
        elements.errorMsg.textContent = message;
        elements.errorMsg.style.display = 'block';
    }
}

function hideError() {
    if (elements.errorMsg) {
        elements.errorMsg.style.display = 'none';
    }
}

function setButtonLoading(button, loading, text) {
    if (!button) return;
    button.textContent = text;
    button.disabled = loading;
}

// ========================================
// Event Listeners
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    checkSession();

    // Login button
    $id('login-btn')?.addEventListener('click', handleLogin);

    // Logout button
    $id('logout-btn')?.addEventListener('click', handleLogout);

    // Create post button
    $id('create-post-btn')?.addEventListener('click', createPost);

    // Enter key on password field
    $id('password-input')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });
});

// Export for use in HTML onclick attributes if needed
window.handleLogin = handleLogin;
window.handleLogout = handleLogout;
window.createPost = createPost;
