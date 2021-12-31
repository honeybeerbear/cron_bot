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

    switch (element.function) {
      case "claimReward":
        const claimAccount = await accountdb.readdata(
          getAccount(element.account)
        );
        cronJob(element.exp, () => {
          console.log("claimReward : " + element.account);

          steemapi
            .getAccount(element.account)
            .then((res) => {
              const steembal = res[0].reward_steem_balance;
              const sbdbal = res[0].reward_sbd_balance;
              const vestBal = res[0].reward_vesting_balance;

              steemapi.claimReward(
                claimAccount.post,
                element.account,
                steembal,
                sbdbal,
                vestBal,
                (result, err) => {
                  if (!err) console.log(result);
                  else console.log(err);
                }
              );
            })
            .catch((err) => {
              console.error(err);
            });
        });
        break;
      case "transferToken": // transfer engine token
        // get wif
        const transferTokenAccount = await accountdb.readdata(
          getAccount(element.from)
        );
        // add cron job
        cronJob(element.exp, () => {
          console.log(
            "transferToken  from " +
              element.from +
              ", to : " +
              element.to +
              ", amount : " +
              element.amount
          );
          steemapi.transferEngineToken(
            transferTokenAccount.active,
            element.from,
            element.symbol,
            element.to,
            element.amount,
            "",
            (result, err) => {
              if (!err) console.log(result);
              else console.log(err);
            }
          );
        });
        break;
      case "transfer":
        // get wif
        const transferAccount = await accountdb.readdata(
          getAccount(element.from)
        );

        // add cron job
        cronJob(element.exp, async () => {
          let amount = 0;
          if (element.amount == 0) {
            // get account info
            const accountInfo = await steemapi.getAccount(element.from);

            amount =
              element.symbol === "STEEM"
                ? accountInfo[0].balance
                : accountInfo[0].sbd_balance;
          } else {
            amount =
              parseFloat(element.amount).toFixed(3) + " " + element.symbol;
          }

          if (element.amount > 0) {
            console.log(
              "Transfer from " +
                element.from +
                ", to : " +
                element.to +
                ", amount : " +
                element.amount
            );
            steemapi.transferToken(
              transferAccount.active,
              element.from,
              element.to,
              amount,
              element.memo ? element.memo : "",
              (result, err) => {
                if (!err) console.log(result);
                else console.log(err);
              }
            );
          }
        });
        break;
    }
  }
})();
