// js/dashboard.js
document.addEventListener('DOMContentLoaded', async () => {
  const statuses = ['New', 'Viewed', 'Progress', 'Rejected', 'Complete'];
  const statusesInfield = ['New', 'Progress', 'Complete'];
  const statusesReports = ['Complete'];
  const bkgpanel = ['bg-primary', 'bg-success', 'bg-warning', 'bg-danger', 'bg-dark'];
  const panelContainer = document.getElementById('status-panels');
  const panelContainerInfield = document.getElementById('status-panels-infield');
  const panelContainerReports = document.getElementById('status-panels-reports');
  let bkgcount = 0;

  // Create a date that is 7 days ago
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const sevenDaysAgoISO = sevenDaysAgo.toISOString();

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

  let bkgcountInfield = 0;
  // Infield panels
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
        <div class="card text-white ${bkgpanel[bkgcountInfield]} h-100">
          <div class="card-body">
            <h5 class="card-title">${statusInfield} Infield</h5>
            <p class="card-text fs-3">${count}</p>
          </div>
          <div class="card-footer bg-transparent border-top-0">
            <a href="list.html?status=${encodeURIComponent(statusInfield)}&infield=Yes" class="btn btn-light">View ${statusInfield}</a>
          </div>
        </div>
      `;

      panelContainerInfield.appendChild(col);
      // increment bkg count to move through the array
      bkgcountInfield++;
    } catch (err) {
      console.error(`Unexpected error for ${status}:`, err);
    }
  }

// Reporting panels
  for (const statusreport of statusesReports) {
    try {
      const { data, error } = await supabase
        .from('status_logs')
        .select('newstatus')
        .eq('newstatus', statusreport)
        .gt('changedat', sevenDaysAgoISO);

      if (error) {
        console.error(`Error fetching count for ${statusreport}:`, error.message);
        continue;
      }

      const count = data ? data.length : 0;

      const col = document.createElement('div');
      col.className = 'col-md-4 mb-4';

      col.innerHTML = `
        <div class="card text-white bg-secondary h-100">
          <div class="card-body">
            <h5 class="card-title">${statusreport} - Last 7 Days</h5>
            <p class="card-text fs-3">${count}</p>
          </div>
          <div class="card-footer bg-transparent border-top-0">
            <a href="list.html?status=${encodeURIComponent(statusreport)}" class="btn btn-light">View ${statusreport}</a>
          </div>
        </div>
      `;

      panelContainerReports.appendChild(col);
      // increment bkg count to move through the array
      bkgcountInfield++;
    } catch (err) {
      console.error(`Unexpected error for ${status}:`, err);
    }
  }
});
