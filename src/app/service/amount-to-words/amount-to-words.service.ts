import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AmountToWordsService {
  private units: string[] = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ];

  private tens: string[] = [
    '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
  ];

  private thousands: string[] = [
    '', 'Thousand', 'Million', 'Billion'
  ];

  public convert(amount: number): string {
    if (amount < 0) {
      return 'Minus ' + this.numberToWords(Math.abs(amount)) + ' Rials Only';
    }
    return this.numberToWords(amount) + ' Rials Only';
  }

  private numberToWords(num: number): string {
    if (num === 0) {
      return 'Zero';
    }

    let words = '';

    for (let i = 0; i < this.thousands.length; i++) {
      if (num === 0) {
        break;
      }

      const currentPart: number = num % 1000;
      if (currentPart > 0) {
        words = this.convertHundreds(currentPart) + (this.thousands[i] ? ' ' + this.thousands[i] : '') + ' ' + words;
      }
      num = Math.floor(num / 1000);
    }

    return words.trim();
  }

  private convertHundreds(num: number): string {
    let words = '';

    if (num >= 100) {
      words += this.units[Math.floor(num / 100)] + ' Hundred';
      num %= 100;
      if (num > 0) {
        words += ' ';
      }
    }

    if (num < 20) {
      words += this.units[num];
    } else {
      words += this.tens[Math.floor(num / 10)];
      if (num % 10 > 0) {
        words += ' ' + this.units[num % 10];
      }
    }

    return words.trim();
  }
}
