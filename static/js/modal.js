document.getElementById('viewLogsBtn').addEventListener('click', async () => {
  const modal = document.getElementById('statusLogsModal');
  const logsList = document.getElementById('logsList');
  logsList.innerHTML = ''; // Clear previous entries

  const { data, error } = await supabase
    .from('status_logs')
    .select('*')
	.eq('newstatus', 'Complete')
    .order('changedat', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error fetching status logs:', error.message);
    logsList.innerHTML = '<li>Error loading logs.</li>';
  } else {
    data.forEach(log => {
      const item = document.createElement('li');
      item.innerHTML = `Claim: <a href="edit.html?claimnumber=${log.claimnumber || 'N/A'}">${log.claimnumber || 'N/A'}</a> | Type: ${log.equipmenttype} | Status: ${log.newstatus} | Changed: ${new Date(log.changedat).toLocaleString()}`;
      logsList.appendChild(item);
    });
  }

  modal.style.display = 'block';
});

document.querySelector('.close').addEventListener('click', () => {
  document.getElementById('statusLogsModal').style.display = 'none';
});

window.addEventListener('click', (event) => {
  const modal = document.getElementById('statusLogsModal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});
