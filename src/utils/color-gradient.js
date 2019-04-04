// converts a movie rating to a color
// minNum is the min score for it to not be the most red
export const convertNumToColor = (num, minNum = 0) => {
    const color1 = {hue: 0, saturation: 100, lightness: 33};
    const color2 = {hue: 120, saturation: 100, lightness: 30};
    const percent = num / 100;

    if (num < minNum) return "hsl("+color1.hue+","+color1.saturation+"%,"+color1.lightness+"%)";
    const h = color1.hue + percent * (color2.hue - color1.hue);
    const s = color1.saturation + percent * (color2.saturation - color1.saturation);
    const l = color1.lightness + percent * (color2.lightness - color1.lightness);

    // return a hsl string that can be used in styling of a component
    return "hsl("+h+","+s+"%,"+l+"%)";
}