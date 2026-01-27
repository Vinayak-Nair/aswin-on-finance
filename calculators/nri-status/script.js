import { $, $$, $id, toggleVisibility } from '../../js/utils.js';

// Toggle terminology help
export function toggleHelp() {
    const helpContent = $id('help-content');
    if (helpContent) helpContent.classList.toggle('show');
}

// Navigation helper
export function goToStep(step) {
    $$('.calc-step').forEach(s => s.classList.remove('active'));
    $(`[data-step="${step}"]`)?.classList.add('active');
}

function getSelectedValue(name) {
    const selected = $(`input[name="${name}"]:checked`);
    return selected ? selected.value === 'yes' : null;
}

function validateSelection(name) {
    if (getSelectedValue(name) === null) {
        alert('Please select an option');
        return false;
    }
    return true;
}

// Step handlers
export function handleStep1() {
    if (!validateSelection('q1-182-days')) return;
    const stayed182Days = getSelectedValue('q1-182-days');
    if (stayed182Days) {
        goToStep(6);
    } else {
        goToStep(2);
    }
}

export function handleStep2() {
    if (!validateSelection('q2-citizen-abroad')) return;
    const isCitizenAbroad = getSelectedValue('q2-citizen-abroad');
    if (isCitizenAbroad) {
        goToStep(4);
    } else {
        goToStep(3);
    }
}

export function handleStep3() {
    if (!validateSelection('q3-60-365')) return;
    const meets60_365 = getSelectedValue('q3-60-365');
    if (meets60_365) {
        goToStep(6);
    } else {
        showResult('NRI');
    }
}

export function handleStep4() {
    if (!validateSelection('q4-high-income')) return;
    const hasHighIncome = getSelectedValue('q4-high-income');
    if (hasHighIncome) {
        goToStep(5);
    } else {
        showResult('NRI');
    }
}

export function handleStep5() {
    if (!validateSelection('q5-120-365')) return;
    const meets120_365 = getSelectedValue('q5-120-365');
    if (meets120_365) {
        goToStep(6);
    } else {
        showResult('NRI');
    }
}

export function handleRNOR() {
    if (!validateSelection('q6-nri-9-years') || !validateSelection('q6-729-days')) return;
    const nri9Years = getSelectedValue('q6-nri-9-years');
    const under729Days = getSelectedValue('q6-729-days');
    if (nri9Years || under729Days) {
        showResult('RNOR');
    } else {
        showResult('ROR');
    }
}

/**
 * Display results
 */
function showResult(status) {
    const calcForm = $id('nri-calculator');
    if (calcForm) calcForm.style.display = 'none';

    const resultContainer = $id('result');
    if (resultContainer) resultContainer.classList.remove('hidden');

    const statusBadge = $id('status-badge');
    const resultTitle = $id('result-title');
    const resultDescription = $id('result-description');
    const taxImplications = $id('tax-implications');

    if (!taxImplications) return;
    taxImplications.innerHTML = '';

    const data = {
        'NRI': {
            badge: 'NRI',
            class: 'nri',
            title: 'You are a Non-Resident Indian',
            desc: 'Based on your answers, you qualify as a Non-Resident Indian (NRI) for tax purposes in FY 2024-25.',
            implications: [
                'Only income earned or received in India is taxable',
                'Foreign income is not taxable in India',
                'Can maintain NRE/NRO bank accounts',
                'Special investment options available (NRI FDs, etc.)'
            ]
        },
        'ROR': {
            badge: 'ROR',
            class: 'ror',
            title: 'You are a Resident and Ordinarily Resident',
            desc: 'Based on your answers, you qualify as Resident and Ordinarily Resident (ROR) for tax purposes in FY 2024-25.',
            implications: [
                'Your global income is taxable in India',
                'Must report foreign assets and income',
                'Standard resident tax slabs apply',
                'Must maintain resident savings accounts'
            ]
        },
        'RNOR': {
            badge: 'RNOR',
            class: 'rnor',
            title: 'You are Resident but Not Ordinarily Resident',
            desc: 'Based on your answers, you qualify as Resident but Not Ordinarily Resident (RNOR) for tax purposes in FY 2024-25.',
            implications: [
                'Indian income is taxable in India',
                'Foreign income generally not taxable (with some exceptions)',
                'Business income from India is taxable',
                'Transitional status - may become ROR in future years'
            ]
        }
    };

    const info = data[status];
    if (statusBadge) {
        statusBadge.textContent = info.badge;
        statusBadge.className = `status-badge ${info.class}`;
    }
    if (resultTitle) resultTitle.textContent = info.title;
    if (resultDescription) resultDescription.textContent = info.desc;

    taxImplications.innerHTML = info.implications.map(imp => `<li>${imp}</li>`).join('');
}

/**
 * Restart calculator
 */
export function restartCalculator() {
    const calcForm = $id('nri-calculator');
    if (calcForm) {
        calcForm.reset();
        calcForm.style.display = 'block';
    }
    $id('result')?.classList.add('hidden');
    goToStep(1);
}

// Expose to window for inline onclick attributes
window.toggleHelp = toggleHelp;
window.handleStep1 = handleStep1;
window.handleStep2 = handleStep2;
window.handleStep3 = handleStep3;
window.handleStep4 = handleStep4;
window.handleStep5 = handleStep5;
window.handleRNOR = handleRNOR;
window.restartCalculator = restartCalculator;
window.goToStep = goToStep;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    goToStep(1);
});
