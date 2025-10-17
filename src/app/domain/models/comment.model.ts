// This file is kept for backward compatibility but IncidentComment is now defined in incident.model.ts
export interface Comment {
  id: string; // Guid
  incidentId: string; // Guid
  userId: string; // Guid
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CommentWithUser extends Comment {
  userName: string;
  userEmail: string;
}
