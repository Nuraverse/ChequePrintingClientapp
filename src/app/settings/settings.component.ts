import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from '../shared.module';
import { ImageManipulationComponent } from '../image-manipulation/image-manipulation.component';
import { ChequeService } from '../service/cheque/cheque-service.service';
import { environment } from '../../environments/environment';
import { Bank, Cheque, FileUploadResponse } from '../model/model';
import { FileBeforeUploadEvent, FileSelectEvent } from 'primeng/fileupload';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent implements OnInit {
  uploadFileURL = environment.apiUrl + '/api/upload';
  isSaveCancelButtonShow = true;
  banks!: Bank[];
  selectedBank!: Bank | null;
  fileUploadResponse!: FileUploadResponse;
  saveChequeResponse!: Cheque;
  savedCheque!: Cheque;
  chequeWidth = 0;
  chequeHeight = 0;
  uploadFilePath = '';
  selectedFileName = '';
  selectedChequeObject!: Cheque;
  selectedBankName = '';
  tabActiveIndex = 0;
  isDisplayApplyBtn = true;
  imageURL = '';
  uploadFileFlag = false;
  isTextNavigation = false;
  printStartPosition = 29.0;

  @ViewChild(ImageManipulationComponent)
  imageComponent!: ImageManipulationComponent;

  constructor(
    private chequeService: ChequeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchBanks();
  }

  onUpload(event: any) {
    this.fileUploadResponse = event.originalEvent.body;
    this.uploadFilePath = this.fileUploadResponse.filePath;
    if (this.imageComponent) {
      this.imageURL =
        this.uploadFileURL + '/files/' + this.fileUploadResponse.fileName;
      this.imageComponent.loadBackgroundImage(
        this.cmToPixels(this.chequeWidth),
        this.cmToPixels(this.chequeHeight),
        this.imageURL
      );
      this.isDisplayApplyBtn = false;
      this.uploadFileFlag = true;
    }
    this.messageService.add({
      severity: 'success',
      summary: 'success',
      detail: 'The cheque image was uploaded successfully!',
    });
  }

  activeIndexChange(index: number) {
    this.tabActiveIndex = index;
    if (index === 2) {
      this.isSaveCancelButtonShow = false;
    } else {
      this.isSaveCancelButtonShow = true;
    }
    this.selectedBank = null;
    this.clear();
  }
  exportJSON() {
    if (this.imageComponent) {
      this.imageComponent.exportJSON();
    }
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

  fetchCheque(): void {
    if (this.selectedBank) {
      this.chequeService.getCheque(this.selectedBank.id).subscribe({
        next: (cheque: Cheque) => {
          this.savedCheque = cheque;
          this.selectedChequeObject = cheque;
          this.selectedBankName = cheque.bankName;
          this.chequeWidth = cheque.chequeWidth;
          this.chequeHeight = cheque.chequeHeight;
          this.printStartPosition = cheque.printStartPosition;
          if (this.imageComponent) {
            this.imageComponent.resizeAndLoadCanvas(cheque);
          }
          this.messageService.add({
            severity: 'success',
            summary: 'success',
            detail: 'Cheque information retrieved successfully!',
          });
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

  deleteCheque(): void {
    if (!this.selectedBank?.id) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please select a bank to delete a cheque.',
      });
      return;
    }

    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this cheque?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-success ml-2',
      rejectButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.chequeService
          .deleteCheque(this.selectedBank ? this.selectedBank.id : 0)
          .subscribe({
            next: (response: any) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: response.message,
              });
              this.clear();
              this.fetchBanks();
            },
            error: (error) => {
              console.error('Error deleting cheque:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete cheque. Please try again later.',
              });
            },
            complete: () => {
              console.log('Delete cheque complete.');
            },
          });
      },
      reject: () => {
        // User rejected the deletion, you can add additional logic if needed
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelled',
          detail: 'Cheque deletion cancelled',
        });
      },
    });
  }

  cmToPixels(cm: number, dpi = 96): number {
    return parseFloat((cm * (dpi / 2.54)).toFixed(2));
  }

  pixelsToCm(pixels: number, dpi = 96): number {
    return parseFloat(((pixels / dpi) * 2.54).toFixed(2));
  }

  saveOrUpdateCheque() {
    if (this.savedCheque) {
      this.updateCheque();
    } else {
      this.saveCheque();
    }
  }
  updateCheque(): void {
    if (this.imageComponent && this.savedCheque) {
      const updateCheque: Cheque = {
        bankName: this.savedCheque.bankName,
        chequeName: this.savedCheque.chequeName,
        chequePath: this.savedCheque.chequePath,
        chequeWidth: this.chequeWidth,
        chequeHeight: this.chequeHeight,
        printStartPosition: this.printStartPosition,
        canvasWidth: Math.round(this.cmToPixels(this.chequeWidth)),
        canvasHeight: Math.round(this.cmToPixels(this.chequeHeight)),
        chequeConfigFront: this.imageComponent.exportJSON(),
        chequeConfigBack: this.imageComponent.exportBackJSON(),
        updatedUserId: 0,
        updatedBy: 'system',
        updatedDate: new Date(),
      };
      if (this.savedCheque.id) {
        this.chequeService
          .updateCheque(this.savedCheque.id, updateCheque)
          .subscribe({
            next: (cheque: Cheque) => {
              this.saveChequeResponse = cheque;
              this.messageService.add({
                severity: 'success',
                summary: 'success',
                detail: 'Cheque has been updated successfully!',
              });
              this.fetchBanks();
            },
            error: (error) => {
              console.error('Error Update Cheque:', error);
            },
            complete: () => {
              console.log('Update Cheque complete.');
            },
          });
      }
    }
  }

  saveCheque(): void {
    if (this.imageComponent) {
      const cheque: Cheque = {
        bankName: this.selectedFileName,
        chequeName: this.fileUploadResponse.fileName,
        chequePath: this.fileUploadResponse.filePath,
        chequeWidth: this.chequeWidth,
        chequeHeight: this.chequeHeight,
        canvasWidth: Math.round(this.cmToPixels(this.chequeWidth)),
        canvasHeight: Math.round(this.cmToPixels(this.chequeHeight)),
        chequeConfigFront: this.imageComponent.exportJSON(),
        chequeConfigBack: this.imageComponent.exportBackJSON(),
        createdUserId: 0,
        createdBy: 'system',
        createdDate: new Date(),
        printStartPosition: this.printStartPosition,
      };

      this.chequeService.createCheque(cheque).subscribe({
        next: (cheque: Cheque) => {
          this.saveChequeResponse = cheque;
          this.messageService.add({
            severity: 'success',
            summary: 'success',
            detail: 'A new cheque has been created successfully!',
          });
          this.fetchBanks();
        },
        error: (error) => {
          console.error('Error Save Cheque:', error);
        },
        complete: () => {
          console.log('Save Cheque complete.');
        },
      });
    }
  }

  onFileSelectEdit(event: FileSelectEvent) {
    this.uploadFilePath = '';
    this.selectedFileName = event.currentFiles[0].name.replace(
      /\.(jpg|jpeg)$/,
      ''
    );
    this.chequeWidth = this.savedCheque.chequeWidth;
    this.chequeHeight = this.savedCheque.chequeHeight;
  }

  onFileSelect(event: FileSelectEvent) {
    this.uploadFilePath = '';
    this.selectedFileName = event.currentFiles[0].name.replace(
      /\.(jpg|jpeg)$/,
      ''
    );
    this.getImageDimensions(event.currentFiles[0])
      .then((dimensions) => {
        this.chequeWidth = this.pixelsToCm(dimensions.width);
        this.chequeHeight = this.pixelsToCm(dimensions.height);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  beforeUploadEdit(event: FileBeforeUploadEvent) {
    const formEvent = event.formData;
    formEvent.append('customFileName', this.savedCheque.bankName);
  }

  beforeUpload(event: FileBeforeUploadEvent) {
    const formEvent = event.formData;
    formEvent.append('customFileName', this.selectedFileName);
  }

  async getImageDimensions(
    file: File
  ): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.onerror = () => reject(new Error('Error loading image'));

        if (event.target?.result) {
          img.src = event.target.result as string;
        }
      };

      reader.onerror = () => reject(new Error('File could not be read'));
      reader.readAsDataURL(file);
    });
  }
  resizeBGImage() {
    if (!this.isDisplayApplyBtn) {
      this.imageComponent.loadBackgroundImage(
        this.cmToPixels(this.chequeWidth),
        this.cmToPixels(this.chequeHeight),
        this.imageURL
      );
    }
  }
  resizeBGImageEdit() {
    if (this.selectedBank != null) {
      this.imageComponent.resizeBackgroundImage(
        this.cmToPixels(this.chequeWidth),
        this.cmToPixels(this.chequeHeight)
      );
    }
  }
  clear() {
    if (this.imageComponent) {
      this.chequeWidth = 0;
      this.chequeHeight = 0;
      this.selectedBankName = '';
      this.selectedFileName = '';
      this.selectedBank = null;
      this.selectedBank = null;
      this.uploadFilePath = '';
      this.uploadFileFlag = false;
      this.imageComponent.resetCanvas();
    }
  }
  onFileClear() {
    if (!this.savedCheque && !this.uploadFileFlag) {
      this.chequeWidth = 0;
      this.chequeHeight = 0;
      this.selectedBankName = '';
      this.selectedFileName = '';
    }
  }

  onTextObjectSelection(obj: any) {
    if (obj) {
      this.isTextNavigation = true;
    } else {
      this.isTextNavigation = false;
    }
  }

  navigateToPrintMaster() {
    if (this.imageComponent) {
      this.imageComponent.disposeCanvas();
    }
    this.router.navigate(['/cheque-printing']);
  }

  printSettingsCanvas() {
    if (this.imageComponent) {
      this.imageComponent.printSettingsCanvas(this.printStartPosition);
    }
  }
}
