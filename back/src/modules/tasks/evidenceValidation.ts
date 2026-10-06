import sharp from 'sharp'

const imageSignatures: Record<string, (data: Buffer) => boolean> = {
  'image/jpeg': (data) => data.length >= 3 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff,
  'image/png': (data) => data.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  'image/webp': (data) => data.length >= 12 && data.toString('ascii', 0, 4) === 'RIFF' && data.toString('ascii', 8, 12) === 'WEBP',
}

export async function isValidEvidenceImage(mimeType: string, data: Buffer) {
  if (!imageSignatures[mimeType]?.(data)) return false
  const expectedFormat = mimeType === 'image/jpeg' ? 'jpeg' : mimeType.slice('image/'.length)
  try {
    const options = { failOn: 'warning' as const, limitInputPixels: 40_000_000 }
    const metadata = await sharp(data, options).metadata()
    if (metadata.format !== expectedFormat) return false
    await sharp(data, options).resize({ width: 1, height: 1, fit: 'inside' }).toBuffer()
    return true
  } catch {
    return false
  }
}