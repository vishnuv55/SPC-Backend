/**
 *
 *
 *
 * @author Anandhakrishnan M
 * @github https://github.com/anandhakrishnanm
 *
 * @author Vishnu viswambharan
 * @github https://github.com/vishnuv55
 *
 */

const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const { handleError } = require('./helpers/error');

const apiRouter = require('./routes/api');

require('dotenv').config();

const app = express();

// Including cors
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Json parser
app.use(express.json());

// Cookie-parser
app.use(cookieParser());

// Logger
app.use(morgan('combined'));

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

// Including API router
app.use('/api', apiRouter);

// Including Error handler
app.use((err, req, res, next) => {
  handleError(err, req, res, next);
});

const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, console.log(`Server running on port : ${PORT}`)); // eslint-disable-line
