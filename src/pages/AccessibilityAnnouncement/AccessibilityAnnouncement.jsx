import React from 'react';
import { makeStyles } from '@mui/styles';
import { Helmet } from 'react-helmet';
import { colors, fonts, radii, shadows } from '../../styles/designTokens';

const useStyles = makeStyles({
  page: {
    background: colors.bg,
    padding: '36px 0 64px',
  },
  container: {
    maxWidth: 940,
    margin: '0 auto',
    padding: '0 22px',
  },
  card: {
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.xl,
    boxShadow: shadows.cardSoft,
    padding: '46px 48px 50px',
    '@media (max-width:640px)': { padding: '30px 20px 34px' },
  },
  title: {
    fontFamily: fonts.display,
    fontWeight: 400,
    fontSize: 'clamp(25px,4.4vw,38px)',
    lineHeight: 1.3,
    color: colors.text,
    margin: '0 0 26px',
    paddingBottom: 24,
    borderBottom: `1px solid ${colors.border}`,
  },
  section: {
    fontFamily: fonts.display,
    fontWeight: 400,
    fontSize: 'clamp(20px,3.2vw,27px)',
    lineHeight: 1.35,
    color: colors.greenInk,
    margin: '40px 0 16px',
  },
  prose: {
    fontSize: 17,
    lineHeight: 1.85,
    color: colors.textSoft,
    maxWidth: '70ch',
    margin: '0 0 18px',
  },
  list: {
    listStyle: 'none',
    margin: '0 0 24px',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    '& li': {
      position: 'relative',
      paddingInlineStart: 26,
      maxWidth: '70ch',
      fontSize: 17,
      lineHeight: 1.75,
      color: colors.textSoft,
    },
    '& li::before': {
      content: '""',
      position: 'absolute',
      insetInlineStart: 7,
      top: '0.72em',
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: colors.green,
    },
  },
  contactBox: {
    marginTop: 22,
    background: colors.surfaceAlt,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.lg,
    padding: '24px 26px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    '@media (max-width:640px)': { padding: '20px 18px' },
  },
  contactLine: {
    margin: 0,
    maxWidth: '70ch',
    fontSize: 17,
    lineHeight: 1.7,
    color: colors.textSoft,
  },
  link: {
    color: colors.greenLink,
    fontWeight: 700,
    textDecoration: 'none',
    borderRadius: 4,
    '&:hover': { color: colors.greenDark, textDecoration: 'underline' },
    '&:focus-visible': {
      outline: `3px solid ${colors.greenDeep}`,
      outlineOffset: 3,
    },
  },
  meta: {
    marginTop: 36,
    paddingTop: 22,
    borderTop: `1px solid ${colors.border}`,
  },
  metaLine: {
    margin: '0 0 8px',
    maxWidth: '70ch',
    fontSize: 15,
    lineHeight: 1.7,
    color: colors.textMuted,
    '&:last-child': { marginBottom: 0 },
  },
});

