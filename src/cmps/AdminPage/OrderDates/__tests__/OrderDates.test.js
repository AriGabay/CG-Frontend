import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import getCustomTheme from '../../../../hooks/getCustomTheme';
import { OrderDates } from '../OrderDates';
import {
  getExceptions,
  saveExceptions,
} from '../../../../services/orderDatesService';
import { ordersService } from '../../../../services/ordersService';

jest.mock('../../../../services/orderDatesService', () => {
  const actual = jest.requireActual('../../../../services/orderDatesService');
  return { ...actual, getExceptions: jest.fn(), saveExceptions: jest.fn() };
});
jest.mock('../../../../services/ordersService', () => ({
  ordersService: { countOrdersForDate: jest.fn() },
}));

// Dates are derived from the real clock rather than a frozen one: faking time
// stalls waitFor's polling, and "a Friday a few weeks out" is all these tests
// need to stay deterministic whenever they are run.
const shift = (days) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d;
};
const nextFridayAfter = (days) => {
  const d = shift(days);
  while (d.getDay() !== 5) d.setDate(d.getDate() + 1);
  return d;
};
const pad = (n) => String(n).padStart(2, '0');
const key = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const label = (d) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;

const FUTURE_FRIDAY = nextFridayAfter(14);
const PAST_FRIDAY = nextFridayAfter(-400);
// The day before a Friday is a Thursday — a normally-closed day to open.
const FUTURE_THURSDAY = shift(0);
FUTURE_THURSDAY.setTime(FUTURE_FRIDAY.getTime());
FUTURE_THURSDAY.setDate(FUTURE_THURSDAY.getDate() - 1);

beforeEach(() => {
  jest.clearAllMocks();
  saveExceptions.mockResolvedValue({});
});

const setup = async (exceptions) => {
  getExceptions.mockResolvedValue(exceptions);
  // Controls.Button styles itself from the theme, as it does under App.
  render(
    <ThemeProvider theme={getCustomTheme()}>
      <OrderDates eventBus={{ dispatch: jest.fn() }} />
    </ThemeProvider>
  );
  await waitFor(() => screen.getByText('תאריכי הזמנה חריגים'));
};

/**
 * Choose a date through the calendar rather than by typing: the v6 picker's
 * text field is segmented, so a plain change event never parses into a date.
 * The calendar opens on the current month, so step forward to the target one.
 */
const choose = async (date) => {
  fireEvent.click(screen.getByRole('button', { name: /choose date/i }));
  await waitFor(() => screen.getByRole('grid'));

  const today = new Date();
  const monthsAhead =
    (date.getFullYear() - today.getFullYear()) * 12 +
    (date.getMonth() - today.getMonth());
  for (let i = 0; i < monthsAhead; i += 1) {
    fireEvent.click(screen.getByTitle('Next month'));
  }

  const day = String(date.getDate());
  await waitFor(() => screen.getByRole('gridcell', { name: day }));
  fireEvent.click(screen.getByRole('gridcell', { name: day }));
  await waitFor(() =>
    expect(screen.queryByRole('grid')).not.toBeInTheDocument()
  );
};

const pick = async (date, buttonText) => {
  await choose(date);
  await waitFor(() => screen.getByText(buttonText));
  fireEvent.click(screen.getByText(buttonText));
};

test('lists blocked dates and hides ones already past', async () => {
  await setup({ blocked: [key(PAST_FRIDAY), key(FUTURE_FRIDAY)], open: [] });
  expect(screen.getByText(new RegExp(label(FUTURE_FRIDAY)))).toBeInTheDocument();
  expect(screen.queryByText(new RegExp(label(PAST_FRIDAY)))).not.toBeInTheDocument();
});

test('blocking a Friday with no orders saves straight away', async () => {
  ordersService.countOrdersForDate.mockResolvedValue(0);
  await setup({ blocked: [], open: [] });
  await pick(FUTURE_FRIDAY, 'חסום תאריך');
  await waitFor(() =>
    expect(saveExceptions).toHaveBeenCalledWith({
      blocked: [key(FUTURE_FRIDAY)],
      open: [],
    })
  );
});

test('blocking a Friday that already has orders asks first', async () => {
  ordersService.countOrdersForDate.mockResolvedValue(4);
  await setup({ blocked: [], open: [] });
  await pick(FUTURE_FRIDAY, 'חסום תאריך');

  await waitFor(() => screen.getByText(/קיימות 4 הזמנות/));
  expect(saveExceptions).not.toHaveBeenCalled();

  fireEvent.click(screen.getByText('חסום בכל זאת'));
  await waitFor(() =>
    expect(saveExceptions).toHaveBeenCalledWith({
      blocked: [key(FUTURE_FRIDAY)],
      open: [],
    })
  );
});

test('a failed order count still lets the admin block, and says so', async () => {
  ordersService.countOrdersForDate.mockResolvedValue(null);
  await setup({ blocked: [], open: [] });
  await pick(FUTURE_FRIDAY, 'חסום תאריך');
  await waitFor(() => screen.getByText(/לא הצלחנו לבדוק/));
});

test('picking a non-Friday opens it instead, with no order check', async () => {
  await setup({ blocked: [], open: [] });
  await pick(FUTURE_THURSDAY, 'פתח להזמנות');
  await waitFor(() =>
    expect(saveExceptions).toHaveBeenCalledWith({
      blocked: [],
      open: [key(FUTURE_THURSDAY)],
    })
  );
  expect(ordersService.countOrdersForDate).not.toHaveBeenCalled();
});
