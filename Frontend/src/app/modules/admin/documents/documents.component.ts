import { Component } from '@angular/core';
import { FileUploadService } from '../../../services/file-service/fileUploadService';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent {
  selectedFile: File | null = null;
  uploadStatus: string = '';
  files: string[] = [];  // List of available files to download
  selectedFileList: string = '';
  isDragOver: boolean = false; // To track if file is being dragged over the drop area

  constructor(private fileUploadService: FileUploadService) {}

  // Handling file selection (via input or drag and drop)
  onFileSelect(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  // Handling drag over event to enable drop
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  // Handling drag leave event to reset state
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  // Handling file drop event
  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    
    if (event.dataTransfer) {
      const files = event.dataTransfer.files;
      if (files.length > 0) {
        this.selectedFile = files[0];
      }
    }
  }

  ngOnInit(): void {
    // Fetch files on component initialization
    this.fileUploadService.getFiles().subscribe(
      (data: string[]) => {
        this.files = data;  // Update the files list with available files
      },
      (error) => {
        console.error('Error fetching files', error);
      }
    );
  }

  // Upload the selected file
  onUpload(): void {
    if (this.selectedFile) {
      this.fileUploadService.uploadFile(this.selectedFile).subscribe(
        (response) => {
          this.uploadStatus = 'File uploaded successfully!';
          const fullPath = response.filePath; // Path returned from the server
          this.files.push(fullPath.split('/').pop()?.split('\\').pop() || '');
          console.log(response);
        },
        (error) => {
          this.uploadStatus = 'Error uploading file!';
          console.error(error);
        }
      );
    } else {
      this.uploadStatus = 'Please select a file first.';
    }
  }

  // Download selected file
  downloadFile(fileName: string): void {
    this.fileUploadService.downloadFile(fileName).subscribe(
      (blob: Blob) => {
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = fileName;
        a.click();
      },
      (error) => {
        console.error('Error downloading file', error);
      }
    );
  }
}
