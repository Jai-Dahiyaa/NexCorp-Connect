import { Pinecone } from "@pinecone-database/pinecone";
import logger from "../config/logger.js";

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const index = pc.index(process.env.PINECONE_INDEX);

export async function testConnection() {
  try {
    logger.info("Pinecone Connected Successfully!");
  } catch (error) {
    logger.error("Pinecone Connection Failed:", error);
  }
}

// export async function insertDummyRecord() {
//   try {
//     const dummyVector = Array.from({ length: 1024 }, () => Math.random());

//     await index.upsert({
//       upsertRequest: {
//         vectors: [
//           {
//             id: "test_01",
//             values: dummyVector,
//             metadata: { topic: "demo", type: "practice" }
//           }
//         ]
//       }
//     });
    
//     logger.info("Dummy Record Inserted Successfully!");
//   } catch (error) {
//     logger.error("Error inserting dummy record:", error);
//   }
// }

