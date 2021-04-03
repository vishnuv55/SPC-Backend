import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Configure ENV variables

const app = express();

// Initializing Database Connection
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log('Database Connected Successfully')) // eslint-disable-line
  .catch((error) => console.log('ERROR : Database Connection Failed', error)); // eslint-disable-line

const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, console.log(`Server running on port : ${PORT}`)); // eslint-disable-line
