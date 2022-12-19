const cron =require("node-cron")
const taskScheduler=async(minutes,hours,task)=>{
    console.log("task scheduler running")
    cron.schedule(
        `${minutes} ${hours} * * *`,
        async () => {
            console.log("scheduled task running")
            task()
       // task()// console.log("task")
        },
        { scheduled: true, timezone: "UTC" }
      );
}
module.exports=taskScheduler