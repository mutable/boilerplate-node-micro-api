
/**
* DEMO FILE
*
* Dummy API handler
**/

const DummyApi = {};
module.exports = DummyApi;

DummyApi.get = (req) => ({ parameters: req.query, message: 'you made a request' });
