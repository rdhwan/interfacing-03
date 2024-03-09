import React from "react";
import ReactDOM from "react-dom/client";
import { Routes } from "./routes";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <Routes />
    </ChakraProvider>
  </React.StrictMode>
);
