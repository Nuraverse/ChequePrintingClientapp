import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from '../shared.module';
import { AmountToWordsService } from '../service/amount-to-words/amount-to-words.service';
import { ImageManipulationComponent } from '../image-manipulation/image-manipulation.component';
import moment from 'moment';
import { Bank, Cheque, Agreement, Period, Frequency } from '../model/model';
import { ChequeService } from '../service/cheque/cheque-service.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AgreemrntService } from '../service/contract/contract-service.service';
import { CommonUtils } from '../utils/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-master',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './master.component.html',
  styleUrl: './master.component.css',
})
export class MasterComponent implements OnInit {
  banks!: Bank[];
  selectedBank!: Bank | null;
  firstChequeDate: Date = new Date();
  lastChequeDate!: Date | null;
  period1Checked = false;
  period2Checked = false;
  period3Checked = false;
  period4Checked = false;
  fontSize = 10;
  dateChecked = true;
  payeeChecked = true;
  aiwChecked = true;
  ainChecked = true;
  acpayeeChecked = true;
  showBackgroundColor = true;
  amountInWords1 = '';
  amountInWords2 = '';
  amountInWords3 = '';
  amountInWords4 = '';
  period1Amount = 0;
  period1LastAmount = 0;
  period1Periods = 1;
  period2Amount = 0;
  period2LastAmount = 0;
  period2Periods = 1;
  period3Amount = 0;
  period3LastAmount = 0;
  period3Periods = 1;
  period4Amount = 0;
  period4LastAmount = 0;
  period4Periods = 1;
  amountDisplay = '';
  agreementNo: number | null = 12345678;
  selectedChequeObject!: Cheque;
  autoMode = true;
  agreementInfo!: Agreement;
  viewDataFlag = false;
  isTextNavigation = false;
  printStartPosition = 0;
  printOptions = [
    { label: 'Front', value: 'front' },
    { label: 'Back', value: 'back' },
    { label: 'Both', value: 'both' },
  ];

  frequencyOptions: Frequency[] = [
    { label: 'Monthly', value: 'M' },
    { label: 'Bi-Monthly', value: 'BIM' },
    { label: 'Quarterly', value: 'Q' },
    { label: 'Half-Yearly', value: 'H' },
    { label: 'Annually', value: 'A' },
  ];

  printValue = 'front';
  selectedFrequency: Frequency = { label: 'Monthly', value: 'M' };

  @ViewChild(ImageManipulationComponent)
  imageComponent!: ImageManipulationComponent;

  constructor(
    private amountToWordsService: AmountToWordsService,
    private chequeService: ChequeService,
    private agreementService: AgreemrntService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchBanks();
  }

  fetchBanks(): void {
    this.chequeService.getBanks().subscribe({
      next: (banks: Bank[]) => {
        this.banks = banks;
      },
      error: (error) => {
        console.error('Error fetching banks:', error);
      },
      complete: () => {
        console.log('Fetching banks complete.');
      },
    });
  }

  fetchAgreement(): void {
    if (this.agreementNo) {
      this.viewDataFlag = false;
      this.agreementService.getAgreement(this.agreementNo).subscribe({
        next: (agreement: Agreement) => {
          if (agreement.agreementNo != null) {
            this.agreementInfo = agreement;
            this.firstChequeDate = moment(
              agreement.firstInstallmentDate,
              'YYYY-MM-DD'
            ).toDate();
            this.period1Amount = agreement.firstInstallmentAmount;
            this.period1LastAmount = agreement.lastInstallmentAmount;
            this.period1Periods = agreement.numberOfInstallment;
            const periodOfDates = CommonUtils.generateDatePeriods(
              moment(this.firstChequeDate).format('DD-MM-YYYY'),
              agreement.numberOfInstallment,
              this.selectedFrequency?.value
            );
            const frequency = this.frequencyOptions.find(
              (option) => option.value === agreement.frequency
            );
            if (frequency) {
              this.selectedFrequency = frequency;
            } else {
              this.selectedFrequency = { label: 'Monthly', value: 'M' };
            }
            this.lastChequeDate = moment(
              periodOfDates[periodOfDates.length - 1],
              'DD-MM-YYYY'
            ).toDate();
            this.messageService.add({
              severity: 'success',
              summary: 'success',
              detail: 'Agreement information retrieved successfully!',
            });
          } else {
            this.messageService.add({
              severity: 'warn',
              summary: 'warn',
              detail:
                'Agreement information not available [' +
                this.agreementNo +
                ']',
            });
            this.clearPeriod1();
          }
        },
        error: (error) => {
          console.error('Error fetching Contract:', error);
        },
        complete: () => {
          console.log('Fetching Contract complete.');
        },
      });
    }
  }

