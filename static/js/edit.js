// js/edit.js
document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const claimNumber = params.get('claim');
  const form = document.getElementById('edit-form-div');

  console.log('ClaimNumber:', claimNumber);

  if (!claimNumber) {
    alert('No claim number provided.');
    return;
  }

  const { data, error } = await supabase
    .from('tblwarranty')
    .select('*')
    .ilike('claimnumber', claimNumber)
    .single();

  if (error || !data) {
    alert('Error loading claim.');
    return;
  }

  const nonEditableFields = ['claimnumber', 'submissiondate'];
  const editableFields = Object.keys(data).filter(f => !nonEditableFields.includes(f));

  editableFields.forEach(field => {
    const value = data[field] || '';
    const inputType = field.toLowerCase().includes('date') ? 'date' : 'text';

    const formGroup = document.createElement('div');
    formGroup.className = 'col-md-6';
    formGroup.innerHTML = `
      <label for="${field}" class="form-label">${field}</label>
      <input type="${inputType}" class="form-control" id="${field}" name="${field}" value="${value}">
    `;
    form.appendChild(formGroup);
  });

  // Add hidden fields for non-editable values
  nonEditableFields.forEach(field => {
    const hidden = document.createElement('input');
    hidden.type = 'hidden';
    hidden.name = field;
    hidden.value = data[field];
    form.appendChild(hidden);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const updated = {};
    formData.forEach((value, key) => {
      if (!nonEditableFields.includes(key)) {
        updated[key] = value;
      }
    });

    const oldStatus = data.Status;
    const newStatus = updated.Status;

    const { error: updateError } = await supabase
      .from('warrantyrequests')
      .update(updated)
      .eq('claimnumber', claimNumber);

    if (updateError) {
      alert('Failed to update entry.');
      return;
    }

    // Log status change
    if (oldStatus !== newStatus) {
      await supabase.from('status_logs').insert({
        ClaimNumber: claimNumber,
        OldStatus: oldStatus,
        NewStatus: newStatus,
        ChangedAt: new Date().toISOString()
      });
    }

    alert('Warranty request updated.');
    window.location.href = `list.html?status=${encodeURIComponent(newStatus)}`;
  });
});
