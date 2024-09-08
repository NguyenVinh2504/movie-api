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
const lookup = {
  from: 'users', // Collection "users" mà bạn muốn join
  localField: 'userId', // Trường trong "comments" tương ứng với user
  foreignField: '_id', // Trường trong "users" là _id
  as: 'user' // Tên trường mới chứa thông tin user
}

const unwind = '$user'

const project = {
  _id: 1, // Hiển thị _id của comment
  content: 1, // Hiển thị nội dung comment
  movieId: 1, // Hiển thị movieId
  movieType: 1, // Hiển thị movieType
  createAt: 1, // Hiện thị thời gian tạo comment
  'user.name': 1, // Hiển thị tên người dùng
  'user.avatar': 1, // Hiển thị avatar người dùng
  'user.temporaryAvatar': 1 // Hiển thị avatar người dùng
}
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
        $lookup: lookup
      },
      {
        $unwind: unwind // Đưa các trường trong "user" ra ngoài tạo thành 1 object thay vì lưu trong mảng với phần tử là object
      },
      {
        $project: project
      }
    ])
    .next()
  return result
}

const getCommentsByMovieId = async ({ movieId, movieType, page, limit }) => {
  if (typeof movieId !== 'string' || typeof movieType !== 'string') throw new Error('movieId, movieType phải là string')
  const skip = (page - 1) * limit
  const result = await GET_DB()
    .collection(COMMENTS_COLLECTION_NAME)
    .aggregate([
      {
        $match: { movieId, movieType }
      },
      {
        $lookup: lookup
      },
      {
        $unwind: unwind // Đưa các trường trong "user" ra ngoài tạo thành 1 object thay vì lưu trong mảng với phần tử là object
      },
      {
        $sort: { createAt: -1 }
      },
      {
        $project: project
      }
    ])
    .skip(skip)
    .limit(limit)
    .toArray()
  return result
}

const countDocument = async (data) => {
  return await GET_DB().collection(COMMENTS_COLLECTION_NAME).countDocuments(data)
}
export const commentModel = {
  COMMENTS_COLLECTION_NAME,
  COMMENTS_COLLECTION_SCHEMA,
  createComment,
  getCommentsByMovieId,
  countDocument
}
