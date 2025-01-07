const bcrypt = require('bcryptjs')

const hashPass = (password) => {
  const salt = bcrypt.genSaltSync(10)
  return bcrypt.hashSync(password, salt)
}

const comparePass = (password, hash) => {
  return bcrypt.compareSync(password, hash)
}

module.exports = { hashPass, comparePass }