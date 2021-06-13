import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const product = await Product.find({});
  res.json(product);
});

// @desc    Fetch single products
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Fetch single products
// @route   GET /api/products/:id/reviews
// @access  Public
const getProductProductReviews = asyncHandler(async (req, res) => {
  const productReviews = await Product.findById(req.params.id)
    .select("user reviews")
    .populate("user")
    .populate("reviews");

  if (productReviews) {
    res.json(productReviews);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Fetch single products
// @route   GET /api/products/:id/ratings
// @access  Public
const getProductRating = asyncHandler(async (req, res) => {
  const productReviews = await Product.findById(req.params.id)
    .select("reviews")
    .populate("reviews");

  let ratings = 0;
  productReviews.reviews.map((p) => Number((ratings += Number(p.rating))));

  if (productReviews) {
    res.json({
      ratings: ratings / productReviews.reviews.length,
      numberOfReviews: productReviews.reviews.length,
    });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Fetch single products
// @route   POST /api/products/:id/reviews
// @access  Public
const addProductReview = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { $push: { reviews: req.body } },
    {
      new: true,
      runValidators: true,
    }
  )
    .select("user reviews")
    .populate("user")
    .populate("reviews");

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

export {
  getProducts,
  getProductById,
  getProductProductReviews,
  addProductReview,
  getProductRating,
};
