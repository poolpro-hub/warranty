// js/auth.js
document.addEventListener('DOMContentLoaded', async () => {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session && !window.location.pathname.includes('login.html')) {
    window.location.href = 'login.html';
  }

  
  // Listen for auth state changes (logout, session expiry, etc.)
  supabase.auth.onAuthStateChange((event, session) => {
    if (!session && !window.location.pathname.includes('login.html')) {
      console.warn('Session expired or user logged out. Redirecting...');
      window.location.href = 'login.html';
    }
  });


  
  // Optional: logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await supabase.auth.signOut();
      window.location.href = 'login.html';
    });
  }
});
