export interface AlertRequestDTO {
  location: string;
  description: string;
}

export interface AlertResponseDTO {
  id: number;
  location: string;
  description: string;
  createdAt: string| null;
  image: string | null; 
}
