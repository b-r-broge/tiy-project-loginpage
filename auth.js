const users = require('./users.js');

function auth(userCheck, passCheck) {
  console.log('attempting auth');
  var authenticatedUser = users.user.find(function (user) {
    if (userCheck === user.username && passCheck === user.password) {
      console.log('User & Password Authenticated');
      return user;
    }
  });
  if (authenticatedUser) {
    return true;
  }
  return false;
}

module.exports = {
  checkUser: auth
}
