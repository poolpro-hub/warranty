// js/edit.js
document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const claimNumber = params.get('claimnumber');
  const formfields = document.getElementById('edit-form-div');
  const form = document.getElementById('edit-form');
  const statuses = ['New', 'Viewed', 'Progress', 'Rejected', 'Complete'];
  const yesno = ['No', 'Yes'];
  const { data: categories, error: catError } = await supabase
	  .from('equipmenttype')
	  .select('name')
	  .eq('active', true)
	  .order('name', { ascending: true });
  const arrayCategories = categories.map(c => c.name);

  //const arrayCategories = ['Chlorinator','Heat Pump','Robot','Filter','Light','Pump','Cell','TDS Meter','Cleaner','Accessory','Not Pool Pro','Water Treatment','HPW','pH Controller'];
  const { data: stockcodes, error: catError } = await supabase
	  .from('modelnumber')
	  .select('name')
	  .eq('active', true)
	  .order('name', { ascending: true });
  const arrayStockcodes = stockcodes.map(c => c.name);
  //const arrayStockcodes = ['GW5500 - GT3','NDC15','NDC25','NDC35','NDC45','NDC55','CPPS15','CPPS20','CPPS30','CPPS30C','CPPS40','CPPS40C','CPPS50','CPPS50C','GW4900 - Plus','GW4900V2','GW4901','GW5100','GW5500','NPP1100','NPP1500','NPP550','NPP750','NPVS150','SF500','SF650','SF700','SF800','CF100','CF150','CF200','CF50','CPP20','CPP30','CPP40','GW4500 - Acrobat','PFC100','NPLR - Blue','NPLR - White','NPLR - Multi','TRT901C','Heater','other','PWSF650P','inver x','PPHPBOX','PHC1 (ph controler)','GW9500','Generic cell','TDS901C','AES AI28','Waterlink Spin Machine','NDCMX35','NHX Heater','GW4907 Robo Pro 30','Aiper','Heater','NDCMX25','InverX X30','InverX X45','InverX X60','InverX X80','88B2','Onga Pump','SMX25RP','NPE550','NPE750','NPE1500','NPE2000','X-Eco','GW4905 Robo Pro','KM1000','WT100-VS','WT150-VS','NPX1100','HPW','SR30','NDC100','88L5','NDC75C','NDC100C','GW9600 Phoenix','NPX1500','NPX2000','NPX2500'];
   const { data: issues, error: catError } = await supabase
	  .from('issue_description')
	  .select('name')
	  .eq('active', true)
	  .order('name', { ascending: true });
  const arrayIssue = issues.map(c => c.name);
  //const arrayIssue = ['Bearings & Seals','Overheating - High Salt','Not Warranty Ran Dry','Main PCB','Timer','Cell','Gear kit','MPV','Tank Leaking','Touchpad','Software Update','Wet end','Water entry','Hose','Other','Drive belts','Cell','Pro Rata','Not Warranty','Tanks','Membrane','Diaphragm','Leaking','Low Production','Leaking to waste','Pressure Gauge','Laterals','Power Pack','Tripping Power','Pump','Lid','Noisy','Locking Ring','Quote to repair','LCD Display Board','Mechanical Seal','Inverter Board','Control Box','Unions','No Response','Tracks','Rotor','Intergrated Board','No Fault Found','Control Panel','Unit out of warranty','No Display','No Production','blocked impellor','Replaced stock','No Flow Fault','Leaking from tank','Outer Tube','Charge Cable','E2 Motor Error','Inverter Board','Capacitor','Cell Housing','Control Box Cover','Will Not Start'];
  const { data: action, error: catError } = await supabase
	  .from('action_taken')
	  .select('name')
	  .eq('active', true)
	  .order('name', { ascending: true });
  const arrayIssue = action.map(c => c.name);
  //const arrayAction = ['Crystal repaired','Robotek repaired','LedRex repaired','Adam repaired infield','Adam repaired workshop','Crystal replaced parts','Robotek replaced parts','Replace new stock','Emaux Replaced parts','AES Repair','Craig repaired infield','Aqua Idea repaired infield','Infield / Crystal repaired','Tom repaired infield','Quote to repair','Referred to Service Agent','Sent replacement parts','Updated PCB','Adam infeild Crystal repaired','Brendan Inspected','Store Repaired','Rectified over the phone','Brendan & Adam Replaced','Emailed how to fix problem','Closed claim','Shipped back to customer','Adam advised customer','Quote to replace','Hard reset unit problem fixed','Adam repaired infeild not warranty','Adam delivered replacement part','Adam replaced infield','Quoted replacement parts','Jason Repaired Infield','Jason Replaced Infield','Repaired in VIC','Warren Completed','Glenn replaced infield','Returned to customer','Sent replacement parts','Crystal Replaced','Graham Advised Customer','Replaced by Sydney','Nothing done','jason repaired workshop','Store Checked NFF','"Problem resolved',' closed claim"','Credit issued to customer','Shop rectified issue','Glenn returned to customer','Adam tested & advised customer','Replaced control panel in workshop'];
  const arrayLocation = [''];

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
	  
    if (field === 'claimnumber' || field === 'submissiondate' || field === 'browsefiles' || field === 'serialnumber'){
      var readOnlyFlag = "readonly";
    } else {
      var readOnlyFlag = '';
    };
	  
    if (field === 'descriptionofissue'){
      const inputType = "textarea";
      formGroup.className = 'col-md-12';
      formGroup.innerHTML = `
        <label for="${field}" class="form-label">${field}</label>
        <textarea type="${inputType}" class="form-control" id="${field}" name="${field}" value="${value}" rows="10" cols="60">${value}</textarea>
      `;      
    } else if (field === 'status'){
	let dropdownHTML = `<label for="${field}" class="form-label">${field}</label>`;
 	dropdownHTML += `<select class="form-control" id="${field}" name="${field}">`;
  	statuses.forEach(option => {
    		const isSelected = option === value;
    		dropdownHTML += `<option value="${option}" ${isSelected ? 'selected' : ''}>${option}</option>`;
  	});
  	dropdownHTML += `</select>`;
      formGroup.className = 'col-md-6 just-a-little-padding text-white bg-secondary';
      formGroup.innerHTML = dropdownHTML;
      
    } else if (field === 'infield'){
	let dropdownHTML = `<label for="${field}" class="form-label">${field}</label>`;
 	dropdownHTML += `<select class="form-control" id="${field}" name="${field}">`;
  	yesno.forEach(option => {
    		const isSelected = option === value;
    		dropdownHTML += `<option value="${option}" ${isSelected ? 'selected' : ''}>${option}</option>`;
  	});
  	dropdownHTML += `</select>`;
      formGroup.className = 'col-md-6';
      formGroup.innerHTML = dropdownHTML;
    } else if (field === 'equipmenttype'){
	let dropdownHTML = `<label for="${field}" class="form-label">${field}</label> Currently Set: <strong>${value}</strong>`;
		dropdownHTML += `<select class="form-control" id="${field}" name="${field}">`;
		dropdownHTML += `<option value="">Select an option from the list</option>`;
		arrayCategories.forEach(option => {
				const isSelected = option === value;
				dropdownHTML += `<option value="${option}" ${isSelected ? 'selected' : ''}>${option}</option>`;
		});
		dropdownHTML += `</select>`;
      formGroup.className = 'col-md-12 text-white bg-warning just-a-little-padding';
      formGroup.innerHTML = dropdownHTML;
    } else if (field === 'modelnumber'){
	let dropdownHTML = `<label for="${field}" class="form-label">${field}</label> Currently Set: <strong>${value}</strong>`;
		dropdownHTML += `<select class="form-control" id="${field}" name="${field}">`;
		dropdownHTML += `<option value="">Select an option from the list</option>`;
		arrayStockcodes.forEach(option => {
				const isSelected = option === value;
				dropdownHTML += `<option value="${option}" ${isSelected ? 'selected' : ''}>${option}</option>`;
		});
		dropdownHTML += `</select>`;
      formGroup.className = 'col-md-12 text-white bg-warning just-a-little-padding';
      formGroup.innerHTML = dropdownHTML;

    } else if (field === 'issue_description'){
	let dropdownHTML = `<label for="${field}" class="form-label">${field}</label>`;
		dropdownHTML += `<select class="form-control" id="${field}" name="${field}">`;
		dropdownHTML += `<option value="">Select an option from the list</option>`;
		arrayIssue.forEach(option => {
				const isSelected = option === value;
				dropdownHTML += `<option value="${option}" ${isSelected ? 'selected' : ''}>${option}</option>`;
		});
		dropdownHTML += `</select>`;
      formGroup.className = 'col-md-12 text-white bg-warning just-a-little-padding';
      formGroup.innerHTML = dropdownHTML;
 
    } else if (field === 'action_taken'){
	let dropdownHTML = `<label for="${field}" class="form-label">${field}</label>`;
		dropdownHTML += `<select class="form-control" id="${field}" name="${field}">`;
		dropdownHTML += `<option value="">Select an option from the list</option>`;
		arrayAction.forEach(option => {
				const isSelected = option === value;
				dropdownHTML += `<option value="${option}" ${isSelected ? 'selected' : ''}>${option}</option>`;
		});
		dropdownHTML += `</select>`;
      formGroup.className = 'col-md-12 text-white bg-warning just-a-little-padding';
      formGroup.innerHTML = dropdownHTML;
   
    } else if (field === 'completedate'){  
	    //Do not render this input field
		formGroup.className = 'col-md-6';
      		formGroup.innerHTML = `${value}      
      		`;	    
    } else {
      formGroup.className = 'col-md-6';
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
  var readOnlyFlag = '';
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
		//console.log('Dateofpurchase:');
		//console.log(value);
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

    if (newStatus === "complete"){
	    if (oldStatus !== newStatus){
		    updated['completedate'] = new Date(0);
	    };
    };

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
