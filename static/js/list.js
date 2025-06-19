
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const status = params.get('status');
  const infield = params.get('infield');

  let currentSort = { column: 'submissiondate', ascending: false };
  let currentPage = 1;
  let rowsPerPage = 10;
  let allData = [];

  const tbody = document.getElementById('requests-table-body');
  const searchInput = document.getElementById('searchInput');
  const rowsPerPageSelect = document.getElementById('rowsPerPage');
  const pageInfo = document.getElementById('pageInfo');
  const prevPageBtn = document.getElementById('prevPage');
  const nextPageBtn = document.getElementById('nextPage');
  const exportBtn = document.getElementById('exportBtn');
  
  if (status !== null) {
	  document.getElementById('page-title').textContent = `Warranty Requests - ${status}`;
  } else {
	  document.getElementById('page-title').textContent = `Warranty Requests`;
  };

  async function fetchData() {
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

    allData = data;
    currentPage = 1;
    renderTable();
  }

  function renderTable() {
    const keyword = searchInput.value.toLowerCase();
    const filteredData = allData.filter(entry =>
      Object.values(entry).some(val =>
        (val || '').toString().toLowerCase().includes(keyword)
      )
    );

    const start = (currentPage - 1) * rowsPerPage;
    const paginatedData = filteredData.slice(start, start + rowsPerPage);

    tbody.innerHTML = '';
    paginatedData.forEach(entry => {
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

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
  }

  document.querySelectorAll('th[data-column]').forEach(header => {
    header.style.cursor = 'pointer';
    header.addEventListener('click', () => {
      const column = header.getAttribute('data-column');
      if (currentSort.column === column) {
        currentSort.ascending = !currentSort.ascending;
      } else {
        currentSort = { column, ascending: true };
      }
      fetchData();
    });
  });

  searchInput.addEventListener('input', () => {
    currentPage = 1;
    renderTable();
  });

  rowsPerPageSelect.addEventListener('change', () => {
    rowsPerPage = parseInt(rowsPerPageSelect.value, 10);
    currentPage = 1;
    renderTable();
  });

  prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderTable();
    }
  });

  nextPageBtn.addEventListener('click', () => {
    const keyword = searchInput.value.toLowerCase();
    const filteredData = allData.filter(entry =>
      Object.values(entry).some(val =>
        (val || '').toString().toLowerCase().includes(keyword)
      )
    );
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderTable();
    }
  });

  exportBtn.addEventListener('click', () => {
    const keyword = searchInput.value.toLowerCase();
    const filteredData = allData.filter(entry =>
      Object.values(entry).some(val =>
        (val || '').toString().toLowerCase().includes(keyword)
      )
    );

    const csvRows = [
      ['Claim #', 'Infield', 'Shop', 'End User', 'Equipment', 'Submitted', 'Status']
    ];

    filteredData.forEach(entry => {
      csvRows.push([
        entry.claimnumber,
        entry.infield || '',
        entry.claimrequestedbyshopname || '',
        entry.nameofenduser || '',
        entry.equipmenttype || '',
        entry.submissiondate ? new Date(entry.submissiondate).toLocaleDateString('en-GB') : '',
        entry.status
      ]);
    });

    const csvContent = csvRows.map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'warranty_requests.csv');
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  fetchData();
});
