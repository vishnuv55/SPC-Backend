/**
 * << Controller to handle bill management functionalities >>
 *
 * postBillDetails -> 18
 * getBillDetails -> 46
 * deleteBill -> 61
 */
const mongoose = require('mongoose');
const Bill = require('../models/bill');
const { ErrorHandler } = require('../helpers/error');
const {
  validateDate,
  validateNumber,
  validateString,
  validateMongooseId,
} = require('../helpers/validation');

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

const deleteBill = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }
  const { id: billId } = req.params;
  try {
    validateMongooseId(billId, 'Id', true);
  } catch (error) {
    return next(error);
  }

  const bill = await Bill.findOneAndDelete({ _id: billId });
  if (!bill) {
    return next(new ErrorHandler(500, 'Error deleting Bill'));
  }
  res.status(200).json({ message: 'Bill deleted successfully' });
};

module.exports = { postBillDetails, getBillDetails, deleteBill };
