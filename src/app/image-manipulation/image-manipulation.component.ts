import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as fabric from 'fabric';
import { Cheque, Period } from '../model/model';
import { CommonUtils } from '../utils/common';
import { AmountToWordsService } from '../service/amount-to-words/amount-to-words.service';

@Component({
  selector: 'app-image-manipulation',

  templateUrl: './image-manipulation.component.html',
  styleUrl: './image-manipulation.component.css',
})
export class ImageManipulationComponent implements OnInit {
  canvas!: fabric.Canvas;
  canvasBack!: fabric.Canvas;
  textboxBackgroundColor = '#f3fbfd';
  textboxBorderColor = '#059bb4';
  currentTextboxBackgroundColor = '#f3fbfd';
  @Output() objectSelected = new EventEmitter<fabric.FabricObject>();

  constructor(private amountToWordsService: AmountToWordsService) {}

  ngOnInit(): void {
    this.initializeCanvas();
    this.addInitialTexts();
    this.enableDragAndDrop();
  }

  resizeAndLoadCanvas(data: Cheque) {
    if (data) {
      this.canvas.setDimensions({
        width: data.canvasWidth,
        height: data.canvasHeight,
      });

      this.canvasBack.setDimensions({
        width: data.canvasWidth,
        height: data.canvasHeight,
      });
      const canvasJSON = JSON.parse(data.chequeConfigFront);
      const canvasBackJSON = JSON.parse(data.chequeConfigBack);

      this.canvas.loadFromJSON(canvasJSON).then(() => {
        this.canvas.renderAll();
        console.log('Canvas Front has been successfully loaded from JSON');
      });

      this.canvasBack.loadFromJSON(canvasBackJSON).then(() => {
        this.canvasBack.renderAll();
        console.log('Canvas Back has been successfully loaded from JSON');
      });
    }
  }

  private initializeCanvas() {
    this.canvas = new fabric.Canvas('canvas', {
      backgroundColor: '#f3f4f6',
    });
    this.canvas.renderAll.bind(this.canvas);

    this.canvasBack = new fabric.Canvas('canvasBack', {
      backgroundColor: 'transparent',
    });
    this.canvasBack.renderAll.bind(this.canvasBack);
  }

  loadBackgroundImage(
    canvasWidth: number,
    canvasHeight: number,
    imageURL: string
  ) {
    this.canvas.setDimensions({
      width: canvasWidth,
      height: canvasHeight,
    });

    this.canvasBack.setDimensions({
      width: canvasWidth,
      height: canvasHeight,
    });
    this.canvas.renderAll();
    this.canvasBack.renderAll();

    fabric.FabricImage.fromURL(imageURL, { crossOrigin: 'anonymous' }).then(
      (img) => {
        // Calculate scale ratios
        const widthRatio = this.canvas.width / img.width;
        const heightRatio = this.canvas.height / img.height;

        // Use the smaller ratio to maintain aspect ratio
        const scale = Math.min(widthRatio, heightRatio);

        // Scale the image
        img.scale(scale);

        // Center the image
        img.set({
          left: (this.canvas.width - img.width * scale) / 2,
          top: (this.canvas.height - img.height * scale) / 2,
        });

        this.canvas.backgroundImage = img;
        this.canvas.renderAll();
        this.canvasBack.renderAll();
      }
    );
  }

  resizeBackgroundImage(canvasWidth: number, canvasHeight: number) {
    this.canvas.setDimensions({
      width: canvasWidth,
      height: canvasHeight,
    });

    this.canvasBack.setDimensions({
      width: canvasWidth,
      height: canvasHeight,
    });
    this.canvas.renderAll();
    this.canvasBack.renderAll();
    const img = this.canvas.backgroundImage;
    if (img) {
      const widthRatio = this.canvas.width / img.width;
      const heightRatio = this.canvas.height / img.height;

      // Use the smaller ratio to maintain aspect ratio
      const scale = Math.min(widthRatio, heightRatio);

      // Scale the image
      img.scale(scale);

      // Center the image
      img.set({
        left: (this.canvas.width - img.width * scale) / 2,
        top: (this.canvas.height - img.height * scale) / 2,
      });
      this.canvas.backgroundImage = img;
    }
    this.canvas.renderAll();
    this.canvasBack.renderAll();
  }

