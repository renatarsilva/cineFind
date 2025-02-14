import { Client, Databases, ID, Query } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(PROJECT_ID);

const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
  // 1. Use Apprite SDK to check if the search term exists in the database

  try {
    console.log({ PROJECT_ID, DATABASE_ID, COLLECTION_ID });
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", searchTerm),
    ]);

    // 2. If it does, update the count
    if (result.documents.length > 0) {
      const doc = result.documents[0];

      await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: doc.count + 1,
      });
      // 3. If it doesn't, create a new document with the search term and count as 1
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm,
        count: 1,
        movie_id: movie.id,
        poster_url: `https://image.tmdb.org/t/p/w500${getRandomInt(1000)}`,
      });
    }
  } catch (error) {
    console.error(error);
  }
  console.log(PROJECT_ID, DATABASE_ID, COLLECTION_ID);
};
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
