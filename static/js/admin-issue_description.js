document.addEventListener('DOMContentLoaded', async () => {


async function loadItems() {
  const { data, error } = await supabase
    .from('issue_description')
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
          <button onclick="toggleActive(${item.id}, ${item.active})">
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
    .from('issue_description')
    .update({ name: newName })
    .eq('id', id);
  loadItems();
}

async function toggleActive(id, currentStatus) {
  await supabase
    .from('issue_description')
    .update({ active: !currentStatus })
    .eq('id', id);
  loadItems();
}

document.getElementById('add-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('new-name').value.trim();
  if (!name) return;
  await supabase.from('issue_description').insert([{ name }]);
  document.getElementById('new-name').value = '';
  loadItems();
});

loadItems();
});