
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('google_token');
    if (!token) {
        alert('You must sign in with Google before editing.');
        window.location.href = 'index.html';
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const claimNumber = urlParams.get('claimNumber');
    const data = await getSheetData('Pool Pro Live - Form Submissions');
    const headers = data[0];
    const rows = data.slice(1);
    const entry = rows.find(row => row[0] === claimNumber);

    if (!entry) {
        alert('Entry not found.');
        return;
    }

    const form = document.getElementById('edit-form');

    headers.forEach((header, index) => {
        const value = entry[index] || '';
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';

        const label = document.createElement('label');
        label.setAttribute('for', header);
        label.textContent = header;

        const input = document.createElement('input');
        input.className = 'form-control';
        input.id = header;
        input.name = header;
        input.value = value;

        if (header === 'ClaimNumber') {
            input.readOnly = true;
        }

        formGroup.appendChild(label);
        formGroup.appendChild(input);
        form.insertBefore(formGroup, form.lastElementChild);
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const updatedValues = headers.map(header => document.getElementById(header).value);
        const rowIndex = rows.findIndex(row => row[0] === claimNumber) + 2;
        const range = `Pool Pro Live - Form Submissions!A${rowIndex}`;
        try {
            await updateSheetData(range, [updatedValues]);
            alert('Changes saved successfully!');
        } catch (error) {
            alert('Failed to update. Please ensure you are signed in and authorized.');
            console.error(error);
        }
    });
});
