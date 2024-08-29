import bcryct from 'bcrypt'
import { userModel } from '~/models/userModel'

const validationsPassword = async (data) => {
  const { id, password } = data
  const user = await userModel.getIdUser(id)
  const validations = await bcryct.compare(password, user.password)
  return validations
}

export default validationsPassword
