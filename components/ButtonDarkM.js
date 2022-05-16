import React from 'react';
import { Switch } from '@mui/material';
import { useTheme } from 'next-themes';

export default function ButtonDarkM() {
  const { theme, setTheme } = useTheme();

  const darkModeChangeHandler = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return <Switch onChange={darkModeChangeHandler}>{theme}</Switch>;
}
