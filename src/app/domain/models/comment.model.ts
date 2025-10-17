export interface Comment {
  id: number;
  incidentId: number;
  userId: number;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CommentWithUser extends Comment {
  userName: string;
  userEmail: string;
}
