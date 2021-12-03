import cron from "node-cron";
import steemapi from "./lib/steemapi.js";
import { LowDBWrapper } from "./db/db.js";

(async () => {
  const cronJob = (exp, func) => {
    try {
      cron.schedule(exp, func);
    } catch (e) {
      console.log(e);
    }
  };

  const getAccount = (accnt) => {
    return (ele) => {
      return ele.account === accnt ? 1 : 0;
    };
  };

  // get db data list
  const jobdb = new LowDBWrapper("job.json");
  const accountdb = new LowDBWrapper("account.json");
  await jobdb.initialize();
  await accountdb.initialize();

  const jobList = await jobdb.readdata();
  for (let i = 0; i < jobList.length; i++) {
    const element = jobList[i];
    if (element.function === "transfer") {
      const rtnData = await accountdb.readdata(getAccount(element.from));

      // add cron job
      cronJob(element.exp, () =>
        steemapi.transferToken(
          rtnData.active,
          element.from,
          element.symbol,
          element.to,
          element.amount,
          "",
          (result, err) => {
            if (!err) console.log(result);
            else console.log(err);
          }
        )
      );
    }
  }
})();
