const { LambdaClient, GetFunctionUrlConfigCommand, ListFunctionsCommand } = require("@aws-sdk/client-lambda");
const fetch = require('node-fetch');
const lambdaController = {};

lambdaController.getFuncs = (req, res, next) => {
  const client = new LambdaClient({ credentials: res.locals.creds, region: req.query.region });
  
  const command2 = new ListFunctionsCommand({});

  client.send(command2) 
    .then((data) => {
      const newFunc = data.Functions.map(obj => {
        const funcs = { Name: obj.FunctionName, Arn : obj.FunctionArn }
        return funcs
      })
      res.locals.funcs = newFunc;
      return next();
    })
    .catch((error) => {
        return next({
            log: `error occurred in lambdaController.getFuncs: ${error}`,
            message: 'An error occurred while attemping to get functions in lambdaController.getFuncs'
        })
    })
}

lambdaController.invokeFuncs = (req, res, next) => {
  const client = new LambdaClient({ credentials: res.locals.creds, region: "us-west-1" });
  res.locals.funcs.forEach((el) => {
    if (el.Name === req.query.funcName) {
      console.log(el.Arn)
      const input = {
        /** input parameters */
        FunctionName: `${el.Arn}`
      };
      const command = new GetFunctionUrlConfigCommand(input);
      client.send(command)
        .then((data) => {
          //grab functionURL to obtain function name and ARN
          // console.log(data.FunctionUrl)
          fetch(data.FunctionUrl)
          return next();
        })
        .catch((error) => {
          // error handling.
          return next({
            log: `error occurred in lambdaController.invokeFuncs: ${error}`,
            message: 'An error occurred while attemping to invoke function in lambdaController.invokeFuncs'
        })
        });
    }
  })
  
}


module.exports = lambdaController;