const express=require("express");
const router=express.Router();

router.use(express.urlencoded({extended:false}));
router.use(express.json());
const jwt = require("jsonwebtoken"); // Import the jsonwebtoken library


const movieModel=require ("../model/movieModel");
//add movie
// router.post("/addMovie", async(req,res)=>{
//     const newMovie=req.body;
//     console.log(newMovie)
//     try {
//       console.log("first")
//       const addMovie = await movieModel(newMovie).save();
//       res.status(200).json({ message: "movie added successfully" });
//   } catch (err) {
//     console.log(err); // Use 'err' instead of 'error'
//     res.json("error");
//   }
// })




// jwt add movie

function authenticateToken(req, res, next) {
    // Get the JWT token from the request headers
    const authorizationHeader = req.headers.authorization;
  
    // If no token is provided, return a 401 Unauthorized response
    if (!authorizationHeader) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    // Extract the token from the Authorization header
    const token = authorizationHeader.replace('Bearer ', '');
  
    // Verify the token
    try {
      const decoded = jwt.verify(token, 'Harsha');
      // You can also extract user information from the decoded token if needed
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(403).json({ message: 'Invalid token.' });
    }
  }
  
  
  
  // Your route definition remains the same
  router.post('/addMovie', authenticateToken, async (req, res) => {
    const newMovie = req.body;
    console.log(newMovie);
    try {
      console.log('first');
      const addMovie = await movieModel(newMovie).save();
      res.status(200).json({ message: 'movie added successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });





  
//view all movies
 router.post("/viewMovies",async (req,res)=>{
    const input=req.body;
    try {
        const movies= await movieModel.find()
        res.status(200).send(movies);
    } catch (error) {
        console.log(error);
        res.json(error);

    }
   
 })


  // Express route to delete a movie by its ID
  router.post("/deleteMovie/:id",async (req,res)=>{
    const movieId=req.params.id;
    console.log(movieId)
    try {
        const movie= await movieModel.findByIdAndDelete({_id:movieId})
        res.status(200).json({message:"movie removed successfully"});
        console.log(movie);
    } 
    catch (error) {
        console.log(error);
        res.json({message:"something went wrong"});
    }  
 }) 


 router.post("/updateMovie/:id",async (req,res)=>{
  const movieId=req.params.id;
  console.log(movieId)
  try {
      const movie= await movieModel.findByIdAndUpdate({_id:movieId})
      res.status(200).json({message:"movie update successfully"});
      console.log(movie);
  } 
  catch (error) {
      console.log(error);
      res.json({message:"something went wrong"});
  }  
}) 

  router.post("/viewMovie/:id", async(req,res)=>{
    const movieId=req.params.id;
    console.log(movieId)
    try {
        const movie =await movieModel.findOne({_id:movieId})
        res.status(200).send(movie);
        
    } catch (err) {
       console.log(err) ;
       res.json("err");
    }
})

module.exports=router;