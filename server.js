const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const port = 3000;

// 处理工资记录GET请求
function handleWageRecordRequest(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const query = parsedUrl.query;
  
  // 过滤数据
  let filteredItems = [...mockData.records];
  
  // 根据查询参数过滤数据
  if (query.keyWords) {
    const keyWords = query.keyWords.toLowerCase();
    filteredItems = filteredItems.filter(item => 
      item.projectName.toLowerCase().includes(keyWords) || 
      item.organizationName.toLowerCase().includes(keyWords)
    );
  }
  
  if (query.recordStatus && query.recordStatus !== '') {
    filteredItems = filteredItems.filter(item => item.recordStatus === query.recordStatus);
  }
  
  if (query.payStatus && query.payStatus !== '') {
    filteredItems = filteredItems.filter(item => item.payStatus === query.payStatus);
  }
  
  if (query.bankAccountType && query.bankAccountType !== '') {
    filteredItems = filteredItems.filter(item => item.bankAccountType === query.bankAccountType);
  }
  
  if (query.bankName && query.bankName !== '') {
    filteredItems = filteredItems.filter(item => item.bankName === query.bankName);
  }
  
  if (query.payType && query.payType !== '') {
    filteredItems = filteredItems.filter(item => item.payType === query.payType);
  }
  
  if (query.laborReviewStatus && query.laborReviewStatus !== '') {
    filteredItems = filteredItems.filter(item => item.laborReviewStatus === query.laborReviewStatus);
  }
  
  if (query.year && query.year !== '') {
    filteredItems = filteredItems.filter(item => item.year === query.year);
  }
  
  if (query.month && query.month !== '') {
    filteredItems = filteredItems.filter(item => item.month === query.month);
  }
  
  if (query.exchangeStatus && query.exchangeStatus !== '' && query.exchangeStatus !== '-1') {
    const exchangeStatus = parseInt(query.exchangeStatus);
    filteredItems = filteredItems.filter(item => item.exchangeStatus === exchangeStatus);
  }
  
  // 分页处理
  const page = parseInt(query.page) || 1;
  const size = parseInt(query.size) || 10;
  const start = (page - 1) * size;
  const end = start + size;
  const paginatedItems = filteredItems.slice(start, end);
  
  // 返回结果
  const responseData = {
    code: 200,
    message: "success",
    data: {
      records: paginatedItems,
      total: filteredItems.length,
      size: size,
      current: page,
      searchCount: true,
      pages: Math.ceil(filteredItems.length / size)
    }
  };
  
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  res.end(JSON.stringify(responseData));
}

// 处理工资记录POST请求
function handleWageRecordPostRequest(postData, res) {
  console.log('POST请求数据:', postData);
  
  // 从POST数据中提取查询参数
  const queryDTO = postData.queryDTO || {};
  const page = postData.page || 1;
  const size = postData.size || 10;
  
  // 过滤数据
  let filteredItems = [...mockData.records];
  
  // 根据查询参数过滤数据
  if (queryDTO.keyWords) {
    const keyWords = queryDTO.keyWords.toLowerCase();
    filteredItems = filteredItems.filter(item => 
      item.projectName.toLowerCase().includes(keyWords) || 
      item.organizationName.toLowerCase().includes(keyWords)
    );
  }
  
  if (queryDTO.recordStatus && queryDTO.recordStatus !== '') {
    filteredItems = filteredItems.filter(item => item.recordStatus === queryDTO.recordStatus);
  }
  
  if (queryDTO.payStatus && queryDTO.payStatus !== '') {
    filteredItems = filteredItems.filter(item => item.payStatus === queryDTO.payStatus);
  }
  
  if (queryDTO.bankAccountType && queryDTO.bankAccountType !== '') {
    filteredItems = filteredItems.filter(item => item.bankAccountType === queryDTO.bankAccountType);
  }
  
  if (queryDTO.bankName && queryDTO.bankName !== '') {
    filteredItems = filteredItems.filter(item => item.bankName === queryDTO.bankName);
  }
  
  if (queryDTO.payType && queryDTO.payType !== '') {
    filteredItems = filteredItems.filter(item => item.payType === queryDTO.payType);
  }
  
  if (queryDTO.laborReviewStatus && queryDTO.laborReviewStatus !== '') {
    filteredItems = filteredItems.filter(item => item.laborReviewStatus === queryDTO.laborReviewStatus);
  }
  
  if (queryDTO.year && queryDTO.year !== '') {
    filteredItems = filteredItems.filter(item => item.year === queryDTO.year);
  }
  
  if (queryDTO.month && queryDTO.month !== '') {
    filteredItems = filteredItems.filter(item => item.month === queryDTO.month);
  }
  
  if (queryDTO.exchangeStatus && queryDTO.exchangeStatus !== -1) {
    const exchangeStatus = parseInt(queryDTO.exchangeStatus);
    filteredItems = filteredItems.filter(item => item.exchangeStatus === exchangeStatus);
  }
  
  if (queryDTO.projectId && queryDTO.projectId !== -1) {
    // 这里只是模拟，实际上我们的模拟数据没有projectId字段
    // 在实际应用中，应该根据projectId进行过滤
  }
  
  // 分页处理
  const start = (page - 1) * size;
  const end = start + size;
  const paginatedItems = filteredItems.slice(start, end);
  
  // 返回结果
  const responseData = {
    code: 200,
    message: "success",
    data: {
      records: paginatedItems,
      total: filteredItems.length,
      size: size,
      current: page,
      searchCount: true,
      pages: Math.ceil(filteredItems.length / size)
    }
  };
  
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  res.end(JSON.stringify(responseData));
}

