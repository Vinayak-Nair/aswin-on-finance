/**
 * Home Loan EMI Calculator
 * Formula: EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
 */

import { Calculator, calculateEMI, renderChart } from '../../js/calculator-base.js';
import { $id } from '../../js/utils.js';

const homeLoanCalculator = new Calculator({
    inputs: [
        { id: 'loan-amount', defaultValue: 5000000 },
        { id: 'interest-rate', defaultValue: 8.5 },
        { id: 'loan-tenure', defaultValue: 20 }
    ],
    calculate: (values) => {
        return calculateEMI(
            values['loan-amount'],
            values['interest-rate'],
            values['loan-tenure'] * 12
        );
    },
    render: (results) => {
        $id('emi-value').textContent = homeLoanCalculator.formatCurrency(results.emi);
        $id('principal-amount').textContent = homeLoanCalculator.formatCurrency(results.principal);
        $id('total-interest').textContent = homeLoanCalculator.formatCurrency(results.totalInterest);
        $id('total-amount').textContent = homeLoanCalculator.formatCurrency(results.totalPayment);

        renderChart('.chart-bar', results.principal, results.totalInterest);
    }
});
