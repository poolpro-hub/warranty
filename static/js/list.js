// js/list.js
document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const status = params.get('status');
  const infield = params.get('infield');

  //document.getElementById('page-title').textContent = `Warranty Requests - ${status}`;

  if (status === null) {
    document.getElementById('page-title').textContent = `Warranty Requests - All`;
    const { data, error } = await supabase
      .from('tblwarranty')
      .select('claimnumber, claimrequestedbyshopname, nameofenduser, equipmenttype, submissiondate, status, infield')
      .order('submissiondate', { ascending: false });
  
      if (error) {
        console.error('Error fetching data:', error.message);
        return;
      }
  
      const tbody = document.getElementById('requests-table-body');
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
  } else {
    document.getElementById('page-title').textContent = `Warranty Requests - ${status}`;
    const { data, error } = await supabase
      .from('tblwarranty')
      .select('claimnumber, claimrequestedbyshopname, nameofenduser, equipmenttype, submissiondate, status, infield')
      .eq('status', status)
      .order('submissiondate', { ascending: false });
  
      if (error) {
        console.error('Error fetching data:', error.message);
        return;
      }
  
      const tbody = document.getElementById('requests-table-body');
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
  };
});
