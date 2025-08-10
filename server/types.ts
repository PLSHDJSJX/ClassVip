import 'express-session';

declare module 'express-session' {
  interface SessionData {
    isAdmin?: boolean;
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    file?: Express.Multer.File;
  }
}

export {};