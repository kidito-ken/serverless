import { readFileSync } from 'fs';

import yml from 'js-yaml';

const files = [
  readFileSync("./src/resources/ddb.yml"),
  readFileSync("./src/resources/sqs/sqs.yml"),
  readFileSync("./src/resources/sns/sns.yml"),
  readFileSync("./src/resources/sns/snsSubscription.yml"),
  readFileSync("./src/resources/sqs/sqsQueuePolicy.yml")
];

export default files.reduce((res, row) => {
  const data = yml.load(row);

  for (const [key, val] of Object.entries<any>(data)) {
    res[key] = { ...res[key], ...val }
  }

  return res;
}, {});