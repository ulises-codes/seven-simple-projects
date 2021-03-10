const body = document.querySelector('body')
const themeEls = document.querySelectorAll('.theme-li')
const profileButton = document.querySelector('.profile-button')
const menu = document.querySelector('.menu')

let currentTheme

function getTheme() {
  return localStorage.getItem('theme')
}

function setTheme(newTheme = 'default') {
  if (currentTheme === newTheme) return

  body.classList.value = `theme-${newTheme}`

  currentTheme = newTheme

  themeEls.forEach(el => toggleActiveClass(el))

  localStorage.setItem('theme', newTheme)
}

// Move 'active-theme' class to relevant element when a new theme is selected
function toggleActiveClass(el) {
  if (el.dataset.theme === currentTheme) {
    el.classList.add('active-theme')
  } else if (el.classList.contains('active-theme')) {
    el.classList.remove('active-theme')
  }
}

window.addEventListener('DOMContentLoaded', () => setTheme(getTheme()))

themeEls.forEach(el =>
  el.addEventListener('click', e => setTheme(e.target.dataset.theme))
)

profileButton.addEventListener('click', () => {
  if (!menu.classList.contains('open')) {
    menu.classList.add('open')
  }
})

menu.addEventListener('mouseleave', e => {
  if (e.target.classList.contains('open')) {
    e.target.classList.remove('open')
  }
})
