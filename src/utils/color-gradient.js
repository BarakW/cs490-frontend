// converts a movie rating to a color
// minNum is the min score for it to not be the most red
export const convertNumToColor = (num, minNum = 0) => {
    const color1 = {red: 170, green: 0, blue: 0};
    const color2 = {red: 0, green: 150, blue: 0};
    const percent = num / 100;

    if (num < minNum) return "rgb("+color1.red+","+color1.green+","+color1.blue+")";
    const r = color1.red + percent * (color2.red - color1.red);
    const g = color1.green + percent * (color2.green - color1.green);
    const b = color1.blue + percent * (color2.blue - color1.blue);

    // return a rgb string that can be used in styling of a component
    return "rgb("+r+","+g+","+b+")";
}