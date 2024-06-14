
const fs = require('fs');
const path = require('path');
const bcrypt = require("bcryptjs");
const employeeModel = require('../Model/employeeModel');

const authRegistration = (req, res) => {
    // let errorSms=req.flash("err");
    // console.log("The flash error sms is:",errorSms);
    
    // if(errorSms.length>0){
    //     errorSms=errorSms[0];
    // }
    // else{
    //     errorSms=null;
    // }
    res.render('employee/registration', {
        title: 'authForm',
        // errorData:errorSms
    })
}

const getAuthPost = async (req, res) => {
    try {
        console.log("Collected data: ", req.body,req.files);
        // console.log("Collected data: ", req.body);
        
    //     if (req.body.password === req.body.cnf_password) {
    //         let hashPassword = await bcrypt.hash(req.body.password, 12)
    //         console.log("hashing", hashPassword);

    //         let formValue = new employeeModel({
    //             Full_name: req.body.fullName.toLowerCase(),
    //             Email: req.body.email,
    //             Phone: req.body.phone,
    //             Address: req.body.address,
    //             State: req.body.state,
    //             Zipcode:req.body.zipCode,
    //             Date_of_Joining:req.body.dateOfJoining,
    //             Password: hashPassword,
    //             Employee_image: req.files.userimage[0].filename,
    //         });
    //         let saved = await formValue.save();
    //         if (saved) {
    //             console.log("Registration data saved");
    //         }
    //     }
    //     else {
    //         res.send("Password mismatch")
    //     }
    //      res.redirect('/login');
    }

    catch(err){
        console.log("Data is not collected", err);
    }
}

const LoginPost=async(req,res)=>{
    try{
    // console.log("sign in data",req.body);
    let existingUser= await employeeModel.findOne({Email:req.body.email})
    // console.log("existing_user",existingUser)
    if(existingUser){
        let result=await bcrypt.compare(req.body.password,existingUser.Password)
        // console.log("check password",result);
        // password 
        if(result)
            {
                req.session.isloggedin=true;
                req.session.user=existingUser;

                await req.session.save(err=>{
                    if(err)
                        {
                            console.log("Session saving error",err);
                        }
                        else{
                            console.log("Login successful");
                             res.redirect("/");
                        }
                });

            }else{
                
                req.flash("error", "Wrong Password")
                res.redirect("/login")
            }
    }
    else{
        req.flash("error", "Invalid email")
        res.redirect("/login")
    }
}
catch(err){
    console.log("user not found",err);
}
}

// const authLogin = (req, res) => {
//     let errorSms=req.flash("error");
    
//     console.log("The flash error sms is:",errorSms);
//     let errSms;

//     // if(errorSms.length>0){
//     //     errSms=errorSms[0];
//     // }else{
//     //     errSms=null;
//     // }

//     res.render('employee/login', {
//         title: 'loginAuth',
//         errorData:errorSms
//     })
// }

const getAuthDetails=async(req,res)=>{
    try{
        let id=req.session.user._id;
        console.log(id);
        let user_detail=await employeeModel.findById(id);
        console.log(user_detail);
        if(user_detail){
            res.render('employee/dashboard',{
                title:"user Profile",
                data:user_detail
            })
            res.redirect('/login');
        }
    }
    catch(error){
        console.log("Error to find",error);
    }
}
const viewEditPage = async (req, res) => {
    try {
      let employee_id = req.params.id;
      // console.log("Employment id", employee_id);
      let old = await employeeModel.findById(employee_id);
      // console.log("Collected old Employee by id ", old);
      if (old) {
        res.render('employee/registration', {
          title: "edit employment details",
          data: old
        })
      }
    }
    catch (err) {
      console.log("Employee not found", err)
    }
  }
  
  const EditPage = async (req, res) => {
    try {
      // console.log("Received new value: ", req.body);
      let emp_id = req.body.p_id;
      const formData = new employeeModel(req.body.fullname, req.body.email, req.body.password);
      let updated = formData.updateData(prod_id)
      if (updated) {
        console.log("Employee is saved")
      }
      res.redirect('/admin/showProduct');
    }
    catch (err) {
      console.log("Error for edit", err);
    }
  }
const logOut=async(req,res)=>{
    req.session.destroy();
    res.redirect('/login')
}
module.exports = { authRegistration, getAuthPost,
    // authLogin,
    LoginPost,getAuthDetails,logOut}






// const employeeModel = require('../Model/employeeModel');
// const path = require('path');
// const fs = require('fs');

// exports.getDashboard = async (req, res) => {
//   try {
//     const employee = await employeeModel.findById(req.user.id);
//     res.render('dashboard', { employee });
//   } catch (err) {
//     console.log("There is a error") ;
//   }
// };

// exports.editEmployee =async(req,res)=>{
//   try {
//     const employee = await employeeModel.findById(req.params.id);
//     res.render('editregistration', { employee });
//   } catch (err) {
//     console.log("Employee not found",err);
//   }
// };

// exports.updateEmployee = async (req, res) => {
//   try {
//     const { fullName, phone, address, state, zipCode } = req.body;
//     const employee = await employeeModel.findById(req.params.id);

//     employee.fullName = fullName;
//     employee.phone = phone;
//     employee.address = address;
//     employee.state = state;
//     employee.zipCode = zipCode;

//     if (req.files) {
//       employee.images.forEach(image => {
//         fs.unlinkSync(path.join(__dirname, '..', image));
//       });
//       let images = [];
//       req.files.forEach(file => {
//         images.push(file.path);
//       });
//       employee.images = images;
//     }

//     await employee.save();
//     res.redirect('/employee/dashboard');
//   } catch(err) {
//     console.log("for editing there is a error message");
//   }
// };

// exports.deleteEmployee = async (req, res) => {
//   try {
//     const employee = await employeeModel.findById(req.params.id);
   
//     employee.images.forEach(image => {
//       fs.unlinkSync(path.join(__dirname, '..', image));
//     });
//     await employee.remove();
//     res.redirect('/auth/login');
//   } catch(err) {
//     console.log(" for deleting error message ");
//   }
// };

