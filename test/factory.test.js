const Job = (name) => {
  const job = { name: name, run: () => {} };
  return job;
};

const jobAssign = (name) => {
  const run = () => {};
  return Object.assign(Job(name), run);
};

console.log(jobAssign);
