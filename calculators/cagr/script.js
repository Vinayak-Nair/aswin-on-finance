/**
 * CAGR Calculator
 * Formula: CAGR = (FV / PV)^(1/n) - 1
 */

import { Calculator, calculateCAGR } from '../../js/calculator-base.js';
import { $id } from '../../js/utils.js';

const cagrCalculator = new Calculator({
    inputs: [
        { id: 'initial-value', defaultValue: 100000 },
        { id: 'final-value', defaultValue: 200000 },
        { id: 'time-period', defaultValue: 5 }
    ],
    calculate: (values) => {
        const cagr = calculateCAGR(
            values['initial-value'],
            values['final-value'],
            values['time-period']
        );
        const initial = values['initial-value'];
        const final = values['final-value'];
        const growth = final - initial;
        return { cagr, initial, final, growth };
    },
    render: (results) => {
        const cagrText = results.cagr.toFixed(2) + '%';
        $id('cagr-value').textContent = cagrText;
        $id('cagr-inline').textContent = cagrText;
        $id('display-initial').textContent = cagrCalculator.formatCurrency(results.initial);
        $id('display-final').textContent = cagrCalculator.formatCurrency(results.final);
        $id('total-growth').textContent = cagrCalculator.formatCurrency(results.growth);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    cagrCalculator.init();
});
