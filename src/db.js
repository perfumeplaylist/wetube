import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;

const handleError = (error) => {
  console.log(`Error : ${error}`);
};

const handleOpen = () => {
  console.log(`DB Conection ✅`);
};

db.on("error", handleError);
db.once("open", handleOpen);
