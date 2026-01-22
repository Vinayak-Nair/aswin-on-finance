/**
 * Home Loan EMI Calculator
 * Formula: EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
 */

function calculateEMI() {
    const principal = parseFloat(document.getElementById('loan-amount').value) || 0;
    const annualRate = parseFloat(document.getElementById('interest-rate').value) || 0;
    const years = parseFloat(document.getElementById('loan-tenure').value) || 0;

    const monthlyRate = annualRate / 12 / 100;
    const months = years * 12;

    let emi = 0;
    if (monthlyRate > 0 && months > 0) {
        emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    } else if (months > 0) {
        emi = principal / months;
    }

    const totalAmount = emi * months;
    const totalInterest = totalAmount - principal;

    // Update display
    document.getElementById('emi-value').textContent = formatCurrency(emi);
    document.getElementById('principal-amount').textContent = formatCurrency(principal);
    document.getElementById('total-interest').textContent = formatCurrency(totalInterest);
    document.getElementById('total-amount').textContent = formatCurrency(totalAmount);

    // Update chart
    const principalPercent = (principal / totalAmount) * 100;
    const interestPercent = (totalInterest / totalAmount) * 100;

    document.getElementById('chart-principal').style.width = principalPercent + '%';
    document.getElementById('chart-interest').style.width = interestPercent + '%';
}

function formatCurrency(amount) {
    return '₹' + Math.round(amount).toLocaleString('en-IN');
}

function syncInputs() {
    const inputs = [
        { input: 'loan-amount', range: 'loan-amount-range' },
        { input: 'interest-rate', range: 'interest-rate-range' },
        { input: 'loan-tenure', range: 'loan-tenure-range' }
    ];

    inputs.forEach(({ input, range }) => {
        const inputEl = document.getElementById(input);
        const rangeEl = document.getElementById(range);

        inputEl.addEventListener('input', () => {
            rangeEl.value = inputEl.value;
            calculateEMI();
        });

        rangeEl.addEventListener('input', () => {
            inputEl.value = rangeEl.value;
            calculateEMI();
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    syncInputs();
    calculateEMI();
});
