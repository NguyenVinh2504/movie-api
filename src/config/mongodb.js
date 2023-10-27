import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from './environment.js'

let movieAppDatabaseInstance = null

//Khởi tạo một đối tượng CLient Instrance để connect tới MongoDB
const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export const CONNECT_DB = async () => {
  // Gọi kết nối tới MongoDB Atlas với URL đã khai báo trong thân của mongoClientInstance
  await mongoClientInstance.connect()

  //Kết nối thành công thì lấy ra DataBase theo tên và gán vào biến movieAppDatabaseInstance
  movieAppDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME)
}

// Đảm bảo chỉ luôn gọi cái getDB này sau khi đã kết nối thành công tới MongoDB
export const GET_DB = () => {
  if (!movieAppDatabaseInstance) throw new Error('Hãy kết nối đến cơ sở dữ liệu trước')
  return movieAppDatabaseInstance
}

//Đóng kêt nối tới Database khi cần
export const CLOSE_DB = async () => {
  await mongoClientInstance.close
}