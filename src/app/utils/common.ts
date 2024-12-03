import moment from 'moment';

export class CommonUtils {
  static generateDatePeriods1(
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

  static generateDatePeriods(
    startDateInput: string,
    numberOfPeriods: number,
    frequency:string
  ): string[] {
    // Validate and parse the start date
    const startDate = moment(startDateInput, "DD-MM-YYYY", true);
    if (!startDate.isValid()) {
      throw new Error("Invalid start date format. Please use 'DD-MM-YYYY'.");
    }

    // Define frequency to month increment mapping
    const frequencyMap: { [key: string]: number } = {
      'M': 1,   // Monthly
      'BIM': 2, // Bi-Monthly
      'Q': 3,   // Quarterly
      'H': 6,   // Half-Yearly
      'A': 12   // Annually
    };

    // Get the month increment based on frequency
    const monthIncrement = frequencyMap[frequency];
    
    return Array.from({ length: numberOfPeriods }, (_, index) => {
      // Get the current date by adding the appropriate number of months
      const currentMonthDate = startDate.clone().add(index * monthIncrement, 'months');

      // Get the start day of the original start date
      const startDay = startDate.date();

      // Get the maximum days in the current month
      const maxDaysInMonth = currentMonthDate.daysInMonth();

      // Determine the valid day within the current month (not exceeding max days)
      const validDay = Math.min(startDay, maxDaysInMonth);
      currentMonthDate.date(validDay); // Set to the valid day within the month

      // Return the formatted date
      return currentMonthDate.format('DD-MM-YYYY');
    });
  }
}
