const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TuitionSchema = new Schema({
  tution_name: {
    type: String,
    require: true,
  },

  total_student: {
    type: Number,
    require: true,
  },

  tution_coordinates: {
    type: String,
    require: true,
  },
  tution_address: {
    type: String,
    require: true,
  },

  demo_class_available: {
    type: Boolean,
    require: true,
  },
  tution_images: {
    type: Array,
    require: false,
  },
 
  booking_date: {
    type: Array,
    require: true
  }
});

const Tution = mongoose.model("Tution", TuitionSchema);

module.exports = Tution;
