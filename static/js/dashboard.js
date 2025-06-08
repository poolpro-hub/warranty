// js/dashboard.js
document.addEventListener('DOMContentLoaded', async () => {
  const statuses = ['New', 'Viewed', 'Progress', 'Rejected', 'Complete'];
  const panelContainer = document.getElementById('status-panels');

  for (const status of statuses) {
    try {
      const { data, error } = await supabase
        .from('tblWarranty')
        .select('*', { count: 'exact', head: true })
        .eq('Status', status);

      if (error) {
        console.error(`Error fetching count for ${status}:`, error.message);
        continue;
      }

      const count = data ? data.length : 0;

      const col = document.createElement('div');
      col.className = 'col-md-4 mb-4';

      col.innerHTML = `
        <div class="card text-white bg-primary h-100">
          <div class="card-body">
            <h5 class="card-title">${status}</h5>
            <p class="card-text fs-3">${count}</p>
          </div>
          <div class="card-footer bg-transparent border-top-0">
            <a href="list.html?status=${encodeURIComponent(status)}" class="stretched-link text-white">View ${status}</a>
          </div>
        </div>
      `;

      panelContainer.appendChild(col);
    } catch (err) {
      console.error(`Unexpected error for ${status}:`, err);
    }
  }
});
