const startButton = document.getElementById('start-button')
const pauseButton = document.getElementById('pause-button')
const stopButton = document.getElementById('stop-button')
const timerDisplay = document.getElementById('timer-display')
const timerLabelInput = document.getElementById('timer-name')
const timesListElement = document.getElementById('times-list')

let timerLabel = ''
let startTime = 0
let elapsedTime = 0
let intervalId = 0
let isRunning = false
let times = []

chrome.storage.local.get('times', result => {
  if (!result.times) return
  times = result.times
  times.forEach(timeItem => {
    const li = document.createElement('li')
    li.textContent = timeItem
    timesListElement.appendChild(li)
  });
});

const startTimer = () => {
  timerLabel = timerLabelInput.value
  startTime = Date.now() - elapsedTime
  intervalId = setInterval(updateTimer, 1000)
  isRunning = true
  startButton.disabled = true
  pauseButton.disabled = false
  stopButton.disabled = false
}

const pauseTimer = () => {
  clearInterval(intervalId)
  isRunning = false
  startButton.disabled = false
  pauseButton.disabled = true
}

const stopTimer = () => {
  clearInterval(intervalId)
  isRunning = false
  elapsedTime = 0
  startButton.disabled = false
  pauseButton.disabled = true
  stopButton.disabled = true
  saveTime()
}

const updateTimer = () => {
  elapsedTime = Date.now() - startTime
  const hours = Math.floor(elapsedTime / 3600000)
  const minutes = Math.floor((elapsedTime % 3600000) / 60000)
  const seconds = Math.floor((elapsedTime % 60000) / 1000)
  timerDisplay.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}

const saveTime = () => {
  const timeItem = `${timerLabelInput.value}: ${timerDisplay.textContent}`
  times.push(timeItem)
  const li = document.createElement('li')
  li.textContent = timeItem
  timesListElement.appendChild(li)
  timerDisplay.textContent = '00:00:00'
  timerLabelInput.value = ''
  chrome.storage.local.set({ times })
}

startButton.addEventListener('click', startTimer)
pauseButton.addEventListener('click', pauseTimer)
stopButton.addEventListener('click', stopTimer)

// ---------- Helper Functions ----------
const pad = number => number.toString().padStart(2, '0')
