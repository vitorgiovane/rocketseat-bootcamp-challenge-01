const express = require("express")
const server = express()

server.listen(3000)
server.use(express.json())

requestNumber = 0
server.use((request, response, next) => {
  requestNumber++
  console.log(`Request number: ${requestNumber}.`)
  next()
})

let projects = []

const checkProjectExists = (request, response, next) => {
  const { id } = request.params
  const project = projects.filter(project => project.id === id)
  if (project.length === 0) {
    return response.status(400).json({ error: "Invalid project ID" })
  }

  next()
}

server.get("/projects", (request, response) => {
  response.json(projects)
})

server.get("/projects/:id", checkProjectExists, (request, response) => {
  const { id } = request.params
  const project = projects.filter(project => project.id === id)
  response.json(project)
})

server.post("/projects", (request, response) => {
  const { id, title } = request.body
  const project = { id, title }
  projects.push(project)
  response.json(project)
})

server.put("/projects/:id", checkProjectExists, (request, response) => {
  const { id } = request.params
  const { title } = request.body
  projects.map(project => {
    if (project.id === id) {
      project.title = title
      response.json(project)
    }
  })
})

server.delete("/projects/:id", checkProjectExists, (request, response) => {
  const { id } = request.params
  projects = projects.filter(project => project.id !== id)
  response.send()
})

server.post("/projects/:id/tasks", checkProjectExists, (request, response) => {
  const { id } = request.params
  const { title } = request.body
  projects.map(project => {
    if (project.id === id) {
      project.tasks = []
      project.tasks.push(title)
      response.json(project)
    }
  })
})
