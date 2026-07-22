// Simple scratch verification script to simulate chunking
const mockBccList = Array.from({ length: 450 }, (_, i) => `user${i}@vitbhopal.ac.in`);

const chunkSize = 80;
const totalRecipients = mockBccList.length;
const totalChunks = Math.ceil(totalRecipients / chunkSize);

console.log(`[Test] Total Recipients: ${totalRecipients}`);
console.log(`[Test] Target Chunk Size: ${chunkSize}`);
console.log(`[Test] Expected Number of Email Loops: ${totalChunks}`);

for (let i = 0; i < totalRecipients; i += chunkSize) {
  const chunk = mockBccList.slice(i, i + chunkSize);
  const chunkIndex = Math.floor(i / chunkSize) + 1;
  console.log(`[Test] Batch ${chunkIndex}/${totalChunks}: sending to ${chunk.length} recipients (emails: ${chunk[0]} to ${chunk[chunk.length - 1]})`);
}
