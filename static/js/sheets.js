
const SHEET_ID = '1ZGmhCzBU36_cpQzjH9vrivtmMXmpeVIqUAU61YP2gtg';
const token = response.credential;

async function getSheetData(sheetName) {
    const token = localStorage.getItem('google_token');
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}`;
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    return data.values;
}

async function updateSheetData(range, values) {
    const token = localStorage.getItem('google_token');
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?valueInputOption=USER_ENTERED`;
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ values })
    });
    return response.json();
}
