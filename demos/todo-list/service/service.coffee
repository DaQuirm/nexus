restify = require 'restify'
node_static = require 'node-static'
mongojs = require 'mongojs'

db = mongojs.connect 'todos-app', ['todos']

server = do restify.createServer
server.use restify.bodyParser mapParams:no

server.get '/todos', (req, res, next) ->
  db.todos.find().sort { date:-1, task:1 }, (err, docs) ->
    res.charSet = 'utf8'
    res.send docs
  do next

server.post '/todos', (req, res, next) ->
  db.todos.insert req.body, (err, docs) ->
    res.charSet = 'utf8'
    res.send 201, docs[0]
  do next

server.get '/todos/:id', (req, res, next) ->
  db.todos.findOne { _id: mongojs.ObjectId req.params.id }, (err, doc) ->
    res.charSet = 'utf8'
    res.send doc
  do next

server.put '/todos/:id', (req, res, next) ->
  data = req.body
  delete data._id
  db.todos.update { _id: mongojs.ObjectId req.params.id }, { $set: data }, (err, doc) ->
    #countdown = (num for num in [60000000..1])
    res.charSet = 'utf8'
    res.send 200, '{}'
  do next

server.del '/todos/:id', (req, res, next) ->
  db.todos.remove { _id: mongojs.ObjectId req.params.id }, (err, doc) ->
    res.charSet = 'utf8'
    res.send 204
  do next

server.listen 3000, ->
  console.log '%s listening at %s', server.name, server.url

file = new node_static.Server './static'
server.get /^\/.*/, (req, res, next) ->
  file.serve req, res, next