// 模拟数据
const mockData = {
  records: [
    { id: 1, companyName: '建筑集团公司', teamName: '钢筋工程队', groupName: '第一班组', month: '05', recordStatus: '暂存', payStatus: '/', expectedSalary: 25000, actualSalary: 0, employeeCount: 12, payType: '银行转账', bankAccountType: '对公', bankName: '建设银行', reportType: '手工填报', documentNumber: 'GZ202305001' },
    { id: 2, companyName: '建筑集团公司', teamName: '模板工程队', groupName: '第二班组', month: '06', recordStatus: '已提交', payStatus: '未发放', expectedSalary: 32000, actualSalary: 0, employeeCount: 15, payType: '银行转账', bankAccountType: '对公', bankName: '工商银行', reportType: '系统导入', documentNumber: 'GZ202306002' },
    { id: 3, companyName: '城市建设公司', teamName: '混凝土工程队', groupName: '第一班组', month: '07', recordStatus: '已提交', payStatus: '未发放', expectedSalary: 28000, actualSalary: 0, employeeCount: 10, payType: '银行转账', bankAccountType: '对公', bankName: '农业银行', reportType: '系统导入', documentNumber: 'GZ202307003' },
    { id: 4, companyName: '建筑集团公司', teamName: '钢筋工程队', groupName: '第三班组', month: '08', recordStatus: '审核通过', payStatus: '已发放', expectedSalary: 30000, actualSalary: 30000, employeeCount: 14, payType: '银行转账', bankAccountType: '对公', bankName: '中国银行', reportType: '手工填报', documentNumber: 'GZ202308004' },
    { id: 5, companyName: '城市建设公司', teamName: '混凝土工程队', groupName: '第二班组', month: '09', recordStatus: '暂存', payStatus: '/', expectedSalary: 27000, actualSalary: 0, employeeCount: 11, payType: '银行转账', bankAccountType: '对公', bankName: '交通银行', reportType: '手工填报', documentNumber: 'GZ202309005' },
    { id: 6, companyName: '城市建设公司', teamName: '混凝土工程队', groupName: '第三班组', month: '10', recordStatus: '已提交', payStatus: '未发放', expectedSalary: 35000, actualSalary: 0, employeeCount: 16, payType: '银行转账', bankAccountType: '对公', bankName: '中国银行', reportType: '系统导入', documentNumber: 'GZ202310006' },
    { id: 7, companyName: '高速公路建设公司', teamName: '路基工程队', groupName: '第一班组', month: '11', recordStatus: '审核通过', payStatus: '已发放', expectedSalary: 40000, actualSalary: 40000, employeeCount: 18, payType: '银行转账', bankAccountType: '对公', bankName: '建设银行', reportType: '系统导入', documentNumber: 'GZ202311007' },
    { id: 8, companyName: '高速公路建设公司', teamName: '路基工程队', groupName: '第二班组', month: '12', recordStatus: '审核通过', payStatus: '已发放', expectedSalary: 38000, actualSalary: 38000, employeeCount: 17, payType: '银行转账', bankAccountType: '对公', bankName: '工商银行', reportType: '手工填报', documentNumber: 'GZ202312008' },
    { id: 9, companyName: '高速公路建设公司', teamName: '路基工程队', groupName: '第三班组', month: '01', recordStatus: '审核通过', payStatus: '发放失败', expectedSalary: 42000, actualSalary: 0, employeeCount: 20, payType: '银行转账', bankAccountType: '对公', bankName: '农业银行', reportType: '系统导入', documentNumber: 'GZ202401009' },
    { id: 10, companyName: '建筑集团公司', teamName: '模板工程队', groupName: '第三班组', month: '02', recordStatus: '暂存', payStatus: '/', expectedSalary: 33000, actualSalary: 0, employeeCount: 15, payType: '银行转账', bankAccountType: '对公', bankName: '交通银行', reportType: '手工填报', documentNumber: 'GZ202402010' }
  ],
  total: 10,
  size: 10,
  current: 1,
  searchCount: true,
  pages: 1
};

