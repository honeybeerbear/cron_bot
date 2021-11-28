import { join, dirname } from "path";
import { Low, JSONFile } from "lowdb";
import { fileURLToPath } from "url";

export class LowDBWrapper {
  constructor(filename) {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const file = join(__dirname, "/data/" + filename);
    this.db = new Low(new JSONFile(file));
    this.filename = filename;
  }

  async initialize() {
    await this.db.read();
    this.db.data = this.db.data || { name: this.filename, v: [] };
    await this.db.write();
  }

  async writedata(data) {
    await this.db.read();
    this.db.data.v.push(data);
    await this.db.write();
  }

  async readdata(comparer) {
    await this.db.read();
    const rtn = comparer ? this.db.data.v.find(comparer) : this.db.data.v;
    return rtn;
  }
}
