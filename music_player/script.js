const songs = [
  {
    name: "lofi.mp3",
    title: "Lofi Song",
    artist: "Ishoo"
  },
  {
    name: "relaxation.mp3",
    title: "Mind Relaxation",
    artist: "Ishoo"
  }
];

const audio = document.getElementById("audio");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progress = document.querySelector(".progress");
const progressBar = document.querySelector(".progress-bar");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const volumeSlider = document.getElementById("volume");
const playlistEl = document.getElementById("playlist");
const downloadBtn = document.getElementById("download");

let songIndex = 0;
let isPlaying = false;

function loadSong(song) {
  title.textContent = song.title;
  artist.textContent = song.artist;
  audio.src = `music/${song.name}`;
  downloadBtn.href = `music/${song.name}`;
  downloadBtn.download = song.name;
  highlightPlaylist();
}

function playSong() {
  isPlaying = true;
  audio.play().catch(err => console.error("Playback error:", err));
  playBtn.textContent = "⏸️";
}

function pauseSong() {
  isPlaying = false;
  audio.pause();
  playBtn.textContent = "▶️";
}

function nextSong() {
  songIndex = (songIndex + 1) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
}

function prevSong() {
  songIndex = (songIndex - 1 + songs.length) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
}

playBtn.addEventListener("click", () => {
  isPlaying ? pauseSong() : playSong();
});

nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    const percent = (audio.currentTime / audio.duration) * 100;
    progress.style.width = `${percent}%`;
    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
  }
});

progressBar.addEventListener("click", (e) => {
  const width = progressBar.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  if (duration) {
    audio.currentTime = (clickX / width) * duration;
  }
});

volumeSlider.addEventListener("input", () => {
  audio.volume = volumeSlider.value;
});

audio.addEventListener("ended", nextSong);

function formatTime(time) {
  let minutes = Math.floor(time / 60) || 0;
  let seconds = Math.floor(time % 60) || 0;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

function renderPlaylist() {
  songs.forEach((song, index) => {
    const songEl = document.createElement("div");
    songEl.textContent = `${song.title} - ${song.artist}`;
    songEl.addEventListener("click", () => {
      songIndex = index;
      loadSong(song);
      playSong();
    });
    playlistEl.appendChild(songEl);
  });
}

function highlightPlaylist() {
  const children = playlistEl.children;
  for (let i = 0; i < children.length; i++) {
    children[i].classList.remove("active");
    if (i === songIndex) {
      children[i].classList.add("active");
    }
  }
}

audio.volume = volumeSlider.value;
loadSong(songs[songIndex]);
renderPlaylist();
