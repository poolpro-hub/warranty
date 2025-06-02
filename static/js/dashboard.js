
document.addEventListener('DOMContentLoaded', async () => {
    const statuses = ['New', 'Viewed', 'In Progress', 'Rejected', 'Complete'];
    const data = await getSheetData('Pool Pro Live - Form Submissions');
    const rows = data.slice(1); // Skip header row

    const counts = {
        New: 0,
        Viewed: 0,
        Investigating: 0,
        Rejected: 0,
        Actioning: 0,
        Complete: 0
    };

    rows.forEach(row => {
        const status = row[1]; // Assuming status is in column D (index 3)
        if (counts[status] !== undefined) {
            counts[status]++;
        }
    });

    document.getElementById('new-requests-count').textContent = counts.New;
    document.getElementById('viewed-count').textContent = counts.Viewed;
    document.getElementById('investigating-count').textContent = counts.Investigating;
    document.getElementById('rejected-count').textContent = counts.Rejected;
    document.getElementById('actioning-count').textContent = counts.Actioning;
    document.getElementById('complete-count').textContent = counts.Complete;
});

