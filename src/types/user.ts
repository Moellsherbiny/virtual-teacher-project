export type User = {
  id: string;
  name: string | null;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  createdAt: Date;
  enrollmentCount: number; 
};