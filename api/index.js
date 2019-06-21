
/**
* DEMO FILE
*
* Dummy API handler
**/

const DummyApi = {};
module.exports = DummyApi;

DummyApi.get = (req) => {
  const { offset, limit } = req.query;  
  
  console.log(limit)
  const parameters = [
    offset ? offset : 0,
    limit ? limit : 0
  ];
  console.log(parameters)
  return  Object.assign({}, {'parameters': parameters, 'message': 'you made a request'});
}