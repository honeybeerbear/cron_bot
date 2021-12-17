import steem from "steem";

const steemapi = {
  claimReward: (wif, account, steembal, sbdbal, vestBal, callback = null) => {
    return callback
      ? steem.broadcast.claimRewardBalance(
          wif,
          account,
          steembal,
          sbdbal,
          vestBal,
          (err, result) => {
            if (err || !result) {
              return callback(null, err);
            } else {
              return callback(result, null);
            }
          }
        )
      : new Promise((resolve, reject) => {
          steem.broadcast.claimRewardBalance(
            wif,
            account,
            steembal,
            sbdbal,
            vestBal,
            (err, result) => {
              if (err) {
                reject(new Error(`Fail to load getAccounts ${err}`));
                return;
              }
              if (!result) {
                reject(new Error(`No Data ${err}`));
                return;
              }
              resolve(result);
            }
          );
        });
  },
  getAccount: (account, callback = null) => {
    return callback
      ? steem.api.getAccounts([account], (err, result) => {
          if (err || !result) {
            return callback(null, err);
          } else {
            return callback(result, null);
          }
        })
      : new Promise((resolve, reject) => {
          steem.api.getAccounts([account], (err, result) => {
            if (err) {
              reject(new Error(`Fail to load getAccounts ${err}`));
              return;
            }
            if (!result) {
              reject(new Error(`No Data ${err}`));
              return;
            }
            resolve(result);
          });
        });
  },

  transferToken: (wif, account, to, amount, memo, callback = null) => {
    return callback
      ? steem.broadcast.transfer(
          wif,
          account,
          to,
          amount,
          memo,
          (err, result) => {
            if (err || !result) {
              return callback(null, err);
            } else {
              return callback(result, null);
            }
          }
        )
      : new Promise((resolve, reject) => {
          steem.broadcast.transfer(
            wif,
            account,
            to,
            amountStr,
            memo,
            (err, result) => {
              if (err) {
                reject(new Error(`Fail to transferToken ${err}`));
                return;
              }
              if (!result) {
                reject(new Error(`No Data ${err}`));
                return;
              }
              resolve(result);
            }
          );
        });
  },
  transferEngineToken: (
    wif,
    account,
    symbol,
    to,
    amount,
    memo,
    callback = null
  ) => {
    const params = {
      contractName: "tokens",
      contractAction: "transfer",
      contractPayload: { symbol: symbol, to: to, quantity: amount, memo: memo },
    };

    const jsonStr = JSON.stringify(params);

    return callback
      ? steem.broadcast.customJson(
          wif,
          [account],
          [],
          "ssc-mainnet1",
          jsonStr,
          (err, result) => {
            if (err || !result) {
              return callback(null, err);
            } else {
              return callback(result, null);
            }
          }
        )
      : new Promise((resolve, reject) => {
          steem.broadcast.customJson(
            wif,
            [account],
            [],
            "ssc-mainnet1",
            jsonStr,
            (err, result) => {
              if (err) {
                reject(new Error(`Fail to load getCustomJson ${err}`));
                return;
              }
              if (!result) {
                reject(new Error(`No Data ${err}`));
                return;
              }
              resolve(result);
            }
          );
        });
  },
};

export default steemapi;
