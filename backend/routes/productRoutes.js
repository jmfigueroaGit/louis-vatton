import express from "express";
const router = express.Router();

import {
  getProductById,
  getProducts,
  getProductProductReviews,
  addProductReview,
  getProductRating,
} from "../controllers/productController.js";

router.route("/").get(getProducts);
router.route("/:id").get(getProductById);
router.route("/:id/reviews").get(getProductProductReviews);
router.route("/:id/ratings").get(getProductRating);
router.route("/:id/reviews").post(addProductReview);

export default router;