  fetchCheque(): void {
    if (this.selectedBank) {
      this.viewDataFlag = false;
      this.chequeService.getCheque(this.selectedBank?.id).subscribe({
        next: (cheque: Cheque) => {
          this.selectedChequeObject = cheque;
          if (this.imageComponent) {
            this.imageComponent.resizeAndLoadCanvas(cheque);
          }
          this.messageService.add({
            severity: 'success',
            summary: 'success',
            detail: 'Cheque information retrieved successfully!',
          });
          this.period1Checked = true;
          this.calculateLastPeriodDate();
        },
        error: (error) => {
          console.error('Error fetching cheque:', error);
        },
        complete: () => {
          console.log('Fetching cheque complete.');
        },
      });
    }
  }

  convertAmountInWords(periodType: string) {
    if (periodType === 'period1' && this.period1Amount != 0) {
      this.amountInWords1 = this.amountToWordsService.convert(
        this.period1Periods == 1 ? this.period1LastAmount : this.period1Amount
      );
    } else if (periodType === 'period2' && this.period2Amount != 0) {
      this.amountInWords2 = this.amountToWordsService.convert(
        this.period2Amount
      );
    } else if (periodType === 'period3' && this.period3Amount != 0) {
      this.amountInWords3 = this.amountToWordsService.convert(
        this.period3Amount
      );
    } else if (periodType === 'period4' && this.period4Amount != 0) {
      this.amountInWords4 = this.amountToWordsService.convert(
        this.period4Amount
      );
    }
  }

  clearAll() {
    this.selectedBank = null;
    this.clearPeriod1();
    this.clearPeriod2();
    this.clearPeriod3();
    this.clearPeriod4();
    this.viewDataFlag = false;
    this.imageComponent.resetCanvas();
  }
  resetCanvas() {
    if (this.imageComponent) {
      this.selectedBank = null;
      this.viewDataFlag = false;
      this.imageComponent.resetCanvas();
    }
  }

  printPreviewCanvas() {
    if (this.imageComponent) {
      const firstChequeDateStr = moment(this.firstChequeDate).format(
        'DD-MM-YYYY'
      );
      const periods: Period[] = this.generatePeriods();
      if (this.agreementNo) {
        this.imageComponent.printPreviewCanvas(
          firstChequeDateStr,
          periods,
          this.agreementNo,
          this.autoMode,
          this.printValue,
          this.selectedFrequency?.value
        );
      }
    }
  }

  printCanvas() {
    if (this.imageComponent) {
      this.confirmationService.confirm({
        message:
          'Are you sure you want to print the cheques on <b style="font-size: 18px;">' +
          this.printValue +
          ' side ' +
          (this.printValue == 'front' || this.printValue == 'back'
            ? 'only'
            : '') +
          ' ? </b>',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptButtonStyleClass: 'p-button-success ml-2',
        rejectButtonStyleClass: 'p-button-warning',
        accept: () => {
          const firstChequeDateStr = moment(this.firstChequeDate).format(
            'DD-MM-YYYY'
          );
          const periods: Period[] = this.generatePeriods();
          if (this.agreementNo) {
            this.imageComponent.printCanvas(
              firstChequeDateStr,
              periods,
              this.agreementNo,
              this.autoMode,
              this.printValue,
              this.selectedFrequency?.value,
              this.selectedChequeObject.printStartPosition
            );
          }
        },
        reject: () => {
          this.messageService.add({
            severity: 'info',
            summary: 'Cancelled',
            detail: 'Cheque printing has been cancelled.',
          });
        },
      });
    }
  }

  generatePeriods() {
    const periods: Period[] = [];
    if (this.period1Checked && this.period1Amount != 0) {
      periods.push({
        periodAmount: this.period1Amount,
        periodLastAmount: this.period1LastAmount,
        periods: this.period1Periods,
      });
    }
    if (this.period2Checked && this.period2Amount != 0) {
      periods.push({
        periodAmount: this.period2Amount,
        periodLastAmount: this.period2LastAmount,
        periods: this.period2Periods,
      });
    }

    if (this.period3Checked && this.period3Amount != 0) {
      periods.push({
        periodAmount: this.period3Amount,
        periodLastAmount: this.period3LastAmount,
        periods: this.period3Periods,
      });
    }

    if (this.period4Checked && this.period4Amount != 0) {
      periods.push({
        periodAmount: this.period4Amount,
        periodLastAmount: this.period4LastAmount,
        periods: this.period4Periods,
      });
    }
    return periods;
  }

  moveText(position: string) {
    if (this.imageComponent) {
      this.imageComponent.moveText(position);
    }
  }

  increaseTextboxWidth() {
    if (this.imageComponent) {
      this.imageComponent.increaseTextboxWidth();
    }
  }

