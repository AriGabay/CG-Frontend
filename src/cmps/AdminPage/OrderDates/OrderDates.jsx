import React, { useEffect, useMemo, useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker as DatePickerMui } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import he from 'date-fns/locale/he';
import { makeStyles } from '@mui/styles';

import Controls from '../../Controls/Controls';
import { ordersService } from '../../../services/ordersService';
import {
  ORDER_DAY,
  formatDateKey,
  getExceptions,
  saveExceptions,
  toDateKey,
} from '../../../services/orderDatesService';

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
  picker: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 },
  list: { margin: '8px 0 0', padding: 0, listStyle: 'none', width: '100%' },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '6px 10px',
    borderBottom: '1px solid #EEE8DF',
  },
  empty: { fontSize: 13.5, color: '#9A9086', marginTop: 6 },
}));

const WEEKDAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

/** Past exceptions can never apply — `disablePast` keeps them unreachable — so
 *  they are hidden and dropped on save instead of accumulating forever. */
const upcoming = (keys) => {
  const todayKey = toDateKey(startOfToday());
  return (keys || []).filter((key) => key >= todayKey).sort();
};

/**
 * Single-date exceptions to the Fridays-only ordering rule.
 *
 * Picking a Friday closes it (it then behaves like a Sun-Thu); picking any
 * other day opens it for orders. The action follows from the date, so the
 * admin picks a date rather than also choosing a mode.
 */
export const OrderDates = ({ eventBus }) => {
  const classes = useStyles();
  const [exceptions, setExceptions] = useState({ blocked: [], open: [] });
  const [picked, setPicked] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState(null);

  useEffect(() => {
    let alive = true;
    getExceptions({ force: true })
      .then((result) => {
        if (!alive) return;
        setExceptions(result);
        setLoading(false);
      })
      .catch(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const blocked = useMemo(() => upcoming(exceptions.blocked), [exceptions]);
  const open = useMemo(() => upcoming(exceptions.open), [exceptions]);

  const notify = (type, message) =>
    eventBus && eventBus.dispatch(type, { message });

  /** Writes the whole list, pruned of dates that have already passed. */
  const persist = async (next) => {
    setSaving(true);
    const pruned = { blocked: upcoming(next.blocked), open: upcoming(next.open) };
    try {
      await saveExceptions(pruned);
      setExceptions(pruned);
      setPicked(null);
      notify('success', 'התאריכים נשמרו בהצלחה');
    } catch (error) {
      console.error('save order date exceptions failed', error);
      notify('error', 'השמירה נכשלה. נסה שוב.');
    }
    setSaving(false);
  };

  const add = async () => {
    if (!picked) return;
    const key = toDateKey(picked);
    if (!key) return;
    if (key < toDateKey(startOfToday())) {
      notify('error', 'לא ניתן להוסיף תאריך שעבר');
      return;
    }
    if (blocked.includes(key) || open.includes(key)) {
      notify('error', 'התאריך כבר נמצא ברשימה');
      return;
    }

    // Opening a day is additive and harmless. Closing one can strand orders
    // that were already placed for it, so the admin is told the count first —
    // the orders themselves are never touched either way.
    if (picked.getDay() !== ORDER_DAY) {
      persist({ ...exceptions, open: [...open, key] });
      return;
    }

    // null means the check itself failed. That must not block the admin from
    // closing a date, so it falls through to the dialog, which says so plainly.
    // The button is held disabled meanwhile: the count is a network round trip,
    // and a second click would open a second dialog over the same date.
    setSaving(true);
    const orderCount = await ordersService.countOrdersForDate(
      formatDateKey(key)
    );
    setSaving(false);

    if (orderCount === 0) {
      persist({ ...exceptions, blocked: [...blocked, key] });
      return;
    }
    setConfirm({ key, orderCount });
  };

  const remove = (key, list) =>
    persist(
      list === 'blocked'
        ? { ...exceptions, blocked: blocked.filter((k) => k !== key) }
        : { ...exceptions, open: open.filter((k) => k !== key) }
    );

  const label = (key) => {
    const [year, month, day] = key.split('-').map(Number);
    return `${formatDateKey(key)} · יום ${
      WEEKDAYS[new Date(year, month - 1, day).getDay()]
    }`;
  };

  const renderList = (keys, list, emptyText) =>
    keys.length ? (
      <ul className={classes.list}>
        {keys.map((key) => (
          <li key={key} className={classes.row}>
            <span>{label(key)}</span>
            <IconButton
              aria-label={`הסר את ${formatDateKey(key)}`}
              onClick={() => remove(key, list)}
              disabled={saving}
              size="small"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </li>
        ))}
      </ul>
    ) : (
      <div className={classes.empty}>{emptyText}</div>
    );

  if (loading) {
    return (
      <Grid className={classes.wrap}>
        <CircularProgress aria-label="טוען את התאריכים" />
      </Grid>
    );
  }

  return (
    <Grid className={classes.wrap}>
      <Typography variant="h5">תאריכי הזמנה חריגים</Typography>
      <div className={classes.hint}>
        רגיל: ניתן להזמין רק לימי שישי. כאן אפשר להחריג תאריך בודד — בחירת יום
        שישי תחסום אותו והוא יתנהג כמו יום א׳-ה׳, ובחירת יום אחר תפתח אותו
        להזמנות. השינוי נכנס לתוקף מיד, בלי צורך בעדכון גרסה.
      </div>

      <div className={classes.picker}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={he}>
          <DatePickerMui
            views={['year', 'month', 'day']}
            label="בחר תאריך"
            format="dd/MM/yyyy"
            disablePast
            value={picked}
            onChange={(d) => setPicked(d)}
            slotProps={{ textField: { size: 'small' } }}
          />
        </LocalizationProvider>
        <Controls.Button
          text={
            picked && picked.getDay() === ORDER_DAY
              ? 'חסום תאריך'
              : 'פתח להזמנות'
          }
          onClick={add}
          disabled={!picked || saving}
        />
      </div>

      <Typography variant="h6" className={classes.gap}>
        ימי שישי חסומים
      </Typography>
      {renderList(blocked, 'blocked', 'אין ימי שישי חסומים.')}

      <Typography variant="h6" className={classes.gap}>
        תאריכים פתוחים חריגים
      </Typography>
      {renderList(open, 'open', 'אין תאריכים פתוחים מעבר לימי שישי.')}

      <Dialog open={!!confirm} onClose={() => setConfirm(null)}>
        <DialogTitle>לחסום את {confirm && formatDateKey(confirm.key)}?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirm?.orderCount === null
              ? 'לא הצלחנו לבדוק אם קיימות הזמנות לתאריך זה. כדאי לבדוק במסך "הזמנות לתאריך ספציפי" לפני החסימה.'
              : `קיימות ${confirm?.orderCount} הזמנות לתאריך זה. חסימת התאריך תמנע הזמנות חדשות בלבד — ההזמנות הקיימות יישארו ללא שינוי.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Controls.Button text="ביטול" onClick={() => setConfirm(null)} />
          <Controls.Button
            text="חסום בכל זאת"
            onClick={() => {
              const key = confirm.key;
              setConfirm(null);
              persist({ ...exceptions, blocked: [...blocked, key] });
            }}
          />
        </DialogActions>
      </Dialog>
    </Grid>
  );
};
