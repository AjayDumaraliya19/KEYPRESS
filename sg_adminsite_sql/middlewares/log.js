const path = require('path');
const fs = require('fs');

exports.logs = async (req, response) => {
    const baseFolderPath = `./logs${req.originalUrl}/`;
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const folderName = `${year}${month}${day}`;
    const fileName = `${hour}.txt`;
    const folderPath = path.join(baseFolderPath, folderName);
    const filePath = path.join(baseFolderPath, folderName, fileName);
    const currentDate = new Date();
    const utcDate = new Date(currentDate.toUTCString());
  //  console.log('utcDate', utcDate)
    if (!fs.existsSync(folderPath)) {
        console.log('-------')
        fs.mkdirSync(folderPath, { recursive: true });
   //     console.log(`Created folder: ${folderPath}`);

        const currentData = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : '';
        const newData = `\n****************************************\n${utcDate.toISOString()}:\n${'request:  ' + JSON.stringify(req.headers)} \n${'Response:  ' + JSON.stringify(response)}\n`;

        fs.writeFileSync(filePath, currentData + newData, 'utf-8');
     //   console.log(`Appended data to file: ${filePath}`);
    } else {
        const currentData = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : '';
        const newData = `\n****************************************\n${utcDate.toISOString()}:\n${'request:  ' + JSON.stringify(req.headers)} \n${'Response:  ' + JSON.stringify(response)}\n`;

        fs.writeFileSync(filePath, currentData + newData, 'utf-8');
    //    console.log(`Appended data to file: ${filePath}`);
    }
}
