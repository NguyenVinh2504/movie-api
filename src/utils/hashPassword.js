import bcryct from 'bcrypt'

const hashPassword = async (password) => {
  const salt = await bcryct.genSalt(10)
  const hashed = await bcryct.hash(password, salt)
  return hashed
}

export default hashPassword