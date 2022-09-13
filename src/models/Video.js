import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  videoUrl: { type: String, trim: true, required: true },
  description: { type: String, required: true, trim: true },
  createAt: { type: Date, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0 },
    like: { type: Number, default: 0 },
  },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  comments: [
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Comment" },
  ],
});

// hashtags 변경
// 1.middleware
// updata(),findByIdUpdate()이 문법에는 사용 x
// videoSchema.pre("save", async function () {
//   this.hashtags = this.hashtags[0]
//     .split(",")
//     .map((el) => (el.startsWith("#") ? el : `#${el}`));
// });

// 2.export function
// export const formatfunction = (hashtag) => {
//   return hashtag.split(",").map((el) => (el.startsWith("#") ? el : `#${el}`));
// };

// 3.static
videoSchema.static("formatfunction", function (hashtag) {
  return hashtag.split(",").map((el) => (el.startsWith("#") ? el : `#${el}`));
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
