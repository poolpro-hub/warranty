// js/edit.js
document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const claimNumber = params.get('claimnumber');
  const formfields = document.getElementById('edit-form-div');
  const form = document.getElementById('edit-form');
  const statuses = ['New', 'Viewed', 'Progress', 'Rejected', 'Complete'];
  const yesno = ['No', 'Yes'];

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

  // Add readonly to the listed fields
  var readOnlyFlag = '';	  
  readOnlyFields.forEach(field => {
    var readOnlyFlag = "readonly";
  });
	  
//    if (field === 'claimnumber' || field === 'submissiondate'){
//      var readOnlyFlag = "readonly";
//    } else {
//      var readOnlyFlag = '';
//    };
    if (field === 'descriptionofissue'){
      const inputType = "textarea";
      formGroup.className = 'col-md-12';
      formGroup.innerHTML = `
        <label for="${field}" class="form-label">${field}</label>
        <textarea type="${inputType}" class="form-control" id="${field}" name="${field}" value="${value}" rows="10" cols="60">${value}</textarea>
      `;      
    } else if (field === 'status'){
	let dropdownHTML = `<label for="${field}" class="form-label">${field}</label>`;
 	dropdownHTML += `<select class="form-control" id="${field}" name="${field}" onchange="updateTextbox(this.value)">`;
  	statuses.forEach(option => {
    		const isSelected = option === value;
    		dropdownHTML += `<option value="${option}" ${isSelected ? 'selected' : ''}>${option}</option>`;
  	});
  	dropdownHTML += `</select>`;
      formGroup.className = 'col-md-12';
      formGroup.innerHTML = dropdownHTML;
      
    } else if (field === 'infield'){
	let dropdownHTML = `<label for="${field}" class="form-label">${field}</label>`;
 	dropdownHTML += `<select class="form-control" id="${field}" name="${field}">`;
  	yesno.forEach(option => {
    		const isSelected = option === value;
    		dropdownHTML += `<option value="${option}" ${isSelected ? 'selected' : ''}>${option}</option>`;
  	});
  	dropdownHTML += `</select>`;
      formGroup.className = 'col-md-12';
      formGroup.innerHTML = dropdownHTML;
     
            
    } else {
      formGroup.className = 'col-md-12';
      formGroup.innerHTML = `
        <label for="${field}" class="form-label">${field}</label>
        <input type="${inputType}" class="form-control" id="${field}" name="${field}" value="${value}" ${readOnlyFlag}>        
      `;
    };

    if (field === 'infield') {
	formfields.insertBefore(formGroup, formfields.firstChild);
    } else {
    	formfields.appendChild(formGroup);
    };
  });

	
  // Add hidden fields for non-editable values
  nonEditableFields.forEach(field => {
    const hidden = document.createElement('input');
    hidden.type = 'hidden';
    hidden.name = field;
    hidden.id = field;
    hidden.value = data[field];
    formfields.appendChild(hidden);
  });


// Save process	
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const updated = {};
    formData.forEach((value, key) => {
      if (!nonEditableFields.includes(key)) {
	
	//Validate fields
	  if (key === 'dateofpurchase'){
		console.log('Dateofpurchase:');
		console.log(value);
		updated[key] = new Date(0);
	  } else {      
        	updated[key] = value;
	  };
      }
	    //console.log(value);
    });

	//alert('HALT ',data.status);  

    const oldStatus = data.status;
    const newStatus = updated.status;

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
