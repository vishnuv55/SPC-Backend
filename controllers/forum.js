const mongoose = require('mongoose');
const Query = require('../models/query');
const { validateString, validateMongooseId } = require('../helpers/validation');
const { ErrorHandler } = require('../helpers/error');

const postQuery = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }
  const { question } = req.body;
  const { _id, name } = req.user;
  try {
    validateString(question, 10, 100, 'Question', true);
  } catch (error) {
    return next(error);
  }
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
  try {
    await query.save();
  } catch (error) {
    return next(new ErrorHandler(500, 'Error saving Question in database'));
  }
  res.status(201).json({ message: 'Question Posted Successfully' });
};

const getQueries = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }
  let queries;
  try {
    queries = await Query.find({});
  } catch (error) {
    return next(new ErrorHandler(500, 'Error Finding Queries'));
  }
  res.status(200).json(queries);
};
const postAnswer = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }
  const { answer, id } = req.body;
  try {
    validateMongooseId(id, 'ID', true);
    validateString(answer, 10, 100, 'Answer', true);
  } catch (error) {
    return next(error);
  }
  let designation;
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
  try {
    await Query.findOneAndUpdate({ _id: id }, answerObj);
  } catch (error) {
    return next(new ErrorHandler(500, 'Unable to Post Answer'));
  }

  res.status(200).json({ message: 'Question answered Successfully' });
};

const editQuestion = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }
  const { question, id } = req.body;
  const { _id, name } = req.user;
  try {
    validateString(question, 10, 100, 'Question', true);
    validateMongooseId(id, 'ID', true);
  } catch (error) {
    return next(error);
  }
  const query = await Query.findOne({ _id: id });
  if (!query) {
    return next(new ErrorHandler(500, 'Error Finding Query'));
  }
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
    await Query.findOneAndUpdate({ _id: id }, questionObj);
  } catch (error) {
    return next(new ErrorHandler(500, 'Error Updating Question'));
  }
  res.status(200).json({ message: 'Question Updated Successfully' });
};

module.exports = { postQuery, getQueries, postAnswer, editQuestion };
