const Employee = require('../Model/employeeModel');

exports.register = async (req, res) => {
    try {
        const { fullName, email, phone, address, state, zipCode, password, dateOfJoining } = req.body;
        let images = [];

        if (req.files) {
            req.files.forEach(file => {
                images.push(file.path);
            });
        }

        const newEmployee = new employeeModel({
            fullName,
            email,
            phone,
            address,
            state,
            zipCode,
            password,
            dateOfJoining,
            images
        });

        await newEmployee.save();
        console.log("Employee registered successfully");
    } catch (err) {
        console.log(" error message");
    }
};

exports.login = async (req, res) => {
    try {
        // console.log("sign in data",req.body);
        let existingUser = await employeeModel.findOne({ Email: req.body.email })
        // console.log("existing_user",existingUser)
        if (existingUser) {
            let result = await bcrypt.compare(req.body.password, existingUser.Password)
            // console.log("check password",result);
            if (result) {
                req.session.isloggedin = true;
                req.session.user = existingUser;

                await req.session.save(err => {
                    if (err) {
                        console.log("Session saving error", err);
                    }
                    else {
                        console.log("Login successful");
                        res.redirect("/");
                    }
                });

            } else {

                req.flash("error", "Wrong Password")
                res.redirect("/login")
            }
        }
        else {
            req.flash("error", "Invalid email")
            res.redirect("/login")
        }
    }
    catch (err) {
        console.log("user not found", err);
    }
}