import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageModule } from 'primeng/image';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { TabViewModule } from 'primeng/tabview';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { SliderModule } from 'primeng/slider';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { FileUploadModule } from 'primeng/fileupload';
import { ImageManipulationComponent } from './image-manipulation/image-manipulation.component'; // Adjust path accordingly
import { provideHttpClient } from '@angular/common/http';
import { ChequeService } from './service/cheque/cheque-service.service';
import { ToastModule } from 'primeng/toast'; // Import ToastModule;
import { MessageService } from 'primeng/api'; // Import MessageService;
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AgreemrntService } from './service/contract/contract-service.service';

@NgModule({
  declarations: [ImageManipulationComponent],
  imports: [
    CommonModule,
    ImageModule,
    DropdownModule,
    FormsModule,

    CalendarModule,
    TabViewModule,
    CheckboxModule,
    InputNumberModule,
    CardModule,
    SliderModule,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
    FileUploadModule,
    ToastModule,
    ConfirmDialogModule,
    SelectButtonModule,
  ],
  exports: [
    ImageModule,
    DropdownModule,
    FormsModule,
    CalendarModule,
    TabViewModule,
    CheckboxModule,
    InputNumberModule,
    CardModule,
    SliderModule,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
    FileUploadModule,
    ImageManipulationComponent,
    CommonModule,
    ToastModule,
    ConfirmDialogModule,
    SelectButtonModule,
  ],
  providers: [
    provideHttpClient(),
    ChequeService,
    MessageService,
    ConfirmationService,
    AgreemrntService,
  ],
})
export class SharedModule {}
