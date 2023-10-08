const mongoose = require("mongoose");

const ticketBookingSchema = mongoose.Schema({
    userId: String,
    movieId: String,
    movieName: String,
    NoOfSeats: Number,
    name: String,
    email: String,
    seat_number: String,
    ticketsSoldPerDay: {
      date: String, // Store date as a string in "YYYY-MM-DD" format
      seatNumber: Number,
      isSold: Boolean,
  },
    // date: Date, // Add date field
    // seatIds: [String],
    // showTime: String,
    isCanceled: {
        type: Boolean,
        default: false, // By default, a booking is not canceled
      },
});


const ticketBookingModel = mongoose.model("ticketBooking", ticketBookingSchema);

module.exports = ticketBookingModel;
