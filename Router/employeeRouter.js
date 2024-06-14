const express=require('express')
const router=express.Router();
const{authRegistration, getAuthPost,
    // authLogin,
    LoginPost,getAuthDetails,logOut}=require('../Controller/employeeController')

const multer=require('multer')

const path = require('path');

const fileStorage=multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,path.join(__dirname,"..","uploads","auth"),(err,data)=>{
            if(err) throw err;
        })
    },
    filename:(req,file,callback)=>{
        callback(null,file.originalname,(err,data)=>{
            if(err) throw err;
        })
    }
}); 

const fileFilter=(req,file,callback)=>{
    if(
        file.mimetype.includes("png")||
        file.mimetype.includes("jpg")||
        file.mimetype.includes("jpeg")||
        file.mimetype.includes("webp")
    ){
        callback(null,true);
    }else{
        callback(null,false);
    }
};

const upload=multer({
    storage:fileStorage,
    fileFilter:fileFilter,
    limits:{fieldSize:1024*1024*5}
});

const upload_type=upload.fields([{name:'employeeImages',maxCount:1}]);

router.get('/employee/registration',authRegistration);
 router.post('/authPost',upload_type,getAuthPost);
// router.post('/authPost',getAuthPost);

// router.get('/login',authLogin);
router.post('/loginPost',LoginPost);
router.get('/detail',getAuthDetails);
router.get('/logout',logOut);

module.exports=router;







// const express = require('express');
// const router=express.Router();
// const {
//   getDashboard,
//   editEmployee,
//   deleteEmployee,
//   updateEmployee
// } = require('../Controller/employeeController');


// router.get('/dashboard', getDashboard);
// router.get('/edit/:id', editEmployee);
// router.post('/edit/:id', updateEmployee);
// router.post('/delete/:id', deleteEmployee);

// module.exports = router;
