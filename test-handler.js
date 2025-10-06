// 测试handler，查看FC传递的request格式
exports.handler = async (request, context) => {
  console.log('=== FC Request Object ===');
  console.log(JSON.stringify(request, null, 2));
  
  return {
    statusCode: 200,
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      message: '测试成功',
      receivedRequest: {
        method: request.method,
        path: request.path,
        headers: request.headers,
        queries: request.queries,
        body: request.body
      }
    }, null, 2)
  };
};

