const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    fullName: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    phone: {
        type: Number,
        require: true,
    },
    address: {
        type: String,
        require: true,
    },

    state: {
        type: String,
        require: true,
    },
    zipCode: {
        type: Number,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    dateOfJoining: {
        type: Date,
        require: true,
    },
    images: {
        type: [String],
        require: true,
    },
},
{timestamps:true,versionKey:false}
);

const employeeModel=new mongoose.model("employee_details",employeeSchema);
module.exports=employeeModel;








