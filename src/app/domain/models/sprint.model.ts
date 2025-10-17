export interface Sprint {
  id: string; // Guid
  projectId: string; // Guid
  project: any; // Project reference
  name: string;
  goal?: string;
  startDate: string; // DateOnly in C# - use ISO string format
  endDate: string; // DateOnly in C# - use ISO string format
  isClosed: boolean;
  createdAt: Date;
}
