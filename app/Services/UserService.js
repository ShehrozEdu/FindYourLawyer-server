const UserRepository = require("../Repositories/UserRepository");
const bcrypt = require("bcrypt");
const token = require("../Config/token");
const ApiError = require("../middleware/error/ApiError");

class UserService {
    async signup(data) {
        const existingUser = await UserRepository.findByEmail(data.Email);
        if (existingUser) {
            throw new ApiError(400, "Email already exists");
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(data.Password, salt);

        const userData = {
            ...data,
            Password: hashPassword,
        };

        // Note: Token generation logic was inside controller before, 
        // but usually token is generated AFTER user creation or during login.
        // Preserving original logic where token is stored in DB (which is unusual but keeping it for now).
        // Actually, looking at original code, it generates token with ID before creating user? 
        // "const authToken = token(data._id);" -> data._id is undefined for new user!
        // The original code was likely buggy or relying on Mongoose generating ID?
        // Mongoose generates ID on instantiation. 
        // Let's fix this flow: Create user -> Generate Token -> Save (or just return token)

        // Correct flow:
        // 1. Create user instance (to get ID) or just save and get ID.
        // 2. Generate token.
        // 3. Update user with token (if storing token in DB is required by frontend).

        // For now, let's follow standard practice: Create user, then generate token.

        const newUser = await UserRepository.create(userData);
        const authToken = token(newUser._id);

        // Save token to user document (if required by legacy code)
        newUser.token = authToken;
        await newUser.save();

        // Return user info and token in consistent format with login
        return {
            _id: newUser._id,
            Email: newUser.Email,
            FirstName: newUser.FirstName,
            LastName: newUser.LastName,
            token: authToken,
            isLawyer: newUser.isLawyer,
            isAdmin: newUser.isAdmin || false,
            isSuperAdmin: newUser.isSuperAdmin || false,
        };
    }

    async login(email, password) {
        const user = await UserRepository.findByEmail(email);
        if (!user) {
            throw new ApiError(401, "Invalid email or password");
        }

        const isMatch = await bcrypt.compare(password, user.Password);
        if (!isMatch) {
            throw new ApiError(401, "Invalid email or password");
        }

        const authToken = token(user._id);

        // Return user info and token (not saving new token to DB unless required for session management, 
        // but JWT is stateless usually. Original code didn't save new token on login, just returned it).

        return {
            _id: user._id,
            Email: user.Email,
            FirstName: user.FirstName,
            LastName: user.LastName,
            token: authToken,
            isLawyer: user.isLawyer,
            isAdmin: user.isAdmin || false,
            isSuperAdmin: user.isSuperAdmin || false,
        };
    }

    async getAllUsers() {
        return await UserRepository.findAll();
    }

    async getUserById(id) {
        const user = await UserRepository.findById(id);
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        return user;
    }

    async updateUser(id, updateData) {
        return await UserRepository.update(id, updateData);
    }

    async deleteUser(id) {
        return await UserRepository.delete(id);
    }
}

module.exports = new UserService();
