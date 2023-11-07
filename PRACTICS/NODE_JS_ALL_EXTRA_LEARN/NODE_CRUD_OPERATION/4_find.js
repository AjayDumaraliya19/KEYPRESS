const connectDB = require("./dbconnection");

async function findata() {
  const db = await connectDB();
  const result = await db.find({}).toArray();

  return await result;
}

const res = findata();
res.then((results) => {
  // The results are now available in the `results` variable
  console.log(results);
});
