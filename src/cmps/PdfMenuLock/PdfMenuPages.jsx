import React from 'react';
import { makeStyles } from '@mui/styles';
import { colors, fonts, radii } from '../../styles/designTokens';

const useStyles = makeStyles({
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  page: {
    display: 'block',
    width: '100%',
    height: 'auto',
    border: `1px solid ${colors.border}`,
    borderRadius: radii.sm,
    background: '#fff',
  },
  link: {
    display: 'block',
    textAlign: 'center',
    fontFamily: fonts.body,
    fontSize: 15.5,
    fontWeight: 700,
    color: colors.greenLink,
    padding: '6px 0 2px',
    '&:focus-visible': {
      outline: `3px solid ${colors.greenDeep}`,
      outlineOffset: 2,
    },
  },
});

/**
 * Renders a PDF menu as page images rather than an embedded PDF.
 *
 * An <iframe> of a PDF shows only the first page on iOS Safari, with no way to
 * reach the rest — so on an iPhone the second half of the menu simply did not
 * exist. Images scroll and zoom natively everywhere, and the original file is
 * still linked for anyone who wants to download or print it.
 */
export const PdfMenuPages = ({ menu }) => {
  const classes = useStyles();
  if (!menu) return null;
  const pages = menu.pages || [];

  return (
    <div className={classes.wrap}>
      {pages.map((src, i) => (
        <img
          key={src}
          className={classes.page}
          src={src}
          alt={`תפריט ${menu.label} — עמוד ${i + 1} מתוך ${pages.length}`}
          loading={i === 0 ? 'eager' : 'lazy'}
        />
      ))}
      {menu.pdf ? (
        <a
          className={classes.link}
          href={menu.pdf}
          target="_blank"
          rel="noopener noreferrer"
        >
          להורדה או הדפסה של התפריט (PDF)
        </a>
      ) : null}
    </div>
  );
};
