import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import { listProductDetails } from "../actions/productActions";
import Rating from "../components/Rating";
import Message from "../components/Message";
import Loader from "../components/Loader";

import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";

const ProductScreen = ({ history, match }) => {
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const queryClient = useQueryClient();
  const { mutateAsync: addReview } = useMutation(
    async (data) => {
      return await axios
        .post(`/api/products/${data.productId}/reviews`, data)
        .then((res) => res.data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["reviews", { productId: product._id }]);
      },
    }
  );
  const { data: productReviews, isLoading } = useQuery(
    ["reviews", { productId: product._id }],
    async () => {
      return await axios
        .get(`/api/products/${product._id.toString()}/reviews`)
        .then((res) => res.data);
    }
  );

  useEffect(() => {
    dispatch(listProductDetails(match.params.id));
  }, [dispatch, match]);

  const addToCartHandler = () => {
    history.push(`/cart/${match.params.id}?qty=${qty}`);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // TODO: Add Review API call here

    try {
      await addReview({
        comment,
        rating,
        user: userInfo._id,
        productId: product._id,
      });

      setRating(0);
      setComment("");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="bg-color">
      <Link className="my-3 btn btn-light" to="/">
        Go Back
      </Link>
      {loading ? (
        <div style={{ height: "70vh" }}>
          <Loader />
        </div>
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div className="bg-color">
          <Row className="bg-color">
            <Col md={6} className="bg-color">
              <Image src={product.image} alt={product.name} fluid />
              <h3>{product.name}</h3>
            </Col>
            <Col md={3} className="bg-color">
              <ListGroup className="bg-color">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>

                <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                <ListGroup.Item>
                  Description: {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>${product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.countInStock > 0 ? "In Stock" : "Out Of Stock"}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty</Col>
                        <Col>
                          <Form.Control
                            as="select"
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item>
                    <Button
                      onClick={addToCartHandler}
                      className="btn-block button"
                      type="button"
                      disabled={product.countInStock === 0}
                    >
                      Add To Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <h2>Reviews</h2>
              {isLoading ? (
                <div>Loading...</div>
              ) : (
                <>
                  {productReviews.length === 0 && <Message>No Reviews</Message>}
                  <ListGroup variant="flush">
                    {productReviews.reviews.map((review) => (
                      <ListGroup.Item key={review._id}>
                        <strong>{review.name}</strong>
                        <Rating value={review.rating} />
                        <p>{review.createdAt.substring(0, 10)}</p>
                        <p>{review.comment}</p>
                      </ListGroup.Item>
                    ))}
                    <ListGroup.Item>
                      <h2>Write a Customer Review</h2>

                      {userInfo ? (
                        <Form onSubmit={submitHandler}>
                          <Form.Group controlId="rating">
                            <Form.Label>Rating</Form.Label>
                            <Form.Control
                              as="select"
                              value={rating}
                              onChange={(e) => setRating(e.target.value)}
                            >
                              <option value="">Select...</option>
                              <option value="1">1 - Poor</option>
                              <option value="2">2 - Fair</option>
                              <option value="3">3 - Good</option>
                              <option value="4">4 - Very Good</option>
                              <option value="5">5 - Excellent</option>
                            </Form.Control>
                          </Form.Group>
                          <Form.Group controlId="comment">
                            <Form.Label>Comment</Form.Label>
                            <Form.Control
                              as="textarea"
                              row="3"
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                            ></Form.Control>
                          </Form.Group>
                          <Button
                            type="submit"
                            variant="primary"
                            className="button"
                          >
                            Submit
                          </Button>
                        </Form>
                      ) : (
                        <Message>
                          Please <Link to="/login">sign in</Link> to write a
                          review{" "}
                        </Message>
                      )}
                    </ListGroup.Item>
                  </ListGroup>
                </>
              )}
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

export default ProductScreen;
