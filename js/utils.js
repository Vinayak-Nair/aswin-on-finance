/**
 * Utility Functions
 * ==================
 * Shared helper functions used across the site.
 * Import as: import { formatCurrency, $ } from '/js/utils.js';
 */

/**
 * Format a number as Indian Rupee currency
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
    return '₹' + Math.round(amount).toLocaleString('en-IN');
};

/**
 * Format a number with commas (Indian style)
 * @param {number} num - The number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (num) => {
    return Math.round(num).toLocaleString('en-IN');
};

/**
 * Format a date in a readable format
 * @param {string|Date} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
    const defaults = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    };
    return new Date(date).toLocaleDateString('en-US', { ...defaults, ...options });
};

/**
 * Convert text to URL-friendly slug
 * @param {string} text - Text to slugify
 * @returns {string} URL-safe slug
 */
export const slugify = (text) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

/**
 * Query selector shorthand
 * @param {string} selector - CSS selector
 * @param {Element} parent - Parent element (default: document)
 * @returns {Element|null} First matching element
 */
export const $ = (selector, parent = document) => {
    return parent.querySelector(selector);
};

/**
 * Query selector all shorthand
 * @param {string} selector - CSS selector
 * @param {Element} parent - Parent element (default: document)
 * @returns {NodeList} All matching elements
 */
export const $$ = (selector, parent = document) => {
    return parent.querySelectorAll(selector);
};

/**
 * Get element by ID shorthand
 * @param {string} id - Element ID
 * @returns {Element|null} Element with matching ID
 */
export const $id = (id) => {
    return document.getElementById(id);
};

/**
 * Create an element with attributes and children
 * @param {string} tag - HTML tag name
 * @param {Object} attrs - Attributes to set
 * @param {Array|string} children - Child elements or text
 * @returns {Element} Created element
 */
export const createElement = (tag, attrs = {}, children = []) => {
    const el = document.createElement(tag);

    Object.entries(attrs).forEach(([key, value]) => {
        if (key === 'className') {
            el.className = value;
        } else if (key === 'dataset') {
            Object.entries(value).forEach(([k, v]) => el.dataset[k] = v);
        } else if (key.startsWith('on')) {
            el.addEventListener(key.slice(2).toLowerCase(), value);
        } else {
            el.setAttribute(key, value);
        }
    });

    if (typeof children === 'string') {
        el.textContent = children;
    } else {
        children.forEach(child => {
            if (typeof child === 'string') {
                el.appendChild(document.createTextNode(child));
            } else {
                el.appendChild(child);
            }
        });
    }

    return el;
};

/**
 * Debounce a function
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (fn, delay = 300) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
};

/**
 * Parse URL query parameters
 * @returns {Object} Key-value pairs of query params
 */
export const getQueryParams = () => {
    return Object.fromEntries(new URLSearchParams(window.location.search));
};

/**
 * Show/hide an element
 * @param {Element|string} el - Element or selector
 * @param {boolean} show - Whether to show or hide
 */
export const toggleVisibility = (el, show) => {
    const element = typeof el === 'string' ? $(el) : el;
    if (element) {
        element.classList.toggle('hidden', !show);
    }
};

/**
 * Clamp a number between min and max
 * @param {number} num - Number to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export const clamp = (num, min, max) => {
    return Math.min(Math.max(num, min), max);
};
