const Api = {};
module.exports = Api;

Api.get = (req) => {
  const { offset, limit } = req.query;  
  
  const parameters = [
    offset ? offset : 0,
    limit ? limit : LIMIT
  ];
  return  Object.assign({}, {'parameters': parameters, 'message': 'you made a request'})
}