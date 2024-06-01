import { getUserId } from '../utils.mjs'
import { TodosStatus } from '../../businessLogic/todosStatus.mjs'
import { updateTodo } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'

const updateTodoLogger = createLogger('updateTodo')

export async function handler(event) {
  const userId = getUserId(event)
  const todoId = event.pathParameters.todoId
  const updatedTodo = JSON.parse(event.body)

  updateTodoLogger.info("handle update todo", { userId, todoId, updatedTodo })

  // Update a TODO item with the provided id using values in the "updatedTodo" object
  const updatedItem = await updateTodo(userId, todoId, updatedTodo)

  return TodosStatus.CREATED(updatedItem)
}
