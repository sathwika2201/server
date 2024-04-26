const express = require('express');
const cors = require('cors');
const {MongoClient} = require('mongodb');
//const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());
app.use(cors(
    {
        origin : "*",
        methods : ["POST","GET"],
        credentials : true
    }
));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on the port number ${PORT}`));

//Configuration (MONGODB)
var curl = "mongodb://localhost:27017";
var client = new MongoClient(curl); 

//TESTING
app.get('/klef/test', async function(req, res){
    //res.send("Koneru Lakshmaiah Education Foundation");
    res.json("Koneru Lakshmaiah Education Foundation");
});

app.post('/klef/cse', async function(req, res){
    res.json(req.body);
    //res.json("Computer Science and Engineering");
});

//REGISTRATION MODULE
app.post('/registration/signup', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('WEATHER');
        users = db.collection('users');
        data = await users.insertOne(req.body);
        conn.close();
        res.json("Registered successfully...");
    }catch(err)
    {
        res.json(err).status(404);
    }
});

//LOGIN MODULE
app.post('/login/signin', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('WEATHER');
        users = db.collection('users');
        data = await users.count(req.body);
        conn.close();
        res.json(data);
    }catch(err)
    {
        res.json(err).status(404);
    }
});

//HOME MODULE
app.post('/home/uname', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('WEATHER');
        users = db.collection('users');
        data = await users.find(req.body, {projection:{firstname: true, lastname: true}}).toArray();
        conn.close();
        res.json(data);
    }catch(err)
    {
        res.json(err).status(404);
    }
});

app.post('/home/menu', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('WEATHER');
        menu = db.collection('menu');
        data = await menu.find({}).sort({mid:1}).toArray();
        conn.close();
        res.json(data);
    }catch(err)
    {
        res.json(err).status(404);
    }
});

app.post('/home/menus', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('WEATHER');
        menus = db.collection('menus');
        data = await menus.find(req.body).sort({smid:1}).toArray();
        conn.close();
        res.json(data);
    }catch(err)
    {
        res.json(err).status(404);
    }
});

//CHANGE PASSWORD
app.post('/cp/updatepwd', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('WEATHER');
        users = db.collection('users');
        data = await users.updateOne({emailid : req.body.emailid}, {$set : {pwd : req.body.pwd}});
        conn.close();
        res.json("Password has been updated");
    }catch(err)
    {
        res.json(err).status(404);
    }
});
// dashboard 
app.post('/api/weather', async (req, res) => {
    try {
      const { city, weatherData } = req.body;
      const newWeatherData = new WeatherData({ city, weatherData });
      await newWeatherData.save();
      res.status(201).json({ message: 'Weather data saved successfully' });
    } catch (error) {
      console.error('Error saving weather data:', error);
      res.status(500).json({ error: 'Error saving weather data' });
    }
  });
  //EMAIL NOTIFICATION
app.post('/sendemail', async function(req, res) {
    try {
        var transport = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "bglorysathwika2005@gmail.com",
                pass: "jpnu gkbg sqmz pizm"
            }
        });

        var emaildata = {
            from: "bglorysathwika2005@gmail.com",
            to: "bglorysathwika2005@gmail.com",
            subject: "Testing Email",
            text: "This is a testing email message..."
        };

        transport.sendMail(emaildata, function(err, info) {
            if (err)
                return res.json("Failed to send Email");

            res.json("Email sent successfully");
        });
    } catch (err) {
        res.json(err).status(404);
    }
});
