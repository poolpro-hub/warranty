
function handleCredentialResponse(response) {
    const token = response.credential;
    localStorage.setItem('google_token', token);
    window.location.reload();
}

window.onload = function () {
    google.accounts.id.initialize({
        client_id: '315427187582-pajr97j8pcbjh6r4imd40m56dk674rla.apps.googleusercontent.com',
        callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(
        document.getElementById('signin-button'),
        { theme: 'outline', size: 'large' }
    );
    google.accounts.id.prompt();
};
