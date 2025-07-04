

//const supabase = supabase.createClient('https://your-project.supabase.co', 'public-anon-key');
document.addEventListener('DOMContentLoaded', async () => {

async function loadItems() {
  const { data, error } = await supabase
    .from('modelnumber')
    .select('*')
    .order('id', { ascending: true });

  const tbody = document.getElementById('table-body');
  tbody.innerHTML = '';

  if (data) {
    data.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td contenteditable="true" onblur="updateItem(${item.id}, this.innerText)">${item.name}</td>
        <td>${item.active ? 'Yes' : 'No'}</td>
        <td>
          <button onclick="toggleActive(${item.id})">
            ${item.active ? 'Deactivate' : 'Activate'}
          </button>
        </td>
      `;
      tbody.appendChild(row);
    });
  }
}

async function updateItem(id, newName) {
  await supabase
    .from('modelnumber')
    .update({ name: newName })
    .eq('id', id);
  loadItems();
}

async function toggleActive(id) {
  // Fetch the current value from the database
  const { data, error } = await supabase
    .from('modelnumber') // replace with actual table
    .select('active')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error('Error fetching current status:', error);
    return;
  }

  const newStatus = !data.active;

  const { error: updateError } = await supabase
    .from('modelnumber') // replace with actual table
    .update({ active: newStatus })
    .eq('id', id);

  if (updateError) {
    console.error('Error updating status:', updateError);
  } else {
    loadItems(); // refresh the table
  }
}

window.toggleActive = toggleActive;
window.updateItem = updateItem;

document.getElementById('add-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('new-name').value.trim();
  if (!name) return;
  await supabase.from('modelnumber').insert([{ name }]);
  document.getElementById('new-name').value = '';
  loadItems();
});

loadItems();


});
