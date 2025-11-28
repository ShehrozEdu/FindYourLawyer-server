const mongoose = require("mongoose");
require("dotenv").config();
const bcrypt = require("bcrypt");
const UsersModel = require("../app/Models/UsersModel");

async function createSuperAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Check if super admin already exists
    const existingAdmin = await UsersModel.findOne({ isSuperAdmin: true });
    if (existingAdmin) {
      console.log("Super admin already exists:", existingAdmin.Email);
      await mongoose.connection.close();
      return;
    }

    // Create super admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("Admin@123", salt);

    const superAdmin = new UsersModel({
      FirstName: "Super",
      LastName: "Admin",
      Email: "admin@findyourlawyer.com",
      Password: hashedPassword,
      isLawyer: false,
      isAdmin: true,
      isSuperAdmin: true,
    });

    await superAdmin.save();
    console.log("✅ Super admin created successfully!");
    console.log("Email: admin@findyourlawyer.com");
    console.log("Password: Admin@123");
    console.log("⚠️  Please change the password after first login!");

    await mongoose.connection.close();
  } catch (error) {
    console.error("Error creating super admin:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  createSuperAdmin();
}

module.exports = createSuperAdmin;