export const AccessibilityAnnouncement = () => {
  const classes = useStyles();

  return (
    <>
      <Helmet>
        <title>Catering Gabay - Accessibility Announcement</title>
        <meta
          name="accessibility-announcement"
          content="AccessibilityAnnouncement"
        />
        <meta name="robots" content="all" />
      </Helmet>
      <main className={classes.page}>
        <div className={`${classes.container} gb-pad`}>
          <article className={classes.card}>
            <h1
              className={classes.title}
              aria-label="הצהרת נגישות לאתר האינטרנט של קייטרינג גבאי"
            >
              הצהרת נגישות לאתר האינטרנט של קייטרינג גבאי
            </h1>

            <p className={classes.prose}>
              בשנים האחרונות אתרי האינטרנט הפכו להיות הפלטפורמה העיקרית לפרסום
              המידע והשירותים השונים המוצעים על ידי החברה לציבור הרחב. קייטרינג
              גבאי מתמחה בהכנת אוכל בתוצרת ביתית. באתר אינטרנט זה ניתן למצוא
              מידע אודות שירותי הקייטרינג, הוראות הגעה למעדניה, ביצוע הזמנות,
              יצירת קשר עם צוות המעדנייה ועוד. מטרתנו בהנגשת האתר היא יצירת
              שוויון הזדמנויות במרחב האינטרנטי לאנשים עם לקויות מגוונות ואנשים
              הנעזרים בטכנולוגיות מסייעות שונות בעת גלישה ברשת האינטרנט.
            </p>

            <h2 className={classes.section}>
              התאמות הנגישות באתר האינטרנט{' '}
            </h2>

            <p
              className={classes.prose}
            >{`באתר אינטרנט זה בוצעו התאמות נגישות בהתאם להמלצות התקן הישראלי (ת"י 5568) ולנגישות תכנים באינטרנט ברמת AA בשילוב המלצות מסמך WCAG2.0 שפורסם באמצעות הארגון הבינלאומי W3C העוסק בתקינה ברשת האינטרנט.`}</p>
            <p
              className={classes.prose}
            >{`ההתאמות שבוצעו באתר נבדקו באמצעות הדפדפנים הנפוצים ביותר: גוגל כרום ואינטרנט אקספלורר (EDGE). לשם קבלת חווית גלישה נעימה ומיטבית עם תוכנה להקראת מסך אנו ממליצים להשתמש בתוכנת NVDA  בגרסה העדכנית ביותר.`}</p>

            <p className={classes.prose}>
              לצורך הנגשת האתר לאנשים עם מוגבלות בוצעו מספר רב של פעולות,
              ביניהן:
            </p>
            <ul className={classes.list}>
              <li>התאמת האתר לניווט קל ונוח באמצעות המקלדת.</li>
              <li>
                שימוש מסגרת ברורה ובולטת בעת קבלת פוקוס כאשר המשתמש מנווט באתר
                באמצעות המקלדת.
              </li>
              <li>שימוש בניגודיות חזותית מתאימה בין צבע הטקסט לצבע הרקע.</li>
              <li>
                תיוג הכותרות בצורה היררכית נכונה בהתאם למידע המפורסם בהן ולמבנה
                העמוד.
              </li>
              <li>
                יצירת שינוי חזותי בולט וברור בעת ריחוף, מעל רכיבים לחיצים כגון:
                התפריט העליון, כפתורים וקישורים.
              </li>
            </ul>

            <p className={classes.prose}>
              התאמות שבוצעו באתר לגולשים המשתמשים בתוכנה להקראת מסך:
            </p>
            <ul className={classes.list}>
              <li>הוספת טקסט אלטרנטיבי מתאים לתמונות המופיעות באתר.</li>
              <li>
                שימוש בכותרות מתאימות ותיוגן בהתאם למידע המופיע בהן ולמבנה
                העמוד.
              </li>
              <li>שימוש בשפה פשוטה ובהירה בכל עמודי האתר.</li>
              <li>
                שימוש בפקודת aria label להתאמת המידע המופיע באתר לתוכנה להקראת
                מסך.
              </li>
            </ul>

            <p className={classes.prose}>
              הייעוץ והליווי בנושא נגישות אתר האינטרנט של קייטרינג גבאי בוצע על
              ידי צוות WEB-A הנגשת אתרים, אפליקציות ומערכות מתקדמות.
            </p>

            <h2 className={classes.section}>הסדרי נגישות לקייטרינג גבאי</h2>

            <p className={classes.prose}>
              להלן הסדרי הנגישות לקייטרינג גבאי הממוקם ברחוב המברג 10, טבריה:{' '}
            </p>
            <ul className={classes.list}>
              <li>קיימות חניות נגישות/נכים מול המעדנייה.</li>
              <li>
                המעדנייה ממוקמת בקומת קרקע והדרך אליה נגישה לאנשים עם מוגבלות.
              </li>
              <li>הכניסה למעדנייה נגישה לאנשים עם מוגבלות.</li>
              <li>ניתן להתנייד במעדנייה בעזרת כיסא גלגלים.</li>
              <li>במעדנייה ישנם תאי שירותים לנכים.</li>
            </ul>

            <p className={classes.prose}>
              צוות החברה מאמין כי לכל אדם עם מוגבלות צריכה להיות היכולת להשתמש
              באתר האינטרנט בצורה שווה, מהנה וחווייתית.{' '}
            </p>
            <p className={classes.prose}>
              באתר זה בוצעו שינויים והתאמות מיוחדות באמצעות הטכנולוגיה העדכנית
              והמתאימה ביותר לצרכי לקוחותינו והגולשים באתר.
              <br /> עם זאת חשוב לציין כי ייתכן וימצאו אלמנטים מסוימים שאינם
              מונגשים בצורה מלאה או נמצאים בתהליכי הנגשה לאנשים עם מוגבלות.{' '}
              <br />
              נתקלתם ברכיב שאינו נגיש באתר?
              <br /> פנו אלינו ואנו מבטיחים לבדוק לשפר אותו בהקדם האפשרי וכמובן
              להעניק לכם את השירות הטוב ביותר בצורה מהירה, אישית ובהתאם לשביעות
              רצונכם.
            </p>

            <h2 className={classes.section}>פרטי רכז נגישות</h2>

            <p className={classes.prose}>
              החברה מינתה את אייל גבאי לרכז הנגישות של החברה.
              <br /> לבירורים נוספים, שאלות או בקשות מיוחדות בנושא נגישות אתר
              האינטרנט ונגישות משרדי החברה ניתן ליצור עימו קשר באמצעים הבאים:
            </p>

            <div className={classes.contactBox}>
              <p className={classes.contactLine}>שם מלא: אייל גבאי</p>
              <p className={classes.contactLine}>
                טלפון במשרד:{' '}
                <a className={classes.link} href="tel:04-6734949">
                  04-6734949
                </a>
              </p>
              <p className={classes.contactLine}>
                טלפון נייד:{' '}
                <a className={classes.link} href="tel:053-6660555">
                  053-6660555
                </a>{' '}
                (ניתן גם לפנות באמצעות הודעת SMS / וואטסאפ)
              </p>
              <p className={classes.contactLine}>
                דואר אלקטרוני:{' '}
                <a
                  className={classes.link}
                  target="_blank"
                  rel="noreferrer"
                  href="mailto:eyal@e-g.co.il"
                >
                  eyal@e-g.co.il
                </a>
              </p>
            </div>

            <div className={classes.meta}>
              <p className={classes.metaLine}>
                הצהרת הנגישות עודכנה בתאריך 21.08.2023
              </p>
              <p
                className={classes.metaLine}
              >{`כל הזכויות בהצהרת נגישות זו שמורות לחברת WEB-A נגישות דיגיטלית בע"מ ואין להפיץ, להעתיק או לשכפל אותה.`}</p>
            </div>
          </article>
        </div>
      </main>
    </>
  );
};
