export interface Post {
    id: string;
    createdAt: Date;       
    description: string;
    geolocation: { lat: number, lng: number }; 
    imageURL: string;
    likesCount: number;
    postedBy: string;
    username: string;
  }
  