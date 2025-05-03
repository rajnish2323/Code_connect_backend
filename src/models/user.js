const mongoose = require('mongoose');

const userschema = new mongoose.Schema({
    firstName: { type: String, required: true 
     
    },
    lastName:  { type: String, required: true

     },
    emailId:   { type: String, required: true 

    },
    password:  { type: String, required: true 

    },
    age:{
        type:Number,
    },
    skills: {
        type: [String],
        default: []
      },
      about:{
        type:String,
        default:"this is default about section"
      },
      gender:{
        type:String,

      },
    photoUrl:{
        type: String,
        default:"https://www.cgg.gov.in/wp-content/uploads/2017/10/dummy-profile-pic-male1.jpg"
      }
});

const User = mongoose.model('User', userschema);
module.exports = User;
