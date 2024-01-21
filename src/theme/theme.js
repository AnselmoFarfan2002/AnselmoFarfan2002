import { Kanit } from "next/font/google";

const kanit = Kanit({ subsets: ["latin"], weight: "500" });

export const themeOptions = {
  palette: {
    type: "dark",
    primary: {
      main: "#B16CEA",
    },
    secondary: {
      main: "#FEA14D",
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
