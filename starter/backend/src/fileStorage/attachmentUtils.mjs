import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import AWSXRay from 'aws-xray-sdk-core'

const s3Client = new S3Client()
const s3ClientXRay = AWSXRay.captureAWSv3Client(s3Client)

const bucketName = process.env.TODOS_IMAGE_S3_BUCKET
const signedUrlExpiration = process.env.SIGNED_URL_EXPIRATION

export async function getUploadUrl(attachmentId) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: attachmentId
  })

  const url = await getSignedUrl(s3ClientXRay, command, {
    expiresIn: signedUrlExpiration
  })

  return url;
}

export async function getAttachmentUrl(attachmentId) {
  const attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${attachmentId}`
  return attachmentUrl
}
