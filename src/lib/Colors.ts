import { Consts } from "node-poweredup";

export const COLORS = [
  Consts.Color.BLUE,
  Consts.Color.GREEN,
  Consts.Color.PINK,
  Consts.Color.PURPLE,
  Consts.Color.YELLOW,
  Consts.Color.ORANGE,
  Consts.Color.RED,
  Consts.Color.WHITE,
  Consts.Color.LIGHT_BLUE,
  Consts.Color.CYAN,
];

class Color {
  private static number: number;
  public constructor() {
    if (!Color.number) Color.number = 0;
  }
  private increment() {
    if (Color.number >= COLORS.length) Color.number = 0;
    else Color.number += 1;
  }
  private getCurrentNumber() {
    return Color.number;
  }
  public get() {
    let color = COLORS[this.getCurrentNumber()];
    this.increment();
    return color;
  }
}

export default Color;
