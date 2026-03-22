// What the frontend sends (multipart form — image handled separately)
export interface LostRequestDTO {
  message: string;
}

// What the backend returns
export interface LostResponseDTO {
  id: number;
  message: string;
  image: string | null;   // base64 string from backend byte[]
  claimed: boolean;
  claimNumber: string;
}

// Claim request
export interface ClaimRequestDTO {
  username: string;
  claimNumber: string;
}

// What the backend returns after a successful claim
export interface ClaimResponseDTO {
  username: string;
  claimNumber: string;
}
