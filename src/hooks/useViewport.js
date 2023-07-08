import useMediaQuery from '@mui/material/useMediaQuery';
import { useState, useEffect } from 'react';

const useViewport = (bigScreen, littleScreen) => {
  const matches = useMediaQuery('(min-width:700px)');
  const [choice, setChoice] = useState(matches ? bigScreen : littleScreen);
  useEffect(() => {
    setChoice(matches ? bigScreen : littleScreen);
  }, [matches]);
  return choice;
};

export default useViewport;
