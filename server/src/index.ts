import server from './server.js';
import { getRedisClient, getEmailInstance } from './services/index.js';

const port = process.env.PORT ?? 3000;

server.listen(port, () => {
  getRedisClient();
  getEmailInstance();
  console.log(`Listening on port ${port}`);
});
