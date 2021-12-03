import { LowDBWrapper } from "../db/db.js";

(async () => {
  const accountdb = new LowDBWrapper("account.json");
  await accountdb.initialize();
  const account = {
    account: "honeybeerbear",
    post: "POST KEY",
    active: "ACTIVE KEY",
  };

  await accountdb.writedata(account);
  const allList = await accountdb.readdata();
  console.log(allList);

  const getAccount = (accnt) => {
    return (ele) => {
      return ele.account === accnt ? 1 : 0;
    };
  };

  const getList = await accountdb.readdata(getAccount("honeyerbear"));
  console.log(getList);
})();

async () => {
  const jobdb = new LowDBWrapper("job.json");
  await jobdb.initialize();
  const job = {
    function: "transfer",
    from: "honeybeerbear",
    to: "jhzzanglove",
    symbol: "SCT",
    amount: "0.1",
    exp: "* 3 * * *", // cron express
  };

  await jobdb.writedata(job);
  const jobList = await 
};