  decreaseTextboxWidth() {
    if (this.imageComponent) {
      this.imageComponent.decreaseTextboxWidth();
    }
  }

  increaseFontSize() {
    if (this.imageComponent) {
      this.imageComponent.increaseFontSize();
    }
  }

  decreaseFontSize() {
    if (this.imageComponent) {
      this.imageComponent.decreaseFontSize();
    }
  }
  toggleBold() {
    if (this.imageComponent) {
      this.imageComponent.toggleBold();
    }
  }

  toggleItalic() {
    if (this.imageComponent) {
      this.imageComponent.toggleItalic();
    }
  }

  toggleUnderline() {
    if (this.imageComponent) {
      this.imageComponent.toggleUnderline();
    }
  }

  hideShowTextbox(index: number, checked: boolean) {
    if (this.imageComponent) {
      this.imageComponent.hideShowTextbox(index, checked);
    }
  }

  toggleBackgroundColor() {
    if (this.imageComponent) {
      this.imageComponent.toggleBackgroundColor(this.showBackgroundColor);
    }
  }

  viewData1() {
    if (this.imageComponent) {
      this.amountDisplay = 'Total ';
      let totalAmount = 0;

      this.amountInWords1 = this.amountToWordsService.convert(
        this.period1Periods == 1 ? this.period1LastAmount : this.period1Amount
      );
      const formattedDate = moment(this.firstChequeDate).format('DD-MM-YYYY');
      this.imageComponent.updateText(formattedDate, 0);
      this.imageComponent.splitTextBetweenTwoObjects(this.amountInWords1, 2, 3);
      this.imageComponent.updateText(
        (this.period1Periods == 1
          ? this.period1LastAmount
          : this.period1Amount) + '/',
        4
      );
      this.imageComponent.updateText('---', 5);
      if (this.period1Checked) {
        this.amountDisplay +=
          this.period1Amount != 0
            ? this.period1Amount +
              ' X ' +
              (this.period1Periods - 1) +
              ' + ' +
              this.period1LastAmount
            : '';
        totalAmount +=
          this.period1Amount * (this.period1Periods - 1) +
          this.period1LastAmount;
      }
      if (this.period2Checked) {
        this.amountDisplay +=
          this.period2Amount != 0
            ? ' & ' +
              this.period2Amount +
              ' X ' +
              (this.period2Periods - 1) +
              ' + ' +
              this.period2LastAmount
            : '';
        totalAmount +=
          this.period2Amount * (this.period2Periods - 1) +
          this.period2LastAmount;
      }

      if (this.period3Checked) {
        this.amountDisplay +=
          this.period3Amount != 0
            ? ' & ' +
              this.period3Amount +
              ' X ' +
              (this.period3Periods - 1) +
              ' + ' +
              this.period3LastAmount
            : '';
        totalAmount +=
          this.period3Amount * (this.period3Periods - 1) +
          this.period3LastAmount;
      }
      if (this.period4Checked) {
        this.amountDisplay +=
          this.period4Amount != 0
            ? ' & ' +
              this.period4Amount +
              ' X ' +
              (this.period4Periods - 1) +
              ' + ' +
              this.period4LastAmount
            : '';
        totalAmount +=
          this.period4Amount * (this.period4Periods - 1) +
          this.period4LastAmount;
      }

      this.amountDisplay += ' => ' + totalAmount;

      if (this.agreementNo != 0) {
        this.imageComponent.updateTextBack(this.agreementNo + '', 0);
      }
      this.showBackgroundColor = false;
      this.toggleBackgroundColor();
      this.viewDataFlag = true;
      this.messageService.add({
        severity: 'success',
        summary: 'success',
        detail: 'The view has been applied successfully!',
      });
    }
  }

