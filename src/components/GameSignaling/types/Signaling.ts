export type Signaling = {
  wires: Wires
  timer: Timer
}

export type Wires = {
  total: number
  correct: number
}

export type Timer = {
  start: number
  end: number
}