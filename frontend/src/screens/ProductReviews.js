import React, { useEffect, useState } from "react";
import {
  Table,
  Row,
  Col,
  DropdownButton,
  Dropdown,
  Form,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Paginate from "../components/Paginate";
import {
  listProducts,
  deleteProduct,
  createProduct,
} from "../actions/productActions";
import { PRODUCT_CREATE_RESET } from "../constants/productConstants";
import axios from "axios";

const ProductReviewsScreen = ({ history, match }) => {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [searchItem, setSearchItem] = useState("");
  const [productReviews, setProductReviews] = useState([]);
  const [productName, setProductName] = useState("");

  useEffect(() => {
    const getProductReviews = async () => {
      if (selectedProduct !== "") {
        const data = await axios
          .get(`/api/products/${selectedProduct}/reviews`)
          .then((res) => res.data);

        if (data) {
          setProductReviews(data.reviews);
          setProductName(data.name);
        }
      }
    };
    getProductReviews();
  }, [selectedProduct]);

  const pageNumber = match.params.pageNumber || 1;

  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;

  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });

    if (!userInfo || !userInfo.isAdmin) {
      history.push("/login");
    }

    if (successCreate) {
      history.push(`/admin/product/${createdProduct._id}/edit`);
    } else {
      dispatch(listProducts("", pageNumber));
    }
  }, [
    dispatch,
    history,
    userInfo,
    successDelete,
    successCreate,
    createdProduct,
    pageNumber,
  ]);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure")) {
      dispatch(deleteProduct(id));
    }
  };

  const createProductHandler = () => {
    dispatch(createProduct());
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Product Reviews</h1>
        </Col>
      </Row>
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row className="table-controls">
            <DropdownButton
              title="Select Product"
              onSelect={(e) => setSelectedProduct(e)}
            >
              {products.map((product) => (
                <Dropdown.Item eventKey={product._id} key={product._id}>
                  {product.name}
                </Dropdown.Item>
              ))}
            </DropdownButton>

            <Form
              onSubmit={(e) => {
                e.preventDefault();
                console.log(searchItem);
              }}
            >
              <Form.Group>
                <Form.Control
                  placeholder="Search"
                  type="text"
                  value={searchItem}
                  onChange={(e) => setSearchItem(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Row>

          <p>Selected Product ID: {selectedProduct}</p>
          <Table striped bordered hover responsive className="table-md ">
            <thead>
              <tr>
                <th>NAME</th>
                <th>RATING</th>
                <th>COMMENT</th>
              </tr>
            </thead>
            <tbody>
              {productReviews.map((product) => (
                <tr key={product._id}>
                  <td>{productName}</td>
                  <td>{product.rating}</td>
                  <td>{product.comment}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={pages} page={page} isAdmin={true} />
        </>
      )}
    </>
  );
};

export default ProductReviewsScreen;
