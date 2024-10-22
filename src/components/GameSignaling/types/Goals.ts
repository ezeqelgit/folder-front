export enum Goal {
  SealIntegrity,
  BoltTightness,
  ClosedLid,
  WireIntegrity
}

export type Property = {
  goal: string
  background: string
  filter: string
  status: string
  roundBackground: string
  roundStatus: string,
  isCompleted: boolean
}

export const GoalColor: Record<Goal, Property> = {
  [Goal.SealIntegrity]: {
    goal: "Целостность пломбы",
    background: "radial-gradient(61.00% 61.00% at 50% 50%,rgb(255, 0, 0),rgb(143, 0, 0) 100%)",
    filter: "blur(20.6px)",
    status: "rgb(255, 56, 56)",
    roundBackground: "radial-gradient(61.00% 61.00% at 50% 50%,rgb(60, 255, 143),rgb(36, 164, 91) 100%)",
    roundStatus: "rgb(38, 203, 109)",
    isCompleted: false
  },
  [Goal.BoltTightness]: {
    goal: "Закрученность болтов",
    background: "radial-gradient(61.00% 61.00% at 50% 50%,rgb(255, 0, 0),rgb(143, 0, 0) 100%)",
    filter: "blur(20.6px)",
    status: "rgb(255, 56, 56)",
    roundBackground: "radial-gradient(61.00% 61.00% at 50% 50%,rgb(60, 255, 143),rgb(36, 164, 91) 100%)",
    roundStatus: "rgb(38, 203, 109)",
    isCompleted: false
  },
  [Goal.ClosedLid]: {
    goal: "Закрытая крышка",
    background: "radial-gradient(61.00% 61.00% at 50% 50%,rgb(255, 0, 0),rgb(143, 0, 0) 100%)",
    filter: "blur(20.6px)",
    status: "rgb(255, 56, 56)",
    roundBackground: "radial-gradient(61.00% 61.00% at 50% 50%,rgb(60, 255, 143),rgb(36, 164, 91) 100%)",
    roundStatus: "rgb(38, 203, 109)",
    isCompleted: false
  },
  [Goal.WireIntegrity]: {
    goal: "Целостность проводов",
    background: "radial-gradient(61.00% 61.00% at 50% 50%,rgb(255, 0, 0),rgb(143, 0, 0) 100%)",
    filter: "blur(20.6px)",
    status: "rgb(255, 56, 56)",
    roundBackground: "radial-gradient(61.00% 61.00% at 50% 50%,rgb(60, 255, 143),rgb(36, 164, 91) 100%)",
    roundStatus: "rgb(38, 203, 109)",
    isCompleted: false
  }
}