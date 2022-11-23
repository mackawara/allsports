const fixtureModel=require("../models/fixture")
var date = moment();
var currentDate = date.format("YYYY-MM-D")

const searchFixtures = async function (competition) {
    const fixturesThisDay=await fixtureModel.find({date:date,competition:competition}).exec().catch(err=>console.log(err))
  return fixturesThisDay.length>0?{fixtures:fixturesThisDay}:{fixtures:`${competition} has no fixtures lined up for today`}
  
}