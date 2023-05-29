"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRoutes = void 0;
const node_crypto_1 = require("node:crypto");
const node_stream_1 = require("node:stream");
const node_util_1 = require("node:util");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const r2_1 = require("../lib/r2");
const node_path_1 = require("node:path");
const node_fs_1 = require("node:fs");
const sharp_1 = __importDefault(require("sharp"));
const fs = require('fs/promises');
const pump = (0, node_util_1.promisify)(node_stream_1.pipeline);
async function uploadRoutes(app) {
    app.post('/upload', async (request, reply) => {
        const upload = await request.file({
            limits: {
                fileSize: 10505760, // 10mb
            },
        });
        if (!upload) {
            return reply.status(400).send();
        }
        const mimeTypeRegex = /^(image|video)\/[a-zA-Z]+/;
        const mimeTypeRegexImage = /^(image)\/[a-zA-Z]+/;
        const isValidFileFormat = mimeTypeRegex.test(upload.mimetype);
        if (!isValidFileFormat) {
            return reply.status(400).send();
        }
        const buffer = await upload.toBuffer();
        const fileId = (0, node_crypto_1.randomUUID)();
        const extension = (0, node_path_1.extname)(upload.filename);
        const fileName = fileId.concat(extension);
        const filePath = (0, node_path_1.resolve)(__dirname, '../../uploads/', fileName);
        if (mimeTypeRegexImage.test(upload.mimetype)) {
            await (0, sharp_1.default)(buffer).webp({ quality: 20 }).toFile(filePath);
        }
        else {
            const writeStream = (0, node_fs_1.createWriteStream)(filePath);
            await pump(upload.file, writeStream);
        }
        const data = await fs.readFile(filePath);
        const signedUrl = await (0, s3_request_presigner_1.getSignedUrl)(r2_1.r2, new client_s3_1.PutObjectCommand({
            Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
            Key: fileName,
            ACL: 'public-read',
        }), { expiresIn: 120 });
        await fetch(signedUrl, {
            method: 'PUT',
            body: data,
        });
        await fs.unlink(filePath);
        const fileUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL?.concat(`/${fileName}`);
        return {
            fileUrl,
        };
    });
}
exports.uploadRoutes = uploadRoutes;
//# sourceMappingURL=upload.js.map