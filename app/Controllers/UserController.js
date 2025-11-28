const UserService = require("../Services/UserService");
const expressAsyncHandler = require("express-async-handler");

const UserController = {
  signup: expressAsyncHandler(async (req, res) => {
    const result = await UserService.signup(req.body);

    // Set JWT in httpOnly cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };
    
    res.cookie('token', result.token, cookieOptions);

    // Return user data without token (token is in httpOnly cookie)
    res.status(200).send({
      status: true,
      user: {
        _id: result._id,
        Email: result.Email,
        FirstName: result.FirstName,
        LastName: result.LastName,
        isLawyer: result.isLawyer,
        isAdmin: result.isAdmin || false,
        isSuperAdmin: result.isSuperAdmin || false,
      },
      message: "Signup successful."
    });
  }),

  login: expressAsyncHandler(async (req, res) => {
    const { Email, Password } = req.body;
    const result = await UserService.login(Email, Password);

    // Set JWT in httpOnly cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };
    
    res.cookie('token', result.token, cookieOptions);

    // Return user data without token (token is in httpOnly cookie)
    res.status(200).send({
      status: true,
      user: {
        _id: result._id,
        Email: result.Email,
        FirstName: result.FirstName,
        LastName: result.LastName,
        isLawyer: result.isLawyer,
        isAdmin: result.isAdmin || false,
        isSuperAdmin: result.isSuperAdmin || false,
      },
      message: "Login successful."
    });
  }),

  logout: expressAsyncHandler(async (req, res) => {
    // Clear cookie with same options used when setting it
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    };
    
    res.clearCookie('token', cookieOptions);
    res.status(200).send({
      status: true,
      message: "Logout successful"
    });
  }),

  fetchall: expressAsyncHandler(async (req, res) => {
    const users = await UserService.getAllUsers();
    res.status(200).send(users);
  }),

  fetchUserById: expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await UserService.getUserById(id);
    res.status(200).send({
      status: true,
      user,
    });
  }),

  updateUser: expressAsyncHandler(async (req, res) => {
    const { _id } = req.user; // Assuming auth middleware populates req.user
    const updateData = {
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
      Email: req.body.Email,
    };
    const user = await UserService.updateUser(_id, updateData);
    res.status(200).send(user);
  }),

  userDelete: expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const deleteUser = await UserService.deleteUser(id);
    res.status(200).send(deleteUser);
  }),
};

module.exports = UserController;