  private addInitialTexts() {
    this.addText('Date', 30, 20, 80);
    this.addText('National Finance Company', 30, 50, 180);
    this.addText('Amount in line1', 30, 90, 130);
    this.addText('Amount in line2', 30, 130, 130);
    this.addText('Rials', 30, 170, 50);
    this.addText('Baiza', 30, 210, 50);
    this.addText('A/C PAYEE', 30, 250, 80);
    this.addTextBack('', 100);
  }

  private enableDragAndDrop() {
    this.canvas.on('object:moving', (e) => {
      e.target.set({
        left: e.target.left,
        top: e.target.top,
      });
    });

    this.canvas.on('selection:created', () => {
      this.objectSelected.emit(this.canvas.getActiveObject());
    });

    this.canvasBack.on('selection:created', () => {
      this.objectSelected.emit(this.canvasBack.getActiveObject());
    });
    this.canvas.on('selection:updated', () => {
      this.objectSelected.emit(this.canvas.getActiveObject());
    });

    this.canvasBack.on('selection:updated', () => {
      this.objectSelected.emit(this.canvasBack.getActiveObject());
    });

    this.canvas.on('selection:cleared', () => {
      this.objectSelected.emit(this.canvas.getActiveObject());
    });

    this.canvasBack.on('selection:cleared', () => {
      this.objectSelected.emit(this.canvasBack.getActiveObject());
    });
  }

  private addText(text: string, left: number, top: number, width: number) {
    // Create the text box
    const textObject = new fabric.Textbox(text, {
      left: left,
      top: top,
      fill: 'black',
      fontSize: 14,
      editable: false,
      hasControls: true,
      hasBorders: true,
      borderColor: this.textboxBorderColor,
      selectable: true,
      lockRotation: true,
      fontFamily: '"Inter var", sans-serif',
      width: width,
      padding: 2,
      backgroundColor: this.textboxBackgroundColor,
      splitByGrapheme: false,
      lineHeight: 1,
      textAlign: 'left',
    });

    this.canvas.add(textObject);

    // Update coordinates and render on modification/moving
    textObject.on('modified', () => {
      textObject.setCoords();
      this.canvas.renderAll();
    });
    textObject.on('moving', () => {
      textObject.setCoords();
      this.canvas.renderAll();
    });
  }

  private addTextBack(text: string, width: number) {
    // Create the text box
    const textObject = new fabric.Textbox(text, {
      left: this.canvasBack.width / 2 - 50,
      top: this.canvasBack.height / 2,
      fill: 'black',
      fontSize: 20,
      editable: false,
      hasControls: true,
      hasBorders: true,
      borderColor: this.textboxBorderColor,
      selectable: true,
      lockRotation: true,
      fontFamily: '"Inter var", sans-serif',
      width: width,
      padding: 2,
      backgroundColor: this.textboxBackgroundColor,
      splitByGrapheme: false,
      lineHeight: 1,
      textAlign: 'left',
    });

    this.canvasBack.add(textObject);

    // Update coordinates and render on modification/moving
    textObject.on('modified', () => {
      textObject.setCoords();
      this.canvasBack.renderAll();
    });
    textObject.on('moving', () => {
      textObject.setCoords();
      this.canvasBack.renderAll();
    });
  }

  toggleBackgroundColor(isBackgroundColor: boolean) {
    const objects = this.canvas.getObjects();
    const objectsBack = this.canvasBack.getObjects();
    if (isBackgroundColor) {
      objects.forEach((obj) => {
        if (obj.type === 'textbox') {
          obj.set('backgroundColor', this.textboxBackgroundColor);
        }
      });
      objectsBack.forEach((obj) => {
        if (obj.type === 'textbox') {
          obj.set('backgroundColor', this.textboxBackgroundColor);
        }
      });
    } else {
      objects.forEach((obj) => {
        if (obj.type === 'textbox') {
          obj.set('backgroundColor', 'transparent');
        }
      });
      objectsBack.forEach((obj) => {
        if (obj.type === 'textbox') {
          obj.set('backgroundColor', 'transparent');
        }
      });
    }
    this.canvas.renderAll();
    this.canvasBack.renderAll();
  }

