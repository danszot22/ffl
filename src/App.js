import React from 'react';
import { RouterProvider, } from "react-router-dom"
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useTheme } from './hooks/useTheme';
import { router } from './router';
import { FantasyTeamProvider } from "./contexts/FantasyTeamContext";
import { NflWeekProvider } from "./contexts/NflWeekContext";

function App() {
  const theme = useTheme();

  return (
    <FantasyTeamProvider>
      <NflWeekProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RouterProvider router={router} />
        </ThemeProvider>
      </NflWeekProvider>
    </FantasyTeamProvider>
  );
}

export default App;
