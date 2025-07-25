const User = require("../Collection/User");
const crypt = require("bcrypt");
const mail = require("nodemailer");
require("dotenv").config()

const secure_info = mail.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSKEY
    }
})



const Crud = {
   create: async function (req, res) {
    try {
        const { name, email, passw, age } = req.body;

        // Ensure all fields are provided
        if (!name || !email || !passw || !age) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        // Check if email already exists
        const email_check = await User.findOne({ email });
        if (email_check) {
            return res.status(409).json({ msg: "Email already exists" });
        }

        // Hash password
        const crypt_pass = crypt.hashSync(passw, 15);

        // Save user
        const save_data = new User({
            name,
            email,
            password: crypt_pass,
            age: Number(age),
        });

        await save_data.save();

        // Send email
        const EmailBodyInfo = {
            to: email,
            from: process.env.EMAIL,
            subject: "Account Registered",
            html: `<h3>Hello ${name}</h3><p>Your account has been successfully registered.</p>`,
        };

        secure_info.sendMail(EmailBodyInfo, function (err, info) {
            if (err) {
                console.log("Email Error:", err);
            } else {
                console.log("Email sent:", info.response);
            }
        });

        res.status(201).json({ msg: "User registered successfully" });

    } catch (error) {
        console.error("Error in create user:", error);
        res.status(500).json({ msg: error.message });
    }
},

    read: async function (req, res) {
        try {
            const user_data = await User.find()
            res.status(201).json(user_data)

        } catch (error) {
            console.log(error.msg)
            res.status(504).json({ msg: error.msg })

        }
    },
    delete: async function (req, res) {
        try {
            const userId = req.params.id;
            await User.findByIdAndDelete(userId);
            res.json({ m: "User deleted successfully" });
        } catch (error) {
            res.status(500).json({ m: error.message });
        }
    },
    update: async function (req, res) {
        try {
            const userId = req.params.id;
            const { name, email, passw, age } = req.body;

            const updatedData = {
                name,
                email,
                age,
            };

            if (passw) {
                updatedData.password = crypt.hashSync(passw, 15);
            }

            const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
                new: true,
            });

            if (!updatedUser) {
                return res.status(404).json({ msg: "User not found" });
            }

            res.json({ msg: "User updated successfully", user: updatedUser });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },




}

module.exports = Crud