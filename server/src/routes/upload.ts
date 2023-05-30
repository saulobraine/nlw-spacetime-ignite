import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { r2 } from '../lib/r2'
import { extname } from 'node:path'
import sharp from 'sharp'

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

    let data

    if (mimeTypeRegexImage.test(upload.mimetype)) {
      data = await sharp(buffer).webp({ quality: 30 }).toBuffer()
    } else {
      data = buffer
    }

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

    const fileUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL?.concat(`/${fileName}`)

    return {
      fileUrl,
    }
  })
}
