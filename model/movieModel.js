const mongoose=require("mongoose");
movieSchema=mongoose.Schema({
    MovieName: {
        type: String,
        required: true,
    },
    Image: {
        type: String,
        required: true,
    },
    Category: {
        type: String,
        enum: ['UA', 'A', 'PG', ], // Define allowed categories
        required: true,
    },
    Languages: {
        type: [String],
        required: true,
        enum: ['Malayalam', 'Hindi', 'Tamil', 'Telugu', 'English'],
    },
    Cast: {
        type: String,
        required: true,
    },
    Description: {
        type: String,
        required: true,
    },
    TicketRates: {
        type: Number,
        required: true,
    },
    NoOfSeats: {
        type: Number,
        required: true,
    },
    reviews: [
        {
          reviewText: String,
          rating: Number,
        },
      ],
      //_id: String,
      title: String,
    averageRating: {
        type: Number,
        default: 0,
    },
    ticketsSoldPerDay: {
        type: Number,
        default: 0,
    },
    userId: "String",
    Timing: {
        timing: String,
      },
})

movieModel=mongoose.model("movie",movieSchema);
module.exports=movieModel;