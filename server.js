const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const port = 3000;

// 简单的body-parser实现，用于解析JSON请求体
function parseBody(req, callback) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    try {
      if (body) {
        req.body = JSON.parse(body);
      } else {
        req.body = {};
      }
      callback();
    } catch (error) {
      console.error('Error parsing request body:', error);
      req.body = {};
      callback();
    }
  });
}

// 处理工资记录请求
function handleWageRecordRequest(req, res) {
  console.log('\n========================================');
  console.log('Handling wage record request:', req.method);
  
  let query = {};
  let page = 1;
  let size = 10;
  
  // 处理GET请求参数
  if (req.method === 'GET') {
    const parsedUrl = url.parse(req.url, true);
    query = parsedUrl.query;
    page = parseInt(query.page) || 1;
    size = parseInt(query.size) || 10;
    console.log('GET parameters:', query);
  } 
  // 处理POST请求参数
  else if (req.method === 'POST') {
    // 如果有请求体数据，使用请求体中的参数
    if (req.body) {
      console.log('POST request body:', JSON.stringify(req.body, null, 2));
      
      page = parseInt(req.body.page) || 1;
      size = parseInt(req.body.size) || 10;
      
      if (req.body.queryDTO) {
        query = req.body.queryDTO;
      }
    }
  }
  
  console.log('Processing with query:', JSON.stringify(query));
  console.log('Page:', page, 'Size:', size);
  
  // 过滤数据
  let filteredItems = [...mockData.records];
  console.log('Initial data count:', filteredItems.length);
  
  // 根据查询参数过滤数据
  if (query.keyWords) {
    const keyWords = query.keyWords.toLowerCase();
    console.log('Filtering by keywords:', keyWords);
    filteredItems = filteredItems.filter(item => 
      (item.companyName && item.companyName.toLowerCase().includes(keyWords)) || 
      (item.teamName && item.teamName.toLowerCase().includes(keyWords))
    );
  }

  // 年月过滤逻辑 - 只应用一次
  if (query.yearMonth && query.yearMonth !== '') {
    // 使用yearMonth参数进行筛选，格式为 YYYY-MM
    console.log('Filtering by yearMonth:', query.yearMonth);
    filteredItems = filteredItems.filter(item => item.month === query.yearMonth);
    console.log('After yearMonth filter:', filteredItems.length, 'items');
  } else if (query.year && query.month && query.year !== '' && query.month !== '') {
    // 兼容旧的年月分开的参数方式
    const yearMonth = `${query.year}-${query.month}`;
    console.log('Filtering by year+month:', yearMonth);
    filteredItems = filteredItems.filter(item => item.month === yearMonth);
    console.log('After year+month filter:', filteredItems.length, 'items');
  } else if (query.year && query.year !== '') {
    // 只有年份，筛选包含该年份的记录
    console.log('Filtering by year:', query.year);
    filteredItems = filteredItems.filter(item => item.month && item.month.startsWith(query.year));
    console.log('After year filter:', filteredItems.length, 'items');
  } else if (query.month && query.month !== '') {
    // 只有月份，筛选该月份的记录（不考虑年份）
    console.log('Filtering by month:', query.month);
    filteredItems = filteredItems.filter(item => item.month && item.month.endsWith(`-${query.month}`));
    console.log('After month filter:', filteredItems.length, 'items');
  }
  
  if (query.payStatus && query.payStatus !== '') {
    console.log('Filtering by payStatus:', query.payStatus);
    filteredItems = filteredItems.filter(item => item.payStatus === query.payStatus);
  }
  
  if (query.bankAccountType && query.bankAccountType !== '') {
    console.log('Filtering by bankAccountType:', query.bankAccountType);
    filteredItems = filteredItems.filter(item => item.bankAccountType === query.bankAccountType);
  }
  
  if (query.bankName && query.bankName !== '') {
    console.log('Filtering by bankName:', query.bankName);
    filteredItems = filteredItems.filter(item => item.bankName === query.bankName);
  }
  
  if (query.payType && query.payType !== '') {
    console.log('Filtering by payType:', query.payType);
    filteredItems = filteredItems.filter(item => item.payType === query.payType);
  }
  
  if (query.laborReviewStatus && query.laborReviewStatus !== '') {
    console.log('Filtering by laborReviewStatus:', query.laborReviewStatus);
    filteredItems = filteredItems.filter(item => item.laborReviewStatus === query.laborReviewStatus);
  }
  
  // 处理exchangeStatus参数，当值为-1或'-1'时不进行筛选
  if (query.exchangeStatus && query.exchangeStatus !== '') {
    const exchangeStatus = parseInt(query.exchangeStatus);
    console.log('Exchange status value:', exchangeStatus, 'Type:', typeof exchangeStatus);
    
    // 只有当exchangeStatus不等于-1时才进行筛选
    if (exchangeStatus !== -1) {
      console.log('Filtering by exchangeStatus:', exchangeStatus);
      filteredItems = filteredItems.filter(item => item.exchangeStatus === exchangeStatus);
    } else {
      console.log('Exchange status is -1, not filtering');
    }
  }
  
  // 打印过滤后的数据数量
  console.log('Final filtered items count:', filteredItems.length);
  
  // 分页处理
  const start = (page - 1) * size;
  const end = start + size;
  const paginatedItems = filteredItems.slice(start, end);
  console.log('Paginated items:', paginatedItems.length, 'items (page', page, 'size', size, ')');
  
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
  console.log('Response sent successfully');
  console.log('========================================\n');
}

