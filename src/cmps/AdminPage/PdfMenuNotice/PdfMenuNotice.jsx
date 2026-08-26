import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import { makeStyles } from '@mui/styles';

import Controls from '../../Controls/Controls';
import { PDF_MENUS } from '../../../services/pdfMenus';
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let alive = true;
    siteSettingService
      .getSettings()
      .then((settings) => {
        if (!alive) return;
        setValue(settings?.[SETTING_KEYS.pdfMenuNotice] ?? '');
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
    try {
      await siteSettingService.setSetting(
        SETTING_KEYS.pdfMenuNotice,
        value.trim()
      );
      if (eventBus)
        eventBus.dispatch('success', { message: 'הטקסט נשמר בהצלחה' });
    } catch (err) {
      console.error('save notice failed', err);
      if (eventBus)
        eventBus.dispatch('error', { message: 'השמירה נכשלה. נסה שוב.' });
    } finally {
      setSaving(false);
    }
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
      <Typography variant="h5">טקסט בהודעת תפריט ה-PDF</Typography>
      <div className={classes.hint}>
        השורה שמופיעה מתחת למספר הטלפון בהודעה שמוצגת ללקוחות כשתפריט מסוג PDF
        מופעל ({MENU_LABELS}). כאן אפשר לכתוב את מועדי האיסוף או כל הודעה אחרת.
        אם משאירים ריק, לא תוצג שום שורה.
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
        text={saving ? 'שומר...' : 'שמור טקסט'}
        onClick={save}
        disabled={saving}
      />
    </Grid>
  );
};
