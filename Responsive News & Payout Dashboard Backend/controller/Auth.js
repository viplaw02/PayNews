const {User} = require('../model/User')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {HttpStatusCode} = require('axios');
const  NewsArticle = require('../model/NewsArticle')
const axios = require('axios')

exports.Signup = async (req, res) => {
    try {
        const { username, email, password ,role} = req.body;
          console.log(role);
          
        
        if (!username || !email || !password||!role) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the data"
            });
        }

        const FindUser = await User.findOne({ email });
        if (FindUser) {
            return res.status(401).json({
                success: false,
                message: "User already registered"
            });
        }

        const payload = new User({
            username,
            email,
            password,
            role
        });

        const NewUser = await payload.save();
        if (NewUser) {
            return res.status(HttpStatusCode.Ok).json({
                success: true,
                payload: NewUser,
              message: "Successfully Signedup"
            });
        }

    } catch (error) {
        console.error("Error handling request:", error.message);
        return res.status(HttpStatusCode.InternalServerError).json({
            success: false,
            message: "User cannot be registered, please try again."
        });
    }
};
//.......................lOGIN..................................//
exports.Login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(HttpStatusCode.BadRequest).json({
          success: false,
          message: "Email and password both are required",
        });
      }
  
      const FindUser = await User.findOne({ email });
      if (!FindUser) {
        return res.status(HttpStatusCode.Unauthorized).json({
          success: false,
          message: "User does not exist. Please Signup",
        });
      }
  
      const IsfoundPassword = await bcrypt.compare(password, FindUser.password);
      if (!IsfoundPassword) {
        return res.status(HttpStatusCode.Unauthorized).json({
          success: false,
          message: "Please enter a valid password",
        });
      }
  
      const payload = {
        email: FindUser.email,
        _id: FindUser._id,
        Role: FindUser.role,
      };
  
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "5m",
      });
  
      const option = {
        expires: new Date(Date.now() + 300000), // 5 minutes
        httpOnly: true,
        sameSite: "Strict",
      };
  
      res.cookie("token", token, option);
  
      FindUser.password = undefined;
  
      // Fetch articles related to the user
      const articles = await NewsArticle.find(); // Fetch all articles or filter by some criteria
  
      return res.status(HttpStatusCode.Ok).json({
        success: true,
        findUser: FindUser,
        token,
        articles, // Include articles in the response
        message: "Successfully logged in",
      });
    } catch (error) {
      console.error("Error handling request:", error);
      return res.status(HttpStatusCode.InternalServerError).json({
        success: false,
        message: "User cannot be registered. Please try again.",
      });
    }
  };
  
//........................AdminPayout............


 exports.AdminPayout = async (req, res) => {
   try {
     const receivedArticles = req.body;
     console.log(receivedArticles);
      // Articles with payout rates sent by the frontend
     if (!receivedArticles || receivedArticles.length === 0) {
       return res.status(400).send({ message: 'No articles provided.' });
     }
 
     const savedArticles = [];
 
     // Loop through each received article and save to database
     for (let article of receivedArticles) {
       // Check if article title or pay is empty, and skip it if true
       if (!article.title || !article.pay) {
         console.log(`Skipping invalid article: ${article.title}`);
         continue; // Skip articles with empty title or pay
       }
 
       const totalPayout = article.totalPayout || 0; // If totalPayout is not provided, default to 0
 
       // Create a new NewsArticle document with 'pay' and 'totalPayout'
       const newsArticle = new NewsArticle({
         title: article.title,      // Article title
         pay: article.pay,          // Payout rate (from the request body)
         totalPayout: totalPayout,  // Total payout (calculated based on pay or provided)
       });
 
       // Save the article to the database
       const savedArticle = await newsArticle.save();
       savedArticles.push(savedArticle); // Store saved article for response
     }
 
     // Send success response with the saved articles
     res.status(200).send({
       message: 'News articles saved successfully.',
       articles: savedArticles, // Return the saved articles
     });
 
   } catch (error) {
     console.error('Error:', error.message);
     res.status(500).send({
       message: 'Error saving articles.',
       error: error.message,
     });
   }
 };
 
