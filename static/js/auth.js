
function handleCredentialResponse(response) {
    const clientId = '1011600113632-ohnfvij8v9p3kbsrbtoip9cc4735oksh.apps.googleusercontent.com';
    const token = response.credential;
    localStorage.setItem('google_token', token);
    document.getElementById('signin-button').style.display = 'none';
    alert('Signed in successfully!');
}

window.onload = function () {
    google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(
        document.getElementById('signin-button'),
        { theme: 'outline', size: 'large' }
    );
};
