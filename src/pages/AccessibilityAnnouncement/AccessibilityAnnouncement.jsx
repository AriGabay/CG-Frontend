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
    textAlign: 'center',
    minWidth: 'auto',
    minHeight: 'auto',
    color: 'black',
    display: 'block',
    overflowWrap: 'break-word',
    textOverflow: 'ellipsis',
    wordWrap: 'break-word',
    overflow: 'hidden',
    padding: '1em',
    fontSize: '20px',
    backgroundColor: 'transparent',
  },
}));

export const AccessibilityAnnouncement = () => {
  const classes = useStyles();

  const announceText = `אנו באתר שלנו מחויבים להפוך את האתר שלנו לנגיש לכולם, כולל אנשים עם מגבלות. לשם כך, ביצענו שדרוגים מספרים לאתר שלנו כדי להבטיח שהוא עומד בתקנים הבינלאומיים WCAG 2.1 ברמה AA.
  התוספות שלנו לנגישות כוללות, אך לא מוגבלות ל:
  * הוספת תיאורים טקסטואליים לתמונות
  * נגישות למקלדת לכפתורים ולאלמנטים האחרים של האתר
  * שימוש בצבעים שניתן להבחין בהם לאנשים עם ראייה מוגבלת
  אנחנו מקווים שמאמצים אלה יקלו על השימוש באתר שלנו לאנשים עם מגבלות.
  אם יש לך שאלות או נתקלת בבעיות נגישות, נשמע לשמוע ממך. הרכז שלנו לשאלות נגישות מוכן לעזור. ניתן ליצור איתו קשר במספר הטלפון 046734949.
  בנוסף, אם משתמשים נתקלים בבעיות נגישות, אנו ממליצים להתקשר אלינו במספר הטלפון שצוין לעיל ונשמח לעזור להם במהירות האפשרית.
  אנו מחויבים להמשיך ולשפר את נגישות האתר שלנו ולהבטיח שהוא נגיש לכל משתמש, לא משנה איזה סוג של מגבלה לו יש. אנו ממליצים לבדוק את האתר שלנו באופן קבוע כדי לראות את השיפורים שאנחנו מבצעים.
  ההצהרה הזו היא ההצהרת הרשמית שלנו על נגישות האתר, ואנו מעודכנים אותה באופן שוטף כדי להבטיח שאנו עומדים בתקנות הבינלאומיות.
  אנו מחויבים לספק חווית משתמש מעולה ונגישה לכולם, ואנו מקווים שתמצא את האתר שלנו מועיל ונוח לשימוש. אם יש לך שאלות או הצעות לשיפור, אנו ממליצים ליצור איתנו קשר.
  בנוסף, כדאי לציין שאם ישנם סעיפים מסוימים באתר שאינם נגישים, נשמע לשמוע את המשוב שלך ונשקול לעשות שינויים בהתאם.
  אנחנו מעריכים את התמיכה שלך במאמצים שלנו להפוך את האתר שלנו לנגיש לכולם.
  `;

  return (
    <Grid className={classes.root}>
      <Grid className={classes.textContainer}>
        <Typography>{announceText}</Typography>
      </Grid>
    </Grid>
  );
};
