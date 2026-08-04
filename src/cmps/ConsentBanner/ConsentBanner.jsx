import React, { useState } from 'react';
import { Button, Link, Paper, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { consentService } from '../../services/consent.service';

/**
 * Asks visitors covered by European privacy law whether they accept analytics
 * cookies. Everyone else never sees it — see consent.service for who is asked
 * and why enforcement does not depend on that guess.
 */
export function ConsentBanner() {
  // Read once on mount: the answer cannot change until the visitor gives one.
  const [isAsking, setIsAsking] = useState(() => consentService.shouldAsk());

  if (!isAsking) return null;

  const answer = (decision) => {
    consentService.decide(decision);
    setIsAsking(false);
  };

  return (
    <Paper
      role="region"
      aria-label="הסכמה לשימוש בעוגיות"
      elevation={8}
      square
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        p: 2,
        zIndex: (theme) => theme.zIndex.snackbar - 1,
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        justifyContent="center"
        sx={{ maxWidth: 900, mx: 'auto' }}
      >
        <Typography variant="body2" sx={{ flex: 1 }}>
          אנחנו משתמשים בעוגיות כדי להבין איך גולשים משתמשים באתר ולשפר אותו.
          דחייה לא משפיעה על הגלישה ולא על ביצוע הזמנות. פרטים נוספים ב
          <Link component={RouterLink} to="/privacy" underline="always">
            מדיניות הפרטיות
          </Link>
          .
        </Typography>
        <Stack direction="row" spacing={1} justifyContent="center">
          <Button variant="outlined" onClick={() => answer('denied')}>
            דחייה
          </Button>
          <Button variant="contained" onClick={() => answer('granted')}>
            אישור
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
