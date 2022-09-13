const videoContainer = document.querySelector(".videoContainer");
const videoController = document.querySelector(".videoController");
const video = document.querySelector(".video");
const playBtn = document.querySelector(".js-play");
const muteBtn = document.querySelector(".js-mute");
const volumeRange = document.querySelector(".js-volumn");
const timelineRange = document.querySelector(".js-timeline");
const startTimeline = document.querySelector(".js-startTimeline");
const endTimeline = document.querySelector(".js-endTimeline ");
const screenBtn = document.querySelector(".js-screen");
const playbackRange = document.querySelectorAll(".js-playbackRange");

let playing = false;
let muted = false;
let volumeBase = 0.5;
let clearControllerId = null;
let clearMousemoveId = null;
timelineRange.value = 0;
timelineRange.min = 0;

const handlePlayBtnClick = () => {
  if (playing) {
    video.pause();
    playBtn.innerText = `Play`;
    playing = false;
  } else {
    video.play();
    playBtn.innerText = "Pause";
    playing = true;
  }
};

const handleMuteBtnClick = () => {
  if (muted) {
    video.muted = false;
    muteBtn.innerText = "Muted";
    video.volume = volumeBase;
    volumeRange.value = volumeBase;
    muted = false;
  } else {
    video.muted = true;
    muteBtn.innerText = "Ummuted";
    volumeRange.value = 0;
    muted = true;
  }
};

const handleVolumeInput = (e) => {
  const {
    target: { value },
  } = e;
  // muted일때
  if (muted) {
    video.muted = false;
    muteBtn.innerText = "muted";
    muted = false;
  }
  // range가 변화에 따라 video 음량 변경
  volumeBase = value;
  video.volume = volumeBase;
};

const formatTime = (time) => {
  return new Date(time * 1000).toISOString().substr(11, 8);
};

const handleVideoMetaData = () => {
  const duration = Math.floor(video.duration);
  endTimeline.innerText = formatTime(duration);
  timelineRange.max = duration;
};

const handleTimeupdate = () => {
  const currentTime = Math.floor(video.currentTime);
  startTimeline.innerText = formatTime(currentTime);
  timelineRange.value = currentTime;
};

const handleTimelineRangeInput = (e) => {
  const {
    target: { value },
  } = e;
  video.currentTime = value;
};

const handleScreenBtnClick = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    document.exitFullscreen();
    screenBtn.innerText = "Exit fullscreen";
  } else {
    videoContainer.requestFullscreen();
    screenBtn.innerText = "Fullscreen";
  }
};

const handlePlayBackRangeBtnClick = (e) => {
  const {
    target: {
      lastChild: { data },
    },
  } = e;
  video.playbackRate = data;
};

const videoControllerClassRemove = () =>
  videoController.classList.remove("showing");
const handleMouseMove = () => {
  if (clearControllerId) {
    clearTimeout(clearControllerId);
    clearControllerId = null;
  }
  if (clearMousemoveId) {
    clearTimeout(clearMousemoveId);
    clearMousemoveId = null;
  }
  videoController.classList.add("showing");
  clearMousemoveId = setTimeout(() => {
    videoControllerClassRemove();
  }, 3000);
};

const handleMouseLeave = () => {
  clearControllerId = setTimeout(() => {
    videoControllerClassRemove();
  }, 3000);
};

const handleEnded = () => {
  const { id } = videoContainer.dataset;
  fetch(`/api/videos/${id}/view`, { method: "POST" });
};

const handleKeyDown = (e) => {
  const { key } = e;
  if (key === " ") {
    handlePlayBtnClick();
  }
};

function init() {
  if (video) {
    playBtn.addEventListener("click", handlePlayBtnClick);
    muteBtn.addEventListener("click", handleMuteBtnClick);
    volumeRange.addEventListener("input", handleVolumeInput);
    timelineRange.addEventListener("input", handleTimelineRangeInput);
    screenBtn.addEventListener("click", handleScreenBtnClick);
    playbackRange.forEach((el) =>
      el.addEventListener("click", handlePlayBackRangeBtnClick)
    );
    video.addEventListener("loadedmetadata", handleVideoMetaData);
    video.addEventListener("timeupdate", handleTimeupdate);
    video.addEventListener("mousemove", handleMouseMove);
    video.addEventListener("mouseleave", handleMouseLeave);
    video.addEventListener("ended", handleEnded);
    document.addEventListener("keydown", handleKeyDown);
  }
}

init();
