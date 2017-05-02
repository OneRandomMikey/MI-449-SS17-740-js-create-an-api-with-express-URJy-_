var todos = require('./todos.js')
var express = require('express')
var app = express()
var port = process.env.PORT || 8080
var bodyParser = require('body-parser')
app.use(bodyParser.json())

app.get('/', function (request, response) {
  response.json({
    welcome: 'welcome to my todo list API!'
  })
})

app.get('/todos', function (request, response) {
  response.json(todos)
})

app.get('/todos/:slug', function (request, response) {
  if (!todos[request.params.slug]) {
    response.status(404).end('sorry, no such todo: ' + request.params.slug)
    return
  }
  response.json(todos[request.params.slug])
})

app.use(function (request, response, next) {
  response.status(404).end(request.url + ' not found')
})

app.post('/todos', function (request, response) {
  var slug = request.body.name.trim().toLowerCase().split(' ').join('-')
  todos[slug] = {
    name: request.body.name.trim(),
    status: request.body.status
  }
  response.redirect('/todos/' + slug)
})

app.put('/todos/:slug', function (request, response) {
  if (!todos[request.params.slug]) {
    response.status(404).end('sorry, no such todo: ' + request.params.slug)
    return
  }
  var todo = todos[request.params.slug]
  if (request.body.name !== undefined) {
    todo.name = request.body.name.trim()
  }
  if (request.body.status !== undefined) {
    todo.status = request.body.status
  }
  response.redirect('/todos')
})

app.delete('/todos/:slug', function (request, response) {
  if (!todos[request.params.slug]) {
    response.status(404).end('sorry, no such product: ' + request.params.slug)
    return
  }
  delete todos[request.params.slug]
  response.redirect('/todos')
})

app.listen(port)
