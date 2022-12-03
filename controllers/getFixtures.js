const fixtureModel=require("../models/fixture")
const moment=require("moment")
var date = moment();
var currentDate = date.format("YYYY-MM-D")

const getFixtures = async function (competition) {
    const fixturesThisDay=await fixtureModel.find({date:date,competition:competition}).exec().catch(err=>console.log(err))
  return fixturesThisDay.length>0?{fixtures:fixturesThisDay}:{fixtures:`${competition} has no fixtures lined up for today`}
  
}
module.export=getFixtures