import React, { useMemo, useState } from 'react';
import { makeStyles } from '@mui/styles';
import {
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  TextField,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import Controls from '../../Controls/Controls';
import { ImageCloud } from '../../ImageCloud/ImageCloud';
import {
  MENU_LABEL,
  measureUnitFor,
  priceInfo,
} from '../../../services/viewModel.service';
import { colors, fonts, gradientFor, radii } from '../../../styles/designTokens';

export const MENU_TYPES = ['weekend', 'tishray', 'pesach'];
export const MENU_FLAG_OF = {
  weekend: 'isMenuWeekend',
  tishray: 'isMenuTishray',
  pesach: 'isMenuPesach',
};

// Local keys for the SizePrice rows. Rows that already exist in the DB are
// keyed by their id; rows the admin just added have no id yet, so they get a
// synthetic key from this counter. Math.random would do, but a counter keeps
// the keys readable in the React tree.
let newRowSeq = 0;
const nextRowKey = () => `new-${(newRowSeq += 1)}`;

/**
 * The card's editable state. Mirrors the Product columns plus the SizePrice
 * rows of whichever price list is currently selected — those live on the Price
 * row, not the product, which is why they are pulled in through `sizeRowsFor`.
 */
export function buildDraft(product, menuType, sizeRowsFor, defaults = {}) {
  const priceId = product ? product.priceId ?? '' : defaults.priceId ?? '';
  return {
    displayName: product?.displayName ?? '',
    description: product?.description ?? '',
    categoryId: product?.categoryId ?? defaults.categoryId ?? '',
    imgUrl: product?.imgUrl ?? '',
    inStock: product ? product.inStock !== false : true,
    kitniyot: !!product?.kitniyot,
    isMenuWeekend: product ? !!product.isMenuWeekend : menuType === 'weekend',
    isMenuTishray: product ? !!product.isMenuTishray : menuType === 'tishray',
    isMenuPesach: product ? !!product.isMenuPesach : menuType === 'pesach',
    priceId,
    sizePrices: sizeRowsFor(priceId),
  };
}

const useStyles = makeStyles({
  card: {
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.lg,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  cardEditing: {
    // The form needs room to breathe, so an open card takes the whole row
    // instead of staying inside its 260px grid cell.
    gridColumn: '1 / -1',
    borderColor: colors.green,
    boxShadow: `0 0 0 2px ${colors.greenPale}`,
  },
  media: {
    position: 'relative',
    height: 150,
    overflow: 'hidden',
    '& img': { width: '100%', height: '100%', objectFit: 'cover' },
  },
  mediaSmall: {
    height: 110,
  },
  chip: {
    position: 'absolute',
    bottom: 8,
    insetInlineEnd: 10,
    background: 'rgba(255,255,255,.92)',
    color: colors.text,
    fontWeight: 700,
    fontSize: 12,
    borderRadius: radii.pill,
    padding: '3px 10px',
  },
  outBadge: {
    position: 'absolute',
    top: 8,
    insetInlineEnd: 10,
    background: colors.danger,
    color: '#fff',
    fontWeight: 700,
    fontSize: 12,
    borderRadius: radii.pill,
    padding: '3px 10px',
  },
  body: {
    padding: '12px 14px 14px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    gap: 4,
  },
  name: {
    fontWeight: 800,
    fontSize: 16,
    color: colors.text,
    lineHeight: 1.3,
    margin: 0,
  },
  desc: {
    fontSize: 13,
    color: colors.textFaint,
    lineHeight: 1.4,
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    overflow: 'hidden',
    minHeight: '2.8em',
    margin: 0,
  },
  serving: {
    fontSize: 12.5,
    color: colors.textFaint,
    fontWeight: 600,
  },
  price: {
    fontFamily: fonts.display,
    fontSize: 19,
    color: colors.greenLink,
  },
  flags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 6,
  },
  flag: {
    fontSize: 11,
    fontWeight: 700,
    borderRadius: radii.pill,
    padding: '2px 9px',
    background: colors.surfaceSunken,
    color: colors.textSoft,
  },
  flagOn: {
    background: colors.greenPale,
    color: colors.greenDark,
  },
  actions: {
    marginTop: 'auto',
    paddingTop: 10,
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
  },
  btn: {
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
    '&:hover:not(:disabled)': { borderColor: colors.text },
    '&:disabled': { opacity: 0.5, cursor: 'not-allowed' },
    '&:focus-visible': {
      outline: `3px solid ${colors.greenDeep}`,
      outlineOffset: 2,
    },
  },
  btnPrimary: {
    background: colors.green,
    borderColor: colors.green,
    color: '#fff',
    '&:hover:not(:disabled)': {
      background: colors.greenDeep,
      borderColor: colors.greenDeep,
    },
  },
  btnDanger: {
    color: colors.danger,
    borderColor: colors.danger,
  },
  // ---- edit form -------------------------------------------------------
  form: {
    padding: '16px 18px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  formHead: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.text,
    margin: 0,
  },
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 14,
    alignItems: 'flex-start',
  },
  section: {
    border: `1px solid ${colors.border}`,
    borderRadius: radii.md,
    padding: '12px 14px',
    background: colors.surfaceAlt,
  },
  sectionTitle: {
    fontWeight: 800,
    fontSize: 14,
    color: colors.textSoft,
    marginBottom: 10,
  },
  hint: {
    fontSize: 12.5,
    color: colors.textFaint,
    lineHeight: 1.5,
  },
  warn: {
    fontSize: 12.5,
    fontWeight: 700,
    color: colors.danger,
    lineHeight: 1.5,
  },
  spRow: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  preview: {
    fontSize: 13,
    color: colors.textSoft,
    fontWeight: 600,
  },
  previewPrice: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.greenLink,
  },
  err: {
    fontSize: 13,
    fontWeight: 700,
    color: colors.danger,
  },
  narrow: { width: 130 },
  spinnerWrap: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(255,255,255,.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 4,
  },
});

