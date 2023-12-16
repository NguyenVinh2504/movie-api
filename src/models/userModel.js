import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { favoriteModel } from './favoriteModel'
const USER_COLLECTION_NAME = 'users'

const getUserName = async (data) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({ name: data })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getEmail = async (data) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).aggregate([
      {
        $match: {
          email: data,
          _destroy: false
        }
      },
      {
        $lookup: {
          from: favoriteModel.FAVORITE_COLLECTION_NAME,
          localField: '_id',
          foreignField: 'userId',
          as: 'favorites'
        }
      }
    ]).toArray()
    return result[0] || null

  } catch (error) {
    throw new Error(error)
  }
}

const getIdUser = async (data) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({ _id: new ObjectId(data), _destroy: false })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getInfo = async (data) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).aggregate([
      {
        $match: {
          _id: new ObjectId(data),
          _destroy: false
        }
      },
      {
        $lookup: {
          from: favoriteModel.FAVORITE_COLLECTION_NAME,
          localField: '_id',
          foreignField: 'userId',
          as: 'favorites'
        }
      }, {
        $project: { _id: 0, password: 0 }
      }
    ]).toArray()
    return result[0] || null
  } catch (error) {
    throw new Error(error)
  }
}

// const pushFavorites = async (favorite) => {
//   try {
//     const result = await GET_DB().collection(USER_COLLECTION_NAME).findOneAndUpdate({ _id: new ObjectId(favorite.userId) }, {
//       $push: { favoriteIds: new ObjectId(favorite._id) }
//     }, { returnDocument: 'after' })
//     return result.value
//   } catch (error) {
//     throw new Error(error)
//   }
// }

const deleteUser = async (data) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).updateOne({ _id: new ObjectId(data) }, {
      $set: { _destroy: true }
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const updateProfile = async (data) => {
  const { id, body } = data
  try {
    await GET_DB().collection(USER_COLLECTION_NAME).updateOne({ _id: new ObjectId(id) }, {
      $set: { ...body }
    })
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({ _id: new ObjectId(id) }, {
      projection: { password: 0 }
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const userModel = {
  USER_COLLECTION_NAME,
  getUserName,
  getEmail,
  getIdUser,
  // pushFavorites,
  deleteUser,
  updateProfile,
  getInfo
}
