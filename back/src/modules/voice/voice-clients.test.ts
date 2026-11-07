import assert from 'node:assert/strict'
import { mock, test } from 'node:test'
import { HttpError } from '../../utils/HttpError'
import { createAssemblyAiClient } from './assemblyAiClient'
import { createElevenLabsClient } from './elevenLabsClient'

const audio = Buffer.from('fixture-audio')
const json = (payload: object, status = 200) => new Response(JSON.stringify(payload), { status })

/** Responde en orden y registra las llamadas, sin tocar la red. */
function scriptedFetch(...responses: Response[]) {
  return mock.fn(async (_url: string | URL | Request, _init?: RequestInit) => {
    const next = responses.shift()
    assert.ok(next, 'Llamada inesperada al proveedor')
    return next
  }) as unknown as typeof fetch & { mock: { calls: { arguments: [string, RequestInit] }[] } }
}

const transcriber = (fetchFn: typeof fetch, timeoutMs?: number) => createAssemblyAiClient({ apiKey: 'fixture-key', fetchFn, pollIntervalMs: 1, timeoutMs })
const rejectsWith = (status: number) => (error: unknown) => error instanceof HttpError && error.status === status

test('AssemblyAI: sube el audio, pide español y espera hasta que la transcripción termina', async () => {
  const fetchFn = scriptedFetch(
    json({ upload_url: 'https://cdn.fixture/audio' }),
    json({ id: 'transcript-1', status: 'queued' }),
    json({ id: 'transcript-1', status: 'processing' }),
    json({ id: 'transcript-1', status: 'completed', text: ' Cambiar la fuente. ' }),
  )
  assert.equal(await transcriber(fetchFn).transcribe(audio), 'Cambiar la fuente.')

  const [upload, submit] = fetchFn.mock.calls
  assert.equal(upload.arguments[0], 'https://api.assemblyai.com/v2/upload')
  assert.equal(new Headers(upload.arguments[1].headers).get('authorization'), 'fixture-key')
  assert.deepEqual(JSON.parse(String(submit.arguments[1].body)), {
    audio_url: 'https://cdn.fixture/audio',
    language_code: 'es',
    speech_models: ['universal-3-pro', 'universal-2'],
  })
  assert.equal(fetchFn.mock.calls.length, 4)
})

test('AssemblyAI: el audio sin voz responde 422 y un rechazo del proveedor 502', async () => {
  const silent = scriptedFetch(json({ upload_url: 'u' }), json({ id: '1', status: 'queued' }), json({ id: '1', status: 'error', error: 'file has no spoken audio' }))
  await assert.rejects(transcriber(silent).transcribe(audio), rejectsWith(422))

  const empty = scriptedFetch(json({ upload_url: 'u' }), json({ id: '1', status: 'queued' }), json({ id: '1', status: 'completed', text: '' }))
  await assert.rejects(transcriber(empty).transcribe(audio), rejectsWith(422))

  mock.method(console, 'error', () => undefined)
  await assert.rejects(transcriber(scriptedFetch(json({ error: 'unauthorized' }, 401))).transcribe(audio), rejectsWith(502))
})

test('AssemblyAI: una transcripción que no termina responde 504', async () => {
  const neverEnds = (async (_url: string | URL | Request, init?: RequestInit) => {
    init?.signal?.throwIfAborted()
    return String(_url).endsWith('/upload') ? json({ upload_url: 'u' }) : json({ id: '1', status: 'processing' })
  }) as typeof fetch
  await assert.rejects(transcriber(neverEnds, 20).transcribe(audio), rejectsWith(504))
})

test('ElevenLabs: envía texto, voz y modelo, y devuelve el audio', async () => {
  const fetchFn = scriptedFetch(new Response(Buffer.from('mp3-bytes')))
  const client = createElevenLabsClient({ apiKey: 'fixture-key', voiceId: 'voice-1', modelId: 'model-1', fetchFn })
  assert.equal((await client.synthesize('Hola')).toString(), 'mp3-bytes')

  const [url, init] = fetchFn.mock.calls[0].arguments
  assert.equal(url, 'https://api.elevenlabs.io/v1/text-to-speech/voice-1')
  assert.equal(new Headers(init.headers).get('xi-api-key'), 'fixture-key')
  assert.deepEqual(JSON.parse(String(init.body)), { text: 'Hola', model_id: 'model-1' })
})

test('ElevenLabs: un rechazo del proveedor responde 502 sin exponer el detalle', async () => {
  mock.method(console, 'error', () => undefined)
  const client = createElevenLabsClient({ apiKey: 'fixture-key', voiceId: 'v', modelId: 'm', fetchFn: scriptedFetch(json({ detail: 'quota' }, 401)) })
  await assert.rejects(client.synthesize('Hola'), rejectsWith(502))
})
