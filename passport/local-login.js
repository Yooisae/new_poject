// const passport = require('passport')
// const LocalStrategy = require('passport-local')
// const authDAO = require('../models/authDAO')
// const bkfd = require('../middlewares/bkfd2')

// module.exports = () => {
//     passport.use('local-login', new LocalStrategy({
//         usernameField: 'user_id',
//         passwordField: 'user_pw'
//     }, async (user_id, user_pw, done) => {
//         try {
//             // salt값, salt된 password값을 가져옵니다.
//             const user = await authDAO.passportCheckUserLogin(user_id)
//             // 입력한 user_pw값과 salt된 user_pw값을 확인후 반환해주는 부분입니다.
//             const result = await bkfd.decryption(user_pw, user.salt, user.user_pw);
//             return done(null, user)
//         } catch (error) {
//             return done(null, false, { message: error })
//         }
//     }))
// }