// 创建服务器
const server = http.createServer((req, res) => {
  // 这里不需要CORS头部，因为我们现在使用同一个服务器
  
  // 处理 OPTIONS 请求
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }
  
  // 解析 URL
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
  // 处理根路径请求，返回 HTML 文件
  if (pathname === '/' || pathname === '/index.html') {
    fs.readFile(path.join(__dirname, 'standalone.html'), (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end('Internal Server Error');
        return;
      }
      res.setHeader('Content-Type', 'text/html');
      res.statusCode = 200;
      res.end(data);
    });
    return;
  }
  
  // 处理 /api/data 请求
  if (pathname === '/wageRecord/page' && req.method === 'GET') {
    console.log('查询参数:', parsedUrl.query);
    handleWageRecordRequest(req, res);
    return;
  }
  
  // 处理 POST 请求
  if (pathname === '/wageRecord/page' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const postData = JSON.parse(body);
        console.log('提交数据:', postData);
        handleWageRecordPostRequest(postData, res);
      } catch (error) {
        res.statusCode = 400;
        res.end(JSON.stringify({ code: 400, message: 'Invalid JSON' }));
      }
    });
    return;
  }
  
  // 处理 /api/data 请求
  if (pathname === '/api/data' && req.method === 'GET') {
    console.log('查询参数:', parsedUrl.query);
    
    // 过滤数据
    let filteredItems = [...mockData.records];
    const query = parsedUrl.query;
    
    // 根据查询参数过滤数据
    if (query.keyWords) {
      const keyWords = query.keyWords.toLowerCase();
      filteredItems = filteredItems.filter(item => 
        item.projectName.toLowerCase().includes(keyWords) || 
        item.organizationName.toLowerCase().includes(keyWords)
      );
    }
    
    if (query.recordStatus && query.recordStatus !== '') {
      filteredItems = filteredItems.filter(item => item.recordStatus === query.recordStatus);
    }
    
    if (query.payStatus && query.payStatus !== '') {
      filteredItems = filteredItems.filter(item => item.payStatus === query.payStatus);
    }
    
    if (query.designUnit && query.designUnit !== '') {
      filteredItems = filteredItems.filter(item => item.designUnit === query.designUnit);
    }
    
    if (query.bankName && query.bankName !== '') {
      filteredItems = filteredItems.filter(item => item.bankName === query.bankName);
    }
    
    if (query.productType && query.productType !== '') {
      filteredItems = filteredItems.filter(item => item.productType === query.productType);
    }
    
    if (query.bankAccountType && query.bankAccountType !== '') {
      filteredItems = filteredItems.filter(item => item.bankAccountType === query.bankAccountType);
    }
    
    if (query.payType && query.payType !== '') {
      filteredItems = filteredItems.filter(item => item.payType === query.payType);
    }
    
    if (query.laborReviewStatus && query.laborReviewStatus !== '') {
      filteredItems = filteredItems.filter(item => item.laborReviewStatus === query.laborReviewStatus);
    }
    
    if (query.year && query.year !== '') {
      filteredItems = filteredItems.filter(item => item.year === query.year);
    }
    
    if (query.month && query.month !== '') {
      filteredItems = filteredItems.filter(item => item.month === query.month);
    }
    
    if (query.exchangeStatus && query.exchangeStatus !== '' && query.exchangeStatus !== '-1') {
      const exchangeStatus = parseInt(query.exchangeStatus);
      filteredItems = filteredItems.filter(item => item.exchangeStatus === exchangeStatus);
    }
    
    // 分页处理
    const page = parseInt(query.page) || 1;
    const size = parseInt(query.size) || 10;
    const start = (page - 1) * size;
    const end = start + size;
    const paginatedItems = filteredItems.slice(start, end);
    
    // 返回结果
    const responseData = {
      code: 200,
      message: "success",
      data: {
        records: paginatedItems,
        total: filteredItems.length,
        size: size,
        current: page,
        searchCount: true,
        pages: Math.ceil(filteredItems.length / size)
      }
    };
    
    // 检查是否是JSONP请求
    const callback = query.callback;
    if (callback) {
      // JSONP响应
      res.setHeader('Content-Type', 'application/javascript');
      res.statusCode = 200;
      res.end(`${callback}(${JSON.stringify(responseData)})`);
    } else {
      // 普通JSON响应
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify(responseData));
    }
  } else {
    // 处理其他请求
    res.statusCode = 404;
    res.end('Not Found');
  }
});

// 启动服务器
server.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});
