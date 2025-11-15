require('dotenv').config();
const { Pool } = require('pg');
const { authors, podcasts, books, videos, comments, posts } = require('./initialData.js');

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("FATAL ERROR: DATABASE_URL is not defined.");
  console.error("This variable should be automatically provided by Liara after connecting your app to a database.");
  console.error("Please go to your Liara dashboard, select your app, and connect it to your PostgreSQL database before running the seed command.");
  process.exit(1);
}

const pool = new Pool({
  connectionString: databaseUrl,
});

async function createTables(client) {
  console.log('Creating tables...');
  
  await client.query(`
    DROP TABLE IF EXISTS posts, comments, videos, books, podcasts, authors CASCADE;

    CREATE TABLE authors (
      id INTEGER PRIMARY KEY,
      name TEXT,
      avatar TEXT,
      bio TEXT,
      role TEXT,
      "coverImage" TEXT
    );

    CREATE TABLE podcasts (
      id INTEGER PRIMARY KEY,
      title TEXT,
      description TEXT,
      cover TEXT,
      "speakerId" INTEGER REFERENCES authors(id),
      duration TEXT,
      episodes JSONB,
      year INTEGER,
      categories JSONB,
      "isSquare" BOOLEAN
    );

    CREATE TABLE books (
      id INTEGER PRIMARY KEY,
      title TEXT,
      "authorId" INTEGER REFERENCES authors(id),
      cover TEXT,
      "relatedEpisodes" JSONB,
      categories JSONB,
      "addedDate" TEXT,
      description TEXT
    );

    CREATE TABLE videos (
      id TEXT PRIMARY KEY,
      "embedId" TEXT,
      title TEXT,
      description TEXT,
      "thumbnailUrl" TEXT,
      "viewCount" INTEGER,
      "uploadDate" TEXT,
      duration INTEGER,
      categories JSONB,
      likes INTEGER
    );

    CREATE TABLE comments (
      id INTEGER PRIMARY KEY,
      type TEXT,
      author TEXT,
      text TEXT,
      date TEXT,
      "isoDate" TEXT,
      likes INTEGER,
      "isFeatured" BOOLEAN,
      "podcastId" INTEGER,
      "episodeIndex" INTEGER,
      "podcastTitle" TEXT,
      "episodeTitle" TEXT,
      timestamp INTEGER,
      "videoId" TEXT,
      "videoTitle" TEXT
    );

    CREATE TABLE posts (
      id INTEGER PRIMARY KEY,
      author TEXT,
      "authorAvatarUrl" TEXT,
      date TEXT,
      "isoDate" TEXT,
      text TEXT,
      "videoId" TEXT,
      "podcastId" INTEGER,
      "episodeIndex" INTEGER,
      timestamp INTEGER,
      comments JSONB,
      likes INTEGER,
      "sourceText" TEXT,
      reactions JSONB,
      "isPinned" BOOLEAN
    );
  `);
  
  console.log('Tables created successfully.');
}

async function insertData(client) {
    console.log('Inserting data...');

    // Authors
    for (const author of authors) {
        await client.query(
            'INSERT INTO authors (id, name, avatar, bio, role, "coverImage") VALUES ($1, $2, $3, $4, $5, $6)',
            [author.id, author.name, author.avatar, author.bio, author.role, author.coverImage]
        );
    }
    console.log('- Authors inserted.');

    // Podcasts
    for (const podcast of podcasts) {
        await client.query(
            'INSERT INTO podcasts (id, title, description, cover, "speakerId", duration, episodes, year, categories, "isSquare") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
            [podcast.id, podcast.title, podcast.description, podcast.cover, podcast.speakerId, podcast.duration, JSON.stringify(podcast.episodes), podcast.year, JSON.stringify(podcast.categories), podcast.isSquare || false]
        );
    }
    console.log('- Podcasts inserted.');
    
    // Books
    for (const book of books) {
        await client.query(
            'INSERT INTO books (id, title, "authorId", cover, "relatedEpisodes", categories, "addedDate", description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [book.id, book.title, book.authorId, book.cover, JSON.stringify(book.relatedEpisodes), JSON.stringify(book.categories), book.addedDate, book.description]
        );
    }
    console.log('- Books inserted.');

    // Videos
    for (const video of videos) {
        await client.query(
            'INSERT INTO videos (id, "embedId", title, description, "thumbnailUrl", "viewCount", "uploadDate", duration, categories, likes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
            [video.id, video.embedId, video.title, video.description, video.thumbnailUrl, video.viewCount, video.uploadDate, video.duration, JSON.stringify(video.categories), video.likes || 0]
        );
    }
    console.log('- Videos inserted.');

    // Comments
    for (const comment of comments) {
        await client.query(
            'INSERT INTO comments (id, type, author, text, date, "isoDate", likes, "isFeatured", "podcastId", "episodeIndex", "podcastTitle", "episodeTitle", timestamp, "videoId", "videoTitle") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)',
            [comment.id, comment.type, comment.author, comment.text, comment.date, comment.isoDate, comment.likes, comment.isFeatured, comment.podcastId, comment.episodeIndex, comment.podcastTitle, comment.episodeTitle, comment.timestamp, comment.videoId, comment.videoTitle]
        );
    }
    console.log('- Comments inserted.');

    // Posts
    for (const post of posts) {
        await client.query(
            'INSERT INTO posts (id, author, "authorAvatarUrl", date, "isoDate", text, "videoId", "podcastId", "episodeIndex", timestamp, comments, likes, "sourceText", reactions, "isPinned") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)',
            [post.id, post.author, post.authorAvatarUrl, post.date, post.isoDate, post.text, post.videoId, post.podcastId, post.episodeIndex, post.timestamp, JSON.stringify(post.comments), post.likes, post.sourceText, JSON.stringify(post.reactions), post.isPinned || false]
        );
    }
    console.log('- Posts inserted.');

    console.log('Data insertion completed successfully.');
}


async function seedDatabase() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await createTables(client);
    await insertData(client);
    await client.query('COMMIT');
    console.log("\nDatabase seeding completed successfully!");
  } catch (err) {
    await client.query('ROLLBACK');
    console.error("\nAn error occurred during database seeding:", err);
  } finally {
    client.release();
    await pool.end();
    console.log("PostgreSQL connection closed.");
  }
}

seedDatabase();