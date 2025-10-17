export enum AttachmentType {
  Image = 'Image',
  Document = 'Document',
  Log = 'Log',
  Other = 'Other'
}

export interface Attachment {
  id: number;
  incidentId: number;
  fileName: string;
  filePath: string;
  fileSize: number;
  fileType: AttachmentType;
  mimeType: string;
  uploadedById: number;
  uploadedAt: Date;
}

export interface AttachmentWithUser extends Attachment {
  uploadedByName: string;
}
