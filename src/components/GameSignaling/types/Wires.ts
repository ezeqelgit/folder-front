export enum WiresList { 
  Red,
  Green,
  White,
  Gray,
  Blue,
  Yellow,
  Purple
}

export type Property = {
  ruined: string
  whole: string
  blinkColor: string
  blinkTranslateX: number
  blinkTranslateY: number
}

export const WiresColor: Record<WiresList, Property> = {
  [WiresList.Red]: {
    ruined: require("../assets/wires/redRuined.svg"),
    whole: require("../assets/wires/red.svg"),
    blinkColor: "C91C1C",
    blinkTranslateX: 42,
    blinkTranslateY: -2,
  },
  [WiresList.Green]: {
    ruined: require("../assets/wires/greenRuined.svg"),
    whole: require("../assets/wires/green.svg"),
    blinkColor: "269E39",
    blinkTranslateX: 48,
    blinkTranslateY: 0,
  },
  [WiresList.White]: {
    ruined: require("../assets/wires/whiteRuined.svg"),
    whole: require("../assets/wires/white.svg"),
    blinkColor: "C5C5C5",
    blinkTranslateX: 42,
    blinkTranslateY: -2,
  },
  [WiresList.Gray]: {
    ruined: require("../assets/wires/grayRuined.svg"),
    whole: require("../assets/wires/gray.svg"),
    blinkColor: "424242",
    blinkTranslateX: 37,
    blinkTranslateY: 0,
  },
  [WiresList.Blue]: {
    ruined: require("../assets/wires/blueRuined.svg"),
    whole: require("../assets/wires/blue.svg"),
    blinkColor: "1C8CCB",
    blinkTranslateX: 42,
    blinkTranslateY: -2,
  },
  [WiresList.Yellow]: {
    ruined: require("../assets/wires/yellowRuined.svg"),
    whole: require("../assets/wires/yellow.svg"),
    blinkColor: "C88623",
    blinkTranslateX: 31,
    blinkTranslateY: 3,
  },
  [WiresList.Purple]: {
    ruined: require("../assets/wires/purpleRuined.svg"),
    whole: require("../assets/wires/purple.svg"),
    blinkColor: "8C2EB8",
    blinkTranslateX: 60,
    blinkTranslateY: 0,
  }
}