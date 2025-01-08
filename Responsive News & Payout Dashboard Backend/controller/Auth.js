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
  
      
      const articles = await NewsArticle.find(); 
  
      return res.status(HttpStatusCode.Ok).json({
        success: true,
        findUser: FindUser,
        token,
        articles, 
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
      
     if (!receivedArticles || receivedArticles.length === 0) {
       return res.status(400).send({ message: 'No articles provided.' });
     }
 
     const savedArticles = [];
 
     
     for (let article of receivedArticles) {
       
       if (!article.title || !article.pay) {
         console.log(`Skipping invalid article: ${article.title}`);
         continue; 
       }
 
       const totalPayout = article.totalPayout || 0; 
 
    
       const newsArticle = new NewsArticle({
         title: article.title,      
         pay: article.pay,          
         totalPayout: totalPayout,  
       });
 
       
       const savedArticle = await newsArticle.save();
       savedArticles.push(savedArticle); 
     }
 
     
     res.status(200).send({
       message: 'News articles saved successfully.',
       articles: savedArticles, 
     });
 
   } catch (error) {
     console.error('Error:', error.message);
     res.status(500).send({
       message: 'Error saving articles.',
       error: error.message,
     });
   }
 };
 
