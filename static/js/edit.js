document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const claimNumber = urlParams.get('claimNumber');
    const editForm = document.getElementById('edit-form');
    const data = await getSheetData('Pool Pro Live - Form Submissions');
    const entry = data.find(row => row[0] === claimNumber);
    const header1 = data[0];


//    entry.forEach((value, index) => {
//        const formGroup = document.createElement('div');
//        formGroup.className = 'form-group';
//        formGroup.innerHTML = `
//            <label for="field-${index}">${header1[index]}</label>
//            <input type="text" class="form-control" id="field-${index}" value="${value}">
//        `;
//        editForm.insertBefore(formGroup, editForm.lastElementChild);
//    });


    entry.forEach((header, index) => {
        const value = entry[index] || '';
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';

        const label = document.createElement('label');
        label.setAttribute('for', header1[index]);
        label.textContent = header1[index];

        const input = document.createElement('input');
        input.className = 'form-control';
        input.id = header1[index];
        input.name = header1[index];
        input.value = value;

        // Make ClaimNumber read-only
        if (header1[index] === 'ClaimNumber') {
            input.readOnly = true;
        }

        formGroup.appendChild(label);
        formGroup.appendChild(input);
        editForm.insertBefore(formGroup, editForm.lastElementChild);
    });

    editForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const updatedValues = Array.from(editForm.elements).map(input => input.value);
        await updateSheetData(`Pool Pro Live - Form Submissions!A${entry[0]}:Z${entry[0]}`, [updatedValues]);
        alert('Changes saved successfully!');
    });
});
