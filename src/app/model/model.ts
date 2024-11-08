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
}

export interface Bank {
  id: number;
  bankName: string;
}

export interface FileUploadResponse {
  fileName: string;
  filePath: string;
}

export interface Contract {
  id: number;
  contractId: string;
  periodStartDate: string;
  periodStartAmount: number;
  periodEndDate: string;
  periodEndAmount: number;
  numberOfInstallment: number;
}
