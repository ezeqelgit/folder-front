export enum MatrixComplexity {
  levelOne,
  levelTwo,
  levelThree
}

export type Property = {
  symbols: string[];
}

export const Complexity: Record<MatrixComplexity, Property> = {
  [MatrixComplexity.levelOne]: {
    symbols: ["BD", "55", "1C", "SO", "B5"],
  },
  [MatrixComplexity.levelTwo]: {
    symbols: ["BD", "55", "1C", "SO", "B5", "F4", "A3"],
  },
  [MatrixComplexity.levelThree]: {
    symbols: ["BD", "55", "1C", "SO", "B5", "F4", "A3", "C2", "10", "G6"],
  },
};