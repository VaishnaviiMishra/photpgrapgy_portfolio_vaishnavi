export interface WorkExperience {
  id: string;
  heading: string;
  brief: string;          // max 2 lines / ~120 chars
  imageUrl: string;
  link: string;
  linkLabel?: string;
  isUserAdded?: boolean;
}
