/**
 * SIP Calculator
 * Formula: FV = P × ((1 + r)^n - 1) / r × (1 + r)
 */

function calculateSIP() {
    const monthlyInvestment = parseFloat(document.getElementById('monthly-investment').value) || 0;
    const annualReturn = parseFloat(document.getElementById('expected-return').value) || 0;
    const years = parseFloat(document.getElementById('time-period').value) || 0;

    const monthlyRate = annualReturn / 12 / 100;
    const months = years * 12;

    let futureValue = 0;
    if (monthlyRate > 0) {
        futureValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    } else {
        futureValue = monthlyInvestment * months;
    }

    const investedAmount = monthlyInvestment * months;
    const estimatedReturns = futureValue - investedAmount;

    // Update display
    document.getElementById('invested-amount').textContent = formatCurrency(investedAmount);
    document.getElementById('estimated-returns').textContent = formatCurrency(estimatedReturns);
    document.getElementById('total-value').textContent = formatCurrency(futureValue);

    // Update chart
    const total = futureValue;
    const investedPercent = (investedAmount / total) * 100;
    const returnsPercent = (estimatedReturns / total) * 100;

    document.getElementById('chart-invested').style.width = investedPercent + '%';
    document.getElementById('chart-returns').style.width = returnsPercent + '%';
}

function formatCurrency(amount) {
    return '₹' + Math.round(amount).toLocaleString('en-IN');
}

// Sync sliders with inputs
function syncInputs() {
    const inputs = [
        { input: 'monthly-investment', range: 'monthly-investment-range' },
        { input: 'expected-return', range: 'expected-return-range' },
        { input: 'time-period', range: 'time-period-range' }
    ];

    inputs.forEach(({ input, range }) => {
        const inputEl = document.getElementById(input);
        const rangeEl = document.getElementById(range);

        inputEl.addEventListener('input', () => {
            rangeEl.value = inputEl.value;
            calculateSIP();
        });

        rangeEl.addEventListener('input', () => {
            inputEl.value = rangeEl.value;
            calculateSIP();
        });
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    syncInputs();
    calculateSIP();
});
