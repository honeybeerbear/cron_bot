import steem from "steem";

const steemapi = {
  transferToken: (wif, account, symbol, to, amount, memo, callback = null) => {
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
