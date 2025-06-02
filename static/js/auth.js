
function handleCredentialResponse(response) {
    const clientId = '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';
    const token = response.credential;
    localStorage.setItem('google_token', token);
    document.getElementById('signin-button').style.display = 'none';
    alert('Signed in successfully!');
}

window.onload = function () {
    google.accounts.id.initialize({
        client_id: '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',
        callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(
        document.getElementById('signin-button'),
        { theme: 'outline', size: 'large' }
    );
};
