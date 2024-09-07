import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const COMMENTS_COLLECTION_NAME = 'comments'
const COMMENTS_COLLECTION_SCHEMA = Joi.object({
  movieId: Joi.string().required(),
  movieType: Joi.string().valid('movie', 'tv').required(),
  userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  content: Joi.string().min(1).max(400).required(),
  createAt: Joi.date()
    .iso()
    .default(() => new Date())
})

const createComment = async (data) => {
  const validData = await COMMENTS_COLLECTION_SCHEMA.validateAsync(data)
  const newValidData = {
    ...validData,
    userId: new ObjectId(validData.userId)
  }
  const db = await GET_DB().collection(COMMENTS_COLLECTION_NAME).insertOne(newValidData)
  const result = await GET_DB()
    .collection(COMMENTS_COLLECTION_NAME)
    .aggregate([
      {
        $match: { _id: new ObjectId(db.insertedId) }
      },
      {
        $lookup: {
          from: 'users', // Collection "users" mà bạn muốn join
          localField: 'userId', // Trường trong "comments" tương ứng với user
          foreignField: '_id', // Trường trong "users" là _id
          as: 'user' // Tên trường mới chứa thông tin user
        }
      },
      {
        $unwind: '$user' // Đưa các trường trong "user" ra ngoài tạo thành 1 object thay vì lưu trong mảng với phần tử là object
      },
      {
        $project: {
          _id: 1, // Hiển thị _id của comment
          content: 1, // Hiển thị nội dung comment
          movieId: 1, // Hiển thị movieId
          createAt: 1, // Hiện thị thời gian tạo comment
          'user.name': 1, // Hiển thị tên người dùng
          'user.avatar': 1, // Hiển thị avatar người dùng
          'user.temporaryAvatar': 1 // Hiển thị avatar người dùng
        }
      }
    ])
    .next()
  return result
}

const getCommentsByMovieId = async ({ movieId, movieType }) => {
  if (typeof movieId !== 'string') throw new Error('idMovie là string')
  const result = await GET_DB()
    .collection(COMMENTS_COLLECTION_NAME)
    .aggregate([
      {
        $match: { movieId, movieType }
      },
      {
        $lookup: {
          from: 'users', // Collection "users" mà bạn muốn join
          localField: 'userId', // Trường trong "comments" tương ứng với user
          foreignField: '_id', // Trường trong "users" là _id
          as: 'user' // Tên trường mới chứa thông tin user
        }
      },
      {
        $unwind: '$user' // Đưa các trường trong "user" ra ngoài tạo thành 1 object thay vì lưu trong mảng với phần tử là object
      },
      {
        $project: {
          _id: 1, // Không hiển thị _id của comment
          content: 1, // Hiển thị nội dung comment
          movieId: 1, // Hiển thị movieId
          createAt: 1, // Hiện thị thời gian tạo comment
          'user.name': 1, // Hiển thị tên người dùng
          'user.avatar': 1, // Hiển thị avatar người dùng
          'user.temporaryAvatar': 1 // Hiển thị avatar người dùng
        }
      }
    ])
    .toArray()
  return result
}
export const commentModel = {
  COMMENTS_COLLECTION_NAME,
  COMMENTS_COLLECTION_SCHEMA,
  createComment,
  getCommentsByMovieId
}
