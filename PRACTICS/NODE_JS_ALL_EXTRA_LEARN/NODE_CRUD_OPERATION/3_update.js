const connectDB = require("./dbconnection");
const colors = require("colors");

/* ------------------------- Create update function ------------------------- */
const update = async () => {
  const db = await connectDB();

//   const result = await db.updateOne(
//     { name: "Ajay" },
//     { $set: { name: "Aman" } }
//   );
const result = await db.updateMany(
    { name: "Aman" },
    { $set: { email: "aman@gamil.com" } }
  );

  console.log("Update successfully..!")
  return result;
};

update();
