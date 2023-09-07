const express = require('express');
const connections = require('./database/connection');

const app = express();
const PORT = 3000;

// // This should already be declared in your API file
// var app = express();

// ADD THIS
var cors = require('cors');
app.use(cors());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// initialize routes
app.use("/api", require("./routes"));

///below code is not used in this project
/*

app.get('/', (req, res)=>{
    res.set('Content-Type', 'text/html');
    res.status(200).send("<h1>Hello GFG Learner!</h1>");
});

//Insert 
app.post('/addprof',(req,res) =>{
    if(!req.body.phone || !req.body.mail)
    {
        res.statusCode = 400;
        res.send({"message":"Required input fields missing"})
    }else{
        let prof = {name: req.body.name , phone:  req.body.phone ,mail: req.body.mail};
        let sql = ('INSERT INTO professor SET ?');
        let query = connections.query(sql,prof, (err, result) =>{    
            if(err) {
                // console.log( "error" , err);
                res.statusCode = 500;
                res.json({message: "Internal Server Error"})
                return;
            };
            console.log("res", result);
            res.send({"message":'Added professor Entry'});
        });
    }
});

app.get('/getprofs',(req, res)=>{
    let sql = ('SELECT * FROM professor');
    connections.query(sql,  (err, result) =>{
        if(err) throw err;
        console.log(result);
        res.send(result);
    });
});
*/

app.listen(PORT, (error) =>{
	if(!error){
        console.log("Server is Successfully Running,and App is listening on port "+ PORT)
    }	
	else{
        console.log("Error occurred, server can't start", error);
    }	
	}
);
