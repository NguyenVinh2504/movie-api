/* eslint-disable no-console */

import express from 'express'
import cors from 'cors'
import { corsOptions } from './config/cors.js'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB } from './config/mongodb.js'
import Routes from './routes/v1/index.js'
import { env } from './config/environment.js'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware.js'
import { StatusCodes } from 'http-status-codes'
import cookieParser from 'cookie-parser'
import { initFolder } from './utils/file.js'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { WHITELIST_DOMAINS } from './utils/constants.js'
import axios from 'axios'
const START_SERVER = () => {
  const app = express()
  const httpServer = createServer(app)
  const io = new Server(httpServer, {
    cors: {
      origin: WHITELIST_DOMAINS,
      credentials: true
    }
  })
  io.on('connection', (socket) => {
    console.log('Socket connected with user have id: ', socket.id)

    // Lắng nghe sự kiện khi client gửi lên server
    socket.on('addComment', (newComment) => {
      io.to(`${newComment.movieId}-${newComment.movieType}`).emit('newComment', newComment)
    })
    // // Lắng nghe sự kiện người dùng tham gia room movie
    socket.on('joinMovieRoom', (idRoom) => {
      socket.join(idRoom) // Tham gia room tương ứng với movieId
      console.log(`User with socket id ${socket.id} joined room ${idRoom}`)
    })
    socket.on('disconnect', () => {
      console.log('Socket disconnected with user have id: ', socket.id)
    })
  })
  //Tạo folder upload
  initFolder()

  app.use((req, res, next) => {
    req.io = io
    next()
  })

  // Bat req cookie
  app.use(cookieParser())

  // Xử lý cors
  app.use(cors(corsOptions))

  // Bật req.body json data
  app.use(express.json())

  // Use APIS V1
  app.use('/api/v1', Routes)

  app.use(express.urlencoded({ extended: false }))

  // Not found API
  app.use('/', (req, res) => {
    res.status(StatusCodes.NOT_FOUND).json({ status: StatusCodes.NOT_FOUND, message: 'Not Found' })
  })

  //Middleware xử lý lỗi tập trung
  app.use(errorHandlingMiddleware)
  if (env.BUILD_MODE === 'production') {
    setInterval(
      () => {
        axios
          .get('https://api.viejoy.site')
          .then(() => {
            // console.log('Server is awake')
          })
          .catch(() => {
            // console.log(error)
          })
      },
      1000 * 60 * 1
    )
  }
  if (env.BUILD_MODE === 'production') {
    httpServer.listen(process.env.PORT, () => {
      // eslint-disable-next-line no-console
      console.log(
        `3.Hello production ${env.AUTHOR}, Back-end Server đang chạy thành công tại Port: ${process.env.PORT}`
      )
    })
  } else {
    httpServer.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
      // eslint-disable-next-line no-console
      console.log(
        `3.Hello ${env.AUTHOR}, Back-end Server đang chạy thành công tại Host: http://${env.LOCAL_DEV_APP_HOST}:${env.LOCAL_DEV_APP_PORT}/`
      )
    })
  }

  //thực hiện các tác vụ clean up trước khi dừng server
  exitHook(() => {
    console.log('4.Đang ngắt kết nối....')
    CLOSE_DB()
    console.log('4.Đã ngắt kết nối')
  })
}
console.log('1.Đang kết.....')
// Chỉ khi kết nối database thành công mới start server
CONNECT_DB()
  .then(() => console.log('2.Kết nối cloud thành công'))
  .then(() => START_SERVER())
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error)
    process.exit(0)
  })
