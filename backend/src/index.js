import app from './server.js';
import logger from './config/logger.js';

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
  logger.info(`Server Is run http://localhost:${PORT}`);
  logger.info(`Swagger docs at http://localhost:${PORT}/api-docs`);
});

export default app;