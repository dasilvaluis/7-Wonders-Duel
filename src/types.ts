export interface CardInterface {
  name: string,
  cost: { 
    [key: string ]: number
  },
  effect: {
    [key: string ]: number | string
  },
  type: "military" | "civilian" | "commercial" | "resouce_brown" | "resouce_grey" | "scientific"
}