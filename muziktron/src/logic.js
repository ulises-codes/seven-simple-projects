import { midiToFreq } from './helper'

const notes = document.querySelectorAll('.note--btn')

const audioCtx = new AudioContext()
let frequency
let oscillator

notes.forEach(note => {
  note.addEventListener('mousedown', startNote)

  note.addEventListener('mouseup', stopNote)
  note.addEventListener('mouseout', stopNote)
})

window.addEventListener('keydown', handleKeyDown)
window.addEventListener('keyup', handleKeyUp)

function createOscillator(frequency) {
  oscillator = audioCtx.createOscillator()
  oscillator.type = 'square'

  oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime)

  oscillator.connect(audioCtx.destination)

  oscillator.start()
}

function destroyOscillator() {
  if (oscillator) {
    oscillator.stop()

    oscillator = undefined
  }
}

function startNote(e) {
  if (oscillator && frequency) {
    const activeButton = Array.from(notes).find(
      note => midiToFreq(note.dataset.midiNote) === frequency
    )
    stopNote({ target: activeButton })
  }

  const { midiNote } = e.target.dataset

  frequency = midiToFreq(midiNote)

  createOscillator(frequency)

  e.target.classList.add('active')
}

function stopNote(e) {
  destroyOscillator()

  frequency = undefined

  e.target.classList.remove('active')
}

function handleKeyDown(e) {
  const button = Array.from(notes).find(note => note.dataset.key === e.key)

  if (button) {
    if (frequency === midiToFreq(button.dataset.midiNote)) {
      return
    }

    startNote({ target: button })
  }
}

function handleKeyUp(e) {
  const button = Array.from(notes).find(note => note.dataset.key === e.key)

  if (button && frequency === midiToFreq(button.dataset.midiNote)) {
    stopNote({ target: button })
  }
}
