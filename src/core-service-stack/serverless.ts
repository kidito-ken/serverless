import serverless from '../libs/baseServerless';

import r from './resources';

module.exports = serverless({
  service: 'core-service-stack',
  provider: {
    architecture: 'x86_64',
    timeout: 29,
    apiGateway: {
      metrics: true,
      shouldStartNameWithService: true
    },
    logRetentionInDays: 90,
    tracing: {
      lambda: true,
      apiGateway: true
    },
    logs: {
      restApi: true
    }
  },
  custom: { },
  resources: r
});