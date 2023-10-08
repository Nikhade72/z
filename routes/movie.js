const express = require("express");
const router = express.Router();
const movieModel=require("../model/movieModel");
const ticketBookingModel=require("../model/ticketBookings");

router.use(express.urlencoded({extended:false}));
router.use(express.json());
const jwt = require('jsonwebtoken');

// Get movies
router.post('/getbookedtkts/:id', async(req,res)=>{
    const userId=req.params.id;
    console.log(userId)
    try {
        let movies= await ticketBookingModel.find({"userId":userId}).exec()
        console.log(movies);
        
        res.json(movies);
        }
        
     catch (error) {
        console.log(error) ;
        res.json("error");
    }
    
})

router.post("/bookingupdate", async(req,res)=>{
  const id= req.body._id;
  var query={_id:id};
  try {
  var post= await movieModel.updateOne({_id:id},{ $inc: {'SeatAvailable': 1 }}).exec();
  const newseat=post.SeatAvailable;
  var updatedseat=newseat-1;
  res.json({message:"seats updated",post});
  console.log(updatedseat)
  }
  catch (error) {
      console.log(error);
      res.json({message:"seats couldnt update"});

  }

})



//book ticket
router.post('/booktickets', async (req, res) => {
  const bookingData = req.body;
  const { seat_number, movieId, userId } = bookingData; // Rename UserId to userId to match the variable name

  try {
    // Check if the seat is already booked for the selected movie and user
    const existingBooking = await ticketBookingModel.findOne({ movieId, seat_number, userId });

    if (existingBooking) {
      // Seat is already booked, return an error response
      return res.status(400).json({ error: 'Seat not available. Please choose another seat.' });
    }

    // Seat is available, proceed with booking
    const booking = new ticketBookingModel(bookingData);
    await booking.save();

    res.status(200).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while booking seats.' });
  }
});



// Cancel tickets
router.post('/cancelticket/:id', async(req,res)=>{
  const tktId=req.params.id;
  console.log(tktId)
  try {
      let movies= await ticketBookingModel.findByIdAndDelete({"_id":tktId})
      console.log(movies);
      
      res.json({message:"Ticket Cancelled"});
      }
   catch (error) {
      console.log(error) ;
      res.json("error");
  }    
})

