export interface Episode {
  title: string;
  description: string;
  duration: string;
  audioUrl: string;
  date: string; // Should be ISO date string e.g., "2025-05-03"
  isNew: boolean;
  cover?: string;
  relatedFileUrl?: string;
  viewCount: number; // Added for sorting by popularity
}

export interface Podcast {
  id: number;
  title: string;
  description: string;
  cover: string;
  speakerId: number; // Changed from speaker: string
  duration: string;
  episodes: Episode[];
  year: number;
  categories: string[];
  isSquare?: boolean;
}

export interface Author {
  id: number;
  name: string;
  avatar: string;
  bio: string;
  role: 'master' | 'secretary'; // Added to differentiate roles
  coverImage?: string;
}

export interface Book {
  id: number;
  title: string;
  authorId: number; 
  cover: string;
  relatedEpisodes: Array<{ podcastId: number; episodeIndex: number; }>;
  categories: string[];
  addedDate?: string;
  description?: string;
}

export interface Video {
  id: string;
  embedId: string;
  title:string;
  description: string;
  thumbnailUrl: string;
  viewCount: number;
  uploadDate: string;
  duration: number; // in seconds
  categories: string[];
  likes?: number;
}

export interface Comment {
    id: number;
    type: 'podcast' | 'video';
    author: string;
    text: string;
    date: string; // User-friendly date like "۲ روز پیش"
    isoDate: string; // ISO date string for sorting
    likes: number;
    isFeatured: boolean;
    // Podcast-specific
    podcastId?: number;
    episodeIndex?: number;
    podcastTitle?: string;
    episodeTitle?: string;
    timestamp?: number;
    // Video-specific
    videoId?: string;
    videoTitle?: string;
}

export interface PostComment {
    id: number;
    author: string;
    authorAvatarUrl: string;
    text: string;
    date: string;
    isoDate: string;
    replyTo?: number;
}

export type Reaction = { [key: string]: number };

export interface Post {
    id: number;
    author: string;
    authorAvatarUrl: string;
    date: string;
    isoDate: string;
    text?: string;
    videoId?: string;
    podcastId?: number;
    episodeIndex?: number;
    // Fix: Add optional timestamp property for posts created from timed comments on audio.
    timestamp?: number;
    comments: PostComment[];
    likes: number;
    sourceText?: string;
    reactions?: Reaction;
    isPinned?: boolean;
}

export type Page = 'mahfel' | 'sowt' | 'matn' | 'videos';