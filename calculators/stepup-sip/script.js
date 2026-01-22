/**
 * Stepup SIP Calculator
 * Monthly investment increases by a % each year
 */

function calculateStepupSIP() {
    let monthlyInvestment = parseFloat(document.getElementById('monthly-investment').value) || 0;
    const annualStepup = parseFloat(document.getElementById('annual-stepup').value) / 100 || 0;
    const annualReturn = parseFloat(document.getElementById('expected-return').value) || 0;
    const years = parseInt(document.getElementById('time-period').value) || 0;

    const monthlyRate = annualReturn / 12 / 100;

    let totalInvested = 0;
    let futureValue = 0;

    for (let year = 1; year <= years; year++) {
        // For each year, calculate the SIP value
        for (let month = 1; month <= 12; month++) {
            totalInvested += monthlyInvestment;
            // Calculate remaining months until end
            const remainingMonths = (years - year) * 12 + (12 - month) + 1;
            futureValue += monthlyInvestment * Math.pow(1 + monthlyRate, remainingMonths);
        }
        // Increase monthly investment for next year
        monthlyInvestment = monthlyInvestment * (1 + annualStepup);
    }

    const estimatedReturns = futureValue - totalInvested;

    // Update display
    document.getElementById('invested-amount').textContent = formatCurrency(totalInvested);
    document.getElementById('estimated-returns').textContent = formatCurrency(estimatedReturns);
    document.getElementById('total-value').textContent = formatCurrency(futureValue);

    // Update chart
    const total = futureValue;
    const investedPercent = (totalInvested / total) * 100;
    const returnsPercent = (estimatedReturns / total) * 100;

    document.getElementById('chart-invested').style.width = investedPercent + '%';
    document.getElementById('chart-returns').style.width = returnsPercent + '%';
}

function formatCurrency(amount) {
    return '₹' + Math.round(amount).toLocaleString('en-IN');
}

function syncInputs() {
    const inputs = [
        { input: 'monthly-investment', range: 'monthly-investment-range' },
        { input: 'annual-stepup', range: 'annual-stepup-range' },
        { input: 'expected-return', range: 'expected-return-range' },
        { input: 'time-period', range: 'time-period-range' }
    ];

    inputs.forEach(({ input, range }) => {
        const inputEl = document.getElementById(input);
        const rangeEl = document.getElementById(range);

        inputEl.addEventListener('input', () => {
            rangeEl.value = inputEl.value;
            calculateStepupSIP();
        });

        rangeEl.addEventListener('input', () => {
            inputEl.value = rangeEl.value;
            calculateStepupSIP();
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    syncInputs();
    calculateStepupSIP();
});
