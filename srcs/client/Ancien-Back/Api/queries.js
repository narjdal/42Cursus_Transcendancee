const axios = require("axios")
const { response, json } = require("express")
const { resolve } = require("../webpack.config")
const url = require('url');
// const { upload } = require("@testing-library/user-event/dist/upload");

const Pool = require('pg').Pool

const pool = new Pool({
  user: 'narjdal',
  host: 'localhost',
  database: 'api',
  password: '123456',
  port: 5432,
})
const getUsers = (request, response) => {
  pool.query('SELECT * FROM users42 ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json({info : results.rows})
  })
}

const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  console.log("Getting users with id : ", + id );
  pool.query('SELECT * FROM users42 WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows);
  })
}
/**
 * 
 * @param {*} request 
 * @param {*} response 
 * Request received
 * Fetch DB en se basant sur le mail , si request.psswd == db.psswd , Login
 */
const GetUserByEmail = (request, response) => {
  const { name, email,password } = request.body
  console.log("GetUserbyEmail :  " + " "+ email +" " + password)
  pool.query('SELECT * FROM users WHERE email = $1', [email], (error, results) => {
    if (error) {
      console.log("Error throwed !")
      throw error
    }

   response.status(200).json(results.rows)
  console.log(JSON.stringify(results.rows))
  })
}



const createUser = (request, response) => {
  const { name, email,password } = request.body
  console.log("Creating a new user ! " + name + " "+ email +" " + password)
  pool.query('INSERT INTO users (name, email,password) VALUES ($1, $2, $3)', [name, email,password], (error, results) => {
    if (error) {
      throw error
    }
    const new_user = {name : name , email:email,password:password,data:null,loggedIn:true}
    response.status(201).send(`User added with ID: ${results.insertId}`)
  })
}

const UpdateUserWithProfilePicture = (req, response) => {
  const id = parseInt(req.params.id)
  // let uploadFile = request.files.file
  // const fileName = request.files.file.name
  // const plsfile = request.file;
  const { nickname } = req.body
  const selectedFile = req.file;
  let filePath = selectedFile.path;
  // const nickname = "a";
  console.log("The Nickname Is =>>> " + nickname);
  console.log("The FilePath Is =>>> " + filePath);

  // console.log("The file Name is =>> " + JSON.stringify(request.body));
//   uploadFile = selectedFile;
//   if(Form)
//   {
//   fileName = JSON.stringify(Form.selectedFile)
//     console.log("THERE IS A SELECTED_FILE !"  + JSON.stringify(request.body));

//   // uploadFile.mv(
//   //   `${__dirname}/public/files/${fileName}`,
//   //   function (err) {
//   //     if (err) {
//   //       return res.status(500).send(err)
//   //     }
//   //     const file_path =  `public/${request.files.file.name}`;
//   // })
// }
  // const email = ""
console.log("Inside Upadte User ! " + nickname);
  pool.query(
    'UPDATE users42 SET nickname = $1 ,image_url = $2 WHERE id = $3',
    [nickname,filePath, id],
    (error, results) => {
      if (error) {
        throw error
      }
      pool.query('SELECT * FROM users42 WHERE id = $1', [id], (error, results) => {
        if (error) {
          throw error
        }
        // const responseobject = {
        //   id : id,
        //   nickname: nickname,
        //   db_response : 'User modified With Picture  with ID: ',
        //   file_path:filePath
        // }
        results.rows.push({db_response:"User Successfully modified and new profile picture set ! "})
        response.status(200).json(results.rows);
      })

      // response.status(200).send(responseobject);
    }
  )
}

function uploadFiles(req,res) {
  const id = parseInt(req.params.id)
  console.log(req.body);
  console.log("-----------------------------");
  console.log(req.file);
  console.log("-----------------------------");
  console.log("User id is => "  + id);
  UpdateUserWithProfilePicture(req,res)
  // db.getUserById(req,res);

  // TODO UPDATE USER IN DB , SET IMAGE URL IN DB AS NEW PATH
  // IN FRONT , IF IMAGE URL GOT FROM LOGIN REQIEST !== DEFAULT PATH DONLOAD NEW PROFILE PIC
  // res.json({message: "Successfully uploaded files"});

}

const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  // let uploadFile = request.files.file
  // const fileName = request.files.file.name
  // const plsfile = request.file;
  const { nickname, selectedFile } = request.body
  // const nickname = "a";
  console.log("The Nickname Is =>>> " + nickname);
  // console.log("The plsfile Is =>>> " + plsfile);

  // console.log("The file Name is =>> " + JSON.stringify(request.body));
//   uploadFile = selectedFile;
//   if(Form)
//   {
//   fileName = JSON.stringify(Form.selectedFile)
//     console.log("THERE IS A SELECTED_FILE !"  + JSON.stringify(request.body));

//   // uploadFile.mv(
//   //   `${__dirname}/public/files/${fileName}`,
//   //   function (err) {
//   //     if (err) {
//   //       return res.status(500).send(err)
//   //     }
//   //     const file_path =  `public/${request.files.file.name}`;
//   // })
// }
  // const email = ""
