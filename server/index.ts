import { Server as HttpServer, createServer } from 'http'
import next, { NextApiHandler } from 'next'
import express, { Express } from 'express'
import { Server as SocketServer } from 'socket.io'
import { IncomingForm } from 'formidable'
import { rejects } from 'assert'
import fs from 'fs'
import jwt from 'jsonwebtoken'

const port = parseInt(process.env.PORT || "3000", 10)
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const handle: NextApiHandler = nextApp.getRequestHandler()
const secret = process.env.SECRET || ''

nextApp.prepare().then(async () => {
  const expressApp: Express = express()
  const httpServer: HttpServer = createServer(expressApp)
  const socketServer: SocketServer = new SocketServer()

  socketServer.attach(httpServer)

  expressApp.post('/api/cameras/:serial', (req: express.Request, res: express.Response) => {
    const { serial } = req.params
    if (serial === '220325001') {
      const token = jwt.sign(serial, secret)
      res.status(200).json({ token: token, }).end()
    } else {
      res.status(403).end()
    }
  })
  expressApp.post('/api/images/:id', (req: express.Request, res: express.Response) => {
    try {
      const token = req.headers.authorization
      if (token) {
        jwt.verify(token, secret)
        const { id } = req.params
        const form = new IncomingForm()
        form.parse(req, (err, _, files) => {
          if (err) {
            return rejects(err)
          }
          if ('filepath' in files.img) {
            const data = fs.readFileSync(files.img.filepath)
            const event = 'image_' + id
            console.log(event)
            socketServer.emit(event, { base64: Buffer.from(data).toString('base64') })
          }
        })
      } else {
        res.status(401).end()
      }
      res.status(200).end()
    } catch (e) {
      res.status(401).end()
    }
  })
  expressApp.all('*', (req: any, res: any) => handle(req, res))
  httpServer.listen(port)
})
