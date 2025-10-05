# Meko Backend

A Node.js backend application with Express and MySQL.

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server (v5.7 or higher)
- npm (comes with Node.js)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the database credentials in `.env`

4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
meko-be/
├── node_modules/    # Dependencies
├── .env            # Environment variables
├── .gitignore      # Git ignore file
├── package.json    # Project metadata and dependencies
└── server.js       # Main application file
```

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon

## API Endpoints

- `GET /` - Welcome message

## Database

Make sure your MySQL server is running and update the database credentials in the `.env` file.
