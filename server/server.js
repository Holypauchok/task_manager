import express from 'express'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import sockjs from 'sockjs'
import { renderToStaticNodeStream } from 'react-dom/server'
import React from 'react'

import cookieParser from 'cookie-parser'
import config from './config'
import Html from '../client/html'

const { readFile, writeFile } = require('fs').promises
const shortid = require('shortid')

const Root = () => ''

try {
  // eslint-disable-next-line import/no-unresolved
  // ;(async () => {
  //   const items = await import('../dist/assets/js/root.bundle')
  //   console.log(JSON.stringify(items))

  //   Root = (props) => <items.Root {...props} />
  //   console.log(JSON.stringify(items.Root))
  // })()
  console.log(Root)
} catch (ex) {
  console.log(' run yarn build:prod to enable ssr')
}

let connections = []

const port = process.env.PORT || 8090
const server = express()
const setHeaders = (req, res, next) => {
  res.set('x-skillcrucial-user', '0c4fc6b0-d95e-4c04-98cf-feefc967bd98')
  res.set('Access-Control-Expose-Headers', 'X-SKILLCRUCIAL-USER')
  next()
}
server.use(setHeaders)

const middleware = [
  cors(),
  express.static(path.resolve(__dirname, '../dist/assets')),
  bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }),
  bodyParser.json({ limit: '50mb', extended: true }),
  cookieParser()
]

middleware.forEach((it) => server.use(it))

const saveFile2 = async (task, category) => {
  return writeFile(`${__dirname}/tasks/${category}.json`, JSON.stringify(task), {
    encoding: 'utf8'
  })
}

const readFiles2 = async (category) => {
  return readFile(`${__dirname}/tasks/${category}.json`, { encoding: 'utf8' })
    .then((data) => JSON.parse(data))
    .catch(async () => {
      const tasks = []
      await saveFile2(tasks, category)
      return tasks
    })
}

server.post('/api/v1/tasks/:category', async (req, res) => {
  const { category } = req.params
  const tasks = await readFiles2(category)
  const newDate = Date.now()
  const newTask = {
    taskId: shortid.generate(),
    title: req.body.title,
    status: 'new',
    _isDeleted: false,
    _createdAt: newDate,
    _deletedAt: null
  }
  await saveFile2([...tasks, newTask], category)
  res.json(newTask)
})

server.get('/api/v1/tasks/:category', async (req, res) => {
  const { category } = req.params
  const tasks = await readFiles2(category)
  const result = tasks.reduce((acc, rec) => {
    const d = new Date(rec['_createdAt'])
    const date = `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`
    if (!rec['_isDeleted']) {
      return [
        ...acc,
        {
          taskId: rec['taskId'],
          title: rec['title'],
          status: rec['status'],
          _createdAt: date
        }
      ]
    }
    return acc
  }, [])
  res.json(result)
})

server.patch('/api/v1/tasks/:category/:id', async (req, res) => {
  const statuses = ['done', 'new', 'in progress', 'blocked']
  const { status } = req.body
  const { category, id } = req.params
  if (statuses.indexOf(status) > -1) {
    const tasks = await readFiles2(category)
    const result = tasks.reduce((acc, rec) => {
      if (rec['taskId'] === id) {
        // eslint-disable-next-line
        rec['status'] = status
        return [...acc, rec]
      }
      return acc
    }, [])
    await saveFile2(tasks, category)
    res.json(result)
  }
  res.status(501).send({ status: 'error', message: 'incorrect status' })
})

server.delete('/api/v1/tasks/:category/:id', async (req, res) => {
  const { category, id } = req.params
  const tasks = await readFiles2(category)
  const newDate = Date.now()
  for (let i = 0; i < tasks.length; i += 1) {
    if (tasks[i]['taskId'] === id) {
      tasks[i]['_isDeleted'] = true
      tasks[i]['_deletedAt'] = newDate
    }
  }
  await saveFile2(tasks, category)
  res.json(tasks)
})

server.get('/api/v1/tasks/:category/:timespan', async (req, res) => {
  const { category, timespan } = req.params
  const tasks = await readFiles2(category)
  let periodOfTime
  switch (timespan) {
    case 'day':
      periodOfTime = 86400000
      break
    case 'week':
      periodOfTime = 7 * 1000 * 60 * 60 * 24
      break
    case 'month':
      periodOfTime = 30 * 1000 * 60 * 60 * 24
      break
    default:
      res.status(501).send({ status: 'error', message: 'incorrect timespan' })
  }
  const result = tasks.reduce((acc, rec) => {
    if (rec['_createdAt'] + periodOfTime > Date.now() && !rec['_isDeleted']) {
      const d = new Date(rec['_createdAt'])
      const date = `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`
      return [
        ...acc,
        {
          title: rec['title'],
          status: rec['status'],
          _createdAt: date
        }
      ]
    }
    return acc
  }, [])
  res.json(result)
})

server.use('/api/', (req, res) => {
  res.status(404)
  res.end()
})

const [htmlStart, htmlEnd] = Html({
  body: 'separator',
  title: 'Skillcrucial - Become an IT HERO'
}).split('separator')

server.get('/', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

server.get('/*', (req, res) => {
  const initialState = {
    location: req.url
  }

  return res.send(
    Html({
      body: '',
      initialState
    })
  )
})

const app = server.listen(port)

if (config.isSocketsEnabled) {
  const echo = sockjs.createServer()
  echo.on('connection', (conn) => {
    connections.push(conn)
    conn.on('data', async () => {})

    conn.on('close', () => {
      connections = connections.filter((c) => c.readyState !== 3)
    })
  })
  echo.installHandlers(app, { prefix: '/ws' })
}
console.log(`Serving at http://localhost:${port}`)
