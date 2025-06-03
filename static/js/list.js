
document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const statusFilter = urlParams.get('status');
    const data = await getSheetData('Pool Pro Live - Form Submissions');
    const headers = data[0];
    const rows = data.slice(1);
    const tableBody = document.getElementById('requests-list');

    const filteredRows = statusFilter
        ? rows.filter(row => row[3] === statusFilter)
        : rows;

    filteredRows.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row[0]}</td>
            <td>${row[1]}</td>
            <td>${row[2]}</td>
            <td>${row[3]}</td>
            <td><a href="edit.html?claimNumber=${row[0]}" class="btn btn-sm btn-primary">Edit</a></td>
        `;
        tableBody.appendChild(tr);
    });
});