const SIZE_LABEL = {
  box: (unit) => `גודל (${unit})`,
  unit: () => 'כמות יחידות',
  weight: () => 'כמות מינימלית (גרם)',
};
const AMOUNT_LABEL = {
  box: () => 'מחיר לקופסה (₪)',
  unit: () => 'מחיר לכמות (₪)',
  weight: () => 'מחיר ל-100 גרם (₪)',
};

/**
 * One product inside the menu editor: reads like the customer's card when
 * closed, turns into a full-width inline form when opened. Nothing here
 * navigates away — every action reports back to MenuEditor, which owns the
 * catalogue state and does the actual API calls.
 */
export const AdminProductCard = ({
  product,
  menuType,
  categories,
  prices,
  sizeRowsFor,
  priceUsage,
  isEditing,
  busy,
  onEdit,
  onCancel,
  onSave,
  onRemoveFromMenu,
  onDeleteForever,
}) => {
  const classes = useStyles();
  const isNew = !product;
  const [draft, setDraft] = useState(null);
  const [errors, setErrors] = useState([]);

  // Entering edit mode seeds the draft from the product as it stands now.
  // Keyed off `isEditing` rather than an effect so the form never renders a
  // frame with stale values.
  const [editKey, setEditKey] = useState(null);
  const currentKey = isEditing ? `${product?.id ?? 'new'}` : null;
  if (isEditing && editKey !== currentKey) {
    setEditKey(currentKey);
    setDraft(buildDraft(product, menuType, sizeRowsFor));
    setErrors([]);
  }
  if (!isEditing && editKey !== null) {
    setEditKey(null);
  }

  const selectedPrice = useMemo(
    () =>
      (prices || []).find((p) => String(p.id) === String(draft?.priceId)) ||
      null,
    [prices, draft]
  );

  // What the customer would see once this draft is saved — computed with the
  // very same helper the menu grid uses, so the preview cannot drift from it.
  const previewInfo = useMemo(() => {
    if (!draft) return null;
    return priceInfo({
      categoryId: draft.categoryId,
      Price: selectedPrice
        ? {
            priceType: selectedPrice.priceType,
            SizePrices: draft.sizePrices
              .filter((r) => r.size !== '' && r.amount !== '')
              .map((r) => ({ size: Number(r.size), amount: Number(r.amount) })),
          }
        : null,
    });
  }, [draft, selectedPrice]);

  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));

  const changePriceList = (priceId) => {
    // The rows belong to the price list, so switching lists swaps the rows for
    // that list's own — editing them would otherwise silently rewrite the
    // previous list's prices.
    setDraft((d) => ({ ...d, priceId, sizePrices: sizeRowsFor(priceId) }));
  };

  const setRow = (key, patch) =>
    setDraft((d) => ({
      ...d,
      sizePrices: d.sizePrices.map((r) =>
        r.key === key ? { ...r, ...patch } : r
      ),
    }));

  const addRow = () =>
    setDraft((d) => ({
      ...d,
      sizePrices: [...d.sizePrices, { key: nextRowKey(), size: '', amount: '' }],
    }));

  const removeRow = (key) =>
    setDraft((d) => ({
      ...d,
      sizePrices: d.sizePrices.filter((r) => r.key !== key),
    }));

  const validate = () => {
    const errs = [];
    if (!draft.displayName.trim()) errs.push('חובה להזין שם מוצר.');
    if (draft.categoryId === '' || draft.categoryId === null)
      errs.push('חובה לבחור קטגוריה.');
    draft.sizePrices.forEach((r, i) => {
      const hasSize = String(r.size).trim() !== '';
      const hasAmount = String(r.amount).trim() !== '';
      if (!hasSize && !hasAmount) return;
      if (!hasSize || !hasAmount)
        errs.push(`שורת מחיר ${i + 1}: חובה למלא גם כמות וגם מחיר.`);
      else if (!(Number(r.size) > 0) || !(Number(r.amount) > 0))
        errs.push(`שורת מחיר ${i + 1}: הכמות והמחיר חייבים להיות מספרים חיוביים.`);
    });
    if (
      !draft.isMenuWeekend &&
      !draft.isMenuTishray &&
      !draft.isMenuPesach
    )
      errs.push('המוצר לא משויך לאף תפריט — הוא לא יוצג ללקוחות.');
    return errs;
  };

  const handleSave = () => {
    const errs = validate();
    // The "not in any menu" note is a warning, not a blocker: unchecking every
    // menu is exactly how the admin parks a product.
    const blocking = errs.filter((e) => !e.startsWith('המוצר לא משויך'));
    setErrors(errs);
    if (blocking.length) return;
    onSave({
      ...draft,
      displayName: draft.displayName.trim(),
      description: draft.description.trim(),
      imgUrl: draft.imgUrl.trim(),
      sizePrices: draft.sizePrices.filter(
        (r) => String(r.size).trim() !== '' && String(r.amount).trim() !== ''
      ),
    });
  };

  // ---- closed card -------------------------------------------------------
  if (!isEditing) {
    const info = priceInfo(product);
    const grad = gradientFor(product.categoryId);
    return (
      <article className={classes.card}>
        {busy && (
          <div className={classes.spinnerWrap}>
            <CircularProgress size={30} />
          </div>
        )}
        <div className={classes.media} style={{ background: grad }}>
          {product.imgUrl ? (
            <ImageCloud
              imageId={product.imgUrl}
              maxWidth={400}
              maxHeight={300}
              alt={`תמונה של ${product.displayName}`}
            />
          ) : null}
          {product.inStock === false && (
            <span className={classes.outBadge}>אזל</span>
          )}
          {product.Category?.displayName && (
            <span className={classes.chip}>
              {product.Category.displayName}
            </span>
          )}
        </div>
        <div className={classes.body}>
          <h3 className={classes.name}>{product.displayName}</h3>
          <p className={classes.desc}>{product.description || ' '}</p>
          <div className={classes.serving}>{info.servingLabel || ' '}</div>
          <div className={classes.price}>{info.priceLabel}</div>
          <div className={classes.flags}>
            {MENU_TYPES.map((type) => (
              <span
                key={type}
                className={`${classes.flag} ${
                  product[MENU_FLAG_OF[type]] ? classes.flagOn : ''
                }`}
              >
                {MENU_LABEL[type]}
              </span>
            ))}
            {product.kitniyot ? (
              <span className={classes.flag}>קיטניות</span>
            ) : null}
          </div>
          <div className={classes.actions}>
            <button
              type="button"
              className={`${classes.btn} ${classes.btnPrimary}`}
              onClick={onEdit}
              disabled={busy}
            >
              ערוך
            </button>
            <Tooltip title={`מכבה את הסימון של תפריט ${MENU_LABEL[menuType]}`}>
              <button
                type="button"
                className={classes.btn}
                onClick={onRemoveFromMenu}
                disabled={busy}
              >
                הסר מהתפריט
              </button>
            </Tooltip>
            <button
              type="button"
              className={`${classes.btn} ${classes.btnDanger}`}
              onClick={onDeleteForever}
              disabled={busy}
            >
              מחק לצמיתות
            </button>
          </div>
        </div>
      </article>
    );
  }

  // ---- open card (form) --------------------------------------------------
  if (!draft) return null;
  const unit = measureUnitFor({ categoryId: draft.categoryId });
  const priceType = selectedPrice?.priceType;
  const sharedCount = draft.priceId ? priceUsage[draft.priceId] || 0 : 0;
  const sharedWithOthers = sharedCount > (isNew ? 0 : 1);

  return (
    <article className={`${classes.card} ${classes.cardEditing}`}>
      {busy && (
        <div className={classes.spinnerWrap}>
          <CircularProgress size={30} />
        </div>
      )}
      <div className={classes.form}>
        <h3 className={classes.formHead}>
          {isNew ? 'מוצר חדש' : `עריכת ${product.displayName}`}
        </h3>

        <div className={classes.row}>
          <TextField
            label="שם המוצר"
            variant="outlined"
            size="small"
            value={draft.displayName}
            onChange={(e) => set({ displayName: e.target.value })}
            style={{ minWidth: 240 }}
            InputLabelProps={{ shrink: true }}
          />
          <Controls.Select
            label="קטגוריה"
            name="categoryId"
            value={draft.categoryId}
            options={categories || []}
            onChange={(e) => set({ categoryId: e.target.value })}
          />
          <TextField
            label="שם התמונה בענן"
            variant="outlined"
            size="small"
            value={draft.imgUrl}
            onChange={(e) => set({ imgUrl: e.target.value })}
            style={{ minWidth: 220 }}
            InputLabelProps={{ shrink: true }}
            helperText="ה-public_id של Cloudinary"
          />
        </div>

        <TextField
          label="תיאור"
          variant="outlined"
          size="small"
          multiline
          minRows={2}
          value={draft.description}
          onChange={(e) => set({ description: e.target.value })}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />

        <div className={classes.row}>
          <FormControlLabel
            control={
              <Checkbox
                checked={draft.inStock}
                onChange={(e) => set({ inStock: e.target.checked })}
              />
            }
            label="במלאי"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={draft.kitniyot}
                onChange={(e) => set({ kitniyot: e.target.checked })}
              />
            }
            label="מכיל קיטניות"
          />
          {MENU_TYPES.map((type) => (
            <FormControlLabel
              key={type}
              control={
                <Checkbox
                  checked={draft[MENU_FLAG_OF[type]]}
                  onChange={(e) =>
                    set({ [MENU_FLAG_OF[type]]: e.target.checked })
                  }
                />
              }
              label={`תפריט ${MENU_LABEL[type]}`}
            />
          ))}
        </div>

        <div className={classes.section}>
          <div className={classes.sectionTitle}>מחירון</div>
          <div className={classes.row}>
            <Controls.Select
              label="מחירון"
              name="priceId"
              value={draft.priceId}
              options={prices || []}
              onChange={(e) => changePriceList(e.target.value)}
            />
            <div>
              <div className={classes.preview}>כפי שיוצג ללקוח:</div>
              <div className={classes.previewPrice}>
                {previewInfo?.priceLabel}
              </div>
              <div className={classes.serving}>
                {previewInfo?.servingLabel || ' '}
              </div>
            </div>
          </div>

          {selectedPrice ? (
            <div style={{ marginTop: 12 }}>
              {sharedWithOthers && (
                <div className={classes.warn} style={{ marginBottom: 8 }}>
                  שים לב: המחירון הזה משותף ל-{sharedCount} מוצרים. כל שינוי
                  בסכומים כאן ישנה את המחיר גם בכל שאר המוצרים שמשתמשים בו.
                </div>
              )}
              {draft.sizePrices.map((row, i) => (
                <div className={classes.spRow} key={row.key}>
                  <TextField
                    className={classes.narrow}
                    label={(SIZE_LABEL[priceType] || SIZE_LABEL.box)(unit)}
                    variant="outlined"
                    size="small"
                    type="number"
                    value={row.size}
                    onChange={(e) => setRow(row.key, { size: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    className={classes.narrow}
                    label={(AMOUNT_LABEL[priceType] || AMOUNT_LABEL.box)()}
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
              <button
                type="button"
                className={classes.btn}
                onClick={addRow}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
              >
                <AddIcon fontSize="small" /> הוסף שורת מחיר
              </button>
              {priceType !== 'box' && draft.sizePrices.length > 1 && (
                <div className={classes.hint} style={{ marginTop: 8 }}>
                  בתמחור לפי {priceType === 'unit' ? 'יחידה' : 'משקל'} נעשה
                  שימוש בשורה הראשונה בלבד.
                </div>
              )}
            </div>
          ) : (
            <div className={classes.hint} style={{ marginTop: 8 }}>
              בלי מחירון המוצר יוצג ללקוח כ״לפרטים בטלפון״.
            </div>
          )}
        </div>

        {errors.length > 0 && (
          <div>
            {errors.map((e) => (
              <div key={e} className={classes.err}>
                {e}
              </div>
            ))}
          </div>
        )}

        <div className={classes.row}>
          <button
            type="button"
            className={`${classes.btn} ${classes.btnPrimary}`}
            onClick={handleSave}
            disabled={busy}
          >
            {isNew ? 'צור מוצר' : 'שמור'}
          </button>
          <button
            type="button"
            className={classes.btn}
            onClick={onCancel}
            disabled={busy}
          >
            בטל
          </button>
        </div>
      </div>
    </article>
  );
};
