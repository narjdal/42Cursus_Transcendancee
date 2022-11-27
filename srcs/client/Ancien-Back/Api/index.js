const express = require('express')
const bodyParser = require('body-parser')
const axios = require("axios")
const app = express()
const port = 8000
var busboy = require('connect-busboy');
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const aa = [] ;
app.use(busboy());
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API,Currently working on Oauth2..' })
  })

  app.listen(port, () => {
    console.log(`App running on pdort ${port}.`)
  })

  let count="1";
  
  app.get('/', (req, res) => {
    res.json({"changed" :count});
  })
  
  const background=function() {
      console.log('backgroung executed');
      setTimeout(background, 5000);
      count++;
  }
  
  const db = require('./queries.js')
app.post('/api/authentification/oauth2/School42',db.AddUser42)

// app.post('/api/authentification/oauth2/School42',async (req,res) => {

// }
app.post('/profile/upload',db.UploadUserProfilePic)
app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/users', db.createUser)

app.post('/loggin', db.GetUserByEmail)
app.post('/fetch_images/:id', db.GetImages)


// app.get('/fetch_images/:id',db.GetImages)

app.post("/upload_files/:id",upload.single("file"),db.uploadFiles);


app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)



