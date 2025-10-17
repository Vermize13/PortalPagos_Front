export interface Backup {
  id: string; // Guid
  createdBy: string; // Guid
  creator: any; // User reference
  storagePath: string;
  strategy: string;
  sizeBytes?: number;
  status: string;
  startedAt: Date;
  finishedAt?: Date;
  notes?: string;
}

export interface Restore {
  id: string; // Guid
  backupId: string; // Guid
  backup: any; // Backup reference
  requestedBy: string; // Guid
  requester: any; // User reference
  status: string;
  targetDb?: string;
  startedAt: Date;
  finishedAt?: Date;
  notes?: string;
}
