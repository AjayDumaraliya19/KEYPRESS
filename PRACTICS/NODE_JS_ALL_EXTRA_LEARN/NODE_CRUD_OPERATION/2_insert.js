const connectDB = require("./dbconnection");

/** Create the insert function */
const insert = async () => {
  const db = await connectDB();

  const result = await db.insertMany([
    { name: "Ajay", email: "ajay@gmail.com" },
    { name: "swata", email: "sweta@gmail.com" },
    { name: "Mayur", email: "mayur@gmail.com" },
    { name: "Aman", email: "Aman@gmail.com" },
    { name: "Vishal", email: "vishal@gmail.com" },
    { name: "vishwa", email: "vishwa@gmail.com" },
    { name: "princy", email: "princy@gmail.com" },
    { name: "Army", email: "Army@gmail.com" },
    { name: "sunil", email: "sunil@gmail.com" },
    { name: "kavin", email: "kavin@gmail.com" },
  ]);

  return console.log(result);
};

insert();
