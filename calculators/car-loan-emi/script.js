import { Calculator, calculateEMI, renderChart } from '../../js/calculator-base.js';
import { $id } from '../../js/utils.js';

const carLoanCalculator = new Calculator({
    inputs: [
        { id: 'loan-amount', defaultValue: 800000 },
        { id: 'interest-rate', defaultValue: 9 },
        { id: 'loan-tenure', defaultValue: 5 }
    ],
    calculate: (values) => {
        return calculateEMI(
            values['loan-amount'],
            values['interest-rate'],
            values['loan-tenure'] * 12
        );
    },
    render: (results) => {
        $id('emi-value').textContent = carLoanCalculator.formatCurrency(results.emi);
        $id('principal-amount').textContent = carLoanCalculator.formatCurrency(results.principal);
        $id('total-interest').textContent = carLoanCalculator.formatCurrency(results.totalInterest);
        $id('total-amount').textContent = carLoanCalculator.formatCurrency(results.totalPayment);

        renderChart('.chart-bar', results.principal, results.totalInterest);
    }
});
