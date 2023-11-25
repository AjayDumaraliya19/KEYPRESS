// const date = new Date();
// const offset = date.getTimezoneOffset() == 0 ? 0 : -1 * date.getTimezoneOffset();

// let normalized = new Date(date.getTime() + (offset) * 60000);
// let indiaTime = new Date(normalized.toLocaleString("en-US", {timeZone: "Asia/Calcutta"}));
// module.exports = indiaTime;


exports.utc = async () => {
    const date = new Date();

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Month is 0-based
    const day = String(date.getUTCDate()).padStart(2, '0');

    const hour = String(date.getUTCHours()).padStart(2, '0');
    const minute = String(date.getUTCMinutes()).padStart(2, '0');
    const second = String(date.getUTCSeconds()).padStart(2, '0');
    const milisecond = String(date.getUTCMilliseconds());
    const strDate = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second + ":" + milisecond;
    // console.log('milisecond', milisecond)
    // console.log('hour', hour)
    // console.log('strDate', strDate)
    return strDate;
}

exports.wutc = async () => {
    const date = new Date();

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Month is 0-based
    const day = String(date.getUTCDate()).padStart(2, '0');

    const hour = String(date.getUTCHours()).padStart(2, '0');
    const minute = String(date.getUTCMinutes()).padStart(2, '0');
    const second = String(date.getUTCSeconds()).padStart(2, '0');
    const milisecond = String(date.getUTCMilliseconds());
    const strDate = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    // console.log('milisecond', milisecond)
    // console.log('hour', hour)
    // console.log('strDate', strDate)
    return strDate;
}
