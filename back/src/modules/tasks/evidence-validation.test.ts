import assert from 'node:assert/strict'
import test from 'node:test'
import sharp from 'sharp'
import { isValidEvidenceImage } from './evidenceValidation'

test('acepta imágenes decodificables JPG, PNG y WEBP', async () => {
  const image = sharp({ create: { width: 2, height: 2, channels: 3, background: '#fff' } })
  const [jpeg, png, webp] = await Promise.all([image.clone().jpeg().toBuffer(), image.clone().png().toBuffer(), image.clone().webp().toBuffer()])
  assert.equal(await isValidEvidenceImage('image/jpeg', jpeg), true)
  assert.equal(await isValidEvidenceImage('image/png', png), true)
  assert.equal(await isValidEvidenceImage('image/webp', webp), true)
})

test('rechaza MIME no permitido, firmas falsas y archivos truncados', async () => {
  const png = await sharp({ create: { width: 2, height: 2, channels: 3, background: '#fff' } }).png().toBuffer()
  assert.equal(await isValidEvidenceImage('application/pdf', Buffer.from('%PDF')), false)
  assert.equal(await isValidEvidenceImage('image/png', Buffer.from('not an image')), false)
  assert.equal(await isValidEvidenceImage('image/jpeg', Buffer.from([0xff, 0xd8, 0xff])), false)
  assert.equal(await isValidEvidenceImage('image/png', png.subarray(0, Math.floor(png.length / 2))), false)
})