import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { isMenuEnableService } from '../../services/isMenuEnableService';
import { activePdfMenu, isSiteLockOn } from '../../services/pdfMenus';
import {
  SETTING_KEYS,
  siteSettingService,
} from '../../services/siteSettingService';
import { PdfMenuLock } from './PdfMenuLock';

// The admin has to stay reachable: the lock is switched off from נעילת תפריט,
// and locking that screen too would mean the only way out is the database.
const ALWAYS_OPEN = ['/adminpage', '/login'];

const isAdminRoute = (pathname) =>
  ALWAYS_OPEN.some((p) => (pathname || '').toLowerCase().startsWith(p));

/**
 * Replaces the whole site with the PDF notice while a PDF-only menu is open —
 * but only if the admin has switched that lock on. A PDF menu and an orderable
 * menu can run side by side, so the lock is a separate decision from publishing
 * the menu.
 *
 * Fails OPEN. If the settings call fails we render the site rather than lock
 * customers out on a flaky request — the rest of the app already treats that
 * call as advisory, and a false lock is far more damaging than a missing one.
 */
export const SiteLockGate = ({ children }) => {
  const { pathname } = useLocation();
  const [menu, setMenu] = useState(null);
  const [notice, setNotice] = useState(undefined);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let alive = true;
    // Both together: the notice is part of the locked screen, so waiting for it
    // avoids the text visibly swapping under the customer a moment later.
    // getSettings never rejects — it resolves {} when the endpoint is missing.
    Promise.all([
      isMenuEnableService.getAllMenuEnables(),
      siteSettingService.getSettings(),
    ])
      .then(([menus, settings]) => {
        if (!alive) return;
        const map = {};
        (menus || []).forEach((m) => {
          map[m.menuType] = m.enable;
        });
        // Both conditions: a PDF menu is open AND the admin has asked for the
        // site to be locked while one is. Without the second, publishing a
        // holiday menu would silently close the orderable shop too.
        setMenu(isSiteLockOn(map) ? activePdfMenu(map) : null);
        setNotice(settings?.[SETTING_KEYS.pdfMenuNotice]);
        setChecked(true);
      })
      .catch((err) => {
        console.error('Error fetching menu enables:', err);
        if (alive) setChecked(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  // Nothing is rendered until the answer is known. Showing the shop for the
  // second before the lock lands would let someone start an order that cannot
  // be completed, and it makes the lock look like a glitch.
  if (!checked) return null;

  if (menu && !isAdminRoute(pathname))
    return <PdfMenuLock menu={menu} notice={notice} />;

  // A fragment because `children` here is the whole app tree, not one element.
  return <>{children}</>;
};
