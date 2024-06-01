import { getUserId } from '../utils.mjs'
import { TodosStatus } from '../../businessLogic/todosStatus.mjs'
import { deleteTodo } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'

const deleteLogger = createLogger('deleteLogger')

export async function handler(event) {
  const userId = getUserId(event)
  const todoId = event.pathParameters.todoId

  deleteLogger.info("handle delete todo", { userId, todoId })

  // Remove a TODO item by id
  const result = await deleteTodo(userId, todoId)

  return TodosStatus.OK(result)
}

