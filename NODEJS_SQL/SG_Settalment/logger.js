const fs = require("fs");
const path = require("path");

/** Function to create a directory for logs based on the current date and time */
function createLogDirectory() {
  /** Get the current date and time */
  const currentDate = new Date();

  /** Get the current year, month, day, and hour */
  const currentYear = currentDate.getFullYear();
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
  const currentDay = currentDate.getDate().toString().padStart(2, "0");
  const currentHour = currentDate.getHours().toString().padStart(2, "0");

  /** Define the top-level folder in YYYYMMDD format */
  const topLevelFolderName = `${currentYear}${currentMonth}${currentDay}`;

  /** Construct the folder path */
  const folderPath = path.join(__dirname, "Logs", topLevelFolderName);

  /** Check if the top-level folder exists and create it if it doesn't */
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  /** Define the filename with the current hour */
  const fileName = `${currentHour}.txt`;

  /** Construct the full file path */
  const filePath = path.join(folderPath, fileName);
  return filePath;
}

const loggerdata = async (data) => {
  // const timestamp = new Date().toISOString();
  // const logMessage = `${timestamp}: ${data}\n`;
  const logMessage = `${data}\n`;

  /** Get the log directory */
  const logDirectory = await createLogDirectory();
  console.log(logDirectory);
  /** Define the log file path */

  /** Append the log message to the log file */
  fs.appendFile(logDirectory, logMessage, (err) => {
    if (err) {
      console.error("Error writing to log file:", err);
    }
  });
};

/** Exports all data module here */
module.exports = {
  loggerdata,
};
