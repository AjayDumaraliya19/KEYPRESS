const os = require("os");

console.log("OS modules : ",os); // Os modules show in console log
console.log("System work on the bit :",os.arch()) // Show your system work on bit
console.log("Free memory in bit : ",os.freemem()) // show memory in bite
console.log("Free memory in GB : ",os.freemem()/(1024*1024*1024)) // show memory in gb
console.log("Total memory : ",os.totalmem()/(1024*1024*1024)) // show memory in gb
console.log("System name : ",os.hostname()) // System name show
console.log("System Platfofm : ",os.platform()) // operatin system Platform show
console.log("User details : ",os.userInfo()); // User realated details
