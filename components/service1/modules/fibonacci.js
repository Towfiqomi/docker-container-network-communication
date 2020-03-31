/*  eslint linebreak-style: ["error", "windows"]  */
/* eslint-env es6 */
/*  eslint max-len: ["error", { "code": 280 }]*/
// eslint-disable-next-line camelcase
const fibonacci_series = function(limit) {
  if (limit===0) {
    return [0];
  } else {
    const result = [0, 1];
    for (let i = 2; i < limit; i++) {
      result[result.length] = result[result.length - 1] + result[result.length - 2];
    }
    return result;
  }
};

// eslint-disable-next-line camelcase
module.exports.fibonacci_series = fibonacci_series;
