document.addEventListener('DOMContentLoaded', function () {
  const profileLink = document.querySelector('.profile-link')
  const dropdownMenu = document.getElementById('dropdownMenu')

  if (profileLink && dropdownMenu) {
    profileLink.addEventListener('click', function (event) {
      event.preventDefault()
      event.stopPropagation() // Prevent immediate document click handler
      dropdownMenu.style.display =
        dropdownMenu.style.display === 'block' ? 'none' : 'block'
    })

    document.addEventListener('click', function (event) {
      if (
        !profileLink.contains(event.target) &&
        !dropdownMenu.contains(event.target)
      ) {
        dropdownMenu.style.display = 'none'
      }
    })
  }
})
