import moment from 'moment';

export class CommonUtils {
  static generateDatePeriods(
    startDateInput: string,
    numberOfPeriods: number
  ): string[] {
    const startDate = moment(startDateInput,"DD-MM-YYYY");

    return Array.from({ length: numberOfPeriods }, (_, index) => {
      const currentMonthDate = startDate.clone().add(index, 'months');
      const startDay = startDate.date();
      const maxDaysInMonth = currentMonthDate.daysInMonth();

      // Determine the valid day for the current month
      const validDay = Math.min(startDay, maxDaysInMonth);
      currentMonthDate.date(validDay); // Set to valid day

      return currentMonthDate.format('DD-MM-YYYY'); // Return the formatted date
    });
  }
}
