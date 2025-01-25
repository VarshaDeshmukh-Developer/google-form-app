"use strict";
var _a, _b, _c, _d, _e, _f;
let formFields = loadFormStructure();
// Add event listeners for buttons
(_a = document.getElementById('add-text')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', addTextField);
(_b = document.getElementById('add-radio')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', addRadioButton);
(_c = document.getElementById('add-checkbox')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', addCheckbox);
(_d = document.getElementById('clear-form')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', clearForm);
(_e = document.getElementById('submit-form')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', submitForm);
(_f = document.getElementById('export-csv')) === null || _f === void 0 ? void 0 : _f.addEventListener('click', exportCSV);
// Render form fields based on formFields array
function renderForm() {
    const formContainer = document.getElementById('dynamic-form');
    formContainer.innerHTML = ''; // Clear existing form fields
    formFields.forEach((field, index) => {
        const fieldElement = document.createElement('div');
        const labelElement = document.createElement('label');
        labelElement.textContent = field.label;
        fieldElement.appendChild(labelElement);
        if (field.type === 'text') {
            const input = document.createElement('input');
            input.type = 'text';
            input.id = field.id;
            input.required = field.required;
            fieldElement.appendChild(input);
        }
        else if (field.type === 'radio' && field.options) {
            field.options.forEach((option, optionIndex) => {
                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.id = `${field.id}-${optionIndex}`;
                radio.name = field.id;
                radio.value = option;
                const radioLabel = document.createElement('label');
                radioLabel.textContent = option;
                fieldElement.appendChild(radio);
                fieldElement.appendChild(radioLabel);
            });
        }
        else if (field.type === 'checkbox' && field.options) {
            field.options.forEach((option, optionIndex) => {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `${field.id}-${optionIndex}`;
                checkbox.name = field.id;
                checkbox.value = option;
                const checkboxLabel = document.createElement('label');
                checkboxLabel.textContent = option;
                fieldElement.appendChild(checkbox);
                fieldElement.appendChild(checkboxLabel);
            });
        }
        // Add Edit and Delete buttons
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.onclick = () => editField(index);
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteField(index);
        fieldElement.appendChild(editButton);
        fieldElement.appendChild(deleteButton);
        formContainer.appendChild(fieldElement);
    });
}
// Add Text Field
function addTextField() {
    const label = prompt("Enter label for the text field:") || '';
    const required = confirm("Is this field required?");
    if (label) {
        const id = `text-${Date.now()}`;
        formFields.push({ id, type: 'text', label, required });
        saveFormStructure();
        renderForm();
    }
}
// Add Radio Button Field
function addRadioButton() {
    var _a;
    const label = prompt("Enter label for the radio button field:") || '';
    const options = ((_a = prompt("Enter options (comma-separated):")) === null || _a === void 0 ? void 0 : _a.split(',')) || [];
    if (label && options.length > 0) {
        const id = `radio-${Date.now()}`;
        formFields.push({ id, type: 'radio', label, options, required: false });
        saveFormStructure();
        renderForm();
    }
}
// Add Checkbox Field
function addCheckbox() {
    var _a;
    const label = prompt("Enter label for the checkbox field:") || '';
    const options = ((_a = prompt("Enter options (comma-separated):")) === null || _a === void 0 ? void 0 : _a.split(',')) || [];
    if (label && options.length > 0) {
        const id = `checkbox-${Date.now()}`;
        formFields.push({ id, type: 'checkbox', label, options, required: false });
        saveFormStructure();
        renderForm();
    }
}
// Edit Field
function editField(index) {
    const field = formFields[index];
    const newLabel = prompt("Enter new label for the field:", field.label) || field.label;
    const newRequired = confirm("Make this field required?") || field.required;
    formFields[index].label = newLabel;
    formFields[index].required = newRequired;
    saveFormStructure();
    renderForm();
}
// Delete Field
function deleteField(index) {
    formFields.splice(index, 1);
    saveFormStructure();
    renderForm();
}
// Clear Form
function clearForm() {
    const formContainer = document.getElementById('dynamic-form');
    formFields.forEach(field => {
        if (field.type === 'text') {
            const input = document.getElementById(field.id);
            if (input)
                input.value = ''; // Clear text inputs
        }
        else if (field.type === 'radio') {
            const radios = document.getElementsByName(field.id);
            radios.forEach(radio => {
                radio.checked = false; // Uncheck radio buttons
            });
        }
        else if (field.type === 'checkbox') {
            const checkboxes = document.getElementsByName(field.id);
            checkboxes.forEach(checkbox => {
                checkbox.checked = false; // Uncheck checkboxes
            });
        }
    });
    // Clear the responses from localStorage
    localStorage.removeItem('formResponses');
    // Optionally, also clear the response display in the UI
    const responseDisplay = document.getElementById('response-display');
    responseDisplay.textContent = '';
}
// Submit Form
function submitForm() {
    const formData = {};
    formFields.forEach(field => {
        if (field.type === 'text') {
            const input = document.getElementById(field.id);
            if (input)
                formData[field.label] = input.value;
        }
        else if (field.type === 'radio') {
            const radios = document.getElementsByName(field.id);
            radios.forEach(radio => {
                if (radio.checked) {
                    formData[field.label] = radio.value;
                }
            });
        }
        else if (field.type === 'checkbox') {
            const checkboxes = document.getElementsByName(field.id);
            const checkedValues = [];
            checkboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    checkedValues.push(checkbox.value);
                }
            });
            formData[field.label] = checkedValues;
        }
    });
    console.log('Form Data Submitted:', formData);
    alert('Form submitted!');
    saveFormResponses(formData);
    displayResponses();
}
// Save Form Structure to LocalStorage
function saveFormStructure() {
    localStorage.setItem('formFields', JSON.stringify(formFields));
}
// Load Form Structure from LocalStorage
function loadFormStructure() {
    const savedFormFields = localStorage.getItem('formFields');
    return savedFormFields ? JSON.parse(savedFormFields) : [];
}
// Save Form Responses to LocalStorage
function saveFormResponses(formData) {
    const responses = JSON.parse(localStorage.getItem('formResponses') || '[]');
    responses.push(formData);
    localStorage.setItem('formResponses', JSON.stringify(responses));
}
// Display Form Responses
function displayResponses() {
    const responses = JSON.parse(localStorage.getItem('formResponses') || '[]');
    const responseDisplay = document.getElementById('response-display');
    responseDisplay.textContent = JSON.stringify(responses, null, 2);
}
// Export CSV
function exportCSV() {
    const responses = JSON.parse(localStorage.getItem('formResponses') || '[]');
    const csvContent = "data:text/csv;charset=utf-8," +
        "Label,Response\n" +
        responses.map((response) => Object.keys(response).map(key => `${key},${response[key]}`).join('\n')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "form_responses.csv");
    link.click();
}
renderForm();
