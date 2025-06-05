
document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    const statusTitle = document.getElementById('status-title');
    const requestsTable = document.getElementById('requests-list');//.getElementsByTagName('tbody')[0];
    const data = await getSheetData('Pool Pro Live - Form Submissions');
    const filteredData = data.find(row => row[1] === status);

console.log("Status param=");
console.log(status);

    if (statusTitle) {
        statusTitle.textContent = status;
    } else {
        console.error("Element with ID 'Status' not found.");
    }

//if (typeof status === "string" && status.length === 0){
//    data.filter(row => row[1] === status).forEach(row => {
if (status === null) {
    data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row[0]}</td>
            <td>${row[1]}</td>
            <td>${row[2]}</td>
            <td>${row[3]}</td>
	    <td>${row[4]}</td>
	    <td><a href="edit.html?claimNumber=${row[0]}">Edit</a></td>
        `;
        tr.addEventListener('click', () => {
            window.location.href = `edit.html?claimNumber=${row[0]}`;
        });
        requestsTable.appendChild(tr);
    });
} else {
    data.filter(row => row[1] === status).forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row[0]}</td>
            <td>${row[1]}</td>
            <td>${row[2]}</td>
            <td>${row[3]}</td>
	    <td>${row[4]}</td>
	    <td><a href="edit.html?claimNumber=${row[0]}">Edit</a></td>
        `;
        tr.addEventListener('click', () => {
            window.location.href = `edit.html?claimNumber=${row[0]}`;
        });
        requestsTable.appendChild(tr);
    });
};
});
