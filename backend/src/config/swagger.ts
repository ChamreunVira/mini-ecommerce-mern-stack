import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ecommerce API with TypeScript',
      version: '1.0.0',
      description: 'API documentation for my Express application',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
  },
  // Path to the API docs. Use {ts,js} to support both development and production
  apis: ['./src/routes/*.{ts,js}', './src/app.{ts,js}'], 
};

export const swaggerSpec = swaggerJsdoc(options);
