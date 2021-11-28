import cron from "node-cron";
import transfer from "./tasks/transfer.js";

const cronJob = (exp, func) => {
  cron.schedule(exp, func);
};

(() => {
  // get db data list
  // cron 객체 생성
  // if transfer
  cronJob("*/1 * * * *", () => transfer("a", "b", 10));
})();
