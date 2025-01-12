export interface Period {
  periodAmount: number;
  periodLastAmount: number;
  periods: number;
}

export interface Cheque {
  id?: number;
  chequeName: string;
  bankName: string;
  chequePath: string;
  chequeWidth: number;
  chequeHeight: number;
  canvasWidth: number;
  canvasHeight: number;
  chequeConfigFront: string;
  chequeConfigBack: string;
  createdUserId?: number;
  createdBy?: string;
  createdDate?: Date;
  updatedUserId?: number;
  updatedBy?: string;
  updatedDate?: Date;
  printStartPosition: number;
  textTopPosition: number;
}

export interface Bank {
  id: number;
  bankName: string;
}

export interface Frequency {
  value: string;
  label: string;
}

export interface FileUploadResponse {
  fileName: string;
  filePath: string;
}

export interface Agreement {
  agreementNo: number;
  contractId: string;
  firstInstallmentDate: string;
  firstInstallmentAmount: number;
  lastInstallmentDate: string;
  lastInstallmentAmount: number;
  numberOfInstallment: number;
  frequency: string;
}
