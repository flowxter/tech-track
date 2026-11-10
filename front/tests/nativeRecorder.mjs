import assert from 'node:assert/strict'

/** MediaRecorder, MediaStream y encoder nativos; Chromium aporta el dispositivo de audio simulado. */
export async function verifyNativeRecorder(page) {
  await page.route('**/recorder-harness', (route) => route.fulfill({ contentType: 'text/html', body: '<!doctype html><html><body></body></html>' }))
  await page.goto(new URL('/recorder-harness', page.url()).href)
  const result = await page.evaluate(async () => {
    const { createElement, act, useEffect, createRoot, useVoiceRecorder } = await import('/tests/recorderHarness.ts')
    const NativeRecorder = window.MediaRecorder
    const nativeStart = NativeRecorder.prototype.start
    const nativeStop = NativeRecorder.prototype.stop
    const getUserMedia = navigator.mediaDevices.getUserMedia
    const originalActEnvironment = window.IS_REACT_ACT_ENVIRONMENT
    const streams = [], events = [], chunkSizes = []
    let control, audioContext, startedAt, stoppedAt, deadline, recorderInstance
    let closedBeforeDelivery = false, tracksLiveAfterStop = false
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    function Probe() {
      const recorder = useVoiceRecorder()
      useEffect(() => { control = recorder })
      return null
    }
    try {
      window.IS_REACT_ACT_ENVIRONMENT = true
      navigator.mediaDevices.getUserMedia = async (constraints) => {
        const stream = await getUserMedia.call(navigator.mediaDevices, constraints)
        streams.push(stream)
        return stream
      }
      NativeRecorder.prototype.start = function (...args) {
        recorderInstance = this
        this.addEventListener('dataavailable', ({ data }) => { events.push('dataavailable'); chunkSizes.push(data.size) })
        this.addEventListener('stop', () => events.push('stop'))
        startedAt = performance.now()
        return nativeStart.apply(this, args)
      }
      NativeRecorder.prototype.stop = function (...args) {
        stoppedAt = performance.now()
        return nativeStop.apply(this, args)
      }
      await act(async () => root.render(createElement(Probe)))
      let complete, fail
      const finished = new Promise((resolve, reject) => { complete = resolve; fail = reject })
      // Registrar el rechazo desde el inicio, incluso si el dispositivo falla antes de detener.
      finished.catch(() => {})
      let audio
      await act(async () => {
        deadline = window.setTimeout(() => fail(new Error('El MediaRecorder nativo no terminó')), 10000)
        await control.start({
          onRecorded(blob) {
            closedBeforeDelivery = streams.every((stream) => stream.getTracks().every((track) => track.readyState === 'ended'))
            complete(blob)
          },
          onError: (message) => fail(new Error(message)),
        })
        await new Promise((resolve) => window.setTimeout(resolve, 600))
        recorderInstance.requestData()
        await new Promise((resolve) => window.setTimeout(resolve, 600))
        control.stop()
        tracksLiveAfterStop = streams.every((stream) => stream.getTracks().every((track) => track.readyState === 'live'))
        audio = await finished
        window.clearTimeout(deadline)
      })
      const bytes = await audio.arrayBuffer()
      audioContext = new AudioContext()
      const decoded = await audioContext.decodeAudioData(bytes.slice(0))
      return {
        nativeConstructorPreserved: window.MediaRecorder === NativeRecorder,
        nativeStreams: streams.length > 0 && streams.every((stream) => stream instanceof MediaStream),
        size: audio.size, type: audio.type,
        supportedType: NativeRecorder.isTypeSupported(audio.type),
        header: [...new Uint8Array(bytes.slice(0, 4))],
        events, chunkSizes,
        duration: decoded.duration, capturedSeconds: (stoppedAt - startedAt) / 1000,
        channels: decoded.numberOfChannels, samples: decoded.length,
        closedBeforeDelivery, tracksLiveAfterStop,
      }
    } finally {
      window.clearTimeout(deadline)
      await act(async () => root.unmount())
      streams.forEach((stream) => stream.getTracks().forEach((track) => track.stop()))
      await audioContext?.close()
      host.remove()
      NativeRecorder.prototype.start = nativeStart
      NativeRecorder.prototype.stop = nativeStop
      navigator.mediaDevices.getUserMedia = getUserMedia
      window.IS_REACT_ACT_ENVIRONMENT = originalActEnvironment
    }
  })
  assert.equal(result.nativeConstructorPreserved, true)
  assert.equal(result.nativeStreams, true)
  assert.ok(result.size > 0)
  assert.match(result.type, /^audio\/webm/)
  assert.equal(result.supportedType, true)
  assert.deepEqual(result.header, [0x1a, 0x45, 0xdf, 0xa3], 'Contenedor WebM con cabecera EBML válida')
  assert.deepEqual(result.events, ['dataavailable', 'dataavailable', 'stop'])
  assert.ok(result.chunkSizes.every((size) => size > 0), 'Se comprueban fragmentos intermedios y el fragmento final nativos')
  assert.equal(result.chunkSizes.reduce((sum, size) => sum + size, 0), result.size, 'Se conserva todo el audio entregado por el encoder')
  assert.ok(result.channels > 0 && result.samples > 0, 'El audio debe poder decodificarse')
  assert.ok(result.duration >= result.capturedSeconds - 0.25 && result.duration <= result.capturedSeconds + 0.5, 'La duración decodificada debe corresponder a la grabación completa')
  assert.equal(result.tracksLiveAfterStop, true)
  assert.equal(result.closedBeforeDelivery, true)
  console.log(`NATIVE_AUDIO ${JSON.stringify(result)}`)
}
