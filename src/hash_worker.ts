import { AsyncSha256 } from "./sha-256.js";
import { HashWorkerMessage, HashWorkerResponse } from "./hash_worker_messages.js";
import { read } from "fs";
import { arrayBuffer } from "stream/consumers";

// In this file, you can define the worker script that will compute the
// hash digest for a given file. Of course, it is up to you what kind
// of messages should the worker receive/send.

// const hasher = new AsyncSha256();
// hasher.async_digest(
//   "Some data (represented as string)",
//   (hash) => console.log(hash),
//   (remaining) => console.log(remaining),
// );
function arrayBufferToString(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return binary;
}

// incoming messages from main thread
self.onmessage = async (event: MessageEvent<HashWorkerMessage>) => {
  const { type, file } = event.data;

  if (type === 'compute-hash') {
    const hasher = new AsyncSha256();

    const reader = new FileReader();
    reader.onload = async () => {
      const buffer =  reader.result as ArrayBuffer;
      const fileData = arrayBufferToString(buffer);

      // handling progress updates -> sending them back to main thread
      const onProgress = (remaining: number) => {
        const progress = 1 - remaining / file.size;
        const response: HashWorkerResponse = {
          type: 'hash-progress',
          progress,
        };
        postMessage(response);
      };

      // handling completed hash -> sedning the result back to main tread
      const onComplete = (hash: string) => {
        const response: HashWorkerResponse = {
          type: 'hash-complete',
          hash,
        };
        postMessage(response);
      };

      await hasher.async_digest(fileData, onComplete, onProgress); // computing hash
  
    };

    reader.readAsArrayBuffer(file);
    
  }
};