import express from "express";
const router = express.Router();

import {
  getProductById,
  getProducts,
  getProductProductReviews,
  addProductReview,
  getProductRating,
  deleteProduct,
  updateProduct,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").get(getProducts);
router
  .route("/:id")
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct);
router.route("/:id/reviews").get(getProductProductReviews);
router.route("/:id/ratings").get(getProductRating);
router.route("/:id/reviews").post(addProductReview);

export default router;
