// https://medium.com/swinginc/playing-with-midi-in-javascript-b6999f2913c3
export function midiToFreq(midiNote) {
  const a = Math.pow(2, (midiNote - 69) / 12)

  return a * 440
}
