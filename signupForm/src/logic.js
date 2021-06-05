const fileInput = document.querySelector('#avatar')
const imgEl = document.querySelector('img')

fileInput.addEventListener('change', e => {
  if (e.target.files.length === 0) return

  const file = e.target.files[0]

  if (!validateImageType(file.type)) return

  imgEl.src = URL.createObjectURL(file)
})

function validateImageType(mimeType) {
  const acceptableTypes = ['jpeg', 'png', 'svg', 'tiff', 'webp']

  const imageType = mimeType.split('/')[1].toLowerCase()

  if (acceptableTypes.indexOf(imageType) < 0) {
    return false
  }

  return true
}

function deleteAvatar() {
  if (fileInput.files.length === 0) return

  fileInput.value = ''
  imgEl.src = './person.svg'
}
