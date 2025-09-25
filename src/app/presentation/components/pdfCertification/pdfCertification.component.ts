import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { PdfViewerModule } from 'ng2-pdf-viewer'; // <- import PdfViewerModule
import SignaturePad from 'signature_pad';

@Component({
  selector: 'app-pdf-certification',
  standalone: true,
  imports: [
    CommonModule,
    PdfViewerModule,
  ],
  template: `

  <button (click)="mostrarPDF()">{{showPDF ? 'Ocultar PDF' : 'Mostrar PDF'}}</button>
  <button (click)="imprimirPDF()">Imprimir PDF</button>
  <input type="file" (change)="cargarPDF($event)" accept=".pdf">

  <div class="pdf-container" style="width: 80vw; height: 80vh; background-color: #f0f0f0;" *ngIf="showPDF">
  <pdf-viewer [src]="pdfSrc"
              [render-text]="true"
              [original-size]="false"
              style="width: 100%; height: 100%"
  ></pdf-viewer>
  </div>

  <div class="documento" *ngIf="!showPDF">
  <img src="ruta-al-logo.png" alt="Logo Findeter" class="logo">
  <p class="fecha">DD/MM/AAAA</p>
  <h1>CERTIFICA CUMPLIMIENTO DE TODOS LOS REQUISITOS PARA SOLICITUD DE PAGO</h1>
  <p>Nombre del Contratista/Consultor/Interventor: <span contenteditable="true"></span></p>
  <div class="firma">
    <div class="signature-container" style="border: 1px solid #ccc; width: 18%;">
      <canvas #signatureCanvas></canvas>
    </div>
  <button (click)="limpiarFirma()">Limpiar firma</button>
  <button (click)="guardarFirma()">Guardar firma</button>
  <button (click)="agregarFirma()">Agregar firma</button>
  </div>
</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PdfCertificationComponent implements AfterViewInit {
  pdfSrc = "https://www.renfe.com/content/dam/renfe/es/General/PDF-y-otros/Ejemplo-de-descarga-pdf.pdf";
  @ViewChild('signatureCanvas') signatureCanvas!: ElementRef<HTMLCanvasElement>;
  private signaturePad!: SignaturePad;

  showPDF = false;


  ngAfterViewInit() {
    this.signaturePad = new SignaturePad(this.signatureCanvas.nativeElement);
  }

  limpiarFirma() {
    this.signaturePad.clear();
  }

  guardarFirma() {
    if (this.signaturePad.isEmpty()) {
      alert('Por favor, proporciona una firma');
    } else {
      const firmaDataURL = this.signaturePad.toDataURL();
      // Aquí puedes guardar o usar firmaDataURL como necesites
      console.log(firmaDataURL);
    }
  }

  imprimirPDF() {
    const contenedorPDF = document.querySelector('.pdf-container');
    if (contenedorPDF) {
      const ventanaImpresion = window.open('', '_blank');
      ventanaImpresion?.document.write('<html><head><title>Imprimir PDF</title></head><body>');
      ventanaImpresion?.document.write(contenedorPDF.innerHTML);
      ventanaImpresion?.document.write('</body></html>');
      ventanaImpresion?.document.close();
      ventanaImpresion?.print();
    } else {
      console.error('No se encontró el contenedor del PDF');
    }
  }

  cargarPDF(event: any) {
    const archivo = event.target.files[0];
    this.pdfSrc = URL.createObjectURL(archivo);
  }

  mostrarPDF() {
    this.showPDF = !this.showPDF;
  }

  agregarFirma() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (evento: any) => {
      const archivo = evento.target.files[0];
      if (archivo) {
        const lector = new FileReader();
        lector.onload = (e: any) => {
          const imagen = new Image();
          imagen.onload = () => {
            const canvas = this.signatureCanvas.nativeElement;
            const contexto = canvas.getContext('2d');
            if (contexto) {
              contexto.drawImage(imagen, 0, 0, canvas.width, canvas.height);
            }
          };
          imagen.src = e.target.result;
        };
        lector.readAsDataURL(archivo);
      }
    };
    input.click();
  }
}
