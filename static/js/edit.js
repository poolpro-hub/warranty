// js/edit.js
document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const claimNumber = params.get('claimnumber');
  const formfields = document.getElementById('edit-form-div');
  const form = document.getElementById('edit-form');
  const statuses = ['New', 'Viewed', 'Progress', 'Rejected', 'Complete'];

  console.log('claimnumber:', claimNumber);

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

  const nonEditableFields = ['id', 'created_at'];
  const readOnlyFields = ['claimnumber', 'submissiondate', 'browsefiles', 'serialnumber']
  
  const editableFields = Object.keys(data).filter(f => !nonEditableFields.includes(f));

  editableFields.forEach(field => {
    const value = data[field] || '';
    const inputType = field.toLowerCase().includes('date') ? 'date' : 'text';
    //const readOnlyFlag = '';
    const formGroup = document.createElement('div');
    if (field === 'claimnumber' || field === 'submissiondate'){
      var readOnlyFlag = "readonly";
    } else {
      var readOnlyFlag = '';
    };
    if (field === 'descriptionofissue'){
      const inputType = "textarea";
      formGroup.className = 'col-md-6';
      formGroup.innerHTML = `
        <label for="${field}" class="form-label">${field}</label>
        <textarea type="${inputType}" class="form-control" id="${field}" name="${field}" value="${value}" rows="10" cols="60">${value}</textarea>
      `;      
    } else if (field === 'status'){
	let dropdownHTML = `<label for="${field}" class="form-label">${field}</label>`;
 	dropdownHTML += `<select class="form-control" id="${field}-change">`;
  	statuses.forEach(option => {
    		const isSelected = option === value;
    		dropdownHTML += `<option value="${option}" ${isSelected ? 'selected' : ''}>${option}</option>`;
  	});
  	dropdownHTML += `</select>`;
	dropdownHTML += `<input type="hidden" name="status" id="status" value="${value}">`;
      formGroup.className = 'col-md-6';
      formGroup.innerHTML = dropdownHTML;
      // Add hidden status field
      
    } else {
      formGroup.className = 'col-md-6';
      formGroup.innerHTML = `
        <label for="${field}" class="form-label">${field}</label>
        <input type="${inputType}" class="form-control" id="${field}" name="${field}" value="${value}" ${readOnlyFlag}>        
      `;
    };
    form.appendChild(formGroup);
  });

  // Add hidden fields for non-editable values
  nonEditableFields.forEach(field => {
    const hidden = document.createElement('input');
    hidden.type = 'hidden';
    hidden.name = field;
    hidden.id = field;
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
	    //console.log(value);
    });

	//alert('HALT ',data.status);  

    const oldStatus = data.status;
    const newStatus = updated.status;
	  alert(oldStatus);
	  alert(newStatus);

    const { error: updateError } = await supabase
      .from('tblwarranty')
      .update(updated)
      .eq('claimnumber', claimNumber);

    if (updateError) {
      console.log(updateError);
      alert('Failed to update entry.');
      return;
    }

    // Log status change
    if (oldStatus !== newStatus) {
      await supabase.from('status_logs').insert({
        claimnumber: claimNumber,
        oldstatus: oldStatus,
        newstatus: newStatus,
        changedat: new Date().toISOString()
      });
    }

    //alert('Warranty request updated.');
    window.location.href = `list.html?status=${encodeURIComponent(newStatus)}`;
  });
});
