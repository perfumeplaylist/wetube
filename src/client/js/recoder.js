import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
const preview = document.getElementById("preview");
const actionBtn = document.getElementById("actionBtn");

let stream;
let recorder;
let videoFile;

const getAccess = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    video: {
      width: 1065,
      height: 675,
    },
    audio: false,
  });
  preview.srcObject = stream;
  preview.play();
};

const downloadFile = () => {
  const a = document.createElement("a");
  a.href = videoFile;
  a.download = "MyRecorder.mp4";
  document.body.appendChild(a);
  a.click();
};

const handleDownloadBtnClick = () => {
  actionBtn.innerText = "Treansform";
  actionBtn.disabled = true;
  actionBtn.removeEventListener("click", handleDownloadBtnClick);
  downloadFile();
  actionBtn.disabled = false;
  actionBtn.addEventListener("click", handleActionBtnClick);
};

const handleActionBtnClick = () => {
  actionBtn.innerText = "Recording";
  actionBtn.disabled = true;
  actionBtn.removeEventListener("click", handleActionBtnClick);
  recorder = new MediaRecorder(stream, { mimeType: "video/mp4" });
  recorder.start();
  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data);
    preview.srcObject = null;
    preview.src = videoFile;
    preview.loop = true;
    preview.play();
    actionBtn.innerText = "Download";
    actionBtn.disabled = false;
    actionBtn.addEventListener("click", handleDownloadBtnClick);
  };
  setTimeout(() => {
    recorder.stop();
  }, 3000);
};

function init() {
  getAccess();
  if (actionBtn) {
    actionBtn.addEventListener("click", handleActionBtnClick);
  }
}

init();
