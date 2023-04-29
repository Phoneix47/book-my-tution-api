const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    first_name: { 
        
        type: String,
         required: true 
        },
    last_name: {
         type: String, 
         required: true 
        },
    email: { 
        type: String,
         required: true
        
        },
    password: { 
        type: String, 
        
        required: true
    
    },
    user_type: {
      type : String,
      required : true
    },
    user_verification: {
      type: Boolean,
      required : true
    }
  },

  { timestamp: true }
);

module.exports = mongoose.model("User", userSchema);