// 我们已经将 POST 请求的处理逻辑统一到 handleWageRecordRequest 函数中

// 模拟数据
const mockData = {
  records: [
    {
      id: 1,
      companyName: '建筑公司A',
      teamName: '施工队1',
      groupName: '环保班组',
      month: '2024-01',
      recordStatus: '已提交',
      payStatus: '已发放',
      expectedSalary: 125000,
      actualSalary: 125000,
      employeeCount: 25,
      payType: '银行转账',
      bankAccountType: '对公',
      bankName: '建设银行',
      reportType: '手工填报',
      documentNumber: 'GZ202401001'
    },
    {
      id: 2,
      companyName: '建筑公司B',
      teamName: '施工队2',
      groupName: '水电班组',
      month: '2024-02',
      recordStatus: '已提交',
      payStatus: '已发放',
      expectedSalary: 98000,
      actualSalary: 98000,
      employeeCount: 18,
      payType: '银行转账',
      bankAccountType: '对公',
      bankName: '工商银行',
      reportType: '手工填报',
      documentNumber: 'GZ202402001'
    },
    {
      id: 3,
      companyName: '建筑公司C',
      teamName: '施工队3',
      groupName: '木工班组',
      month: '2024-03',
      recordStatus: '暂存',
      payStatus: '未发放',
      expectedSalary: 76000,
      actualSalary: 0,
      employeeCount: 15,
      payType: '银行转账',
      bankAccountType: '对公',
      bankName: '农业银行',
      reportType: '系统导入',
      documentNumber: 'GZ202403001'
    },
    {
      id: 4,
      companyName: '建筑公司D',
      teamName: '施工队4',
      groupName: '水泥班组',
      month: '2023-04',
      recordStatus: '已提交',
      payStatus: '发放失败',
      expectedSalary: 112000,
      actualSalary: 0,
      employeeCount: 22,
      payType: '银行转账',
      bankAccountType: '对公',
      bankName: '中国银行',
      reportType: '系统导入',
      documentNumber: 'GZ202304001'
    },
    {
      id: 5,
      companyName: '建筑公司E',
      teamName: '施工队5',
      groupName: '钢筋班组',
      month: '2023-05',
      recordStatus: '审核通过',
      payStatus: '已发放',
      expectedSalary: 135000,
      actualSalary: 135000,
      employeeCount: 27,
      payType: '现金',
      bankAccountType: '对私',
      bankName: '交通银行',
      reportType: '手工填报',
      documentNumber: 'GZ202305001'
    },
    {
      id: 6,
      companyName: '建筑公司F',
      teamName: '施工队6',
      groupName: '电器班组',
      month: '2025-01',
      recordStatus: '已提交',
      payStatus: '已发放',
      expectedSalary: 145000,
      actualSalary: 145000,
      employeeCount: 30,
      payType: '银行转账',
      bankAccountType: '对公',
      bankName: '建设银行',
      reportType: '手工填报',
      documentNumber: 'GZ202501001'
    },
    {
      id: 7,
      companyName: '建筑公司G',
      teamName: '施工队7',
      groupName: '浆工班组',
      month: '2025-02',
      recordStatus: '已提交',
      payStatus: '已发放',
      expectedSalary: 110000,
      actualSalary: 110000,
      employeeCount: 20,
      payType: '银行转账',
      bankAccountType: '对公',
      bankName: '工商银行',
      reportType: '系统导入',
      documentNumber: 'GZ202502001'
    }
  ],
  total: 7,
  size: 10,
  current: 1,
  searchCount: true,
  pages: 1
};

// 创建服务器
const server = http.createServer((req, res) => {
  // 设置跨域访问头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理OPTIONS请求（预检请求）
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // 处理工资记录API请求
  if (pathname === '/wageRecord/page') {
    // 如果是POST请求，先解析请求体
    if (req.method === 'POST') {
      parseBody(req, () => {
        handleWageRecordRequest(req, res);
      });
    } else {
      handleWageRecordRequest(req, res);
    }
    return;
  }

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
