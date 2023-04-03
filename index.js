const express = require("express");
const app = express();
const routes = require("./routes");
const db = require("./db_connction");
const cors = require('cors');

//Get Request
// app.get('/', (req, res) => {
//     res.send("Hellow world");
// });

//All Routes Linking    
var corsOptions = {
    origin: "http://localhost:3000"
  };
db.then(() => {
    app.use(express.json());
    app.use(express.urlencoded())
    app.use(cors(corsOptions));
    app.use('/api', routes);

    app.listen(3001,  () => {
        console.log("Server has started!")
    });
})
