
// list.js - Enhanced with sorting and filtering

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const status = params.get('status');
  const infield = params.get('infield');

  document.getElementById('page-title').textContent = `Warranty Requests - ${status}`;

  let currentSort = { column: 'submissiondate', ascending: false };

  async function fetchAndRenderTable() {
    const tbody = document.getElementById('requests-table-body');
    tbody.innerHTML = '';

    let query = supabase
      .from('tblwarranty')
      .select('claimnumber, claimrequestedbyshopname, nameofenduser, equipmenttype, submissiondate, status, infield')
      .order(currentSort.column, { ascending: currentSort.ascending });

    if (status !== null) query = query.eq('status', status);
    if (infield !== null) query = query.eq('infield', infield);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching data:', error.message);
      return;
    }

    data.forEach(entry => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><a href="edit.html?claimnumber=${encodeURIComponent(entry.claimnumber)}">${entry.claimnumber}</a></td>
        <td>${entry.infield || ''}</td>
        <td>${entry.claimrequestedbyshopname || ''}</td>
        <td>${entry.nameofenduser || ''}</td>
        <td>${entry.equipmenttype || ''}</td>
        <td>${entry.submissiondate ? new Date(entry.submissiondate).toLocaleDateString('en-GB') : ''}</td>
        <td><strong>${entry.status}</strong></td>
      `;
      tbody.appendChild(row);
    });
  }

  // Setup sorting on table headers
  document.querySelectorAll('th[data-column]').forEach(header => {
    header.style.cursor = 'pointer';
    header.addEventListener('click', () => {
      const column = header.getAttribute('data-column');
      if (currentSort.column === column) {
        currentSort.ascending = !currentSort.ascending;
      } else {
        currentSort = { column, ascending: true };
      }
      fetchAndRenderTable();
    });
  });

  // Initial table render
  fetchAndRenderTable();
});
