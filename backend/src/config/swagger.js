import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "IssueLog API",
      version: "1.0.0",
      description: "API documentation for backend",
    },
    servers: [
      {
        url: "http://localhost:4000",
        description: "Local dev server",
      },
    ],
  },
  apis: [path.resolve("src/routes/*.js")],
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
