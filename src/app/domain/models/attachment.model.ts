export interface Attachment {
  id: string; // Guid
  incidentId: string; // Guid
  uploadedBy: string; // Guid
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
  uploadedAt: Date;
}

export interface AttachmentWithUser extends Attachment {
  uploaderName: string;
}
