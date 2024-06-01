import { getUserId } from '../utils.mjs'
import { v4 as uuidv4 } from 'uuid'
import { TodosStatus } from '../../businessLogic/todosStatus.mjs'
import { generateUploadUrl, updateAttachmentUrl } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'

const generateUploadUrlLogger = createLogger('generateUploadUrl')

export async function handler(event) {
  const userId = getUserId(event)
  const todoId = event.pathParameters.todoId
  const attachmentId = uuidv4()

  generateUploadUrlLogger.info("handle generate upload url", { userId, todoId, attachmentId })

  // Return a presigned URL to upload a file for a TODO item with the provided id
  const attachmentPreSignedUrl = await generateUploadUrl(attachmentId)
  await updateAttachmentUrl(userId, todoId, attachmentId)

  return TodosStatus.OK({
    'uploadUrl': attachmentPreSignedUrl
  })
}
