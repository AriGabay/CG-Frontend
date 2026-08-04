import React from 'react';
import { makeStyles } from '@mui/styles';
import { Helmet } from 'react-helmet';
import { BUSINESS } from '../../cmps/AppHeader/AppHeader';
import { colors, fonts, radii, shadows } from '../../styles/designTokens';

/**
 * Every factual claim here is traceable to the code, so nothing invented
 * reaches a real customer:
 *   collected fields -> UserDetailsForm.jsx (initialFValues)
 *   order storage    -> cg-backend models/order.js
 *   order email      -> cg-backend services/email.service.js (PDF attachment)
 *   analytics        -> public/index.html, consent.service.js
 *   browser storage  -> storageService / async-storage.service (sessionStorage)
 *   contact details  -> BUSINESS in AppHeader.jsx
 */
const LAST_UPDATED = 'אוגוסט 2026';

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
    margin: '0 0 12px',
  },
  updated: {
    fontSize: 15,
    color: colors.textMuted,
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
      insetInlineStart: 6,
      top: 12,
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: colors.green,
    },
  },
  link: {
    color: colors.greenLink,
    textUnderlineOffset: 3,
  },
});

export const PrivacyPolicy = () => {
  const classes = useStyles();

  return (
    <>
      <Helmet>
        <title>קייטרינג גבאי - מדיניות פרטיות</title>
        <meta
          name="description"
          content="מדיניות הפרטיות של אתר קייטרינג גבאי: איזה מידע נאסף, לשם מה, עם מי הוא משותף וכיצד ניתן לממש את זכויותיכם."
        />
        <meta name="robots" content="all" />
      </Helmet>

      <main className={classes.page}>
        <div className={`${classes.container} gb-pad`}>
          <article className={classes.card}>
            <h1 className={classes.title}>מדיניות פרטיות</h1>
            <p className={classes.updated}>עודכן לאחרונה: {LAST_UPDATED}</p>

            <p className={classes.prose}>
              קייטרינג גבאי בע״מ מכבדת את פרטיותכם. מסמך זה מסביר איזה מידע אישי נאסף
              באתר, כיצד הוא נאסף, לשם מה הוא משמש, עם מי הוא משותף, וכיצד תוכלו
              לממש את זכויותיכם ביחס אליו. המדיניות מנוסחת בלשון זכר מטעמי נוחות
              בלבד ומתייחסת לכל המגדרים.
            </p>

            <h2 className={classes.section}>איזה מידע אנחנו אוספים</h2>

            <p className={classes.prose}>
              מידע שאתם מוסרים לנו ביוזמתכם, בעת ביצוע הזמנה או פנייה אלינו:
            </p>
            <ul className={classes.list}>
              <li>שם פרטי ושם משפחה.</li>
              <li>מספר טלפון, ובאפשרותכם להוסיף מספר טלפון נוסף.</li>
              <li>כתובת דואר אלקטרוני.</li>
              <li>עיר ורחוב.</li>
              <li>מספר תעודת זהות.</li>
              <li>מועד האיסוף ושעת האיסוף שבחרתם.</li>
              <li>תוכן ההזמנה: המנות, הכמויות והערות שצירפתם.</li>
            </ul>

            <p className={classes.prose}>
              מידע הנאסף באופן אוטומטי בעת הגלישה, באמצעות שירותי מדידה: כתובת
              IP, סוג המכשיר והדפדפן, העמודים שבהם ביקרתם, משך השהייה והאתר שממנו
              הגעתם. מידע זה נאסף בכפוף להסכמתכם, במקומות שבהם החוק מחייב זאת.
            </p>

            <p className={classes.prose}>
              באתר לא מתבצעת סליקה ולא מתבצע תשלום מקוון, ולפיכך איננו אוספים
              ואיננו שומרים פרטי כרטיס אשראי או פרטי חשבון בנק.
            </p>

            <h2 className={classes.section}>כיצד המידע נאסף</h2>
            <ul className={classes.list}>
              <li>טופס ההזמנה באתר, בעת השלמת ההזמנה.</li>
              <li>טופס יצירת הקשר ופניות שמגיעות אלינו בדואר אלקטרוני.</li>
              <li>שיחות טלפון למעדנייה.</li>
              <li>
                כלי מדידה וניתוח תנועה המוטמעים באתר, כמתואר בסעיף העוגיות שלהלן.
              </li>
            </ul>

            <h2 className={classes.section}>לשם מה אנחנו אוספים את המידע</h2>
            <ul className={classes.list}>
              <li>קבלת ההזמנה, הכנתה ומסירתה במועד ובשעה שבחרתם.</li>
              <li>יצירת קשר בנוגע להזמנה, לרבות עדכונים, בירורים ושינויים.</li>
              <li>זיהוי המזמין והפקת מסמכי ההזמנה.</li>
              <li>
                עמידה בחובות החלות עלינו בדין, ובכלל זה חובות הנהלת חשבונות
                ושמירת מסמכים.
              </li>
              <li>
                שיפור האתר, התפריט והשירות, על בסיס נתונים סטטיסטיים על אופן
                השימוש באתר.
              </li>
              <li>
                משלוח עדכונים ומבצעים, ככל שהסכמתם לכך, ובכפוף לזכותכם לחזור בכם
                בכל עת.
              </li>
            </ul>

            <h2 className={classes.section}>
              כיצד המידע נשמר, משותף ונמסר לאחרים
            </h2>

            <p className={classes.prose}>
              פרטי ההזמנה נשמרים במסד הנתונים של האתר, ובנוסף נשלחים אלינו בדואר
              אלקטרוני בצירוף מסמך ההזמנה. הגישה למידע מוגבלת לבעלי תפקידים
              במעדנייה הזקוקים לו לצורך מילוי ההזמנה, והכניסה לממשק הניהול מוגנת
              בהזדהות.
            </p>

            <p className={classes.prose}>
              איננו מוכרים מידע אישי ואיננו מעבירים אותו לצדדים שלישיים לצורכי
              פרסום. לצורך הפעלת האתר אנו נעזרים בספקי שירות, שלכל אחד מהם מדיניות
              פרטיות משלו:
            </p>
            <ul className={classes.list}>
              <li>Microsoft Azure — אחסון האתר והגשתו לגולשים.</li>
              <li>Google — שירותי מדידה, מפות ומשלוח הודעות הדואר האלקטרוני.</li>
              <li>Cloudinary — אחסון והגשה של תמונות המנות.</li>
              <li>Auth0 — שירות ההזדהות של ממשק הניהול.</li>
            </ul>

            <p className={classes.prose}>
              נמסור מידע אישי מעבר לאמור אם נידרש לכך על פי דין, על פי צו של רשות
              מוסמכת, או לשם הגנה על זכויותינו בהליך משפטי.
            </p>

            <p className={classes.prose}>
              המידע נשמר כל עוד הוא דרוש לצרכים שלשמם נאסף, ולתקופות נוספות ככל
              שאלה נדרשות לפי חובות שמירת מסמכים החלות עלינו בדין.
            </p>

            <h2 className={classes.section}>כיצד אנחנו יוצרים איתכם קשר</h2>
            <p className={classes.prose}>
              אנו פונים אליכם בטלפון או בדואר אלקטרוני, בעיקר בנוגע להזמנה
              שביצעתם. אם הסכמתם לקבל עדכונים שיווקיים, נוכל לשלוח לכם הודעות על
              תפריטים ומבצעים. בכל הודעה כזו תימצא דרך פשוטה להסיר את עצמכם
              מהרשימה, ותוכלו גם לפנות אלינו ישירות בבקשה להפסיק את הדיוור.
            </p>

            <h2 className={classes.section}>עוגיות וכלי מעקב</h2>

            <p className={classes.prose}>
              האתר עושה שימוש בעוגיות ובאחסון מקומי בדפדפן לצרכים אלה:
            </p>
            <ul className={classes.list}>
              <li>
                שמירת עגלת הקניות ופרטי ההזמנה במהלך הגלישה, כדי שלא יאבדו בין
                העמודים. מידע זה נשמר בדפדפן שלכם בלבד ונמחק עם סגירת החלון.
              </li>
              <li>
                שמירת בחירתכם לגבי עוגיות, כדי שלא נשאל אתכם שוב בכל ביקור.
              </li>
              <li>
                Google Analytics, לצורך הבנת אופן השימוש באתר במונחים סטטיסטיים.
              </li>
              <li>Google Maps, בעמודים המציגים מפה.</li>
            </ul>

            <p className={classes.prose}>
              עוגיות המדידה פועלות במנגנון ההסכמה של גוגל. במדינות שבהן הדין
              מחייב הסכמה מוקדמת, האחסון חסום כברירת מחדל עד שתאשרו אותו בבאנר
              המופיע באתר. תוכלו לעיין במדיניות הפרטיות של גוגל בכתובת{' '}
              <a
                className={classes.link}
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                policies.google.com/privacy
              </a>
              .
            </p>

            <h2 className={classes.section}>
              זכויותיכם וכיצד לחזור בכם מהסכמה
            </h2>

            <p className={classes.prose}>
              על פי חוק הגנת הפרטיות, התשמ״א-1981, אתם רשאים לעיין במידע שנאסף
              עליכם, לבקש לתקן מידע שאינו נכון, שלם או מדויק, ולבקש את מחיקתו.
              גולשים המצויים באזור הכלכלי האירופי או בבריטניה זכאים בנוסף לזכויות
              המוקנות להם לפי ה-GDPR, ובכללן קבלת עותק מהמידע והתנגדות לעיבודו.
            </p>

            <p className={classes.prose}>
              למימוש כל אחת מהזכויות האלה פנו אלינו בפרטים שבסוף עמוד זה. בנוסף,
              תוכלו בכל עת למחוק את העוגיות ואת האחסון המקומי דרך הגדרות הדפדפן —
              פעולה זו תמחק גם את בחירתכם הקודמת, והבאנר יופיע שוב בביקור הבא.
            </p>

            <h2 className={classes.section}>שינויים במדיניות</h2>
            <p className={classes.prose}>
              אנו רשאים לעדכן מדיניות זו מעת לעת, למשל בעקבות שינוי בשירותים
              שאנו מציעים או בדרישות הדין. הנוסח המעודכן יפורסם בעמוד זה, ותאריך
              העדכון האחרון המופיע בראשו ישקף את מועד השינוי. אנו ממליצים לעיין
              בעמוד זה מדי פעם.
            </p>

            <h2 className={classes.section}>שאלות ויצירת קשר</h2>
            <p className={classes.prose}>
              לכל שאלה בנוגע למדיניות זו, או לבקשה לעיין במידע שנאסף עליכם, לתקן
              אותו או למחוק אותו, אנחנו זמינים עבורכם:
            </p>
            <ul className={classes.list}>
              <li>
                טלפון:{' '}
                <a className={classes.link} href={BUSINESS.phoneHref}>
                  {BUSINESS.phoneDisplay}
                </a>
              </li>
              <li>
                דואר אלקטרוני:{' '}
                <a
                  className={classes.link}
                  href={`mailto:${BUSINESS.email}`}
                >
                  {BUSINESS.email}
                </a>
              </li>
              <li>כתובת: {BUSINESS.address}</li>
            </ul>
          </article>
        </div>
      </main>
    </>
  );
};
