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

document.addEventListener('DOMContentLoaded', function () {
  const listLink = document.querySelector('.list-link')
  const listMenu = document.getElementById('listMenu')

  if(listLink && listMenu){
    listLink.addEventListener("click",function(event){
      event.preventDefault()
      event.stopPropagation()
      listMenu.style.display = 
      listMenu.style.display === "block" ? "none" : "block"   
    })
    document.addEventListener('click', function (event) {
          if (
        !listLink.contains(event.target) &&
        !listMenu.contains(event.target)
      ) {
        listMenu.style.display = 'none'
      }
    })
  }

})