  viewData() {
    if (this.imageComponent) {
      this.amountDisplay = '';
      let totalAmount = 0;

      this.amountInWords1 = this.amountToWordsService.convert(
        this.period1Periods == 1 ? this.period1LastAmount : this.period1Amount
      );

      const formattedDate = moment(this.firstChequeDate).format('DD-MM-YYYY');
      this.imageComponent.updateText(formattedDate, 0);
      this.imageComponent.splitTextBetweenTwoObjects(this.amountInWords1, 2, 3);
      this.imageComponent.updateText(
        (this.period1Periods == 1
          ? this.period1LastAmount
          : this.period1Amount) + '/',
        4
      );
      this.imageComponent.updateText('---', 5);

      // Define a concise array of periods without prefixes
      const periods = [
        {
          amount: this.period1Amount,
          periods: this.period1Periods,
          lastAmount: this.period1LastAmount,
          checked: this.period1Checked,
        },
        {
          amount: this.period2Amount,
          periods: this.period2Periods,
          lastAmount: this.period2LastAmount,
          checked: this.period2Checked,
        },
        {
          amount: this.period3Amount,
          periods: this.period3Periods,
          lastAmount: this.period3LastAmount,
          checked: this.period3Checked,
        },
        {
          amount: this.period4Amount,
          periods: this.period4Periods,
          lastAmount: this.period4LastAmount,
          checked: this.period4Checked,
        },
      ];

      periods.forEach((period, index) => {
        if (period.checked) {
          let effectiveAmount = period.amount; // Default to the amount

          if (period.periods === 1) {
            // Use last amount if available; otherwise, use the first amount
            effectiveAmount = period.lastAmount || period.amount;

            // Directly add effectiveAmount to the amountDisplay without multiplication
            this.amountDisplay += `${index > 0 ? ' & ' : ''}${effectiveAmount}`;
            totalAmount += effectiveAmount; // Add to totalAmount directly
          } else if (period.periods > 1) {
            // Explicitly checking for periods greater than 1
            // For periods greater than 1, only manipulate if the amount is not zero
            if (period.amount !== 0) {
              const multiplier = period.periods - 1; // This is used for display
              const lastAmountDisplay =
                period.lastAmount !== undefined
                  ? ` + ${period.lastAmount}`
                  : '';

              // Display the multiplication part with the multiplier
              this.amountDisplay += `${index > 0 ? ' & ' : ''}${
                period.amount
              } X ${multiplier}${lastAmountDisplay}`;
            }

            // Calculate totalAmount for periods greater than 1
            totalAmount +=
              effectiveAmount * (period.periods - 1) + (period.lastAmount || 0);
          }
        }
      });

      // Finally, append the total amount to the amountDisplay
      this.amountDisplay += ` => Total Amount: ${totalAmount}`;

      if (this.agreementNo !== 0) {
        this.imageComponent.updateTextBack(this.agreementNo + '', 0);
      }
      this.showBackgroundColor = false;
      this.toggleBackgroundColor();
      this.viewDataFlag = true;

      this.messageService.add({
        severity: 'success',
        summary: 'success',
        detail: 'The view has been applied successfully!',
      });
    }
  }

  exportJSON() {
    if (this.imageComponent) {
      this.imageComponent.exportJSON();
    }
  }
  onAutoMode() {
    if (this.autoMode) {
      this.period2Checked = false;
      this.period3Checked = false;
      this.period4Checked = false;
    } else {
      this.clearPeriod1();
    }
    this.calculateLastPeriodDate();
  }

  clearPeriod1() {
    this.amountDisplay = '';
    this.agreementNo = null;
    this.firstChequeDate = new Date();
    this.period1Amount = 0;
    this.period1LastAmount = 0;
    this.lastChequeDate = null;
    this.period1Periods = 1;
    this.amountInWords1 = '';
    this.viewDataFlag = false;
    this.selectedFrequency = { label: 'Monthly', value: 'M' };
  }

  clearPeriod2() {
    this.amountDisplay = '';
    this.period2Amount = 0;
    this.period2LastAmount = 0;
    this.period2Periods = 1;
    this.amountInWords2 = '';
  }

  clearPeriod3() {
    this.amountDisplay = '';
    this.period3Amount = 0;
    this.period3LastAmount = 0;
    this.period3Periods = 1;
    this.amountInWords3 = '';
  }

  clearPeriod4() {
    this.amountDisplay = '';
    this.period4Amount = 0;
    this.period4LastAmount = 0;
    this.period4Periods = 1;
    this.amountInWords4 = '';
  }

  calculateLastPeriodDate() {
    if (!this.autoMode && this.firstChequeDate) {
      this.viewDataFlag = false;
      let periods = 0;
      if (this.period1Checked) {
        periods = this.period1Periods;
      }
      if (this.period2Checked) {
        periods += this.period2Periods;
      }
      if (this.period3Checked) {
        periods += this.period3Periods;
      }
      if (this.period4Checked) {
        periods += this.period4Periods;
      }
      if (periods != 0) {
        const periodOfDates = CommonUtils.generateDatePeriods(
          moment(this.firstChequeDate).format('DD-MM-YYYY'),
          periods,
          this.selectedFrequency?.value
        );
        this.lastChequeDate = moment(
          periodOfDates[periodOfDates.length - 1],
          'DD-MM-YYYY'
        ).toDate();
      }
    }
  }
  onTextObjectSelection(obj: any) {
    if (obj) {
      this.isTextNavigation = true;
    } else {
      this.isTextNavigation = false;
    }
  }

  navigateToPrintSettings() {
    if (this.imageComponent) {
      this.imageComponent.disposeCanvas();
    }
    this.router.navigate(['/cheque-print-settings']);
  }
}
