
const API_KEY = 'AIzaSyCbj_HkOkMr6nWfrBgGAVi08fjhyBZ9G4s';
const SHEET_ID = '1ZGmhCzBU36_cpQzjH9vrivtmMXmpeVIqUAU61YP2gtg';
const BASE_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values`;
const SHEET_NAME = 'Pool Pro Live - Form Submissions';
const token = handleCredentialResponse;

async function getSheetData(range) {
    const response = await fetch(`${BASE_URL}/${SHEET_NAME}?key=${API_KEY}`);
    const data = await response.json();
    return data.values;
}


async function updateSheetData(range, values) {
    console.log(`${BASE_URL}/${range}?valueInputOption=USER_ENTERED&key=${API_KEY}`);
    const response = await fetch(`${BASE_URL}/${range}?valueInputOption=USER_ENTERED&key=${API_KEY}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ values })
    });
    const data = await response.json();
    return data;
}
/*async function getSheetData(sheetName) {
    const token = localStorage.getItem('google_token');
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}`;
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    return data.values;
} */


/*async function updateSheetData(range, values) {
    const sheetId = '1ZGmhCzBU36_cpQzjH9vrivtmMXmpeVIqUAU61YP2gtg';
    const token = localStorage.getItem('google_token');
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?valueInputOption=USER_ENTERED`;
    const body = {
        values: values
    };
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    return response.json();
} */


