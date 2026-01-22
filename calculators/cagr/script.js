/**
 * CAGR Calculator
 * Formula: CAGR = (FV / PV)^(1/n) - 1
 */

function calculateCAGR() {
    const initialValue = parseFloat(document.getElementById('initial-value').value) || 0;
    const finalValue = parseFloat(document.getElementById('final-value').value) || 0;
    const years = parseFloat(document.getElementById('time-period').value) || 1;

    let cagr = 0;
    if (initialValue > 0 && finalValue > 0 && years > 0) {
        cagr = (Math.pow(finalValue / initialValue, 1 / years) - 1) * 100;
    }

    const totalGrowth = finalValue - initialValue;

    // Update display
    document.getElementById('cagr-value').textContent = cagr.toFixed(2) + '%';
    document.getElementById('cagr-inline').textContent = cagr.toFixed(2) + '%';
    document.getElementById('display-initial').textContent = formatCurrency(initialValue);
    document.getElementById('display-final').textContent = formatCurrency(finalValue);
    document.getElementById('total-growth').textContent = formatCurrency(totalGrowth);
}

function formatCurrency(amount) {
    return '₹' + Math.round(amount).toLocaleString('en-IN');
}

function syncInputs() {
    const inputs = [
        { input: 'initial-value', range: 'initial-value-range' },
        { input: 'final-value', range: 'final-value-range' },
        { input: 'time-period', range: 'time-period-range' }
    ];

    inputs.forEach(({ input, range }) => {
        const inputEl = document.getElementById(input);
        const rangeEl = document.getElementById(range);

        inputEl.addEventListener('input', () => {
            rangeEl.value = inputEl.value;
            calculateCAGR();
        });

        rangeEl.addEventListener('input', () => {
            inputEl.value = rangeEl.value;
            calculateCAGR();
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    syncInputs();
    calculateCAGR();
});
