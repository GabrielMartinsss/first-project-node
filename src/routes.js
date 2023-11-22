import { Database } from "./database.js"
import { randomUUID } from "node:crypto"
import buildRoutePath from "./utils/build-route-path.js"

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const tasks = database.select('tasks')

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      const data = {
        id: randomUUID(),
        title,
        description,
        completedAt: null,
        createdAt: new Date(),
        updatedAt: null,
      }

      database.insert('tasks', data)

      return res.writeHead(201).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      database.delete('tasks', id)
      
      return res.writeHead(204).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const { title, description } = req.body
      const newData = {
        title,
        description,
      }

      database.update('tasks', newData, id)
      
      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      database.complete('tasks', id)
      
      return res.writeHead(204).end()
    }
  }
]