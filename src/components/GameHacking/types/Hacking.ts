export type Hacking = {
  matrixData: MatrixData
  specsData: SpecsData
  listRewards: Reward[]
}

export type MatrixData = {
  matrixSize: number
  matrixComplexity: number
}

export type SpecsData = {
  time: number
  bufferSize: number
}

export type Reward = {
  id: number
  nameReward: string
  descriptionReward: string
  complexityReward: number
}