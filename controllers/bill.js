/**
 *
 *
 *
 * Controllers to handles all Bill specific functions
 *
 * @author Vishnu viswambharan
 * @github https://github.com/vishnuv55
 *
 * @author Anandhakrishnan M
 * @github https://github.com/anandhakrishnanm
 *
 *
 */

const mongoose = require('mongoose');

const {
  validateDate,
  validateString,
  validateNumber,
  validateMongooseId,
} = require('../helpers/validation');
const Bill = require('../models/bill');
const { ErrorHandler } = require('../helpers/error');

/**
 *
 *
 * Controller to add new bill details
 *
 */
const postBillDetails = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }
  // Fetching data from request body
  const { bill_title, bill_date, bill_amount, bill_description } = req.body;

  // Validating data
  try {
    validateString(bill_title, 3, 30, 'Bill Title', true);
    validateDate(bill_date, 'Bill Date', true);
    validateNumber(bill_amount, 1, 99999999, 'Bill Amount', true);
    validateString(bill_description, 10, 100, 'Bill Description', true);
  } catch (error) {
    return next(error);
  }

  // Creating new bill
  const bill = new Bill({
    _id: mongoose.Types.ObjectId(),
    created_date: new Date().toISOString(),
    bill_title,
    bill_date,
    bill_amount,
    bill_description,
  });

  // Saving bill
  const isBill = await bill.save();
  if (!isBill) {
    return next(new ErrorHandler(500, 'Error saving bill details'));
  }

  res.status(201).json({ message: 'Bill created successfully' });
};

/**
 *
 *
 * Controller to send bill details to client
 *
 */
const getBillDetails = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }

  let bills;

  // Fetching Bill details from database
  try {
    bills = await Bill.find({}).sort({ created_date: -1 });
  } catch (error) {
    return next(new ErrorHandler(500, 'Error Finding Bills'));
  }

  res.status(200).json(bills);
};

/**
 *
 *
 * Controller to delete bill details from database
 *
 */
const deleteBill = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }

  // Getting id from request
  const { id: billId } = req.params;

  // Validating id
  try {
    validateMongooseId(billId, 'Id', true);
  } catch (error) {
    return next(error);
  }

  // Finding and deleting bill
  const bill = await Bill.findOneAndDelete({ _id: billId });

  // Sending error if no bill exists for deletion
  if (!bill) {
    return next(new ErrorHandler(500, 'Error deleting Bill'));
  }

  res.status(200).json({ message: 'Bill deleted successfully' });
};

module.exports = { postBillDetails, getBillDetails, deleteBill };
