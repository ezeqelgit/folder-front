export enum Wires { 
  Red,
  Green,
  White,
  Grey,
  Blue,
  Yellow,
  Purple
}

export type Property = {
  ruined: string
  whole: string
}

export const WiresColor: Record<Wires, Property> = {
  [Wires.Red]: {
    ruined: require("../assets/wires/red.svg"),
    whole: require("../assets/wires/red.svg"),
  },
  [Wires.Green]: {
    ruined: require("../assets/wires/green.svg"),
    whole: require("../assets/wires/green.svg"),
  },
  [Wires.White]: {
    ruined: require("../assets/wires/white.svg"),
    whole: require("../assets/wires/white.svg"),
  },
  [Wires.Grey]: {
    ruined: require("../assets/wires/grey.svg"),
    whole: require("../assets/wires/grey.svg"),
  },
  [Wires.Blue]: {
    ruined: require("../assets/wires/blue.svg"),
    whole: require("../assets/wires/blue.svg"),
  },
  [Wires.Yellow]: {
    ruined: require("../assets/wires/yellow.svg"),
    whole: require("../assets/wires/yellow.svg"),
  },
  [Wires.Purple]: {
    ruined: require("../assets/wires/purple.svg"),
    whole: require("../assets/wires/purple.svg"),
  }
}