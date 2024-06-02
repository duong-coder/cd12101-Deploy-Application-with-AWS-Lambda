import { getUserId } from '../utils.mjs'
import { TodosStatus } from '../../businessLogic/todosStatus.mjs'
import { getTodos } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'

const getTodosLogger = createLogger('getTodos')

export async function handler(event) {
  const userId = getUserId(event)
  getTodosLogger.info("handle get todos", { userId })

  const result = await getTodos(userId)

  return TodosStatus.OK({
    "items": [...result]
  })
}
