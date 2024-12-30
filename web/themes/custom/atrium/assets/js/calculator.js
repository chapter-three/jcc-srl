
(function ($, Drupal) {
  'use strict';

  const globalState = {
    payments: [],
    judgmentAmount: 0,
    judgmentDate: '',
    endDate: '',
    interestRate: 0,
    principalBalance: 0,
    latestDays: 0,
    totalDays: 0,
    totalAmount: 0,
    totalCost: 0,
    principalReduction: 0,
    interestToDate: 0,
    editIndex: null,
    actionButtons: {},
  };

  const resultFields = [
    'resultJudgmentAmount',
    'principalBalance',
    'principalReduction',
    'interestAccrued',
    'totalInterest',
    'costsAfterJudgment',
    'dailyInterest',
    'interestToDate',
    'grandTotal',
    'days',
  ];

  const tableHeaders = [
    'Date',
    'Payment Amount',
    'Cost',
    'Days',
    'Newly Accrued Interest',
    'Unpaid Interest',
    'Interest Reduction',
    'Principal Reduction',
    'Principal Balance',
    'Action',
  ];

  Drupal.behaviors.paymentBehavior = {
    attach: function (context, settings) {
      console.log('[Attach] Initialized payment behavior');
      logGlobalState('attach');

      [processPayment, reset, printResults].forEach((action) => {
        $(context)
          .find(`button[data-toggle="${action.name}"]`)
          .once(action.name)
          .on('click', function (event) {
            if (action.name === "calculate" || action.name === "addPayment") {
              const context = action.name === "calculate" ? "calculate" : "add";
              processPayment(event, context);
            } else {
              action(event);
            }
          });
      });

      // Accordion toggle behavior
      $('.usa-accordion--full')
        .find('button[data-toggle="accordion"]')
        .once('accordion-toggle')
        .on('click', function () {
          toggleAccordion(this);
        });
     
      // Delegate Edit, Update, and Cancel Actions to Table
      $('#paymentTable').once('table-actions').on('click', 'button[data-action]', handleTableActions);
    },
  };


  function processPayment(event, context = "add") {
    if (event) event.preventDefault();
    console.log(`[Action] ${context} triggered`);
  
    syncGlobalStateFromForm();
  
    try {
      getJudgementDetails();
      const { paymentAmount, paymentDate, cost } = getPaymentDetails();
  
      // Validate and add payment for both Add and Calculate
      if (validateAndAddPayment(paymentDate, paymentAmount, cost, context, context, event)) {
        initializeCalculationVariables();
  
        globalState.totalDays = calculateDays(globalState.judgmentDate, globalState.endDate);
  
        processPayments();
        calculateRemainingInterest();
  
        const grandTotal = calculateGrandTotal();
  
        updatePaymentTable(); // Ensure the table reflects updated payments
        populateResults(grandTotal); // Update result fields
  
        toggleOpenIfClosed('button[data-toggle="accordion"]');
      }
    } catch (error) {
      console.error(`[Error] ${context}:`, error.message);
    }
  }
  function logGlobalState(callingFunction) {
    console.log(`\n[Global State Log] Function: ${callingFunction}`);
    console.table(globalState);
  }

  function syncGlobalStateFromForm() {
    globalState.judgmentAmount =
      parseFloat(document.getElementById('judgmentAmount')?.value || 0);
    globalState.interestRate =
      parseFloat(document.getElementById('interestRate')?.value || 0);
  }

  function toggleAccordion(button) {
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    const accordionContentId = button.getAttribute('aria-controls');
    const accordionContent = document.getElementById(accordionContentId);

    if (isExpanded) {
      accordionContent.classList.remove('usa-accordion__content--visible');
      button.setAttribute('aria-expanded', 'false');
    } else {
      accordionContent.classList.add('usa-accordion__content--visible');
      button.setAttribute('aria-expanded', 'true');
    }
  }


  function editRow(index) {
    // Set the edit index and refresh the table to show the editable row
    globalState.editIndex = index;
    console.log("the edit index is ",globalState.editIndex);
    updatePaymentTable();
  }

  function updateRow(index) {
    const paymentDate = document.getElementById(`editPaymentDate-${index}`).value;
    const paymentAmount = parseFloat(document.getElementById(`editPaymentAmount-${index}`).value) || 0;
    const cost = parseFloat(document.getElementById(`editCost-${index}`).value) || 0;

    globalState.payments[index] = {
      paymentDate: new Date(paymentDate),
      paymentAmount,
      cost,
    };

    globalState.editIndex = null;
    updatePaymentTable();
  }

  function cancelEdit() {
    globalState.editIndex = null;
    updatePaymentTable();
  }

  function handleTableActions(event) {
    const { action, index } =event.currentTarget.dataset;
    action === 'edit' ? editRow(eval(index)) : action === 'update' ? updateRow(eval(index)) : cancelEdit();
  }

  function getJudgementDetails(){
    // Parse inputs for judgment details
    globalState.judgmentAmount = parseFloat(document.getElementById('judgmentAmount').value) || 0;
    globalState.interestRate = parseFloat(document.getElementById('interestRate').value) || 0;
    globalState.judgmentDate = document.getElementById('judgmentDate').value;
    globalState.endDate = document.getElementById('endDate').value;
  }

  function getPaymentDetails() {
    const paymentAmount = parseFloat(
      document.getElementById('paymentAmount').value
    ) || 0;
    const paymentDate = document.getElementById('paymentDate').value;
    const cost = parseFloat(document.getElementById('cost')?.value || 0);

    return { paymentAmount, paymentDate, cost };
  }

  function toggleOpenIfClosed(selector) {
    const element = document.querySelector(selector);
    if (element && element.getAttribute('aria-expanded') === 'false') {
        element.click(); // Simulate a click to toggle it open
    }
  }

  // Validation Function
function validateInput(paymentDate, paymentAmount, cost, judgmentDate, endDate, judgmentAmount, context = "add") {
  let isValid = true;
  // Determine field IDs for add or edit mode
  const dateFieldId = context === "add" ? "paymentDate" : `editPaymentDate-${globalState.editIndex}`;
  const amountFieldId = context === "add" ? "paymentAmount" : `editPaymentAmount-${globalState.editIndex}`;
  const costFieldId = context === "add" ? "cost" : `editCost-${globalState.editIndex}`;
  const startDateFieldId = "judgmentDate";
  const endDateFieldId = "endDate";
  const judgmentAmountFieldId = "judgmentAmount";

  // Validate Payment Date
  if (!paymentDate || isNaN(new Date(paymentDate).getTime())) {
    isValid = false;
    console.log("id sent ", dateFieldId)
    addError(dateFieldId, "Payment Date is required.");
  }else{
    clearError(dateFieldId)
  }

  // Validate Payment Amount
  if (!paymentAmount || paymentAmount <= 0) {
    isValid = false;
    addError(amountFieldId, "Payment Amount must be greater than 0.");
  }else{
    clearError(amountFieldId)
  }

  // Validate Start and End Dates
  if (!judgmentDate || !endDate || new Date(endDate) < new Date(judgmentDate)) {
    isValid = false;
    addError(endDateFieldId, "End Date must be greater than or equal to Start Date.");
  } else {
    clearError(endDateFieldId);
  }

  // Validate Judgment Amount
  if (!judgmentAmount || judgmentAmount <= 0) {
    isValid = false;
    addError(judgmentAmountFieldId, "Judgment Amount must be greater than 0.");
  } else {
    clearError(judgmentAmountFieldId);
  }

  // Validate Cost
  if (cost < 0 ) {
    isValid = false;
    addError(costFieldId, "Cost must be greater than 0.");
  }
  else{
    clearError(costFieldId)
  }
  return isValid;
}

function clearError(fieldId){
  const $field = $(`#${fieldId}`);
  $($field ).removeClass('error');
  $($field ).next('.error-message').remove();
}

  // Helper function to add errors and dynamically clear them
  function addError(fieldId, message) {
    const $field = $(`#${fieldId}`); // Dynamically target the field
    console.log("the id is ",fieldId)
    errorMessage = $field.next('.error-message');
    if (!$field.next('.error-message').length) {
      $field.addClass('error'); // Add a visual class for error styling
      $field.after(`<span class="error-message" style="color: red;">${message}</span>`);
    }

    // Clear error dynamically when user inputs valid data
    $field.off('input').on('input', function () {
      if ($(this).val().trim() !== "") {
        $(this).removeClass('error');
        $(this).next('.error-message').remove();
      }
    });
  }

  function renderActionButtons(index ,isEditing){
    const actionButtons = isEditing
     ? `<button type="button" class="usa-button usa-button--primary" data-action="update" data-index="${index}">Update</button>
         <button type="button" class="usa-button usa-button--secondary" data-action="cancel">Cancel</button>`
      : `<button type="button" class="usa-button usa-button--secondary" data-action="edit" data-index="${index}">Edit</button>`;
    globalState.actionButtons =actionButtons
    return actionButtons;
  }

  function validateAndAddPayment(
    paymentDate,
    paymentAmount,
    cost,
    context = 'add',
    callingFunction,
    event = null
  ) {
    if (event) {
      event.preventDefault();
    }

    if (
      validateInput(
        paymentDate,
        paymentAmount,
        cost,
        globalState.judgmentDate,
        globalState.endDate,
        globalState.judgmentAmount,
        context
      )
    ) {
      if (paymentDate && paymentAmount) {
        globalState.payments.push({
          paymentDate: new Date(paymentDate),
          paymentAmount,
          cost,
        });

        updatePaymentTable();
        recalculateTotals();

        if (callingFunction !== 'calculate' && typeof calculate === 'function') {
          calculate(event); // Only if not already in "calculate"
        }

        resetPaymentDetails();
        return true;
      }
    }
    return false;
  }

  function resetPaymentDetails() {
    document.getElementById('paymentDate').value = '';
    document.getElementById('paymentAmount').value = '';
    document.getElementById('cost').value = '';
  }

  function recalculateTotals() {
    globalState.totalAmount = globalState.payments.reduce(
      (sum, payment) => sum + payment.paymentAmount,
      0
    );
    globalState.totalCost = globalState.payments.reduce(
      (sum, payment) => sum + payment.cost,
      0
    );
  }

  function initializeCalculationVariables() {
    globalState.totalDays = 0;
    globalState.interestToDate = 0;
    globalState.principalReduction = 0;
    globalState.principalBalance = globalState.judgmentAmount;
  }

  function calculateDays(startDate, endDate) {
    return Math.round(
      (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
    );
  }

  function processPayments() {
    let lastDate = globalState.judgmentDate;

    globalState.payments.forEach((payment) => {
      const days = calculateDays(lastDate, payment.paymentDate);

      if (days < 0) {
        alert('Payment date cannot be before the last calculated date.');
        return;
      }

      const dailyInterest =
        (globalState.principalBalance * (globalState.interestRate / 100)) / 365;
      const accruedInterest = dailyInterest * days;

      const interestReduction = Math.min(accruedInterest, payment.paymentAmount);
      const principalReduction = Math.max(
        0,
        payment.paymentAmount - interestReduction
      );

      globalState.principalReduction += principalReduction;
      globalState.interestToDate += accruedInterest;
      globalState.principalBalance = Math.max(
        0,
        globalState.judgmentAmount - globalState.principalReduction
      );

      lastDate = payment.paymentDate;
    });
  }

  function calculateRemainingInterest() {
    const lastPaymentDate =
      globalState.payments.length > 0
        ? globalState.payments[globalState.payments.length - 1].paymentDate
        : globalState.judgmentDate;

    const daysFromLastPayment = calculateDays(
      lastPaymentDate,
      globalState.endDate
    );

    if (daysFromLastPayment > 0) {
      const dailyInterest =
        (globalState.principalBalance * (globalState.interestRate / 100)) / 365;
      const finalAccruedInterest = dailyInterest * daysFromLastPayment;

      globalState.interestToDate += finalAccruedInterest;
    }
  }

  function calculateGrandTotal() {
    const costsAfterJudgment = globalState.totalCost || 0;
    return (
      globalState.principalBalance + costsAfterJudgment + globalState.interestToDate
    );
  }

  function updateResults() {
    const grandTotal = calculateGrandTotal();
    populateResults(grandTotal);
  }

  function populateResults(grandTotal) {
    const resultItems = [
      { id: 'resultJudgmentAmount', value: globalState.judgmentAmount.toFixed(2) },
      { id: 'principalBalance', value: globalState.principalBalance.toFixed(2) },
      { id: 'principalReduction', value: globalState.principalReduction.toFixed(2) },
      { id: 'costsAfterJudgment', value: (globalState.totalCost || 0).toFixed(2) },
      { id: 'dailyInterest', value: ((globalState.principalBalance * (globalState.interestRate / 100)) / 365).toFixed(4) },
      { id: 'interestAccrued', value: globalState.interestToDate.toFixed(2) },
      { id: 'interestToDate', value: globalState.interestToDate.toFixed(2) },
      { id: 'totalInterest', value: globalState.interestToDate.toFixed(2) },
      { id: 'days', value: globalState.totalDays },
      { id: 'grandTotal', value: grandTotal.toFixed(2) },
    ];

    resultItems.forEach((item) => {
      document.getElementById(item.id).innerHTML =
        item.id === 'days' ? item.value : `$${item.value}`;
    });
  }

  function updatePaymentTable() {
    const table = document.getElementById('paymentTable');
    const tbody = table.querySelector('tbody');
    const headerRow = tableHeaders.map((header) => `<th>${header}</th>`).join('');

    tbody.innerHTML = `
      <thead>
        <tr>${headerRow}</tr>
      </thead>
      ${generateTableRows(globalState.payments, true, true)}
    `;
  }

  function generateTableRows(payments, isEditable = false, printAction = true) {
    let principalBalance = globalState.judgmentAmount || 0;
    let lastDate = new Date(document.getElementById('judgmentDate')?.value) || 0;

    return payments
      .map((payment, index) => {
        const isEditing = globalState.editIndex === index;
        const days = Math.round(
          (payment.paymentDate - lastDate) / (1000 * 60 * 60 * 24)
        );
        const dailyInterest =
          (principalBalance * (globalState.interestRate / 100)) / 365;
        const newlyAccruedInterest = dailyInterest * days;
        const interestReduction = Math.min(
          newlyAccruedInterest,
          payment.paymentAmount
        );
        const principalReduction =
          payment.paymentAmount - interestReduction;
        principalBalance -= principalReduction;
        lastDate = payment.paymentDate;
        const paymentDate = formatDateToMMDDYYYY(
          payment.paymentDate.toISOString().split('T')[0]
        );
        const actionColumn = printAction
          ? `<td>${isEditable ? renderActionButtons(index, isEditing) : ''}</td>`
          : '';

        return `
          <tr>
            <td>${isEditing
                ? `<input type="date" id="editPaymentDate-${index}" value="${payment.paymentDate
                    .toISOString()
                    .split('T')[0]}">`
                : paymentDate}</td>
            <td>${isEditing
                ? `<input type="number" id="editPaymentAmount-${index}" value="${payment.paymentAmount.toFixed(2)}">`
                : `$${payment.paymentAmount.toFixed(2)}`}</td>
            <td>${isEditing
                ? `<input type="number" id="editCost-${index}" value="${payment.cost.toFixed(2)}">`
                : `$${payment.cost.toFixed(2)}`}</td>
            <td>${days}</td>
            <td>${newlyAccruedInterest.toFixed(2)}</td>
            <td>${0}</td>
            <td>${interestReduction.toFixed(2)}</td>
            <td>${principalReduction.toFixed(2)}</td>
            <td>${principalBalance.toFixed(2)}</td>
            ${actionColumn}
          </tr>
        `;
      })
      .join('');
  }

  function formatDateToMMDDYYYY(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${month}/${day}/${year}`;
  }

  function reset(event) {
    if (event) {
      event.preventDefault();
    }
  
    // Clear all input fields
    document.querySelectorAll('input').forEach((input) => {
      input.value = '';
    });
  
    // Clear the payment table
    const paymentTableBody = document.getElementById('paymentTable').querySelector('tbody');
    paymentTableBody.innerHTML = '';
  
    // Reset global state
    Object.keys(globalState).forEach((key) => {
      if (Array.isArray(globalState[key])) {
        globalState[key] = [];
      } else if (typeof globalState[key] === 'object') {
        globalState[key] = {};
      } else {
        globalState[key] = 0;
      }
    });
  
    // Clear result fields
    resultFields.forEach((fieldId) => {
      const field = document.getElementById(fieldId);
      if (field) {
        field.innerHTML = '';
      }
    });
  
    console.log('[Reset] Application state and form have been reset.');
  }
function printResults(event) {
  if (event) event.preventDefault();

  console.log("Global state at print level:", globalState);

  // Extract relevant global state properties
  const {
    payments,
    judgmentAmount,
    judgmentDate,
    endDate,
    principalBalance,
    interestRate,
  } = globalState;

  // Judgment Information Section with two-column layout
  const judgmentInfo = `
    <h2 class="usa-heading judgment-title">Judgment Calculator</h2>
    <div class="judgment-information">
      <div class="column">
        <p><strong>Judgment Amount:</strong> $${judgmentAmount.toFixed(2)}</p>
        <p><strong>Interest Rate:</strong> ${interestRate}%</p>
      </div>
      <div class="column">
        <p><strong>Judgment Date:</strong> ${formatDateToMMDDYYYY(judgmentDate)}</p>
        <p><strong>End Date:</strong> ${formatDateToMMDDYYYY(endDate)}</p>
      </div>
    </div>
  `;

  // Generate Table Section
  const tableHeadersHTML = tableHeaders
    .filter((header) => header !== "Action")
    .map((header) => `<th>${header}</th>`)
    .join("");

  const tableHTML = `
    <div class="usa-table-container">
      <table class="usa-table usa-table--borderless">
        <thead>
          <tr>${tableHeadersHTML}</tr>
        </thead>
        <tbody>${generateTableRows(payments, false, false)}</tbody>
      </table>
    </div>
  `;

  // Results Section
  const resultContent = document.getElementById("resultBox").outerHTML;

  // Combine all sections for the print content
  const printContent = `
    ${judgmentInfo}
    ${tableHTML}
    ${resultContent}
  `;

  // Open a new window and write the print content
  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Print Judgment Calculator</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/uswds@3.x.x/css/uswds.min.css">
        <style>
          body {
            font-family: 'Source Sans Pro', Arial, sans-serif;
            margin: 20px;
            padding: 20px;
          }
          .judgment-title {
            text-align: center;
            font-size: 1.8em;
            margin-bottom: 20px;
          }
          .judgment-information {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
          }
          .judgment-information .column p {
            margin: 5px 0;
          }
          .usa-table-container {
            margin-bottom: 30px;
          }
          .usa-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          .usa-table th,
          .usa-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          .usa-table th {
            background-color: #f4f4f4;
          }
          .result-column {
            display: inline-grid;
            grid-template-rows: 1fr 1fr 1fr 1fr;
            gap: 20px;
            grid-auto-flow: column;
          }
          .result-item {
            padding: 10px;
          }
        </style>
      </head>
      <body>
        ${printContent}
      </body>
    </html>
  `);

  // Close and print the window
  printWindow.document.close();
  printWindow.print();
}
  
})(jQuery, Drupal);
