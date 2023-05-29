import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { r2 } from '../lib/r2'
import { extname, resolve } from 'node:path'
import { createWriteStream } from 'node:fs'
import sharp from 'sharp'

const fs = require('fs/promises')
const pump = promisify(pipeline)

export async function uploadRoutes(app: FastifyInstance) {
  app.post('/upload', async (request, reply) => {
    const upload = await request.file({
      limits: {
        fileSize: 10_505_760, // 10mb
      },
    })

    if (!upload) {
      return reply.status(400).send()
    }

    const mimeTypeRegex = /^(image|video)\/[a-zA-Z]+/
    const mimeTypeRegexImage = /^(image)\/[a-zA-Z]+/

    const isValidFileFormat = mimeTypeRegex.test(upload.mimetype)

    if (!isValidFileFormat) {
      return reply.status(400).send()
    }

    const buffer = await upload.toBuffer()

    const fileId = randomUUID()
    const extension = extname(upload.filename)

    const fileName = fileId.concat(extension)

    const filePath = resolve(__dirname, '../../tmp/', fileName)

    if (mimeTypeRegexImage.test(upload.mimetype)) {
      await sharp(buffer).webp({ quality: 20 }).toFile(filePath)
    } else {
      const writeStream = createWriteStream(filePath)
      await pump(upload.file, writeStream)
    }

    const data = await fs.readFile(filePath)

    const signedUrl = await getSignedUrl(
      r2,
      new PutObjectCommand({
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
        Key: fileName,
        ACL: 'public-read',
      }),
      { expiresIn: 120 },
    )

    await fetch(signedUrl, {
      method: 'PUT',
      body: data,
    })

    await fs.unlink(filePath)

    const fileUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL?.concat(`/${fileName}`)

    return {
      fileUrl,
    }
  })
}
