interface FormField {
    id: string;
    type: string;
    label: string;
    options?: string[];
    required: boolean;
}

let formFields: FormField[] = loadFormStructure();

// Add event listeners for buttons
document.getElementById('add-text')?.addEventListener('click', addTextField);
document.getElementById('add-radio')?.addEventListener('click', addRadioButton);
document.getElementById('add-checkbox')?.addEventListener('click', addCheckbox);
document.getElementById('clear-form')?.addEventListener('click', clearForm);
document.getElementById('submit-form')?.addEventListener('click', submitForm);
document.getElementById('export-csv')?.addEventListener('click', exportCSV);

// Render form fields based on formFields array
function renderForm() {
    const formContainer = document.getElementById('dynamic-form')!;
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
        } else if (field.type === 'radio' && field.options) {
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
        } else if (field.type === 'checkbox' && field.options) {
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
    const label = prompt("Enter label for the radio button field:") || '';
    const options = prompt("Enter options (comma-separated):")?.split(',') || [];
    if (label && options.length > 0) {
        const id = `radio-${Date.now()}`;
        formFields.push({ id, type: 'radio', label, options, required: false });
        saveFormStructure();
        renderForm();
    }
}

// Add Checkbox Field
function addCheckbox() {
    const label = prompt("Enter label for the checkbox field:") || '';
    const options = prompt("Enter options (comma-separated):")?.split(',') || [];
    if (label && options.length > 0) {
        const id = `checkbox-${Date.now()}`;
        formFields.push({ id, type: 'checkbox', label, options, required: false });
        saveFormStructure();
        renderForm();
    }
}

// Edit Field
function editField(index: number) {
    const field = formFields[index];
    const newLabel = prompt("Enter new label for the field:", field.label) || field.label;
    const newRequired = confirm("Make this field required?") || field.required;
    formFields[index].label = newLabel;
    formFields[index].required = newRequired;
    saveFormStructure();
    renderForm();
}

// Delete Field
function deleteField(index: number) {
    formFields.splice(index, 1);
    saveFormStructure();
    renderForm();
}

// Clear Form
function clearForm() {
    const formContainer = document.getElementById('dynamic-form')!;
    formFields.forEach(field => {
        if (field.type === 'text') {
            const input = document.getElementById(field.id) as HTMLInputElement;
            if (input) input.value = ''; // Clear text inputs
        } else if (field.type === 'radio') {
            const radios = document.getElementsByName(field.id) as NodeListOf<HTMLInputElement>;
            radios.forEach(radio => {
                radio.checked = false; // Uncheck radio buttons
            });
        } else if (field.type === 'checkbox') {
            const checkboxes = document.getElementsByName(field.id) as NodeListOf<HTMLInputElement>;
            checkboxes.forEach(checkbox => {
                checkbox.checked = false; // Uncheck checkboxes
            });
        }
    });

    // Clear the responses from localStorage
    localStorage.removeItem('formResponses');

    // Optionally, also clear the response display in the UI
    const responseDisplay = document.getElementById('response-display')!;
    responseDisplay.textContent = '';
}

// Submit Form
function submitForm() {
    const formData: { [key: string]: any } = {};

    formFields.forEach(field => {
        if (field.type === 'text') {
            const input = document.getElementById(field.id) as HTMLInputElement;
            if (input) formData[field.label] = input.value;
        } else if (field.type === 'radio') {
            const radios = document.getElementsByName(field.id) as NodeListOf<HTMLInputElement>;
            radios.forEach(radio => {
                if (radio.checked) {
                    formData[field.label] = radio.value;
                }
            });
        } else if (field.type === 'checkbox') {
            const checkboxes = document.getElementsByName(field.id) as NodeListOf<HTMLInputElement>;
            const checkedValues :any= [];
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
function loadFormStructure(): FormField[] {
    const savedFormFields = localStorage.getItem('formFields');
    return savedFormFields ? JSON.parse(savedFormFields) : [];
}

// Save Form Responses to LocalStorage
function saveFormResponses(formData: { [key: string]: any }) {
    const responses = JSON.parse(localStorage.getItem('formResponses') || '[]');
    responses.push(formData);
    localStorage.setItem('formResponses', JSON.stringify(responses));
}

// Display Form Responses
function displayResponses() {
    const responses = JSON.parse(localStorage.getItem('formResponses') || '[]');
    const responseDisplay = document.getElementById('response-display')!;
    responseDisplay.textContent = JSON.stringify(responses, null, 2);
}

// Export CSV
function exportCSV() {
    const responses = JSON.parse(localStorage.getItem('formResponses') || '[]');
    const csvContent = "data:text/csv;charset=utf-8," + 
        "Label,Response\n" + 
        responses.map((response: any) => 
            Object.keys(response).map(key => `${key},${response[key]}`).join('\n')
        ).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "form_responses.csv");
    link.click();
}

renderForm();
