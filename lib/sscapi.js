import axios from "axios";

const CONTRACTAPI = "contracts";
const baseUrl = "https://steemapi.cryptoempirebot.com/rpc/";
const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

let id = 1;

function sendWithPromise(endpoint, request) {
  const postData = {
    jsonrpc: "2.0",
    id: id++,
    ...request,
  };

  return new Promise(function (resolve, reject) {
    axios({
      url: endpoint,
      baseURL: baseUrl,
      method: "POST",
      headers,
      data: postData,
    })
      .then((response) => {
        resolve(response.data.result);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function sendWithCallback(endpoint, request, callback) {
  const postData = {
    jsonrpc: "2.0",
    id: id++,
    ...request,
  };

  axios({
    url: endpoint,
    baseURL: baseUrl,
    method: "POST",
    headers,
    data: postData,
  })
    .then((response) => {
      callback(response.data.result, null);
    })
    .catch((error) => {
      callback(null, error);
    });
}

function send(endpoint, request, callback) {
  return callback
    ? sendWithCallback(endpoint, request, callback)
    : sendWithPromise(endpoint, request);
}

const sscapi = {
  // token 전송 관련 데이터
  getSteemEngineAccountHistoryAsync: async (
    account,
    symbol,
    callback = null
  ) => {
    const request = {
      account,
      limit: 50,
      offset: 0,
      // type: "user",
      // symbol,
    };

    return await axios({
      url: "https://api.steem-engine.net/history/accountHistory",
      method: "GET",
      params: request,
    })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.error("Could not fetch data");
        return [];
      });
  },
  getTokenBalance: (account, symbol, callback = null) => {
    const request = {
      method: "findOne",
      params: {
        contract: "tokens",
        table: "balances",
        query: {
          account: account,
          symbol: symbol,
        },
        limit: 1000,
        offset: 0,
        indexes: [],
      },
    };
    return send(CONTRACTAPI, request, callback);
  },
  getTokenBalanceList: (account, callback = null) => {
    const request = {
      method: "find",
      params: {
        contract: "tokens",
        table: "balances",
        query: {
          account: account,
          balance: { $gt: "0.0000000" },
        },
      },
    };
    return send(CONTRACTAPI, request, callback);
  },
  getTokenInfo: (tokens, callback = null) => {
    const request = {
      method: "find",
      params: {
        contract: "tokens",
        table: "tokens",
        query: {
          symbol: { $in: tokens },
        },
      },
    };
    return send(CONTRACTAPI, request, callback);
  },
  getTokenMarketMatrics: (tokens, callback = null) => {
    const request = {
      method: "find",
      params: {
        contract: "market",
        table: "metrics",
        query: {
          symbol: { $in: tokens },
        },
      },
    };
    return send(CONTRACTAPI, request, callback);
  },
};

export default sscapi;
