import { v4 as uuidv4 } from 'uuid'
import { getTodoByUserIdAndTodoId, getTodosByUserId, insertTodo, updateTodoByItem, deleteTodoByUserIdAndTodoId, updateAttachmentUrlByUserIdAndTodoId } from '../dataLayer/todoAccess.mjs'
import { getAttachmentUrl, getUploadUrl } from '../fileStorage/attachmentUtils.mjs'

export async function createTodo(userId, newTodo) {
    const todoId = uuidv4()
    const newItem = {
        userId: userId,
        todoId: todoId,
        createdAt: new Date().toISOString(),
        done: false,
        attachmentUrl: null,
        ...newTodo
    }

    await insertTodo(newItem)

    return newItem
}

export async function getTodos(userId) {
    return await getTodosByUserId(userId)
}

export async function updateTodo(userId, todoId, updatedTodo) {
    const oldedTodo = await getTodoByUserIdAndTodoId(userId, todoId)
    const updatedItem = {
        ...oldedTodo,
        ...updatedTodo
    }
    return await updateTodoByItem(updatedItem)
}

export async function deleteTodo(userId, todoId) {
    return await deleteTodoByUserIdAndTodoId(userId, todoId)
}

export async function generateUploadUrl(attachmentId) {
    const uploadUrl = await getUploadUrl(attachmentId)

    return uploadUrl
}

export async function updateAttachmentUrl(userId, todoId, attachmentId) {
    const attachmentUrl = await getAttachmentUrl(attachmentId)

    await updateAttachmentUrlByUserIdAndTodoId(userId, todoId, attachmentUrl)

    return attachmentUrl
}
