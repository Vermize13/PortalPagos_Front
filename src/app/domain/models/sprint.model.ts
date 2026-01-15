export interface Sprint {
  id: string; // Guid
  projectId: string; // Guid
  project: any; // Project reference
  number: number; // Sprint number within the project
  name: string;
  goal?: string;
  startDate: string; // DateOnly in C# - use ISO string format
  endDate: string; // DateOnly in C# - use ISO string format
  isClosed: boolean;
  createdAt: Date;
}

export interface SprintWithProject extends Sprint {
  projectName?: string;
  projectCode?: string;
}

