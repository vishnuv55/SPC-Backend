const mongoose = require('mongoose');
const Bill = require('../models/bill');
const { ErrorHandler } = require('../helpers/error');
const { validateDate, validateNumber, validateString } = require('../helpers/validation');

// Post-gill-details
const postBillDetails = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }
  // Fetching data from request body
  const { bill_date, bill_amount, bill_description } = req.body;

  try {
    validateDate(bill_date, 'Bill Date', true);
    validateNumber(bill_amount, 1, 99999999, 'Bill Amount', true);
    validateString(bill_description, 5, 100, 'Bill Description', true);
  } catch (error) {
    return next(error);
  }
  const bill = new Bill({
    _id: mongoose.Types.ObjectId(),
    bill_date: new Date(bill_date),
    bill_amount,
    bill_description,
  });

  const isBill = await bill.save();
  if (!isBill) {
    return next(new ErrorHandler(500, 'Error saving bill details'));
  }
  res.status(201).json({ message: 'Bill created successfully' });
};

const getBillDetails = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }
  // Fetching Bill details from database

  let bills;
  try {
    bills = await Bill.find({});
  } catch (error) {
    return next(new ErrorHandler(500, 'Error Finding Bills'));
  }
  res.status(200).json(bills);
};

module.exports = { postBillDetails, getBillDetails };
