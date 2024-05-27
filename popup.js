// TODO: Create time log & store times in local storage
const startButton = document.getElementById('start-button');
const pauseButton = document.getElementById('pause-button');
const stopButton = document.getElementById('stop-button');
const timerDisplay = document.getElementById('timer-display');
const timerLabelInput = document.getElementById('timer-name');

let timerLabel = '';
let startTime = 0;
let elapsedTime = 0;
let intervalId = 0;
let isRunning = false;

const startTimer = () => {
  timerLabel = timerLabelInput.value;
  startTime = Date.now() - elapsedTime;
  intervalId = setInterval(updateTimer, 1000);
  isRunning = true;
  startButton.disabled = true;
  pauseButton.disabled = false;
  stopButton.disabled = false;
}

const pauseTimer = () => {
  clearInterval(intervalId);
  isRunning = false;
  startButton.disabled = false;
  pauseButton.disabled = true;
}

const stopTimer = () => {
  clearInterval(intervalId);
  isRunning = false;
  elapsedTime = 0;
  startButton.disabled = false;
  pauseButton.disabled = true;
  stopButton.disabled = true;
}

const updateTimer = () => {
  elapsedTime = Date.now() - startTime;
  const hours = Math.floor(elapsedTime / 3600000);
  const minutes = Math.floor((elapsedTime % 3600000) / 60000);
  const seconds = Math.floor((elapsedTime % 60000) / 1000);
  timerDisplay.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
stopButton.addEventListener('click', stopTimer);

// Helper function to pad the displayed time
const pad = number => {
  return number.toString().padStart(2, '0');
}