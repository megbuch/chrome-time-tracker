const startButton = document.getElementById('start-button')
const pauseButton = document.getElementById('pause-button')
const stopButton = document.getElementById('stop-button')
const clearTimesButton = document.getElementById('clear-button')
const timerDisplay = document.getElementById('timer-display')
const timerLabelInput = document.getElementById('timer-name')
const timesListElement = document.getElementById('times-list')

startButton.addEventListener('click', startTimer)
pauseButton.addEventListener('click', pauseTimer)
stopButton.addEventListener('click', stopTimer)
clearTimesButton.addEventListener('click', clearTimesFromStorage)

let timerLabel = ''
let startTime = 0
let elapsedTime = 0
let intervalId = 0
let isRunning = false
let times = []

// Immediately load list of times from local storage
getTimesFromStorage()

function startTimer() {
  timerLabel = timerLabelInput.value
  startTime = Date.now() - elapsedTime
  intervalId = setInterval(updateTimer, 1000)
  isRunning = true
  startButton.disabled = true
  pauseButton.disabled = false
  stopButton.disabled = false
}

function pauseTimer() {
  clearInterval(intervalId)
  isRunning = false
  startButton.disabled = false
  pauseButton.disabled = true
}

function stopTimer() {
  clearInterval(intervalId)
  isRunning = false
  elapsedTime = 0
  startButton.disabled = false
  pauseButton.disabled = true
  stopButton.disabled = true
  saveTime()
}

function updateTimer() {
  elapsedTime = Date.now() - startTime
  const hours = Math.floor(elapsedTime / 3600000)
  const minutes = Math.floor((elapsedTime % 3600000) / 60000)
  const seconds = Math.floor((elapsedTime % 60000) / 1000)
  timerDisplay.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`

  function pad(number) {
    return number.toString().padStart(2, '0')
  }
}

function saveTime() {
  // Set time in local storage
  const time = {
    label: timerLabelInput.value,
    time: timerDisplay.textContent
  }
  times.push(time)
  chrome.storage.local.set({ times })

  // Add time to list
  const li = document.createElement('li')
  li.textContent = `${timerLabelInput.value} - ${timerDisplay.textContent}`
  timesListElement.appendChild(li)

  // Reset
  timerDisplay.textContent = '00:00:00'
  timerLabelInput.value = ''
}

function getTimesFromStorage() {
  chrome.storage.local.get('times', result => {
    if (!result.times) return
    times = result.times
    
    // Populate the list with times
    times.forEach(time => {
      const li = document.createElement('li')
      li.textContent = `${time.label} ${time.time}`
      timesListElement.appendChild(li)
    });
  });
}

function clearTimesFromStorage() {
  chrome.storage.local.remove('times', () => {
    times = []
    while (timesListElement.firstChild) {
      timesListElement.removeChild(timesListElement.firstChild)
    }
  })
}