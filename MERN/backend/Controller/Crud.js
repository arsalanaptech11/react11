const User = require("../Collection/User"); 
const crypt = require("bcrypt");

const Crud = {
    create : async function(req,res){
        try {
            const {Name,Email,Passw, Age} = req.body;
            const email_check = await User.findOne({email : Email})
            if(email_check){
                res.status(409).json({msg : "Email Already Exist"})

            }
            else{
                const crypt_pass = crypt.hashSync(Passw,15)
                const save_data = new User({
                    name: Name,
                    email: Email,
                    password: crypt_pass,
                    age:Age,
                })
                save_data.save()
                res.status(201).json({m : "User Registered Sucessfully"})
            }
           
        } catch (error) {
            res.status(201).json({m : error.message})
        }
    }
}

module.exports = Crud