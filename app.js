const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");


const dotEnv = require("dotenv");
const authRouter = require("./routes/auth");
const videoRouter = require("./routes/video");
const handleError = require("./middlewares/handleError");
dotEnv.config();

const app_port = process.env.app_port;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors())
app.use(morgan("dev"))

app.listen(app_port, () =>{
    console.log(`App Is Running On Port:${app_port}`)
});

require("./config/connectToDb");
require("./utils/nodemailer/transporter");

app.use("/api/auth", authRouter)
app.use("/api/video", videoRouter)
app.all("/{*any}", (req, res) => {
  res.status(403).json(`${req.method} ${req.originalUrl} is not an endpoint on this server.`)
})

app.use(handleError)
