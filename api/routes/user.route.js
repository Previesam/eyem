module.exports = app => {
  const user = require("../controllers/user.controller.js");

  const { verifyToken } = require("../config/verify.token");

  // Route to create new user

  app.post("/user/signup", user.create);

  // Route to authenticate user

  app.post("/auth/login", user.authenticate);

  // Route to refresh user

  app.post("/auth/refresh", user.refresh);

  // Route to get all users

  app.get("/users", verifyToken, user.findAll);

  // Route to get authenticated user

  app.get("/auth/user", verifyToken, user.findAuthUser);

  // Route to get single user

  app.get("/user/:id", verifyToken, user.findOne);

  // Route to update user

  app.put("/user/update/:id", user.update);

  // Route to delete user

  app.delete("/user/delete/:id", user.delete);
};
