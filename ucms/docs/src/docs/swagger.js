import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.3",

    info: {
      title: "University Course Management System API",
      version: "1.0.0",
      description: "REST API for the University Course Management System.",
    },

    servers: [
      {
        url: "http://localhost:5000/api/v1",
        description: "Development Server",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: ["./src/docs/**/*.yaml", "./src/docs/**/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
