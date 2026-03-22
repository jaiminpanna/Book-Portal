export interface Book {
  id: string;
  title: string;
  author: string;
  published: number;
  category: string;
  description: string;
  amazonUrl: string;
  featured?: boolean;
  spotlight?: string;
}

export interface ReaderProfile {
  name: string;
  email: string;
}

export interface BookRequest {
  name: string;
  email: string;
  requestedTitle: string;
  message: string;
  createdAt: string;
}
