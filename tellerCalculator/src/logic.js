const allInputs = document.querySelectorAll('.input')

const radioBtns = document.querySelectorAll('.picker')

const quantityItems = document.querySelectorAll('.quantity-item')
const quantityTotals = document.querySelectorAll('.quantity-total')

const errorBox = document.querySelectorAll('.error-box')[0]

const resetBtn = document.getElementById('reset')

const billsTotal = document.getElementById('bills-total')
const coinsTotal = document.getElementById('coins-total')
const grandTotal = document.getElementById('grand-total')

const allTotalFields = document.querySelectorAll('.total-field')

let countMethod = 'value'

//Validate user input to ensure it is a valid number and correct denomination.
const validateUserInput = targetInput => {
  const validInput = targetInput.validity.valid

  const amount = parseFloat(targetInput.value)

  const denomination = Number(targetInput.dataset.denomination)

  if (typeof amount !== 'number') return handleErrors(targetInput, 0)
  if (amount < 0) return handleErrors(targetInput, 1)
  if (!validInput) return handleErrors(targetInput, 0)

  switch (countMethod) {
    case 'value':
      if ((amount * 100) % (denomination * 100) !== 0) {
        return handleErrors(targetInput, 2)
      }

      break

    case 'quantity':
      if (amount % 1 !== 0) {
        return handleErrors(targetInput, 3)
      }

      break
  }

  targetInput.classList.remove('invalid-input', 'invalid-input-animation')

  errorBox.style.display = 'none'
  errorBox.innerText = ''

  return true
}

//Handle invalid user input.
const handleErrors = (box, code) => {
  const errorMessages = {
    0: 'Please enter a valid number.',
    1: 'Please enter a positive number.',
    2: 'That is an invalid input for this denomination.',
    3: 'Please enter a whole number.',
  }

  box.addEventListener(
    'animationend',
    () => box.classList.remove('invalid-input-animation'),
    { once: true }
  )

  box.classList.add('invalid-input')

  //Animate field with a red border and a quick jiggle.
  box.classList.add('invalid-input-animation')

  //Display error message.
  errorBox.style.display = 'flex'
  errorBox.innerText = errorMessages[code]

  //Clear input field.
  box.value = ''

  return false
}

//Listen for user input.
const handleChange = e => {
  const { category } = e.target.dataset

  // Validate user input and display errors (if applicable)
  const isValid = validateUserInput(e.target)

  if (!isValid) return

  const subtotal = Array.from(allInputs)
    // Only include relevant column (bills or coins) and exclude empty rows
    .filter(input => input.dataset.category === category && input.value)
    .map(input => {
      const value = parseFloat(input.value)

      if (countMethod === 'quantity') {
        const denomination = parseFloat(input.dataset.denomination)

        const total = value * denomination

        if (input === e.target) {
          quantityTotals.item(i).textContent = total.toString()
        }

        return value * denomination
      }

      return value
    })
    .reduce((a, b) => a + b)

  // Restore hundredths place for coin inputs
  if (category === 'coins') {
    e.target.value = parseFloat(e.target.value).toFixed(2)
  }

  const subtotalField = category === 'bills' ? billsTotal : coinsTotal

  subtotalField.value = category === 'coins' ? subtotal.toFixed(2) : subtotal

  grandTotal.value = (
    Number(billsTotal.value) + Number(coinsTotal.value)
  ).toFixed(2)
}

allInputs.forEach(field => field.addEventListener('change', handleChange))

const handleMethodChange = e => {
  if (e.target.checked) {
    countMethod = e.target.id.replace('picker-', '')
  }

  allInputs.forEach((input, i) => {
    const denomination = parseFloat(input.dataset.denomination)

    const category = input.dataset.category

    // Adjacent quantity total field
    const totalField = quantityTotals.item(i)

    if (countMethod === 'quantity') {
      // Switch to quantity view
      quantityItems.forEach(item => (item.style.display = 'block'))

      if (!input.value) return

      // Fill-in quantity total field
      const total = parseFloat(input.value)
      totalField.textContent = total

      // Convert input field from value to quantity
      input.value = input.value / denomination
    } else {
      // Switch to value view
      quantityItems.forEach(item => (item.style.display = 'none'))

      if (!input.value) return

      // Convert input field from quantity to value
      const total = denomination * parseFloat(input.value)

      if (category === 'bills') {
        input.value = total.toString()
      } else if (category === 'coins') {
        input.value = total.toFixed(2)
      }
    }
  })
}

radioBtns.forEach(btn => btn.addEventListener('change', handleMethodChange))

//Reset everything.
resetBtn.addEventListener('click', () => {
  const everything = [...allTotalFields, ...allInputs]

  everything.forEach(input => {
    input.value = ''

    input.classList.remove('invalid-input', 'invalid-input-animation')
    errorBox.style.display = 'none'

    errorBox.innerText = ''
  })

  quantityTotals.forEach(box => (box.textContent = '0'))
})
