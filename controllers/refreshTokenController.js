// const userDB = {
//   users: require('../model/users.json'),
//   setUsers: function (data) {
//     this.users = data;
//   },
// };
const User = require('../model/User');

const jwt = require('jsonwebtoken');
// require('dotenv').config();

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  // if it just set status(401), the response will not stop, only using sendStatus(401), it means send a response.
  if (!cookies?.jwt) return res.sendStatus(401);
  // console.log(cookies.jwt);
  const refreshToken = cookies.jwt;
  console.log(refreshToken);

  //according to the structure of UserSchema, we can look for the data based on a field value.
  const foundUser = await User.findOne({ refreshToken }).exec();

  if (!foundUser) return res.sendStatus(403); //Unauthorized, it's not the real user
  //evaluate jwt

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username)
      return res.sendStatus(403);
    const roles = Object.values(foundUser.roles);
    const accessToken = jwt.sign(
      { UserInfo: { username: decoded.username, roles: roles } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '120s' }
    );
    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
