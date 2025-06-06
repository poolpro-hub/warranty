
function handleCredentialResponse(response) {
    const clientId = '1011600113632-ohnfvij8v9p3kbsrbtoip9cc4735oksh.apps.googleusercontent.com';
    const token = response.credential;
    localStorage.setItem('google_token', token);
    document.getElementById('signin-button').style.display = 'none';
    window.location.reload();
    //alert('Signed in successfully!');
}

window.onload = function () {
    google.accounts.id.initialize({
        client_id: '1011600113632-ohnfvij8v9p3kbsrbtoip9cc4735oksh.apps.googleusercontent.com',
        callback: handleCredentialResponse,
        auto_select: true
    });
    google.accounts.id.renderButton(
        document.getElementById('signin-button'),
        { theme: 'outline', size: 'large' }
    );
    google.accounts.id.prompt(); // Shows One Tap or auto sign-in
};

const token = localStorage.getItem('google_token');
