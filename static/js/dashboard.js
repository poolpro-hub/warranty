
document.addEventListener('DOMContentLoaded', async () => {
    const statuses = ['New', 'Viewed', 'Progress', 'Rejected', 'Complete'];
    const data = await getSheetData('Pool Pro Live - Form Submissions');
    const rows = data.slice(1); // Skip header row

    const counts = {
        New: 0,
        Viewed: 0,
        Progress: 0,
        Rejected: 0,
        Complete: 0
    };

    rows.forEach(row => {
        const status = row[3]; // Assuming status is in column D (index 3)
        if (counts[status] !== undefined) {
            counts[status]++;
        }
    });

    document.getElementById('new-requests-count').textContent = counts.New;
    document.getElementById('viewed-count').textContent = counts.Viewed;
    document.getElementById('investigating-count').textContent = counts.Progress;
    document.getElementById('rejected-count').textContent = counts.Rejected;
    document.getElementById('complete-count').textContent = counts.Complete;
});
