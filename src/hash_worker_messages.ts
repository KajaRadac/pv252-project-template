// If you want to use types (e.g. types of messages) that are used by
// the main website and the web worker, it might be good to have those
// declared in a separate file, so that they can be imported
// from both contexts.

export interface HashWorkerMessage {
    type: 'compute-hash';
    file: File;
  }
  
  export interface HashWorkerResponse {
    type: 'hash-progress' | 'hash-complete';
    progress?: number;
    hash?: string;
  }
