const express = require('express');
const app = express();
const cors = require('cors');
const DbConnect = require('./config/DbConnect').DbConnect()
const AllRoutes = require('./Routes/AllRoutes')
const AllowedOrigins = require('./Cors/AllowedOrigins');
const bodyParser = require('body-parser');

require('dotenv').config();
app.use(express.json())
app.use(cors(AllowedOrigins))
PORT = process.env.PORT||4000
app.use('/api/v1',AllRoutes)
app.get('/',(req,res)=>{
    res.send('<h1>Welcome to e-commerse</h1>')
})

app.listen(PORT,()=>{
 console.log(`sever has been running at this port ${PORT}`);

})
