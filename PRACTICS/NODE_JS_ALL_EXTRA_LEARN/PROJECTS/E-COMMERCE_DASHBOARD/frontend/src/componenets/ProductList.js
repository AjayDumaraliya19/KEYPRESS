import React, { useEffect, useState } from "react";

const ProductList = () => {
  const [products, setProduct] = useState([]);

  useEffect(() => {
    getProduct();
  }, []);

  const getProduct = async () => {
    let result = await fetch("http://localhost:8080/v1/product/productList");
    result = await result.json();

    setProduct(result.data);
  };

  return (
    <div className="product-list">
      <h1>Product List</h1>
      <ul>
        <li>Sr. no</li>
        <li>Name</li>
        <li>Price</li>
        <li>Category</li>
        <li>Company</li>
      </ul>
      {products?.map((item, index) => {
        return (
          <ul>
            <li>{index + 1}</li>
            <li>{item.name}</li>
            <li>{item.price}</li>
            <li>{item.category}</li>
            <li>{item.company}</li>
          </ul>
        );
      })}
    </div>
  );
};

export default ProductList;
