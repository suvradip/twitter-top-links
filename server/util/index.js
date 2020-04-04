module.exports.sortObjByValues = (obj) => {
   const res = Object.entries(obj)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
   return res;
};
