const aCtx = new AudioContext()
let clickBuffer
fetch('mp3/click.mp3')
  .then((res) => res.arrayBuffer())
  .then((buf) => aCtx.decodeAudioData(buf))
  .then((decoded) => (clickBuffer = decoded))

window.playClickSound = () => {
  aCtx.resume()
  const clickSrc = aCtx.createBufferSource()
  clickSrc.buffer = clickBuffer
  clickSrc.connect(aCtx.destination)
  clickSrc.start(0)
}
