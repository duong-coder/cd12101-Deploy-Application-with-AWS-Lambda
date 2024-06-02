import { getUserId } from '../utils.mjs'
import { TodosStatus } from '../../businessLogic/todosStatus.mjs'
import { createLogger } from '../../utils/logger.mjs'
import { createTodo } from '../../businessLogic/todos.mjs'

const createTodoLogger = createLogger('createTodo')

export async function handler(event) {
  const newTodo = JSON.parse(event.body)
  const userId = getUserId(event)

  createTodoLogger.info("handle create todo", {
    userId,
    newTodo
  })

  // Implement creating a new TODO item
  const newItem = await createTodo(userId, newTodo)

  return TodosStatus.CREATED({
    "item": newItem
  })
}