console.log("Inside Upadte User ! " + nickname);
  pool.query(
    'UPDATE users42 SET nickname = $1 WHERE id = $2',
    [nickname, id],
    (error, results) => {
      if (error) {
        throw error
      }
      const responseobject = {
        id : id,
        nickname: nickname,
        db_response : 'User modified with ID: ',
        file_path:"",
        image_url:"http://localhost:9000/upload/Accountlogo.jpeg"
      }
      response.status(200).send(responseobject);
    }
  )
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};
async function  HandleGetData  (access_token)   {

  var res;
  // let id = new Promise(function(req,resp){
  //   var p1  = GetUserProfile(access_token);
  //   res  = p1 ;
  //   return p1;
  // })
  // .then(value => {

  // })
  try {

  // return new Promise(resolve => {
    // const value =     GetUserProfile(access_token)
    // console.log("Here is the response : "  + value)
    // // resolve(value);
    // return (value);
  //  await  GetUserProfile(access_token)
  //   .then((response) => {
  //     console.log("response HandleGetData : => " + response);
  //   })
  //   .catch((err) => {
  //     console.log("HandleGetData error ! " + err);
  //   })
  // })
//   const value = await  GetUserProfile(access_token).then(data => {
//     console.log("Valeur recup : " + value)
//   })
//     console.log("Value => + " + value)
//     return (value);

const value = await GetUserProfile(access_token);
if(value)
{
  const {id ,usual_full_name } = value;
  // console.log("response HandleGetData : => " + value.id + " => " + usual_full_name);
  populateData(id);
  populateData(usual_full_name);
}

  return(value);
  }
catch (e)
{
  console.log("Error in HandleGetData => " + e);
  return(e)
}

  // await GetUserProfile(access_token)
  // .then(dataPromise => {
  // // return (value.data);

  // })
  //  await GetUserProfile(access_token)
  //  .then((response) => JSON.stringify(response))
  //  .then((response) => {
  //   console.log("pls => " + response);
  //  })


}

const lst = [];  
const  ss =[]
const populateData = (data) => {lst.push(data)} 

async function  Checkfirsttime  (infos,request,response)  {

  if(infos)
  {
  const {id ,usual_full_name,nickname} = infos;

 await pool.query('SELECT * FROM users42 WHERE id = $1', [id], (error, results) => {
  if (error) {
    throw error
  }

  const full_name = JSON.stringify(results.rows);
  const value = JSON.parse(full_name);
  if(value[0])
  {
  const nick = value[0].nickname;
  console.log("value AddUser42 "   + id + " =>  " + usual_full_name);
  console.log("CheckFirst Time :> " + " =>>> " + value[0].nickname);
  response.status(200).json({UserId : id,usual_full_name:usual_full_name,image_url:"/images/Accountlogo.jpeg",nickname:nick});
}
else {
  response.status(200).json({UserId : id,usual_full_name:usual_full_name,image_url:"/images/Accountlogo.jpeg",nickname:""});

}
// for(var)
  // const f
  // const {full_name} = results.rows;
   
  // return value[0].nickName;

  
  //   if(value[0].nickname)
  // {
  //   // const nickname = JSON.stringify(value[0].nickName);
  //   // console.log("Nickname CheckFirst => " + nickname )
  //   return (1);

  // }
  // else {
  //   console.log("No Nickname First login");
  //   // return (null);
  // }
  // response.status(200).json(results.rows)  
})

}
};

async function GetUserProfile (access_token)
{
  const text = ' Bearer ' + access_token;
 try {
  // console.log("Getting user profile " + access_token);
 const response =  await axios.get('https://api.intra.42.fr/v2/me',{
    headers: { Authorization:text},
  })
  const {image_url,usual_full_name,id} = response.data;
  //  Uncomment to get All User Public data onsole.log(" user infos: " + JSON.stringify(response.data));
  
  pool.query('INSERT INTO users42 (id, image_url,full_name,nickname) VALUES ($1, $2, $3,$4)', [id , image_url,usual_full_name,""] ,(error, results) => {
    try {
      if (error) {
      throw error
    }
    }
    catch (e)
    {
      console.error("Error !  =>" + e);
    }
  })
  return response.data;
}
catch(e)
{
  console.log(e);
}
}
async function  AddUser42  (request,response ) {
  const {code} = request.body;
  // try {

//     const queryObject = url.parse(request.url,true).query;

// // true
// if(queryObject) {
//   console.log(" =>>>>>>  GG i GOT THE CODE ! " +  request.query.code );
//     // 
// }
    
   const Token42 = await GetSchool42UserInfos(code);
    // .then((resp) => {
    //   // const {id ,usual_full_name } = resp;
    //   // console.log("response AddUser42 Ok " + id + usual_full_name );
    //   populateData(resp);
    //   return (resp);
      
    // })
    // if(Token42)
    // {
      // const tt = JSON.stringify(Token42);
    const {access_token} = Token42;
    // console.log("TOken42 => " + tt);

    const infos = await HandleGetData(access_token);
        Checkfirsttime(infos,request,response)
    // }
    
    
  
  
// }
// catch(e)
// {
//   console.log("Error from AddUser42 " + e);
// }
  

}

async   function   GetSchool42UserInfos   (url_code)    {
const code =url_code;
console.log(" the code is => " + code);
let id ,usual_full_name;
try {
  const post = { 
grant_type:"authorization_code",
client_id :"8d53476d0b35503b5132e8298c0c72b3b9a338afc65ab471d6a11eaefdf2437a",
client_secret:"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",
code:code,
redirect_uri:"http://localhost:3000/"};

  const response = await axios.post('https://api.intra.42.fr/oauth/token/', post)
  console.log("42Api TOken Response : " + JSON.stringify(response.data));
  return response.data;

  // )
}
catch (e)
{
  console.log("Error  From 42 api ! => " + e);
}
return("ww");
}

async function UploadUserProfilePic(request,response) {
  // let uploadFile = req.files.file;
  // const fileName = req.files.file.name;
 
}

async function GetImages (req,res)  {
  const id = parseInt(request.params.id)


}
module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  GetUserByEmail,
  AddUser42,
  UploadUserProfilePic,
  UpdateUserWithProfilePicture,
  uploadFiles,
  GetImages
}