/**
 * NRI Status Calculator Logic (Yes/No Version)
 * Based on Section 6 of the Income Tax Act, 1961
 */

// Toggle terminology help
function toggleHelp() {
    const helpContent = document.getElementById('help-content');
    helpContent.classList.toggle('show');
}

// Navigation helper
function goToStep(step) {
    document.querySelectorAll('.calc-step').forEach(s => s.classList.remove('active'));
    document.querySelector(`[data-step="${step}"]`).classList.add('active');
}

function getSelectedValue(name) {
    const selected = document.querySelector(`input[name="${name}"]:checked`);
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
function handleStep1() {
    if (!validateSelection('q1-182-days')) return;

    const stayed182Days = getSelectedValue('q1-182-days');

    if (stayed182Days) {
        // 182+ days = Resident, go to RNOR check
        goToStep(6);
    } else {
        // Less than 182 days, check citizenship
        goToStep(2);
    }
}

function handleStep2() {
    if (!validateSelection('q2-citizen-abroad')) return;

    const isCitizenAbroad = getSelectedValue('q2-citizen-abroad');

    if (isCitizenAbroad) {
        // Indian citizen/PIO abroad - check high income
        goToStep(4);
    } else {
        // Not citizen abroad - check 60+365 rule
        goToStep(3);
    }
}

function handleStep3() {
    if (!validateSelection('q3-60-365')) return;

    const meets60_365 = getSelectedValue('q3-60-365');

    if (meets60_365) {
        // 60 days + 365 days = Resident
        goToStep(6);
    } else {
        // NRI
        showResult('NRI');
    }
}

function handleStep4() {
    if (!validateSelection('q4-high-income')) return;

    const hasHighIncome = getSelectedValue('q4-high-income');

    if (hasHighIncome) {
        // High income - 120 day threshold applies
        goToStep(5);
    } else {
        // Low income citizen abroad - NRI (182 day exception applies, and they already said <182)
        showResult('NRI');
    }
}

function handleStep5() {
    if (!validateSelection('q5-120-365')) return;

    const meets120_365 = getSelectedValue('q5-120-365');

    if (meets120_365) {
        // 120 days + 365 days = Resident
        goToStep(6);
    } else {
        // NRI
        showResult('NRI');
    }
}

function handleRNOR() {
    if (!validateSelection('q6-nri-9-years') || !validateSelection('q6-729-days')) return;

    const nri9Years = getSelectedValue('q6-nri-9-years');
    const under729Days = getSelectedValue('q6-729-days');

    // RNOR if either condition is true
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
    // Hide form
    document.getElementById('nri-calculator').style.display = 'none';

    // Show result
    const resultContainer = document.getElementById('result');
    resultContainer.classList.remove('hidden');

    const statusBadge = document.getElementById('status-badge');
    const resultTitle = document.getElementById('result-title');
    const resultDescription = document.getElementById('result-description');
    const taxImplications = document.getElementById('tax-implications');

    // Clear previous
    taxImplications.innerHTML = '';

    switch (status) {
        case 'NRI':
            statusBadge.textContent = 'NRI';
            statusBadge.className = 'status-badge nri';
            resultTitle.textContent = 'You are a Non-Resident Indian';
            resultDescription.textContent = 'Based on your answers, you qualify as a Non-Resident Indian (NRI) for tax purposes in FY 2024-25.';
            taxImplications.innerHTML = `
                <li>Only income earned or received in India is taxable</li>
                <li>Foreign income is not taxable in India</li>
                <li>Can maintain NRE/NRO bank accounts</li>
                <li>Special investment options available (NRI FDs, etc.)</li>
            `;
            break;

        case 'ROR':
            statusBadge.textContent = 'ROR';
            statusBadge.className = 'status-badge ror';
            resultTitle.textContent = 'You are a Resident and Ordinarily Resident';
            resultDescription.textContent = 'Based on your answers, you qualify as Resident and Ordinarily Resident (ROR) for tax purposes in FY 2024-25.';
            taxImplications.innerHTML = `
                <li>Your global income is taxable in India</li>
                <li>Must report foreign assets and income</li>
                <li>Standard resident tax slabs apply</li>
                <li>Must maintain resident savings accounts</li>
            `;
            break;

        case 'RNOR':
            statusBadge.textContent = 'RNOR';
            statusBadge.className = 'status-badge rnor';
            resultTitle.textContent = 'You are Resident but Not Ordinarily Resident';
            resultDescription.textContent = 'Based on your answers, you qualify as Resident but Not Ordinarily Resident (RNOR) for tax purposes in FY 2024-25.';
            taxImplications.innerHTML = `
                <li>Indian income is taxable in India</li>
                <li>Foreign income generally not taxable (with some exceptions)</li>
                <li>Business income from India is taxable</li>
                <li>Transitional status - may become ROR in future years</li>
            `;
            break;
    }
}

/**
 * Restart calculator
 */
function restartCalculator() {
    // Reset form
    document.getElementById('nri-calculator').reset();

    // Show form, hide result
    document.getElementById('nri-calculator').style.display = 'block';
    document.getElementById('result').classList.add('hidden');

    // Go back to step 1
    goToStep(1);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    goToStep(1);
});
