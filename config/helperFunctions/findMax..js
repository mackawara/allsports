function findMax(array) {
  var max = 0;
  var a = array.length;
  for (i = 0; i < a; i++) {
    if (array[i] > max) {
      max = array[i];
    }
  }
  return max;
}

module.exports = findMax;
