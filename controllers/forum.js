/**
 *
 *
 *
 * Controllers to handles all Forum specific functions
 *
 * @author Anandhakrishnan M
 * @github https://github.com/anandhakrishnanm
 *
 * @author Vishnu viswambharan
 * @github https://github.com/vishnuv55
 *
 */

const mongoose = require('mongoose');

const Query = require('../models/query');
const { ErrorHandler } = require('../helpers/error');
const { validateString, validateMongooseId } = require('../helpers/validation');

/**
 *
 *
 * Controller for posting new query to database
 *
 */
const postQuery = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }

  // Fetching question from request body
  const { question } = req.body;

  // Fetching id,name request user
  const { _id, name } = req.user;

  // Validating question
  try {
    validateString(question, 10, 128, 'Question', true);
  } catch (error) {
    return next(error);
  }

  // Setting created date for bill
  const currentDate = new Date().toISOString();
  const query = new Query({
    _id: mongoose.Types.ObjectId(),
    created_date: currentDate,
    question: {
      question,
      student_name: name,
      student_id: _id,
    },
  });

  // Saving bill details to database
  try {
    await query.save();
  } catch (error) {
    return next(new ErrorHandler(500, 'Error saving Question in database'));
  }

  res.status(201).json({ message: 'Question Posted Successfully' });
};

/**
 *
 *
 * Controller for fetching all queries
 *
 */
const getQueries = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }

  let queries;

  // Getting all queries from database
  try {
    queries = await Query.find({}).sort({ created_date: -1 });
  } catch (error) {
    return next(new ErrorHandler(500, 'Error Finding Queries'));
  }

  res.status(200).json(queries);
};

/**
 *
 *
 * Controller for posting answer to a query
 *
 */
const postAnswer = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }

  // Getting answer and query id from request
  const { answer, id } = req.body;

  // Validating data
  try {
    validateMongooseId(id, 'ID', true);
    validateString(answer, 2, 250, 'Answer', true);
  } catch (error) {
    return next(error);
  }

  let designation;

  // Getting designation from req.user
  if (req.user) {
    designation = req.user.designation;
  } else {
    return next(new ErrorHandler(403, 'You have no permission to access this'));
  }

  const answerObj = {
    answer: {
      answer,
      designation,
    },
  };

  // Finding and updating query in database
  try {
    await Query.findOneAndUpdate({ _id: id }, answerObj);
  } catch (error) {
    return next(new ErrorHandler(500, 'Unable to Post Answer'));
  }

  res.status(200).json({ message: 'Question answered Successfully' });
};

/**
 *
 *
 * Controller to edit question in forum
 *
 */
const editQuestion = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }

  // Fetching question and query id from request body
  const { question, id } = req.body;

  // Fetching student id and name from request user
  const { _id, name } = req.user;

  // Validating question and query id
  try {
    validateString(question, 10, 128, 'Question', true);
    validateMongooseId(id, 'ID', true);
  } catch (error) {
    return next(error);
  }

  // Fetching query from backend
  const query = await Query.findOne({ _id: id });
  if (!query) {
    return next(new ErrorHandler(500, 'Error Finding Query'));
  }

  // Sending error if student is not the creator of query
  if (!_id.equals(query.question.student_id)) {
    return next(new ErrorHandler(403, 'Invalid Student'));
  }
  const questionObj = {
    question: {
      question,
      student_name: name,
      student_id: _id,
    },
  };
  try {
    // Updating question in database
    await Query.findOneAndUpdate({ _id: id }, questionObj);
  } catch (error) {
    return next(new ErrorHandler(500, 'Error Updating Question'));
  }

  res.status(200).json({ message: 'Question Updated Successfully' });
};

/**
 *
 *
 * Controller to delete query
 *
 */
const deleteQuery = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }

  // Getting query id from request
  const { id: queryId } = req.params;

  // Validating id
  try {
    validateMongooseId(queryId, 'Id', true);
  } catch (error) {
    return next(error);
  }

  // Finding and deleting query in database
  const bill = await Query.findOneAndDelete({ _id: queryId });

  // Sending error if delete unsuccessful
  if (!bill) {
    return next(new ErrorHandler(500, 'Error deleting Query'));
  }

  res.status(200).json({ message: 'Query deleted successfully' });
};

module.exports = { postQuery, getQueries, postAnswer, editQuestion, deleteQuery };
