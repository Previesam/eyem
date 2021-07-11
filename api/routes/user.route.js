module.exports = app => {
  const user = require("../controllers/user.controller.js");

  const { verifyToken } = require("../config/verify.token");

  // Route to request account creation

  app.post("/user/pre-signup", user.preCreate);

  // Route to create new user

  app.post("/user/signup", verifyToken, user.create);

  // Route to activate user

  app.post("/user/activate/:code", user.activate);

  // Route to set user password

  app.post("/user/set-password/:code", user.setPassword);

  // Route to authenticate user

  app.post("/auth/login", user.authenticate);

  // Route to refresh user token

  app.post("/auth/refresh", user.refresh);

  // Route to get all users

  app.get("/users", verifyToken, user.findAll);

  // Route to get authenticated user

  app.get("/auth/user", verifyToken, user.findAuthUser);

  // Route to get single user

  app.get("/user/:id", verifyToken, user.findOne);

  // Route to update user profile

  app.put("/user/update-profile/:id", verifyToken, user.update);

  // Route to update user password

  app.put("/user/update-password/:id", verifyToken, user.updatePassword);

  // Route to delete user

  app.delete("/user/delete/:id", verifyToken, user.delete);
};
