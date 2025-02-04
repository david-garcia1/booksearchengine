import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url'; // Import for __dirname equivalent in ES modules
import db from './config/connection.js';
import { ApolloServer } from '@apollo/server';
import type { Request, Response } from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateToken } from './utils/auth.js';

// Define __filename and __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
});

const startApolloServer = async () => {
  await server.start();
  await db();

  const app = express();
  const PORT = process.env.PORT || 3001;

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(
    '/graphql',
    expressMiddleware(server as any, {
      context: authenticateToken as any,
    })
  );

  // Serve static assets in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../client/dist')));

    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();