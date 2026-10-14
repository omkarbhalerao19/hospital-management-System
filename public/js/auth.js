document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('medicore_user'));
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('medicore_user');
            alert('Logged out successfully.');
            window.location.href = 'index.html';
        });
    }
});