import "dotenv/config";
import "./db";
import "./models/Video";
import "./models/User";
import "./models/Comments";
import app from "./server";

const PORT = 4000;

const handlelisten = () => {
  console.log(`http://localhost:${PORT} 🚀`);
};

app.listen(PORT, handlelisten);
