import { Kanit } from "next/font/google";

const kanit = Kanit({ subsets: ["latin"], weight: "500" });

export const themeOptions = {
  palette: {
    type: "dark",
    primary: {
      main: "#FEA14D",
    },
    secondary: {
      main: "#FFFF00",
    },
    light: {
      main: "#F0F2F5",
    },
    background: {
      default: "#161513",
      paper: "#323737",
    },
    text: {
      primary: "#F0F2F5",
    },
    info: {
      main: '#66463d',
    },
  },
  typography: {
    h3: {
      fontFamily: kanit.style.fontFamily,
    },
    h2: {
      fontFamily: kanit.style.fontFamily,
    },
    h1: {
      fontFamily: kanit.style.fontFamily,
    },
  },
};
