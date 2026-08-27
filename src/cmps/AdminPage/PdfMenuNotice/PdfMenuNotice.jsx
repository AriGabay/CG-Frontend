import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import { makeStyles } from '@mui/styles';

import Controls from '../../Controls/Controls';
import { isMenuEnableService } from '../../../services/isMenuEnableService';
import { LOCK_FLAG, PDF_MENUS } from '../../../services/pdfMenus';
import {
  SETTING_KEYS,
  siteSettingService,
} from '../../../services/siteSettingService';

const useStyles = makeStyles(() => ({
  wrap: {
    marginTop: '15px!important',
    marginRight: '15px!important',
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'column!important',
    maxWidth: 640,
  },
  gap: { marginTop: '12px!important' },
  hint: { fontSize: 13.5, color: '#766B5E', lineHeight: 1.6, marginTop: 8 },
}));

const MENU_LABELS = Object.values(PDF_MENUS)
  .map((m) => m.label)
  .join(', ');

/**
 * Edits the line of copy under the phone number in the PDF-menu notice — the
 * screen that takes the site over while a PDF-only menu is open.
 *
 * It exists because that line used to be hard-coded pickup hours that were
 * wrong for the menu being announced, and only the admin knows the right text
 * for each holiday.
 */
export const PdfMenuNotice = ({ eventBus }) => {
  const classes = useStyles();
  const [value, setValue] = useState('');
  const [lockSite, setLockSite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let alive = true;
    // The two settings live in different places on purpose: the lock is a row
    // in isMenuEnable (already deployed, no schema change), the text is in
    // siteSetting. Loading them together keeps that split invisible here.
    Promise.all([
      siteSettingService.getSettings(),
      isMenuEnableService.getAllMenuEnables(),
    ])
      .then(([settings, menus]) => {
        if (!alive) return;
        setValue(settings?.[SETTING_KEYS.pdfMenuNotice] ?? '');
        setLockSite(
          (menus || []).some((m) => m.menuType === LOCK_FLAG && m.enable)
        );
        setLoading(false);
      })
      .catch(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const save = async () => {
    setSaving(true);
    // Saved independently so a failure on one is reported honestly rather than
    // as a blanket "save failed" that hides what did land. The lock matters
    // most, so it goes first.
    let lockOk = false;
    try {
      await isMenuEnableService.setMenuEnable({
        menuType: LOCK_FLAG,
        enable: !!lockSite,
      });
      lockOk = true;
    } catch (err) {
      console.error('save site lock failed', err);
    }

    let textOk = false;
    try {
      await siteSettingService.setSetting(
        SETTING_KEYS.pdfMenuNotice,
        value.trim()
      );
      textOk = true;
    } catch (err) {
      console.error('save notice failed', err);
    }

    if (eventBus) {
      if (lockOk && textOk)
        eventBus.dispatch('success', { message: 'ההגדרות נשמרו בהצלחה' });
      else if (lockOk)
        eventBus.dispatch('error', {
          message: 'הנעילה נשמרה, אך שמירת הטקסט נכשלה.',
        });
      else if (textOk)
        eventBus.dispatch('error', {
          message: 'הטקסט נשמר, אך שמירת הנעילה נכשלה.',
        });
      else
        eventBus.dispatch('error', { message: 'השמירה נכשלה. נסה שוב.' });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <Grid className={classes.wrap}>
        <CircularProgress aria-label="טוען את הטקסט" />
      </Grid>
    );
  }

  return (
    <Grid className={classes.wrap}>
      <Typography variant="h5">הודעת תפריט ה-PDF</Typography>

      <div className={classes.hint}>
        כשמופעל תפריט מסוג PDF ({MENU_LABELS}), אפשר לבחור אם לנעול את כל האתר
        ולהציג רק את ההודעה עם התפריט והטלפון. אם לא נועלים, האתר ממשיך לפעול
        כרגיל — כולל הזמנות של תפריט סוף שבוע — והתפריט נגיש מהבאנר ומהתפריט
        העליון.
      </div>
      <Controls.Checkbox
        className={classes.gap}
        name="lockSite"
        label="נעל את האתר כשמופעל תפריט PDF"
        value={lockSite}
        onChange={(e) => setLockSite(e.target.value)}
      />

      <Typography variant="h6" className={classes.gap}>
        הטקסט בהודעה
      </Typography>
      <div className={classes.hint}>
        השורה שמופיעה מתחת למספר הטלפון בהודעה. כאן אפשר לכתוב את מועדי האיסוף
        או כל הודעה אחרת. אם משאירים ריק, לא תוצג שום שורה.
      </div>
      <TextField
        className={classes.gap}
        label="הטקסט שיוצג"
        variant="outlined"
        multiline
        minRows={2}
        fullWidth
        value={value}
        onChange={(e) => setValue(e.target.value)}
        InputLabelProps={{ shrink: true }}
        inputProps={{ maxLength: 300 }}
        helperText={`${value.length}/300`}
      />
      <Controls.Button
        className={classes.gap}
        text={saving ? 'שומר...' : 'שמור הגדרות'}
        onClick={save}
        disabled={saving}
      />
    </Grid>
  );
};
