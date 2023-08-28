import React from 'react';
import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    height: '100%',
  },
  textContainer: {
    padding: '1em 1rem 2rem 1rem',
    height: 'max-content',
    '& > h1': {
      fontSize: '3rem',
      marginBottom: '1rem',
      textAlign: 'center',
    },
    '& > h2': {
      fontSize: '2rem',
      marginTop: '2rem',
      marginBottom: '1rem',
      textAlign: 'center',
    },
    '& > h3': {
      fontSize: '1.5rem',
      marginTop: '2rem',
      marginBottom: '1rem',
      textAlign: 'center',
    },
    '& > span , li': {
      textAlign: 'start',
      fontSize: '1rem',
      direction: 'rtl',
    },
    '& > ul>li': {
      width: 'max-content',
      maxWidth: '100%',
    },
  },
}));

export const AccessibilityAnnouncement = () => {
  const classes = useStyles();

  return (
    <Grid className={(classes.root, classes.textContainer)}>
      <Typography
        aria-label="הצהרת נגישות לאתר האינטרנט של קייטרינג גבאי"
        variant="h1"
      >
        הצהרת נגישות לאתר האינטרנט של קייטרינג גבאי
      </Typography>
      <Typography variant="p">
        בשנים האחרונות אתרי האינטרנט הפכו להיות הפלטפורמה העיקרית לפרסום המידע
        והשירותים השונים המוצעים על ידי החברה לציבור הרחב. קייטרינג גבאי מתמחה
        בהכנת אוכל בתוצרת ביתית. באתר אינטרנט זה ניתן למצוא מידע אודות שירותי
        הקייטרינג, הוראות הגעה למעדניה, ביצוע הזמנות, יצירת קשר עם צוות המעדנייה
        ועוד. מטרתנו בהנגשת האתר היא יצירת שוויון הזדמנויות במרחב האינטרנטי
        לאנשים עם לקויות מגוונות ואנשים הנעזרים בטכנולוגיות מסייעות שונות בעת
        גלישה ברשת האינטרנט.
      </Typography>
      <Typography variant="h2">התאמות הנגישות באתר האינטרנט </Typography>
      <Typography variant="p">{`באתר אינטרנט זה בוצעו התאמות נגישות בהתאם להמלצות התקן הישראלי (ת"י 5568) ולנגישות תכנים באינטרנט ברמת AA בשילוב המלצות מסמך WCAG2.0 שפורסם באמצעות הארגון הבינלאומי W3C העוסק בתקינה ברשת האינטרנט.
ההתאמות שבוצעו באתר נבדקו באמצעות הדפדפנים הנפוצים ביותר: גוגל כרום ואינטרנט אקספלורר (EDGE). לשם קבלת חווית גלישה נעימה ומיטבית עם תוכנה להקראת מסך אנו ממליצים להשתמש בתוכנת NVDA  בגרסה העדכנית ביותר.
`}</Typography>
      <br />
      <Typography variant="p">
        לצורך הנגשת האתר לאנשים עם מוגבלות בוצעו מספר רב של פעולות, ביניהן:
      </Typography>
      <ul role="tablist">
        <li role="tab">התאמת האתר לניווט קל ונוח באמצעות המקלדת.</li>
        <li role="tab">
          שימוש מסגרת ברורה ובולטת בעת קבלת פוקוס כאשר המשתמש מנווט באתר באמצעות
          המקלדת.
        </li>
        <li role="tab">
          שימוש בניגודיות חזותית מתאימה בין צבע הטקסט לצבע הרקע.
        </li>
        <li role="tab">
          תיוג הכותרות בצורה היררכית נכונה בהתאם למידע המפורסם בהן ולמבנה העמוד.
        </li>
        <li role="tab">
          יצירת שינוי חזותי בולט וברור בעת ריחוף, מעל רכיבים לחיצים כגון: התפריט
          העליון, כפתורים וקישורים.
        </li>
      </ul>
      <Typography variant="p">
        התאמות שבוצעו באתר לגולשים המשתמשים בתוכנה להקראת מסך:
      </Typography>
      <ul role="tablist">
        <li role="tab">הוספת טקסט אלטרנטיבי מתאים לתמונות המופיעות באתר.</li>
        <li role="tab">
          שימוש בכותרות מתאימות ותיוגן בהתאם למידע המופיע בהן ולמבנה העמוד.
        </li>
        <li role="tab">שימוש בשפה פשוטה ובהירה בכל עמודי האתר.</li>
        <li role="tab">
          שימוש בפקודת aria label להתאמת המידע המופיע באתר לתוכנה להקראת מסך.
        </li>
      </ul>
      <Typography variant="p">
        הייעוץ והליווי בנושא נגישות אתר האינטרנט של קייטרינג גבאי בוצע על ידי
        צוות WEB-A הנגשת אתרים, אפליקציות ומערכות מתקדמות.
      </Typography>
      <Typography variant="h2">הסדרי נגישות לקייטרינג גבאי</Typography>
      <Typography variant="p">
        להלן הסדרי הנגישות לקייטרינג גבאי הממוקם ברחוב המברג 10, טבריה:{' '}
      </Typography>
      <ul role="tablist">
        <li role="tab">קיימות חניות נגישות/נכים מול המעדנייה.</li>
        המעדנייה ממוקמת בקומת קרקע והדרך אליה נגישה לאנשים עם מוגבלות.
        <li role="tab">הכניסה למעדנייה נגישה לאנשים עם מוגבלות.</li>
        <li role="tab">ניתן להתנייד במעדנייה בעזרת כיסא גלגלים.</li>
        <li role="tab">במעדנייה ישנם תאי שירותים לנכים.</li>
      </ul>
      <Typography variant="p">
        צוות החברה מאמין כי לכל אדם עם מוגבלות צריכה להיות היכולת להשתמש באתר
        האינטרנט בצורה שווה, מהנה וחווייתית.{' '}
      </Typography>
      <Typography variant="p">
        באתר זה בוצעו שינויים והתאמות מיוחדות באמצעות הטכנולוגיה העדכנית
        והמתאימה ביותר לצרכי לקוחותינו והגולשים באתר.
        <br /> עם זאת חשוב לציין כי ייתכן וימצאו אלמנטים מסוימים שאינם מונגשים
        בצורה מלאה או נמצאים בתהליכי הנגשה לאנשים עם מוגבלות. <br />
        נתקלתם ברכיב שאינו נגיש באתר?
        <br /> פנו אלינו ואנו מבטיחים לבדוק לשפר אותו בהקדם האפשרי וכמובן להעניק
        לכם את השירות הטוב ביותר בצורה מהירה, אישית ובהתאם לשביעות רצונכם.
      </Typography>
      <Typography variant="h2">פרטי רכז נגישות</Typography>
      <Typography variant="p">
        החברה מינתה את אייל גבאי לרכז הנגישות של החברה.
        <br /> לבירורים נוספים, שאלות או בקשות מיוחדות בנושא נגישות אתר האינטרנט
        ונגישות משרדי החברה ניתן ליצור עימו קשר באמצעים הבאים:
      </Typography>
      <br />
      <Typography variant="p">שם מלא: אייל גבאי</Typography>
      <br />
      <Typography variant="p">
        טלפון במשרד: <a href="tel:04-6734949">04-6734949</a>{' '}
      </Typography>

      <br />
      <Typography variant="p">
        טלפון נייד: <a href="tel:053-6660555">053-6660555</a> (ניתן גם לפנות
        באמצעות הודעת SMS / וואטסאפ){' '}
      </Typography>
      <br />
      <Typography variant="p">
        דואר אלקטרוני:{' '}
        <a target="_blank" rel="noreferrer" href={'mailto: eyal@e-g.co.il'}>
          {' '}
          eyal@e-g.co.il
        </a>
      </Typography>
      <br />
      <Typography variant="p">
        הצהרת הנגישות עודכנה בתאריך 21.08.2023
      </Typography>
      <br />
      <Typography variant="p">{`כל הזכויות בהצהרת נגישות זו שמורות לחברת WEB-A נגישות דיגיטלית בע"מ ואין להפיץ, להעתיק או לשכפל אותה.`}</Typography>
    </Grid>
  );
};