router.post('/available', async (req, res) => {
    try {
      const movies = await ticketBookingModel.find({ availableSeats: { $gt: 0 } }); // Fetch movies with available seats
      res.json(movies);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.post('/availability/:movieId', async (req, res) => {
    try {
      const movieId = req.params.movieId;
  
      // Find the movie's total available seats based on the provided movieId
      const movie = await TicketBooking.findOne({ movieId });
  
      if (!movie) {
        return res.status(404).json({ error: 'Movie not found' });
      }
  
      // Fetch existing bookings for the movie
      const bookings = await TicketBooking.find({ movieId });
  
      // Calculate available seats
      const reservedSeatsCount = bookings.reduce(
        (count, booking) => count + booking.seatIds.length,
        0
      );
  
      const availableSeats = movie.totalSeats - reservedSeatsCount;
  
      // Determine availability status
      let availabilityStatus = 'Available';
  
      if (availableSeats <= 10) {
        availabilityStatus = 'Fast Filling';
      } else if (availableSeats === 0) {
        availabilityStatus = 'Housefull';
      }
  
      res.json({ movieName: movie.movieName, availabilityStatus });
    } catch (error) {
      console.error('Error fetching availability status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  router.post('/api/availableMovies', (req, res) => {
  Movie.find({}, (err, movies) => {
    if (err) {
      return res.status(500).json({ error: 'Could not retrieve movies' });
    }
    return res.status(200).json(movies);
  });
});

router.post('/api/reserve-seat', async (req, res) => {
  const { seat_number, user_id, movie_id } = req.body;

  try {
    // Check if the seat is available
    const existingReservation = await Reservation.findOne({ seat_number, movie_id });

    if (existingReservation) {
      // Seat is already reserved
      return res.status(400).json({ error: 'Seat not available' });
    }

    // Create a new reservation
    const reservation = new reservation({ seat_number, user_id, movie_id });
    await reservation.save();

    // Seat reserved successfully
    res.json({ message: 'Seat reserved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/getbookedtkts/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Use the model to find ticket bookings for the given userId
    const bookings = await ticketBookingModel.find({ userId });

    // Send the bookings as a response
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'An error occurred while fetching bookings' });
  }
});


router.post("/seatupdate/:id", async(req,res)=>{
  const id=req.params.id;
  console.log(id)
  const data=req.body.name;
  console.log(data);
  const datas={ "seats.seatnumber":"1","seats.disabledd":true}
 
  var query={_id:id};
  try {

       const pot=await ticketBookingModel.updateOne(
      {_id:id,"seats.seatnumber": data },
      { $set: {'seats.$.disStatus': true },
        $dec:{'SeatAvailable':1}    },{updeart:true}
      )
      
      var post= await ticketBookingModel.updateOne({_id:id},{ $inc: {'SeatAvailable': -1 }}).exec();
      const newseat=post.SeatAvailable;
      var updatedseat=newseat-1;
     res.json({message:"seats updated",updatedseat});
      console.log(post)
  }
  catch (error) {
      console.log(error);
      res.json({message:"seats couldnt update"});

  }

})

// get all movies by one user
router.post('/getbookedtkts/:id', async(req,res)=>{
  const userId=req.params.id;
  console.log(userId)
  try {
      let movies= await ticketBookingModel.find({"userId":userId}).sort({date:-1}).exec()
      console.log(movies);
      res.json(movies);
      }
      
   catch (error) {
      console.log(error) ;
      res.json("error");
  }
  
})



router.get('/bookingdetails/:bookingId', async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const bookingDetails = await ticketBookingModel.findById(bookingId);

    if (!bookingDetails) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ bookingDetails });
  } catch (error) {
    console.error('Error fetching booking details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a movie by its ID
// Update movie timing and ticket charges by its ID
router.post("/updateMovie/:id", async (req, res) => {
  const movieId = req.params.id;
  const { Timing, TicketRates } = req.body; // Include updated fields in the request body

  try {
    const movie = await movieModel.findByIdAndUpdate(
      { _id: movieId },
      { Timing, TicketRates }, // Pass the updated timing and ticket charges
      { new: true }
    );

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json({ message: "Movie timing and ticket charges updated successfully", movie });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// POST /api/movie/submitreview
// Define route for submitting a review
// router.post('/submitreview', async (req, res) => {
//   try {
//     const { movieId, reviewText, rating } = req.body;

//     // Find the movie by its ID
//     const movie = await movieModel.findById(movieId);

//     if (!movie) {
//       return res.status(404).json({ error: 'Movie not found' });
//     }

//     // Create a new review for the movie
//     const newReview = {
//       reviewText,
//       rating,
//     };

//     // Add the review to the movie's reviews array (assuming you have a reviews array in the movie schema)
//     movie.reviews.push(newReview);

//     // Calculate the new average rating for the movie
//     const totalRatings = movie.reviews.reduce((total, review) => total + review.rating, 0);
//     movie.averageRating = totalRatings / movie.reviews.length;

//     // Save the updated movie document
//     await movie.save();

//     res.status(200).json({ message: 'Review submitted successfully' });
//   } catch (error) {
//     console.error('Error submitting review:', error);
//     res.status(500).json({ error: 'An error occurred while submitting the review' });
//   }
// });


router.get('/api/movies/:id/averageRating', async (req, res) => {
  const movieId = req.params.id;

  try {
    const movie = await movie.findOne({ _id: movieId });

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.status(200).json({ averageRating: movie.averageRating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/bookingdetails/:movieId/:date', async (req, res) => {
  try {
    const movieId = req.params.movieId;
    const date = new Date(req.params.date);
    
    // Assuming you have a field named "movieId" in your ticket booking model
    const bookingDetails = await ticketBookingModel.find({
      movieId: movieId,
      date: {
        $gte: date,
        $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000) // Add 24 hours to the date
      }
    });

    if (!bookingDetails || bookingDetails.length === 0) {
      return res.status(404).json({ message: 'Booking details not found for the specified movie and date' });
    }

    res.json({ bookingDetails });
  } catch (error) {
    console.error('Error fetching booking details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// router.post('/submitreview', async (req, res) => {
//   try {
//     const { movieId, reviewText, rating } = req.body;
//     // Find the movie by its ID
//     const movie = await movieModel.findById(movieId);

//     if (!movie) {
//       return res.status(404).json({ error: 'Movie not found' });
//     }

//     // Create a new review for the movie
//     const newReview = {
//       reviewText,
//       rating,
//     };

//     // Add the review to the movie's reviews array (assuming you have a reviews array in the movie schema)
//     movie.reviews.push(newReview);

//     // Calculate the new average rating for the movie
//     const totalRatings = movie.reviews.reduce((total, review) => total + review.rating, 0);
//     movie.averageRating = totalRatings / movie.reviews.length;

//     // Save the updated movie document
//     await movie.save();

//     res.status(200).json({ message: 'Review submitted successfully' });
//   } catch (error) {
//     console.error('Error submitting review:', error);
//     res.status(500).json({ error: 'An error occurred while submitting the review' });
//   }
// });
router.post('/submitreview', async (req, res) => {
  try {
    const { movieId, reviewText, rating } = req.body;

    // Check if the movieId, reviewText, and rating are provided
    if (!movieId || !reviewText || !rating) {
      return res.status(400).json({ message: 'Please provide movieId, reviewText, and rating' });
    }

    // Create a new review
    const newReview = new reviewData({
      movieId,
      reviewText,
      rating,
    });

    const savedReview = await newReview.save();
    return res.status(201).json({ message: 'Review submitted successfully', review: savedReview });
  } catch (error) {
    console.error('Error submitting review:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Retrieve reviews for a specific movie
router.get('/reviews/:movieId', async (req, res) => {
  try {
    const movieId = req.params.movieId;
    const reviews = await reviewData.find({ movieId });

    if (!reviews) {
      return res.status(404).json({ message: 'No reviews found for this movie' });
    }

    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error retrieving reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// ...

// const { isValid, parseISO } = require('date-fns'); // Import date-fns for date validation

// router.get('/soldticketsperday', async (req, res) => {
//   console.log('Query Parameters:', req.query);

//   try {
//     // Extract query parameters from the URL
//     const { startDate, endDate } = req.query;
//     console.log('Query Parameters:', req.query);

//     // Client-side date format validation
//     const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
//     const isValidStartDate = dateRegex.test(startDate);
//     const isValidEndDate = dateRegex.test(endDate);

//     if (!isValidStartDate || !isValidEndDate) {
//       return res.status(400).json({ message: 'Invalid date format' });
//     }

//     // Server-side date parsing and validation
//     const parsedStartDate = parseISO(startDate);
//     const parsedEndDate = parseISO(endDate);

//     if (!isValid(parsedStartDate) || !isValid(parsedEndDate)) {
//       return res.status(400).json({ message: 'Invalid date value' });
//     }

//     // Perform a query to retrieve ticket sales data within the specified date range
//     const ticketSalesData = await ticketBookingModel.find({
//       'ticketsSoldPerDay.date': {
//         $gte: parsedStartDate, // Greater than or equal to startDate
//         $lte: parsedEndDate,   // Less than or equal to endDate
//       },
//     });
//     console.log('Query Results:', ticketSalesData);

//     // Send the ticket sales data as a JSON response
//     res.status(200).json(ticketSalesData);
//   } catch (error) {
//     console.error('Error fetching ticket sales data:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

module.exports=router;