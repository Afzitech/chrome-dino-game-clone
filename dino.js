import {
  incrementCustomProperty,
  setCustomProperty,
  getCustomProperty,
} from "./updateCustomProperty.js"

const dinoElem = document.querySelector("[data-dino]")
const JUMP_SPEED = 0.45
const GRAVITY = 0.0015
const DINO_FRAME_COUNT = 2
const FRAME_TIME = 100

// 1. Initialize the jump sound
const jumpSound = new Audio("jump.mp3")

let isJumping
let dinoFrame
let currentFrameTime
let yVelocity

export function setupDino() {
  isJumping = false
  dinoFrame = 0
  currentFrameTime = 0
  yVelocity = 0
  setCustomProperty(dinoElem, "--bottom", 0)
  
  // Remove listeners first to prevent "double-jumping" bugs
  document.removeEventListener("keydown", onJump)
  document.removeEventListener("touchstart", onJump)
  
  // 2. Add listeners for BOTH keyboard and mobile touch
  document.addEventListener("keydown", onJump)
  document.addEventListener("touchstart", onJump)
}

export function updateDino(delta, speedScale) {
  handleRun(delta, speedScale)
  handleJump(delta)
}

export function getDinoRect() {
  return dinoElem.getBoundingClientRect()
}

export function setDinoLose() {
  dinoElem.src = "imgs/dino-lose.png"
}

function handleRun(delta, speedScale) {
  if (isJumping) {
    dinoElem.src = `imgs/dino-stationary.png`
    return
  }

  if (currentFrameTime >= FRAME_TIME) {
    dinoFrame = (dinoFrame + 1) % DINO_FRAME_COUNT
    dinoElem.src = `imgs/dino-run-${dinoFrame}.png`
    currentFrameTime -= FRAME_TIME
  }
  currentFrameTime += delta * speedScale
}

function handleJump(delta) {
  if (!isJumping) return

  incrementCustomProperty(dinoElem, "--bottom", yVelocity * delta)

  // FIX: Using 0.1 instead of 0 makes repeated jumping much more responsive
  if (getCustomProperty(dinoElem, "--bottom") <= 0.1) {
    setCustomProperty(dinoElem, "--bottom", 0)
    isJumping = false
  }

  yVelocity -= GRAVITY * delta
}

function onJump(e) {
  // 3. Logic: If it's a keyboard event, check for Space/ArrowUp. 
  // If it's a touch event, just let it through.
  if (e.type === "keydown") {
    if ((e.code !== "Space" && e.code !== "ArrowUp") || isJumping) return
  } else if (e.type === "touchstart") {
    if (isJumping) return
  }

  // Play jump sound
  jumpSound.play().catch(() => {}) 
  
  yVelocity = JUMP_SPEED
  isJumping = true
}
