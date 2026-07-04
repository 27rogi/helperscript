export type StatType = "goal" | "assist" | "yellow" | "2yellow" | "red" | "pgoal" | "nogoal" | "autogoal" | "keeperskip"

export interface Stat {
  player: String | null;
  type: StatType;
  time: number;
}