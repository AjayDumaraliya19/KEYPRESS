import React, { useState } from "react";

const AddProduct = () => {
  const [name, setname] = useState("");
  const [price, setprice] = useState("");
  const [category, setcategory] = useState("");
  const [company, setcompany] = useState("");
  const [err, setErr] = useState(false);

  const addProduct = async () => {
    if (!name || !price || !category || !company) {
      setErr(true);
      return false;
    }

    const userId = JSON.parse(localStorage.getItem("user"))._id;
    let result = await fetch("http://localhost:8080/v1/product/createProduct", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, price, category, company, userId }),
    });
    const data = await result.json();
  };

  return (
    <div>
      <div className="card">
        <h1>Add Product</h1>
        <input
          className="cardfield"
          type="text"
          placeholder="Enter Product name"
          value={name}
          onChange={(e) => {
            setname(e.target.value);
          }}
        />
        {err && !name && (
          <span className="invalide-input">Enter valid name</span>
        )}
        <input
          className="cardfield"
          type="number"
          placeholder="Enter Product Price"
          value={price}
          onChange={(e) => {
            setprice(e.target.value);
          }}
        />
        {err && !price && (
          <span className="invalide-input">Enter valid price</span>
        )}
        <input
          className="cardfield"
          type="text"
          placeholder="Enter Category name"
          value={category}
          onChange={(e) => {
            setcategory(e.target.value);
          }}
        />
        {err && !category && (
          <span className="invalide-input">Enter valid category</span>
        )}
        <input
          className="cardfield"
          type="text"
          placeholder="Enter company name"
          value={company}
          onChange={(e) => {
            setcompany(e.target.value);
          }}
        />
        {err && !company && (
          <span className="invalide-input">Enter valid company</span>
        )}
        <button onClick={addProduct} className="subButton">
          Add Product
        </button>
      </div>
    </div>
  );
};

export default AddProduct;
