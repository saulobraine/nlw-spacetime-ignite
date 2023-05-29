"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.r2 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
exports.r2 = new client_s3_1.S3Client({
    region: 'auto',
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_API_KEY || '',
        secretAccessKey: process.env.CLOUDFLARE_R2_API_SECRET || '',
    },
});
//# sourceMappingURL=r2.js.map