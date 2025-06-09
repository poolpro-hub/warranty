// js/list.js
document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const status = params.get('status');

  document.getElementById('page-title').textContent = `Warranty Requests - ${status}`;

  if (status === null) {
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
          <td>${entry.submissiondate ? new Date(entry.submissiondate).toLocaleDateString() : ''}</td>
          <td>${entry.status}</td>
        `;
        tbody.appendChild(row);
      });
  } else {
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
          <td>${entry.submissiondate ? new Date(entry.submissiondate).toLocaleDateString() : ''}</td>
          <td>${entry.status}</td>
        `;
        tbody.appendChild(row);
      });
  };
});
