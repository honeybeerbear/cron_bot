import { LowDBWrapper } from "../db/db.js";

(async () => {
  const accountdb = new LowDBWrapper("account.json");
  await accountdb.initialize();
  const account = { account: "honeybeerbear", post: "KEY", active: "ACTIVE" };

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