  printCanvas(
    firstChequeDate: string,
    periods: Period[],
    agreementNo: number,
    autoMode: boolean,
    printType: string, // 'both', 'front', 'back'
    frequency: string,
    printStartPosition: number
  ) {
    let numberOfInstallment = 0;

    if (autoMode) {
      numberOfInstallment = periods[0]?.periods || 0;
    } else {
      numberOfInstallment = periods.reduce(
        (acc, period) => acc + (period ? period.periods : 0),
        0
      );
    }
    const periodDates = CommonUtils.generateDatePeriods(
      firstChequeDate,
      numberOfInstallment,
      frequency
    );

    // Save original canvas properties
    const originalBackgroundImage = this.canvas.backgroundImage;
    const originalBackgroundColor = this.canvas.backgroundColor;
    const objects = this.canvas.getObjects();
    const objectsBack = this.canvasBack.getObjects();

    // Clear background and set transparent for printing
    objects.forEach((obj, index) => {
      if (obj.type === 'textbox') {
        obj.set('backgroundColor', 'transparent');
        if (index === 0) {
          this.currentTextboxBackgroundColor = obj.backgroundColor;
        }
      }
    });

    objectsBack.forEach((objback) => {
      if (objback.type === 'textbox') {
        objback.set('backgroundColor', 'transparent');
      }
    });

    this.canvas.backgroundImage = undefined; // Clear the background image
    this.canvas.backgroundColor = 'transparent';

    this.canvasBack.backgroundImage = undefined; // Clear the background image
    this.canvasBack.backgroundColor = 'transparent';

    // Array to hold data URLs for each page
    const frontDataUrls: string[] = [];

    this.updateTextBack(agreementNo + '', 0);

    const backDataUrl = this.canvasBack.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 3,
    });

    // Process each dynamic data item and apply it to the canvas
    let dateIndex = 0;

    periods.forEach((period) => {
      const periodEndIndex = dateIndex + period.periods - 1;

      for (let i = dateIndex; i <= periodEndIndex; i++) {
        const currentDateStr = periodDates[i];

        if (i === dateIndex && period.periods > 1) {
          this.splitTextBetweenTwoObjects(
            this.amountToWordsService.convert(period.periodAmount),
            2,
            3
          );
          this.updateText(period.periodAmount + '/', 4);
          this.updateText('---', 5);
        } else if (i === periodEndIndex) {
          this.splitTextBetweenTwoObjects(
            this.amountToWordsService.convert(period.periodLastAmount),
            2,
            3
          );
          this.updateText(period.periodLastAmount + '/', 4);
          this.updateText('---', 5);
        }

        this.updateText(currentDateStr, 0);
        this.canvas.renderAll();

        const frontDataUrl = this.canvas.toDataURL({
          format: 'png',
          quality: 1,
          multiplier: 3,
        });

        if (currentDateStr.trim() !== '') {
          frontDataUrls.push(frontDataUrl);
        }
      }

      dateIndex += period.periods;
    });

    // Restore original canvas properties
    this.canvas.backgroundImage = originalBackgroundImage;
    this.canvas.backgroundColor = originalBackgroundColor || 'transparent';

    objects.forEach((obj) => {
      if (obj.type === 'textbox') {
        obj.set('backgroundColor', this.currentTextboxBackgroundColor);
      }
    });

    objectsBack.forEach((objback) => {
      if (objback.type === 'textbox') {
        objback.set('backgroundColor', this.currentTextboxBackgroundColor);
      }
    });

    this.canvas.renderAll();
    this.canvasBack.renderAll();

    // Build the print document
    const printWindow = window.open('', '_blank');

    if (printWindow) {
      const imgTags = frontDataUrls
        .map((frontDataUrl, index) => {
          const frontDataTag =
            printType === 'both' || printType === 'front'
              ? `<div class="page" style="${
                  index < frontDataUrls.length - 1
                    ? 'page-break-after: always;'
                    : ''
                }">
                   <img src="${frontDataUrl}" style="width: 100%; height: auto;" />
                 </div>`
              : '';

          const backDataTag =
            printType === 'both' || printType === 'back'
              ? `<div class="page" style="${
                  index < frontDataUrls.length - 1
                    ? 'page-break-after: always;'
                    : ''
                }">
                   <img src="${backDataUrl}" style="width: 100%; height: auto;" />
                 </div>`
              : '';

          return frontDataTag + backDataTag;
        })
        .join('');

      // HTML and CSS for the print window
      printWindow.document.write(`
        <html>
        <head>
          <title>Print</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 0;
            }
            body {
              margin: 0;
              background-color: white;
            }
            .page {
              position: relative;
              width: 100%;
              height: 100%;
              overflow: hidden; /* Prevent overflow */            
            }
          
            @media print {
              img {
                width: 100%;  /* Ensure the image fits the width of the page */
                height: auto;  /* Maintain aspect ratio */
                transform: rotate(90deg);  /* Rotate the image 90 degrees */
                top: 0;  /* Position it at the top of the page */
                left: 0;  /* Position it at the left of the page */
                margin-top: ${printStartPosition}%;               
              }
            }
          </style>
        </head>
        <body>
          ${imgTags}
        </body>
        </html>
      `);

      printWindow.document.close();
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      };
    } else {
      console.error(
        'Failed to open print window. Please check your browser settings.'
      );
    }
  }

  printSettingsCanvas(printStartPosition: number) {
    // Array to hold data URLs for each page
    const frontImageUrl = this.canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 3,
    });

    const backImageUrl = this.canvasBack.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 3,
    });
    const frontImage = `<div class="page" >
    <img src="${frontImageUrl}" style="width: 100%; height: auto;" />
  </div>`;
    const backImage = `<div class="page" >
            <img src="${backImageUrl}" style="width: 100%; height: auto;" />
          </div>`;

    const imgTags = frontImage + backImage;
    // Build the print document
    const printWindow = window.open('', '_blank');

    if (printWindow) {
      // HTML and CSS for the print window
      printWindow.document.write(`
        <html>
        <head>
          <title>Print</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 0;
            }
            body {
              margin: 0;
              background-color: white;
            }
            .page {
              position: relative;
              width: 100%;
              height: 100%;
              overflow: hidden; /* Prevent overflow */
            }
          
            @media print {
              img {
                width: 100%;  /* Ensure the image fits the width of the page */
                height: auto;  /* Maintain aspect ratio */
                transform: rotate(90deg);  /* Rotate the image 90 degrees */
                top: 0;  /* Position it at the top of the page */
                left: 0;  /* Position it at the left of the page */
                margin-top: ${printStartPosition}%;               
              }
            }
          </style>
        </head>
        <body>
          ${imgTags}
        </body>
        </html>
      `);

      printWindow.document.close();
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      };
    } else {
      console.error(
        'Failed to open print window. Please check your browser settings.'
      );
    }
  }

  printPreviewCanvas(
    firstChequeDate: string,
    periods: Period[],
    agreementNo: number,
    autoMode: boolean,
    printType: string, // 'both', 'front', 'back'
    frequency: string
  ) {
    let numberOfInstallment = 0;

    if (autoMode) {
      numberOfInstallment = periods[0]?.periods || 0;
    } else {
      numberOfInstallment = periods.reduce(
        (acc, period) => acc + (period ? period.periods : 0),
        0
      );
    }
    const periodDates = CommonUtils.generateDatePeriods(
      firstChequeDate,
      numberOfInstallment,
      frequency
    );

    // Save original canvas properties
    const originalBackgroundImage = this.canvas.backgroundImage;
    const originalBackgroundColor = this.canvas.backgroundColor;
    const objects = this.canvas.getObjects();
    const objectsBack = this.canvasBack.getObjects();

    // Clear background and set transparent for printing
    objects.forEach((obj, index) => {
      if (obj.type === 'textbox') {
        obj.set('backgroundColor', 'transparent');
        if (index == 0) {
          this.currentTextboxBackgroundColor = obj.backgroundColor;
        }
      }
    });

    objectsBack.forEach((objback) => {
      if (objback.type === 'textbox') {
        objback.set('backgroundColor', 'transparent');
      }
    });

    this.canvas.backgroundImage = undefined; // Clear the background image
    this.canvas.backgroundColor = 'transparent';

    this.canvasBack.backgroundImage = undefined; // Clear the background image
    this.canvasBack.backgroundColor = 'transparent';

    // Array to hold data URLs for each page
    const frontDataUrls: string[] = [];

    this.updateTextBack(agreementNo + '', 0);

    const backDataUrl = this.canvasBack.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 3,
    });

    let dateIndex = 0; // Start tracking index in periodDates

    periods.forEach((period) => {
      const periodEndIndex = dateIndex + period.periods - 1; // End index for the current period

      for (let i = dateIndex; i <= periodEndIndex; i++) {
        const currentDateStr = periodDates[i];

        if (i === dateIndex && period.periods > 1) {
          this.splitTextBetweenTwoObjects(
            this.amountToWordsService.convert(period.periodAmount),
            2,
            3
          );
          this.updateText(period.periodAmount + '/', 4);
          this.updateText('---', 5);
        } else if (i === periodEndIndex) {
          this.splitTextBetweenTwoObjects(
            this.amountToWordsService.convert(period.periodLastAmount),
            2,
            3
          );
          this.updateText(period.periodLastAmount + '/', 4);
          this.updateText('---', 5);
        }

        this.updateText(currentDateStr, 0);
        this.canvas.renderAll();

        const frontDataUrl = this.canvas.toDataURL({
          format: 'png',
          quality: 1,
          multiplier: 3,
        });

        if (currentDateStr.trim() !== '') {
          frontDataUrls.push(frontDataUrl);
        }
      }

      dateIndex += period.periods;
    });

    // Restore original canvas properties
    this.canvas.backgroundImage = originalBackgroundImage;
    this.canvas.backgroundColor = originalBackgroundColor || 'transparent';

    objects.forEach((obj) => {
      if (obj.type === 'textbox') {
        obj.set('backgroundColor', this.currentTextboxBackgroundColor);
      }
    });

    objectsBack.forEach((objback) => {
      if (objback.type === 'textbox') {
        objback.set('backgroundColor', this.currentTextboxBackgroundColor);
      }
    });

    this.canvas.renderAll();
    this.canvasBack.renderAll();

    // Build the print document
    const printWindow = window.open('', '_blank');

    if (printWindow) {
      const imgTags = frontDataUrls
        .map((frontDataUrl, index) => {
          const backDataTag =
            printType === 'both' || printType === 'back'
              ? `<div class="page">
                   <img src="${backDataUrl}" />
                 </div>`
              : '';

          const frontDataTag =
            printType === 'both' || printType === 'front'
              ? `<div class="page" style="${
                  index < frontDataUrls.length - 1
                    ? 'page-break-after: always;'
                    : ''
                }">
                   <img src="${frontDataUrl}" />
                 </div>`
              : '';

          return frontDataTag + backDataTag;
        })
        .join('');

      // HTML and CSS for the print window
      printWindow.document.write(`
        <html>
        <head>
          <title>Print</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 0;
            }
            body {
              margin: 0;
              background-color: white;
            }
            .page {
              position: relative;
              width: 100%;
              height: 100%;
              overflow: hidden; /* Prevent overflow */
            }
          
            @media print {
              img {
                width: 100%;  /* Ensure the image fits the width of the page */
                height: auto;  /* Maintain aspect ratio */
                transform: rotate(90deg);  /* Rotate the image 90 degrees */
                top: 0;  /* Position it at the top of the page */
                left: 0;  /* Position it at the left of the page */
                margin-top: 29.0%;               
              }
            }
          </style>
        </head>
        <body>
          ${imgTags}
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.onload = () => {};
    } else {
      console.error(
        'Failed to open print window. Please check your browser settings.'
      );
    }
  }

  moveText(direction: string) {
    let activeObject = this.canvas.getActiveObject();
    let isCanvasBack = false;
    if (!activeObject) {
      activeObject = this.canvasBack.getActiveObject();
      isCanvasBack = true;
    }
    if (activeObject) {
      const movementStep = 1; // Move by 10 pixels
      switch (direction) {
        case 'left':
          activeObject.set({ left: activeObject.left - movementStep });
          break;
        case 'right':
          activeObject.set({ left: activeObject.left + movementStep });
          break;
        case 'up':
          activeObject.set({ top: activeObject.top - movementStep });
          break;
        case 'down':
          activeObject.set({ top: activeObject.top + movementStep });
          break;
      }
      activeObject.setCoords();
      if (isCanvasBack) {
        this.canvasBack.renderAll();
      } else {
        this.canvas.renderAll();
      }
    }
  }

  disposeCanvas() {
    this.canvas.dispose();
    this.canvasBack.dispose();

    const canvasElement = document.getElementById('canvas');
    if (canvasElement) {
      canvasElement.remove(); // Remove the canvas element from the DOM
    }

    const canvasBackElement = document.getElementById('canvasBack');
    if (canvasBackElement) {
      canvasBackElement.remove(); // Remove the canvas element from the DOM
    }
  }

  resetCanvas() {
    if (this.canvas) {
      this.canvas.clear();
      this.canvasBack.clear();
      //this.canvas.dispose();
      //this.canvasBack.dispose();
      //this.initializeCanvas();
      this.canvas.backgroundColor = '#f3f4f6';
      this.canvas.setDimensions({
        width: 722,
        height: 341,
      });

      this.canvasBack.setDimensions({
        width: 722,
        height: 341,
      });
      this.addInitialTexts();
      this.enableDragAndDrop();
      this.canvas.renderAll();
      this.canvasBack.renderAll();
    }
  }

  setBackgroundImage() {
    const imgUrl = prompt('Enter the URL of the background image:');
    if (imgUrl) {
      fabric.FabricImage.fromURL(imgUrl, { crossOrigin: 'anonymous' }).then(
        (img) => {
          // Calculate scale ratios
          const widthRatio = this.canvas.width / img.width;
          const heightRatio = this.canvas.height / img.height;

          // Use the smaller ratio to maintain aspect ratio
          const scale = Math.min(widthRatio, heightRatio);

          // Scale the image
          img.scale(scale);

          // Center the image
          img.set({
            left: (this.canvas.width - img.width * scale) / 2,
            top: (this.canvas.height - img.height * scale) / 2,
          });
          this.canvas.backgroundImage = img; // Use the new property directly
          this.canvas.renderAll(); // Render the canvas
        }
      );
    }
  }

  exportJSON() {
    const json = this.canvas.toJSON();
    const jsonString = JSON.stringify(json, null, 2);

    return jsonString;
  }

  exportBackJSON() {
    const json = this.canvasBack.toJSON();
    const jsonString = JSON.stringify(json, null, 2);

    return jsonString;
  }

  findTextObject(index: number) {
    return this.canvas.getObjects('Textbox')[index];
  }

  updateText(newText: string, textIndex: number) {
    const textObject = this.canvas.getObjects('Textbox')[textIndex];
    textObject.set({ text: newText });
    this.canvas.renderAll();
  }

  splitTextBetweenTwoObjects(
    inputText: string,
    firstTextIndex: number,
    secondTextIndex: number
  ) {
    // Get the first text object and its maximum width
    const textObj1 = this.findTextObject(firstTextIndex);
    let maxWidth = textObj1?.width || 100; // Use default width if not found

    maxWidth = maxWidth != 130 ? maxWidth - 130 : maxWidth;
    const context = this.canvas.getContext();

    const words = inputText.split(' '); // Split the input text into words
    let line = '';
    let splitIndex = words.length; // Default to the full length if not split

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const measuredWidth = context.measureText(testLine).width;

      if (measuredWidth > maxWidth) {
        splitIndex = i; // Update the split index
        break; // Exit loop once we exceed max width
      }
      line = testLine; // Update line if within width
    }

    // Update the text for the first object
    this.updateText(line.trim(), firstTextIndex);

    // Only update the second object if there's remaining text and splitIndex is not 0
    if (splitIndex > 0 && splitIndex < words.length) {
      const remainingText = words.slice(splitIndex).join(' ').trim();
      this.updateText(remainingText, secondTextIndex);
    } else {
      this.updateText('', secondTextIndex);
    }
  }

  increaseTextboxWidth(): void {
    let activeObject = this.canvas.getActiveObject();
    let chequeBack = false;
    if (!activeObject) {
      activeObject = this.canvasBack.getActiveObject();
      chequeBack = true;
    }

    if (activeObject && activeObject.type === 'textbox') {
      // Increase the width by 5 pixels
      activeObject.width += 5;
      activeObject.set({ textAlign: 'left' }); // Optional: Adjust text alignment
      activeObject.dirty = true; // Mark object as dirty to trigger re-render
      if (chequeBack) {
        this.canvasBack.renderAll();
      } else {
        this.canvas.renderAll();
      }
    } else {
      console.log('No textbox selected');
    }
  }

  decreaseTextboxWidth(): void {
    let activeObject = this.canvas.getActiveObject();
    let chequeBack = false;
    if (!activeObject) {
      activeObject = this.canvasBack.getActiveObject();
      chequeBack = true;
    }

    if (activeObject && activeObject.type === 'textbox') {
      // Decrease the width by 5 pixels, but not below a minimum width
      if (activeObject.width > 5) {
        activeObject.width -= 5;
        activeObject.set({ textAlign: 'left' }); // Optional: Adjust text alignment
        activeObject.dirty = true; // Mark object as dirty to trigger re-render
        if (chequeBack) {
          this.canvasBack.renderAll();
        } else {
          this.canvas.renderAll();
        }
      }
    } else {
      console.log('No textbox selected');
    }
  }

  increaseFontSize(): void {
    let activeObject = this.canvas.getActiveObject();
    let chequeBack = false;
    if (!activeObject) {
      activeObject = this.canvasBack.getActiveObject();
      chequeBack = true;
    }

    if (activeObject && activeObject.type === 'textbox') {
      const textObject = activeObject as fabric.Textbox;
      textObject.set('fontSize', textObject.fontSize + 1);
      textObject.dirty = true;
      if (chequeBack) {
        this.canvasBack.renderAll();
      } else {
        this.canvas.renderAll();
      }
    } else {
      console.log('No textbox selected');
    }
  }

  decreaseFontSize(): void {
    let activeObject = this.canvas.getActiveObject();
    let chequeBack = false;
    if (!activeObject) {
      activeObject = this.canvasBack.getActiveObject();
      chequeBack = true;
    }
    if (activeObject && activeObject.type === 'textbox') {
      const textObject = activeObject as fabric.Textbox; // Cast to fabric.Text
      const newSize = textObject.fontSize - 1;
      textObject.set('fontSize', newSize > 0 ? newSize : 1); // Prevent font size from going below 1
      textObject.dirty = true;
      if (chequeBack) {
        this.canvasBack.renderAll();
      } else {
        this.canvas.renderAll();
      }
    }
  }

  // Function to toggle bold
  toggleBold() {
    let activeObject = this.canvas.getActiveObject();
    let chequeBack = false;
    if (!activeObject) {
      activeObject = this.canvasBack.getActiveObject();
      chequeBack = true;
    }
    if (activeObject && activeObject.type === 'textbox') {
      const textboxObject = activeObject as fabric.Textbox;
      textboxObject.set(
        'fontWeight',
        textboxObject.fontWeight === 'bold' ? 'normal' : 'bold'
      );
      if (chequeBack) {
        this.canvasBack.renderAll();
      } else {
        this.canvas.renderAll();
      }
    }
  }

  // Function to toggle italic
  toggleItalic() {
    let activeObject = this.canvas.getActiveObject();
    let chequeBack = false;
    if (!activeObject) {
      activeObject = this.canvasBack.getActiveObject();
      chequeBack = true;
    }

    if (activeObject && activeObject.type === 'textbox') {
      const textboxObject = activeObject as fabric.Textbox;
      textboxObject.set(
        'fontStyle',
        textboxObject.fontStyle === 'italic' ? 'normal' : 'italic'
      );
      if (chequeBack) {
        this.canvasBack.renderAll();
      } else {
        this.canvas.renderAll();
      }
    }
  }

  // Function to toggle underline
  toggleUnderline() {
    let activeObject = this.canvas.getActiveObject();
    let chequeBack = false;
    if (!activeObject) {
      activeObject = this.canvasBack.getActiveObject();
      chequeBack = true;
    }
    if (activeObject && activeObject.type === 'textbox') {
      const textboxObject = activeObject as fabric.Textbox;
      textboxObject.set('underline', !textboxObject.underline); // Toggle the underline Boolean
      if (chequeBack) {
        this.canvasBack.renderAll();
      } else {
        this.canvas.renderAll();
      }
    }
  }

  // Function to hide / show the relavent textbox
  hideShowTextbox(index: number, hideShow: boolean) {
    const activeObject = this.canvas.getObjects()[index];
    if (activeObject && activeObject.type === 'textbox') {
      activeObject.set('visible', hideShow);
      this.canvas.renderAll();
    }
  }

  updateTextBack(newText: string, textIndex: number) {
    const textObject = this.canvasBack.getObjects('Textbox')[textIndex];
    textObject.set({ text: newText });
    this.canvasBack.renderAll();
  }
}
