import assert from 'node:assert/strict'

/** Ejercita el hook real con React en Chromium; solo se simulan los dispositivos y fallos del navegador. */
export async function verifyRecorder(page, scenario) {
  await page.route('**/recorder-harness', (route) => route.fulfill({ contentType: 'text/html', body: '<!doctype html><html><body></body></html>' }))
  await page.goto(new URL('/recorder-harness', page.url()).href)
  const result = await page.evaluate(async (scenario) => {
    const { createElement, act, useEffect, createRoot, useVoiceRecorder } = await import('/tests/recorderHarness.ts')
    const originalRecorder = window.MediaRecorder
    const originalGetUserMedia = navigator.mediaDevices.getUserMedia
    const originalSetTimeout = window.setTimeout
    const originalClearTimeout = window.clearTimeout
    const originalActEnvironment = window.IS_REACT_ACT_ENVIRONMENT
    const stats = { requests: 0, recorded: 0, errors: [], tracks: [], pendingTimers: 0, closedBeforeDelivery: true }
    const timers = new Map()
    const recorders = []
    let releasePermission
    let control
    let otherControl
    let deliveredAudio
    let deliverFinalChunks
    let mounted = true
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    const handlers = {
      onRecorded(audio) {
        deliveredAudio = audio
        stats.recorded++
        stats.audioSize = audio.size
        stats.closedBeforeDelivery = stats.tracks.every(({ readyState }) => readyState === 'ended')
      },
      onError(message) { stats.errors.push(message) },
    }
    class Recorder {
      static isTypeSupported() { return true }
      constructor() {
        if (scenario === 'constructor') throw new Error('constructor fixture')
        this.state = 'inactive'
        this.mimeType = 'audio/webm'
        recorders.push(this)
      }
      start() {
        if (scenario === 'start') throw new Error('start fixture')
        this.state = 'recording'
      }
      stop() {
        if (scenario === 'stop-failure') throw new Error('stop fixture')
        this.state = 'inactive'
        if (scenario === 'missing-stop') return
        if (scenario === 'final-chunks') {
          deliverFinalChunks = () => {
            this.ondataavailable?.({ data: new Blob(['primer fragmento;']) })
            this.ondataavailable?.({ data: new Blob(['fragmento final']) })
            this.onstop?.()
          }
          return
        }
        queueMicrotask(() => {
          this.ondataavailable?.({ data: new Blob(scenario === 'empty' ? [] : ['fixture-audio']) })
          if (scenario === 'data-without-stop') return
          this.onstop?.()
        })
      }
    }
    function Probe() {
      const primary = useVoiceRecorder()
      const secondary = useVoiceRecorder()
      useEffect(() => { control = primary; otherControl = secondary })
      return null
    }
    async function unmount() {
      if (!mounted) return
      mounted = false
      await act(async () => root.unmount())
    }
    try {
      window.IS_REACT_ACT_ENVIRONMENT = true
      window.MediaRecorder = Recorder
      window.setTimeout = (callback, ms, ...args) => {
        if (ms !== 180000 && ms !== 5000) return originalSetTimeout(callback, ms, ...args)
        const id = 100000 + timers.size
        timers.set(id, callback)
        return id
      }
      window.clearTimeout = (id) => {
        if (timers.has(id)) timers.delete(id)
        else originalClearTimeout(id)
      }
      navigator.mediaDevices.getUserMedia = async () => {
        stats.requests++
        if (scenario === 'denied') throw new DOMException('fixture', 'NotAllowedError')
        const track = { readyState: 'live', stop() { this.readyState = 'ended' } }
        stats.tracks.push(track)
        const stream = { getTracks: () => [track] }
        if (['concurrent', 'late-permission', 'cancel-permission'].includes(scenario)) {
          return await new Promise((resolve) => { releasePermission = () => resolve(stream) })
        }
        return stream
      }
      await act(async () => root.render(createElement(Probe)))
      if (['concurrent', 'late-permission', 'cancel-permission'].includes(scenario)) {
        const pending = control.start(handlers)
        if (scenario === 'concurrent') await control.start(handlers)
        else if (scenario === 'late-permission') await unmount()
        else await act(async () => control.stop())
        await act(async () => { releasePermission(); await pending })
      } else {
        await act(async () => control.start(handlers))
      }
      if (scenario === 'another-field') await act(async () => otherControl.start(handlers))
      if (scenario === 'error') await act(async () => recorders[0].onerror())
      if (scenario === 'timeout') await act(async () => [...timers.values()][0]())
      if (['stop', 'stop-failure', 'concurrent', 'empty', 'final-chunks', 'missing-stop', 'data-without-stop'].includes(scenario)) {
        await act(async () => { control.stop(); control.stop() })
      }
      if (scenario === 'final-chunks') {
        stats.tracksLiveBeforeFinalChunk = stats.tracks.every(({ readyState }) => readyState === 'live')
        stats.deliveredBeforeFinalChunk = stats.recorded
        await act(async () => deliverFinalChunks())
      }
      if (['missing-stop', 'data-without-stop'].includes(scenario)) {
        await act(async () => [...timers.values()][0]())
        stats.releasedAfterDeadline = stats.tracks.every(({ readyState }) => readyState === 'ended')
        // La exclusión global debe quedar libre sin depender de desmontar el hook anterior.
        await act(async () => otherControl.start(handlers))
      }
      await unmount()
      await Promise.resolve()
      stats.pendingTimers = timers.size
      stats.audioText = deliveredAudio ? await deliveredAudio.text() : null
      return { ...stats, tracks: stats.tracks.map(({ readyState }) => readyState) }
    } finally {
      await unmount()
      host.remove()
      window.MediaRecorder = originalRecorder
      navigator.mediaDevices.getUserMedia = originalGetUserMedia
      window.setTimeout = originalSetTimeout
      window.clearTimeout = originalClearTimeout
      window.IS_REACT_ACT_ENVIRONMENT = originalActEnvironment
    }
  }, scenario)
  const missingStop = ['missing-stop', 'data-without-stop'].includes(scenario)
  assert.equal(result.requests, missingStop ? 2 : 1, 'La exclusión global impide duplicados y permite volver a grabar tras el plazo de seguridad')
  assert.ok(result.tracks.every((state) => state === 'ended'), 'No debe quedar ninguna pista activa')
  assert.equal(result.pendingTimers, 0, 'No debe quedar el temporizador de grabación')
  const shouldDeliver = ['stop', 'concurrent', 'timeout', 'final-chunks'].includes(scenario)
  assert.equal(result.recorded, shouldDeliver ? 1 : 0, 'Solo se entrega audio al detener normalmente')
  if (shouldDeliver) {
    assert.ok(result.audioSize > 0)
    assert.equal(result.closedBeforeDelivery, true)
  }
  if (['constructor', 'start', 'error', 'denied', 'stop-failure', 'another-field', 'empty', 'missing-stop', 'data-without-stop'].includes(scenario)) assert.equal(result.errors.length, 1)
  if (missingStop) assert.equal(result.releasedAfterDeadline, true)
  if (scenario === 'empty') assert.match(result.errors[0], /no contiene audio/)
  if (scenario === 'final-chunks') {
    assert.equal(result.deliveredBeforeFinalChunk, 0)
    assert.equal(result.tracksLiveBeforeFinalChunk, true)
    assert.equal(result.audioText, 'primer fragmento;fragmento final')
  }
  if (['late-permission', 'cancel-permission', 'unmount'].includes(scenario)) assert.deepEqual(result.errors, [])
}
