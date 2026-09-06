import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import DatePicker from '../DatePicker';
import { getExceptions } from '../../../services/orderDatesService';

jest.mock('../../../services/orderDatesService', () => {
  const actual = jest.requireActual('../../../services/orderDatesService');
  return { ...actual, getExceptions: jest.fn() };
});

// October 2026: the 2nd, 9th, 16th, 23rd and 30th are Fridays.
const OCTOBER = new Date(2026, 9, 1);

const openCalendar = async (exceptions) => {
  getExceptions.mockResolvedValue(exceptions);
  const { container } = render(
    <DatePicker
      name="pickUpDate"
      label="תאריך איסוף"
      value={OCTOBER}
      onChange={() => {}}
    />
  );
  // The outer wrapper is what opens the picker; the value prop pins it to October.
  fireEvent.click(container.firstChild);
  await waitFor(() => screen.getByRole('gridcell', { name: '2' }));
};

const cell = (day) => screen.getByRole('gridcell', { name: String(day) });

test('with no exceptions only Fridays are selectable', async () => {
  await openCalendar({ blocked: [], open: [] });
  await waitFor(() => expect(cell(2)).not.toBeDisabled()); // Friday
  expect(cell(1)).toBeDisabled(); // Thursday
  expect(cell(9)).not.toBeDisabled(); // Friday
});

test('a Friday the admin blocked is not selectable', async () => {
  await openCalendar({ blocked: ['2026-10-09'], open: [] });
  await waitFor(() => expect(cell(9)).toBeDisabled());
  expect(cell(2)).not.toBeDisabled(); // other Fridays unaffected
  expect(cell(16)).not.toBeDisabled();
});

test('a weekday the admin opened is selectable', async () => {
  await openCalendar({ blocked: [], open: ['2026-10-07'] });
  await waitFor(() => expect(cell(7)).not.toBeDisabled()); // Wednesday
  expect(cell(6)).toBeDisabled(); // Tuesday, untouched
});
