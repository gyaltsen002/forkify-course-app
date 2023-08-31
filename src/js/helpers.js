// Rejecting the promise after a certain seconds
import { TIMEOUT_SECONDS } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadedData = undefined) {
  try {
    const fetchPro = uploadedData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadedData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SECONDS)]);

    // Convert to readable JSON file
    const data = await res.json();

    // Throwing error
    if (!res.ok) throw new Error(`${data.message}`);
    return data;
  } catch (err) {
    // Catching and throwing the error to the next handler function which calls it
    throw err.message;
  }
};

// Exporting the getAPI to fetch the data from the url provided
// export const getAPI = async function (url) {
//   try {
//     // Fetching the response from the url
//     const fetchPro = fetch(url);
//     const res = await Promise.race([fetchPro, timeout(TIMEOUT_SECONDS)]);

//     // Convert to readable JSON file
//     const data = await res.json();

//     // Throwing error
//     if (!res.ok) throw new Error(`${data.message}`);
//     return data;
//   } catch (err) {
//     // Catching and throwing the error to the next handler function which calls it
//     throw err.message;
//   }
// };

// // Exporting the getAPI to send the data to the url provided with the userUploaded data
// export const sendAPI = async function (url, uploadedData) {
//   try {
//     // Fetching the response from the url
//     const fetchPro = fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(uploadedData),
//     });

//     const res = await Promise.race([fetchPro, timeout(TIMEOUT_SECONDS)]);

//     // Convert to readable JSON file
//     const data = await res.json();

//     // Throwing error
//     if (!res.ok) throw new Error(`${data.message}`);
//     return data;
//   } catch (err) {
//     // Catching and throwing the error to the next handler function which calls it
//     throw err.message;
//   }
// };
