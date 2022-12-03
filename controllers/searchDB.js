const searchDb = async function (queryParam, model) {
    console.log(`query DB is working`);
    const result = await model
      .find({
        queryParam: queryParam,
      })
      .exec();
    console.log(result);
  
    if (result.length < 1) {
      return false;
    } else {
      return true;
    }
  };
  module.exports=searchDb
  