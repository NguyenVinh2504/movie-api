import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'

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
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({ email: data, _destroy: false }, {
      projection: { password: 0 }
    })
    return result
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
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({ _id: new ObjectId(data) }, {
      projection: { _id: 0, password: 0 }
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

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
  deleteUser,
  updateProfile,
  getInfo
}
