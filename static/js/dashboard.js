// js/dashboard.js
document.addEventListener('DOMContentLoaded', async () => {
  const statuses = ['New', 'Viewed', 'Progress', 'Rejected', 'Complete'];
  const statusesInfield = ['New', 'Progress', 'Complete'];
  const bkgpanel = ['bg-primary', 'bg-success', 'bg-warning', 'bg-danger', 'bg-dark'];
  const panelContainer = document.getElementById('status-panels');
  const panelContainerInfield = document.getElementById('status-panels-infield');
  let bkgcount = 0;

  for (const status of statuses) {
    try {
      const { data, error } = await supabase
        .from('tblwarranty')
        .select('claimnumber')
        .eq('status', status);

      if (error) {
        console.error(`Error fetching count for ${status}:`, error.message);
        continue;
      }

      const count = data ? data.length : 0;

      const col = document.createElement('div');
      col.className = 'col-md-4 mb-4';

      col.innerHTML = `
        <div class="card text-white ${bkgpanel[bkgcount]} h-100">
          <div class="card-body">
            <h5 class="card-title">${status}</h5>
            <p class="card-text fs-3">${count}</p>
          </div>
          <div class="card-footer bg-transparent border-top-0">
            <a href="list.html?status=${encodeURIComponent(status)}" class="btn btn-light">View ${status}</a>
          </div>
        </div>
      `;

      panelContainer.appendChild(col);
      // increment bkg count to move through the array
      bkgcount++;
    } catch (err) {
      console.error(`Unexpected error for ${status}:`, err);
    }
  }


  
  for (const statusInfield of statusesInfield) {
    try {
      const { data, error } = await supabase
        .from('tblwarranty')
        .select('claimnumber')
        .eq('status', statusInfield)
        .eq('infield', 'Yes');

      if (error) {
        console.error(`Error fetching count for ${statusInfield}:`, error.message);
        continue;
      }

      const count = data ? data.length : 0;

      const col = document.createElement('div');
      col.className = 'col-md-4 mb-4';

      col.innerHTML = `
        <div class="card text-white ${bkgpanel[bkgcount]} h-100">
          <div class="card-body">
            <h5 class="card-title">${statusInfield}</h5>
            <p class="card-text fs-3">${count}</p>
          </div>
          <div class="card-footer bg-transparent border-top-0">
            <a href="list.html?status=${encodeURIComponent(statusInfield)}" class="btn btn-light">View ${statusInfield}</a>
          </div>
        </div>
      `;

      panelContainerInfield.appendChild(col);
      // increment bkg count to move through the array
      bkgcount++;
    } catch (err) {
      console.error(`Unexpected error for ${status}:`, err);
    }
  }
});
