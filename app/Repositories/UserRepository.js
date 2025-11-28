const UsersModel = require("../Models/UsersModel");

class UserRepository {
    async create(userData) {
        const user = new UsersModel(userData);
        return await user.save();
    }

    async findByEmail(email) {
        return await UsersModel.findOne({ Email: email });
    }

    async findById(id) {
        return await UsersModel.findById(id);
    }

    async findAll() {
        return await UsersModel.find({});
    }

    async update(id, updateData) {
        return await UsersModel.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });
    }

    async delete(id) {
        return await UsersModel.findByIdAndDelete(id);
    }
}

module.exports = new UserRepository();
