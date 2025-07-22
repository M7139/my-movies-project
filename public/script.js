    const profileLink = document.querySelector('.profile-link');
    const dropdownMenu = document.getElementById('dropdownMenu');

    profileLink.addEventListener('click', (event) => {
        event.preventDefault();
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });

    
    window.addEventListener('click', (event) => {
        if (!profileLink.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.style.display = 'none';
        }
    });