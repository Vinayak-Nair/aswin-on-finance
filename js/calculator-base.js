/**
 * Calculator Base Class
 * ======================
 * Base class for all financial calculators.
 * Provides common functionality for input syncing, formatting, and rendering.
 */

import { formatCurrency, $, $id } from './utils.js';

export class Calculator {
    /**
     * @param {Object} config - Calculator configuration
     * @param {Array} config.inputs - Input field configurations
     * @param {Function} config.calculate - Calculation function
     * @param {Function} config.render - Render function for results
     */
    constructor(config) {
        this.inputs = config.inputs || [];
        this.calculateFn = config.calculate;
        this.renderFn = config.render;
        this.values = {};

        this.init();
    }

    /**
     * Initialize the calculator
     */
    init() {
        // Set initial values and setup event listeners
        this.inputs.forEach(({ id, defaultValue }) => {
            const input = $id(id);
            const range = $id(`${id}-range`);

            if (input) {
                this.values[id] = parseFloat(input.value) || defaultValue || 0;

                input.addEventListener('input', () => {
                    this.values[id] = parseFloat(input.value) || 0;
                    if (range) range.value = input.value;
                    this.update();
                });
            }

            if (range) {
                range.addEventListener('input', () => {
                    this.values[id] = parseFloat(range.value) || 0;
                    if (input) input.value = range.value;
                    this.update();
                });
            }
        });

        // Initial calculation
        this.update();
    }

    /**
     * Get a value by input ID
     * @param {string} id - Input ID
     * @returns {number} Current value
     */
    getValue(id) {
        return this.values[id] || 0;
    }

    /**
     * Run calculation and render results
     */
    update() {
        const results = this.calculateFn(this.values);
        this.renderFn(results);
    }

    /**
     * Format currency helper
     * @param {number} amount - Amount to format
     * @returns {string} Formatted currency
     */
    formatCurrency(amount) {
        return formatCurrency(amount);
    }
}

/**
 * SIP Calculator
 * Formula: FV = P × ((1 + r)^n - 1) / r × (1 + r)
 */
export const calculateSIP = (monthlyInvestment, annualReturn, years) => {
    const monthlyRate = annualReturn / 12 / 100;
    const months = years * 12;

    let futureValue = 0;
    if (monthlyRate > 0) {
        futureValue = monthlyInvestment *
            ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
            (1 + monthlyRate);
    } else {
        futureValue = monthlyInvestment * months;
    }

    const investedAmount = monthlyInvestment * months;
    const returns = futureValue - investedAmount;

    return { investedAmount, returns, futureValue };
};

/**
 * Step-up SIP Calculator
 * SIP with annual increase in investment amount
 */
export const calculateStepUpSIP = (initialInvestment, annualReturn, years, stepUpPercent) => {
    const monthlyRate = annualReturn / 12 / 100;
    let totalInvested = 0;
    let futureValue = 0;
    let currentMonthly = initialInvestment;

    for (let year = 0; year < years; year++) {
        for (let month = 0; month < 12; month++) {
            const remainingMonths = (years - year) * 12 - month;
            totalInvested += currentMonthly;

            if (monthlyRate > 0) {
                futureValue += currentMonthly * Math.pow(1 + monthlyRate, remainingMonths);
            } else {
                futureValue += currentMonthly;
            }
        }
        currentMonthly *= (1 + stepUpPercent / 100);
    }

    const returns = futureValue - totalInvested;

    return { investedAmount: totalInvested, returns, futureValue };
};

/**
 * CAGR Calculator
 * Formula: CAGR = (EV/BV)^(1/n) - 1
 */
export const calculateCAGR = (beginningValue, endingValue, years) => {
    if (beginningValue <= 0 || years <= 0) return 0;
    const cagr = (Math.pow(endingValue / beginningValue, 1 / years) - 1) * 100;
    return cagr;
};

/**
 * EMI Calculator
 * Formula: EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
 */
export const calculateEMI = (principal, annualRate, tenureMonths) => {
    const monthlyRate = annualRate / 12 / 100;

    if (monthlyRate === 0) {
        return principal / tenureMonths;
    }

    const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths) /
        (Math.pow(1 + monthlyRate, tenureMonths) - 1);

    const totalPayment = emi * tenureMonths;
    const totalInterest = totalPayment - principal;

    return { emi, totalPayment, totalInterest, principal };
};

/**
 * Render a bar chart showing invested vs returns
 * @param {Element|string} container - Container element or selector
 * @param {number} investedAmount - Amount invested
 * @param {number} returns - Returns earned
 */
export const renderChart = (container, investedAmount, returns) => {
    const el = typeof container === 'string' ? $(container) : container;
    if (!el) return;

    const total = investedAmount + returns;
    const investedPercent = total > 0 ? (investedAmount / total) * 100 : 50;
    const returnsPercent = total > 0 ? (returns / total) * 100 : 50;

    const chartInvested = el.querySelector('.chart-invested');
    const chartReturns = el.querySelector('.chart-returns');

    if (chartInvested) chartInvested.style.width = investedPercent + '%';
    if (chartReturns) chartReturns.style.width = returnsPercent + '%';
};
