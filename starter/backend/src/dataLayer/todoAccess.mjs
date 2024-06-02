import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { createLogger } from '../utils/logger.mjs'

const todoAccessLogger = createLogger('todoAccess')
const dynamoDbClient = DynamoDBDocument.from(new DynamoDB())
const todosTable = process.env.TODOS_TABLE
const todosCreatedAtIndex = process.env.TODOS_CREATED_AT_INDEX

export async function getTodosByUserId(userId) {
    todoAccessLogger.info('todoAccess getTodosByUserId', { userId })

    const result = await dynamoDbClient.query({
        TableName: todosTable,
        IndexName: todosCreatedAtIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        }
    })

    return result.Items
}

export async function getTodoByUserIdAndTodoId(userId, todoId) {
    const result = await dynamoDbClient.query({
        TableName: todosTable,
        IndexName: todosCreatedAtIndex,
        KeyConditionExpression: 'userId = :userId AND createdAt <= :createdAt',
        FilterExpression: 'todoId = :todoId',
        ExpressionAttributeValues: {
            ':userId': userId,
            ':todoId': todoId,
            ':createdAt': new Date().toISOString()
        }
    })

    return result.Items[0]
}

export async function getTodoAttachmentUrlByUserIdAndTodoId(userId, todoId) {
    const result = await dynamoDbClient.query({
        TableName: todosTable,
        IndexName: todosCreatedAtIndex,
        ProjectionExpression: 'attachmentUrl',
        KeyConditionExpression: 'userId = :userId AND todoId = :todoId',
        ExpressionAttributeValues: {
            ':userId': userId,
            ':todoId': todoId,
        }
    })

    return result.Items[0]
}

export async function updateAttachmentUrlByUserIdAndTodoId(userId, todoId, attachmentUrl) {
    todoAccessLogger.info('todoAccess updateAttachmentUrl', { attachmentUrl })

    const result = await dynamoDbClient.update({
        TableName: todosTable,
        Key: {
            'userId': userId,
            'todoId': todoId
        },
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
            ':attachmentUrl': attachmentUrl
        },
        ReturnValues: 'ALL_NEW'
    })

    return result
}

export async function insertTodo(newItem) {
    todoAccessLogger.info('todoAccess insert todo', { newItem })

    await dynamoDbClient.put({
        TableName: todosTable,
        Item: newItem
    })
}

export async function updateTodoByItem(updateItem) {
    todoAccessLogger.info('todoAccess update todo', { updateItem })

    await dynamoDbClient.put({
        TableName: todosTable,
        Item: updateItem
    })

    return updateItem
}

export async function deleteTodoByUserIdAndTodoId(userId, todoId) {
    todoAccessLogger.info('todoAccess delete todo', { userId, todoId })

    const result = await dynamoDbClient.delete({
        TableName: todosTable,
        Key: {
            'userId': userId,
            'todoId': todoId
        },
        ReturnValues: 'ALL_OLD'
    })

    return result
}
