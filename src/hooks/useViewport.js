import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useState, useEffect } from 'react';

const useViewport = (bigScreen, littleScreen) => {
  const matches = useMediaQuery('(min-width:700px)');
  const [choice, setChoice] = useState(matches ? bigScreen : littleScreen);
  useEffect(() => {
    setChoice(matches ? bigScreen : littleScreen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matches]);
  return choice;
};

export default useViewport;
