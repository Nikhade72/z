const express=require("express");
const router=express.Router();

const userModel=require("../model/userModel");
const adminModel=require("../model/adminModel");

 router.use(express.urlencoded({extended:false}));
 router.use(express.json());
 const bcrypt = require('bcrypt');
 const jwt = require('jsonwebtoken');

//  user signup
 router.post("/signup", async (req,res)=>{
    const userData= req.body;
    const data= await userModel(userData).save();
    res.json({message:"saved succesfully"});

 })

 //add admin credential
router.post("/admin", async (req,res)=>{
    const userData= req.body;
    const data= await adminModel(userData).save();
    res.json({message:"saved succesfully"});

 })


// router.post("/login",async (req,res)=>{
//     const email=req.body.email;
//     const password=req. body.password;
//     console.log(email);
//     console.log(password);
//     const user= await userModel.findOne({email:email});
//     try {
        
//         if(user){
//              try {
//                 console.log(user)
//                 if(user.password==password){
                
//                    console.log(user)
//                     res.json({message:"login successfull",data:user});
//                 }
//                 else{
//                     res.json({message:"login fails"});
//                 }
//             } 
//             catch (error) {
//             res.json("error");
//             }
//         }
//         else{
//             console.log(email);
//             const admin= await adminModel.findOne({email:email});
//             console.log(admin)
//             if(admin){
//                 try {
//                     if(admin.password==password){
//                          console.log(admin)
//                          res.json({message:"admin login successfull"});
//                     }
//                      else{
//                         res.json({message:"password doesn't match"}); 
//                     }
//                 } 
//                 catch (error) {
//                     res.json("error");
//                 }
//            }
//            else{
//             res.json({message:"no such user found"}); 
//            }
//         }
//     } 
//     catch (error) {
//         res.json({message:"no such user"});
//     }
   
// })

router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await userModel.findOne({ email: email });

    if (user) {
      try {
        if (user.password === password) {
          // Generate a JWT token for the user
          const token = jwt.sign({ userId: user._id }, "Harsha", {
            expiresIn: "1d", // Token expiration time (adjust as needed)
          });

          res.json({ message: "login successful", data: user, token });
        } else {
          res.json({ message: "login fails" });
        }
      } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
      }
    } else {
      const admin = await adminModel.findOne({ email: email });

      if (admin) {
        try {
          if (admin.password === password) {
            // Generate a JWT token for admin
            const adminToken = jwt.sign(
              { adminId: admin._id },
              "Harsha",
              {
                expiresIn: "1d", // Token expiration time for admin (adjust as needed)
              }
            );

            res.json({ message: "admin login successful", adminToken });
          } else {
            res.json({ message: "password doesn't match" });
          }
        } catch (error) {
          res.status(500).json({ message: "Internal Server Error" });
        }
      } else {
        res.json({ message: "no such user found" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post('/user', async (req, res) => {
    try {
        console.log(req.body);
        let item = req.body;
        console.log(req.body.email);
        let email = req.body.email;
        
        // Ensure you await the findOne operation
        let existingUser = await UserDATA.findOne({ email: email });

        // Check if the existingUser is found
        if (existingUser) {
            res.json({ message: "User Already exists, Please try with another email Id" });
        } else {
            console.log('saved');
            const user = new UserDATA(item); // Note: Ensure you use `new` to create a new instance
            await user.save();  
            res.json({ message: "Registered Successfully" });
        }
    } catch (error) {
        console.error("Error in user registration:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


module.exports = router

