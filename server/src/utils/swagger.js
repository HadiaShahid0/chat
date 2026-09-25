import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MERN API Documentation",
      version: "1.0.0",
      description: "API documentation for the MERN Chat Application backend",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
      },
    ],
  },
  apis: ["./routes/*.js", "./src/routes/*.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

export const swaggerUiServe = swaggerUi.serve;
export const swaggerUiSetup = swaggerUi.setup(swaggerDocs);
