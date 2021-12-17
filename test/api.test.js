import steemapi from "../lib/steemapi.js";
import { LowDBWrapper } from "../db/db.js";
import steem from "steem";

const getAccount = (accnt) => {
  return (ele) => {
    return ele.account === accnt ? 1 : 0;
  };
};

(async () => {
  // const accountdb = new LowDBWrapper("account.json");
  // await accountdb.initialize();

  // const rtnData = await accountdb.readdata(getAccount("honeybeerbear"));

  // const accountInfo = await steemapi.getAccount("honeybeerbear");
  // console.log(accountInfo[0].reward_steem_balance);
  // console.log(accountInfo[0].reward_sbd_balance);
  // console.log(accountInfo[0].reward_vesting_balance);

  steemapi
    .getAccount("honeybeerbear")
    .then((res) => {
      console.log(res);
      console.log(res[0].reward_steem_balance);
    })
    .catch((err) => {
      reject(err);
    });
})();
