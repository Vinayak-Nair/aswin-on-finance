import { Calculator, calculateStepUpSIP, renderChart } from '../../js/calculator-base.js';
import { $id } from '../../js/utils.js';

const stepUpCalculator = new Calculator({
    inputs: [
        { id: 'monthly-investment', defaultValue: 10000 },
        { id: 'annual-stepup', defaultValue: 10 },
        { id: 'expected-return', defaultValue: 12 },
        { id: 'time-period', defaultValue: 10 }
    ],
    calculate: (values) => {
        return calculateStepUpSIP(
            values['monthly-investment'],
            values['expected-return'],
            values['time-period'],
            values['annual-stepup']
        );
    },
    render: (results) => {
        $id('invested-amount').textContent = stepUpCalculator.formatCurrency(results.investedAmount);
        $id('estimated-returns').textContent = stepUpCalculator.formatCurrency(results.returns);
        $id('total-value').textContent = stepUpCalculator.formatCurrency(results.futureValue);

        renderChart('.chart-bar', results.investedAmount, results.returns);
    }
});
