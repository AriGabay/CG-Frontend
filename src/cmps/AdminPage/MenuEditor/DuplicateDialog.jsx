import React, { useMemo, useState } from 'react';
import { makeStyles } from '@mui/styles';
import {
  Button as MuiButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select as MuiSelect,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import {
  MENU_LABEL,
  measureUnitFor,
  menuFlagFor,
  priceInfo,
} from '../../../services/viewModel.service';
import { colors, fonts, radii } from '../../../styles/designTokens';
import {
  MENU_TYPES,
  PRICE_TYPE_LABEL,
  amountLabelFor,
  productCount,
  sizeLabelFor,
} from './priceFields';

const PRICE_TYPES = Object.entries(PRICE_TYPE_LABEL).map(([value, label]) => ({
  value,
  label,
}));

let rowSeq = 0;
const nextKey = () => `dup-${(rowSeq += 1)}`;

const useStyles = makeStyles({
  intro: {
    fontSize: 14,
    color: colors.textSoft,
    lineHeight: 1.6,
    marginBottom: 14,
  },
  section: {
    border: `1px solid ${colors.border}`,
    borderRadius: radii.md,
    padding: '12px 14px',
    background: colors.surfaceAlt,
    marginTop: 12,
  },
  row: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  narrow: { width: 150 },
  hint: {
    fontSize: 12.5,
    color: colors.textFaint,
    lineHeight: 1.5,
  },
  warn: {
    fontSize: 13,
    fontWeight: 700,
    color: colors.danger,
    lineHeight: 1.6,
  },
  err: {
    fontSize: 13,
    fontWeight: 700,
    color: colors.danger,
    marginTop: 8,
  },
  preview: {
    fontSize: 13,
    color: colors.textSoft,
    fontWeight: 600,
    marginTop: 4,
  },
  previewPrice: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.greenLink,
  },
  addBtn: {
    border: `1px solid ${colors.borderInput}`,
    background: colors.surface,
    color: colors.text,
    borderRadius: radii.pill,
    padding: '7px 14px',
    minHeight: 36,
    fontFamily: fonts.body,
    fontSize: 13.5,
    fontWeight: 700,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    '&:hover': { borderColor: colors.text },
  },
});

/**
 * Asked before a duplicate is seeded. The price lives on the shared Price row,
 * so the one decision that cannot be deferred is whether the copy gets a price
 * list of its own — keeping the original's means any later price edit hits both
 * products, which is usually the opposite of why the copy was made.
 *
 * Nothing is written here: the answer only seeds the duplicate's form, and the
 * new price list is created when that form is saved.
 */
