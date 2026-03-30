
export interface LostRequestDTO {
  message: string;
}

export interface LostResponseDTO {
  id: number;
  message: string;
  image: string | null;   
  claimed: boolean;
  claimNumber: string;
}


export interface ClaimRequestDTO {
  username: string;
  claimNumber: string;
}

export interface ClaimResponseDTO {
  username: string;
  claimNumber: string;
}
