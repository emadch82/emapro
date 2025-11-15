
import type { Podcast, Comment, Video, Post, Book, Author } from '../types';
import db from '../data/database';

// This file now simulates fetching data from a local source.
// This removes the dependency on the external backend and resolves network errors.

// Simulate a short network delay to mimic real-world fetching.
const apiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getPodcasts = async (): Promise<Podcast[]> => {
    await apiDelay(150);
    // Returning a deep copy to prevent direct mutation of the source data
    return JSON.parse(JSON.stringify(db.podcasts));
};

export const getBooks = async (): Promise<Book[]> => {
    await apiDelay(50);
    return JSON.parse(JSON.stringify(db.books));
};

export const getAuthors = async (): Promise<Author[]> => {
    await apiDelay(50);
    return JSON.parse(JSON.stringify(db.authors));
};

export const getVideos = async (): Promise<Video[]> => {
    await apiDelay(100);
    return JSON.parse(JSON.stringify(db.videos));
};

export const getComments = async (): Promise<Comment[]> => {
    await apiDelay(50);
    return JSON.parse(JSON.stringify(db.comments));
};

export const getPosts = async (): Promise<Post[]> => {
    await apiDelay(50);
    return JSON.parse(JSON.stringify(db.posts));
};

// --- Mock Save Functions ---
// These functions simulate saving data but currently do not persist it
// as they only modify the in-memory 'db' object which resets on refresh.
// In a real local-first app, this would interact with localStorage or IndexedDB.

export const savePodcastsAndVideos = async (podcasts: Podcast[], videos: Video[]): Promise<void> => {
    console.log("API (Mock): Saving podcasts and videos.", { podcasts, videos });
    db.podcasts = podcasts;
    db.videos = videos;
    return Promise.resolve();
};

export const saveComments = async (comments: Comment[]): Promise<void> => {
    console.log("API (Mock): Saving comments.", { comments });
    db.comments = comments;
    return Promise.resolve();
};

export const savePosts = async (posts: Post[]): Promise<void> => {
    console.log("API (Mock): Saving posts.", { posts });
    db.posts = posts;
    return Promise.resolve();
};
