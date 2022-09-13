import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  avatarUrl: String,
  username: { type: String, trim: true, required: true, unique: true },
  socialOnly: { type: Boolean, default: false },
  email: { type: String, trim: true, required: true, unique: true },
  password: { type: String, trim: true, unique: true },
  location: { type: String, trim: true },
  name: { type: String, trim: true, required: true },
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
  comments: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
});

// 한번 생각해보기
// export const getLocation = async () => {
//   const locationInfo = await (
//     await fetch(
//       `https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.LOCATION_API}`
//     )
//   ).json();
//   const { country_name, city, country_capital } = locationInfo;
//   this.location = country_capital;
//   return this.location;
// };

// userSchema.pre("save",async function(){
//   const currentLocation=await getLocation();
//   this.location=currentLocation;
// })

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 5);
  }
});

const User = mongoose.model("User", userSchema);

export default User;
