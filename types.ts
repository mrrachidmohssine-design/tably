
export interface ReceiptItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  assignedTo: string[]; // IDs of friends
}

export interface Friend {
  id: string;
  name: string;
  color: string;
}

export interface SplitRecord {
  id: string;
  date: string;
  total: number;
  restaurantName: string;
  items: ReceiptItem[];
  friends: Friend[];
  tax: number;
  tip: number;
}

export enum AppState {
  HOME = 'HOME',
  SCANNING = 'SCANNING',
  ASSIGN = 'ASSIGN',
  RESULTS = 'RESULTS'
}
