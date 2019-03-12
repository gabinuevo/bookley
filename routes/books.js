const express = require("express");
const router = new express.Router();
const Book = require("../models/book");
const ExpressError = require("../expressError");
const jsonschema = require("jsonschema");
const createBookSchema = require("../schemas/createBookSchema.json");
const updateBookSchema = require("../schemas/updateBookSchema.json")

router.get("/", async function (req, res, next) {
  try {
    const books = await Book.findAll(req.query);
    return res.json({ books });
  } catch (err) {
    return next(err);
  }
});

router.get("/:id", async function (req, res, next) {
  try {
    const book = await Book.findOne(req.params.id);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

router.post("/", async function (req, res, next) {
  try {
    const result = jsonschema.validate(req.body, createBookSchema);

    if (!result.valid) {
      // pass validation errors to error handler
      //  (the "stack" key is generally the most useful)
      let listOfErrors = result.errors.map(error => error.stack);
      let error = new ExpressError(listOfErrors, 400);
      return next(error);
    }

    const book = await Book.create(req.body);
    return res.status(201).json({ book: book });
    
  } catch (err) {
    return next(err);
  }
});

router.patch("/:isbn", async function (req, res, next) {
  try {
    const result = jsonschema.validate(req.body, updateBookSchema);

    if (!result.valid) {
      // pass validation errors to error handler
      //  (the "stack" key is generally the most useful)
      let listOfErrors = result.errors.map(error => error.stack);
      let error = new ExpressError(listOfErrors, 400);
      return next(error);
    }
    const targetBook = await Book.findOne(req.params.isbn);
    debugger;
    const updatedData = {...targetBook, ...req.body}
    const book = await Book.update(req.params.isbn, updatedData);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

router.delete("/:isbn", async function (req, res, next) {
  try {
    await Book.remove(req.params.isbn);
    return res.json({ message: "Book deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
