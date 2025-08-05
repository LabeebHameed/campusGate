export interface FavoriteItem {
  id: string;
  title: string;
  duration: string;
  cost: string;
  rating: string;
}

export const favoriteItems: FavoriteItem[] = [
  {
    id: '1',
    title: 'Rio de Janeiro College',
    duration: '4 Years',
    cost: '₹20,000 / Sem',
    rating: '4.3'
  },
  {
    id: '2',
    title: 'University of Toronto',
    duration: '3 Years',
    cost: '₹40,000 / Sem',
    rating: '4.8'
  },
  {
    id: '3',
    title: 'Harvard University',
    duration: '2 Years',
    cost: '₹80,000 / Sem',
    rating: '4.9'
  },
  {
    id: '4',
    title: 'Stanford University',
    duration: '4 Years',
    cost: '₹55,000 / Sem',
    rating: '4.9'
  },
  {
    id: '5',
    title: 'MIT Cambridge',
    duration: '4 Years',
    cost: '₹45,000 / Sem',
    rating: '5.0'
  }
]; 