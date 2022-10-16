const bcrypt = require('bcrypt')

const hashPassword = password => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export const comparePassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword)
}

export default hashPassword