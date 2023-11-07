const connectDB = require("./dbconnection");

const dltdata = async () => {
  const db = await connectDB();

  const result = await db.deleteMany({
    $or: [
      { name: "Aman" },
      { name: "Mayur" },
      { name: "princy" },
      { name: "Army" },
      { name: "kavin" },
    ],
  });

  console.log(`Deleted succefully ${result.deletedCount} documents...`);

  return result;
};

dltdata();
