export interface Attachment {
  id: string; // Guid
  incidentId: string; // Guid
  incident: any; // Incident reference
  uploadedBy: string; // Guid
  uploader: any; // User reference
  fileName: string;
  storagePath: string;
  mimeType: string;
  fileSizeBytes: number;
  sha256Checksum?: string;
  uploadedAt: Date;
}

export interface AttachmentWithUser extends Attachment {
  uploadedByName: string;
}
