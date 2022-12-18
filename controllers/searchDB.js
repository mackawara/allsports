const searchDb = async function (queryKey,queryParam, model) {
 
  const result = await model
    .find({
      [queryKey]: queryParam,
    })
    .exec();
//console.log("The resultis "+ result)
  return result.length > 0 ? true : false;
};

module.exports = searchDb;
