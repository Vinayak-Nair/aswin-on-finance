import { Calculator, calculateSIP, renderChart } from '../../js/calculator-base.js';
import { $id } from '../../js/utils.js';

const sipCalculator = new Calculator({
    inputs: [
        { id: 'monthly-investment', defaultValue: 10000 },
        { id: 'expected-return', defaultValue: 12 },
        { id: 'time-period', defaultValue: 10 }
    ],
    calculate: (values) => {
        return calculateSIP(
            values['monthly-investment'],
            values['expected-return'],
            values['time-period']
        );
    },
    render: (results) => {
        $id('invested-amount').textContent = sipCalculator.formatCurrency(results.investedAmount);
        $id('estimated-returns').textContent = sipCalculator.formatCurrency(results.returns);
        $id('total-value').textContent = sipCalculator.formatCurrency(results.futureValue);

        renderChart('.chart-bar', results.investedAmount, results.returns);
    }
});
