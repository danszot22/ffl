import React from 'react';
import { RouterProvider, } from "react-router-dom"
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useTheme } from './hooks/useTheme';
import { router } from './router';
import { FantasyTeamProvider } from "./contexts/FantasyTeamContext";
import { NflWeekProvider } from "./contexts/NflWeekContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function App() {
  const theme = useTheme();
  const queryClient = new QueryClient()

  return (
    <FantasyTeamProvider>
      <NflWeekProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
          </QueryClientProvider>
        </ThemeProvider>
      </NflWeekProvider>
    </FantasyTeamProvider>
  );
}

export default App;
