// js/list.js
document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const status = params.get('status');

  document.getElementById('page-title').textContent = `Warranty Requests - ${status}`;

  const { data, error } = await supabase
    .from('tblWarranty')
    .select('ClaimNumber, ClaimRequestedByShopName, NameOfEndUser, EquipmentType, SubmissionDate, Status')
    .eq('Status', status)
    .order('SubmissionDate', { ascending: false });

  if (error) {
    console.error('Error fetching data:', error.message);
    return;
  }

  const tbody = document.getElementById('requests-table-body');
  data.forEach(entry => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><a href="edit.html?claim=${encodeURIComponent(entry.ClaimNumber)}">${entry.ClaimNumber}</a></td>
      <td>${entry.ClaimRequestedByShopName || ''}</td>
      <td>${entry.NameOfEndUser || ''}</td>
      <td>${entry.EquipmentType || ''}</td>
      <td>${entry.SubmissionDate ? new Date(entry.SubmissionDate).toLocaleDateString() : ''}</td>
      <td>${entry.Status}</td>
    `;
    tbody.appendChild(row);
  });
});