export const DuplicateDialog = ({
  product,
  menuType,
  priceUsage,
  onCancel,
  onConfirm,
}) => {
  const classes = useStyles();

  const sourcePrice = product?.Price || null;
  const sourceRows = useMemo(
    () =>
      (sourcePrice?.SizePrices || []).map((r) => ({
        key: nextKey(),
        size: r.size,
        amount: r.amount,
      })),
    [sourcePrice]
  );

  const [createNew, setCreateNew] = useState(true);
  const [displayName, setDisplayName] = useState(
    product ? `${product.displayName} - ${MENU_LABEL[menuType]}` : ''
  );
  const [priceType, setPriceType] = useState(sourcePrice?.priceType || 'box');
  const [rows, setRows] = useState(sourceRows);
  const [errors, setErrors] = useState([]);

  const unit = measureUnitFor(product || {});
  // Drives the wording above: the save only detaches the original when it has
  // somewhere else to live.
  const otherMenus = MENU_TYPES.filter(
    (t) => t !== menuType && !!(product || {})[menuFlagFor(t)]
  );
  const sharedCount = product?.priceId
    ? priceUsage[String(product.priceId)] || 0
    : 0;

  // Same helper the grid uses, so the number shown here is the number the
  // customer will see.
  const preview = priceInfo({
    categoryId: product?.categoryId,
    Price: {
      priceType,
      SizePrices: rows
        .filter((r) => String(r.size).trim() !== '' && String(r.amount).trim() !== '')
        .map((r) => ({ size: Number(r.size), amount: Number(r.amount) })),
    },
  });

  const setRow = (key, patch) =>
    setRows((list) => list.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  const addRow = () =>
    setRows((list) => [...list, { key: nextKey(), size: '', amount: '' }]);
  const removeRow = (key) =>
    setRows((list) => list.filter((r) => r.key !== key));

  const confirm = () => {
    if (!createNew) {
      onConfirm({ createNew: false });
      return;
    }
    const errs = [];
    if (!displayName.trim()) errs.push('חובה להזין שם למחירון החדש.');
    const filled = rows.filter(
      (r) => String(r.size).trim() !== '' || String(r.amount).trim() !== ''
    );
    if (!filled.length) errs.push('חובה להזין לפחות שורת מחיר אחת.');
    // Numbered by position in `rows`, not in the filtered list — the rows are
    // labelled by their on-screen position, so counting the filtered subset
    // pointed the admin at the wrong line.
    rows.forEach((r, i) => {
      const hasSize = String(r.size).trim() !== '';
      const hasAmount = String(r.amount).trim() !== '';
      if (!hasSize && !hasAmount) return;
      if (!(Number(r.size) > 0) || !(Number(r.amount) > 0))
        errs.push(
          `שורת מחיר ${i + 1}: "${sizeLabelFor(priceType, unit)}" ו"${amountLabelFor(priceType)}" חייבים להיות מספרים חיוביים.`
        );
      else if (!Number.isInteger(Number(r.size)))
        errs.push(
          `שורת מחיר ${i + 1}: "${sizeLabelFor(priceType, unit)}" חייב להיות מספר שלם.`
        );
    });
    setErrors(errs);
    if (errs.length) return;
    onConfirm({
      createNew: true,
      displayName: displayName.trim(),
      priceType,
      rows: filled.map((r) => ({ size: Number(r.size), amount: Number(r.amount) })),
    });
  };

  return (
    <Dialog open={!!product} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>שכפול {product?.displayName}</DialogTitle>
      <DialogContent>
        <div className={classes.intro}>
          ייווצר עותק של המוצר שמשויך רק לתפריט{' '}
          <b>{MENU_LABEL[menuType]}</b>. העותק ייפתח לעריכה ולא יישמר עד שתלחץ
          שמור.
          {otherMenus.length ? (
            <>
              {' '}
              בשמירת העותק, המוצר המקורי יוסר מתפריט{' '}
              {MENU_LABEL[menuType]} (כל עוד העותק משויך אליו) ויישאר בתפריטי{' '}
              {otherMenus.map((t) => MENU_LABEL[t]).join(' ו')}.
            </>
          ) : (
            <>
              {' '}
              <b>
                {MENU_LABEL[menuType]} הוא התפריט היחיד של המקור, ולכן הוא יישאר
                בו
              </b>{' '}
              — אחרת הוא לא היה מופיע באף תפריט. שני המוצרים יופיעו יחד עד
              שתסיר את אחד מהם.
            </>
          )}
        </div>

        <FormControl>
          <RadioGroup
            value={createNew ? 'new' : 'same'}
            onChange={(e) => setCreateNew(e.target.value === 'new')}
          >
            <FormControlLabel
              value="new"
              control={<Radio />}
              label="ליצור מחירון חדש לעותק (מומלץ)"
            />
            <FormControlLabel
              value="same"
              control={<Radio />}
              label="לקשר את העותק לאותו מחירון כמו המקור"
            />
          </RadioGroup>
        </FormControl>

        {createNew ? (
          <div className={classes.section}>
            <div className={classes.row}>
              <TextField
                label="שם המחירון החדש"
                variant="outlined"
                size="small"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                style={{ minWidth: 260 }}
                InputLabelProps={{ shrink: true }}
              />
              <FormControl size="small" style={{ minWidth: 140 }}>
                <InputLabel id="dup-price-type" shrink>
                  סוג תמחור
                </InputLabel>
                <MuiSelect
                  labelId="dup-price-type"
                  label="סוג תמחור"
                  value={priceType}
                  onChange={(e) => setPriceType(e.target.value)}
                >
                  {PRICE_TYPES.map((t) => (
                    <MenuItem key={t.value} value={t.value}>
                      {t.label}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </div>

            {rows.map((row, i) => (
              <div className={classes.row} key={row.key}>
                <TextField
                  className={classes.narrow}
                  label={sizeLabelFor(priceType, unit)}
                  variant="outlined"
                  size="small"
                  type="number"
                  value={row.size}
                  onChange={(e) => setRow(row.key, { size: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  className={classes.narrow}
                  label={amountLabelFor(priceType)}
                  variant="outlined"
                  size="small"
                  type="number"
                  value={row.amount}
                  onChange={(e) => setRow(row.key, { amount: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
                <IconButton
                  aria-label={`מחק שורת מחיר ${i + 1}`}
                  onClick={() => removeRow(row.key)}
                  size="small"
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </div>
            ))}
            <button type="button" className={classes.addBtn} onClick={addRow}>
              <AddIcon fontSize="small" /> הוסף שורת מחיר
            </button>

            <div className={classes.preview}>כפי שיוצג ללקוח:</div>
            <div className={classes.previewPrice}>{preview.priceLabel}</div>
            <div className={classes.hint}>{preview.servingLabel || ' '}</div>

            {priceType !== 'box' && rows.length > 1 && (
              <div className={classes.hint} style={{ marginTop: 8 }}>
                בתמחור לפי {priceType === 'unit' ? 'יחידה' : 'משקל'} נעשה שימוש
                בשורה הראשונה בלבד.
              </div>
            )}
          </div>
        ) : (
          <div className={classes.section}>
            <div className={classes.warn}>
              העותק יהיה מקושר לאותו מחירון כמו המקור
              {sourcePrice ? ` ("${sourcePrice.displayName}")` : ''}
              {sharedCount > 1 ? `, שמשמש ${productCount(sharedCount)}` : ''}. כל שינוי
              של הסכומים ישנה את המחיר גם במקור ובכל מוצר אחר שמשתמש בו — כלומר
              לא תוכל לתמחר את העותק בנפרד.
            </div>
            <div className={classes.hint} style={{ marginTop: 8 }}>
              תמיד אפשר לבחור מחירון אחר בטופס העריכה שייפתח.
            </div>
          </div>
        )}

        {errors.map((e) => (
          <div key={e} className={classes.err}>
            {e}
          </div>
        ))}
      </DialogContent>
      <DialogActions>
        <MuiButton onClick={onCancel}>ביטול</MuiButton>
        <MuiButton variant="contained" onClick={confirm}>
          המשך לשכפול
        </MuiButton>
      </DialogActions>
    </Dialog>
  );
};
