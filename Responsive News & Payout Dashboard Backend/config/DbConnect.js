const mongoose = require('mongoose');
require('dotenv').config();

exports.DbConnect = (function () {
   return()=> mongoose.connect(process.env.DB_URL)
        .then(() => {console.log("Database has been connected")})
        .catch((error) =>{ console.log("Database connection error:", error.message)
            process.exit(1);
        });
      
   
})();