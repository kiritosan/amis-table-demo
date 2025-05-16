# AMIS 前端框架使用指南

## 1. AMIS 简介

AMIS 是百度开源的一个低代码前端框架，它让前端开发变得简单高效。通过 JSON 配置的方式，即使是不懂前端的开发者也能轻松搭建出功能丰富的页面。AMIS 特别适合快速开发数据密集型的中后台页面。

### 核心特点

- **低代码开发**：通过 JSON 配置即可生成页面，无需编写大量 HTML/CSS/JS
- **丰富的组件**：内置 100+ 种常用组件，满足各类业务需求
- **灵活扩展**：支持自定义组件和扩展现有组件
- **响应式设计**：自适应不同屏幕尺寸
- **数据联动**：组件间数据联动简单直观

## 2. 快速入门

### 基础环境搭建

在 HTML 页面中引入 AMIS 所需的 CSS 和 JS 文件：

```html
<link rel="stylesheet" href="https://unpkg.com/amis@3.6.3/sdk/sdk.css" />
<link rel="stylesheet" href="https://unpkg.com/amis@3.6.3/sdk/helper.css" />
<link rel="stylesheet" href="https://unpkg.com/amis@3.6.3/sdk/iconfont.css" />

<script src="https://unpkg.com/amis@3.6.3/sdk/sdk.js"></script>
```

### 基本页面结构

```html
<div id="root"></div>
<script>
    const amis = amisRequire('amis/embed');
    const schema = {
        type: 'page',
        title: '我的第一个AMIS页面',
        body: {
            type: 'tpl',
            tpl: '你好，AMIS!'
        }
    };
    
    amis.embed('#root', schema);
</script>
```

## 3. 实战案例：工资记录管理系统

下面我们以一个工资记录管理系统为例，展示 AMIS 在实际业务中的应用。这个系统包含了筛选表单、数据表格、分页等常用功能。

### 3.1 整体页面结构

```javascript
const schema = {
    type: 'page',
    title: '',
    body: [
        // 筛选表单
        {
            type: 'form',
            mode: 'inline',
            // ...
        },
        // 数据表格
        {
            type: 'crud',
            // ...
        }
    ]
};
```

### 3.2 筛选表单实现

筛选表单使用 AMIS 的 `form` 组件，配置为内联模式，并设置提交目标为数据表格：

```javascript
{
    type: 'form',
    title: '',
    mode: 'inline',
    wrapWithPanel: false,
    className: 'mb-3',
    submitOnChange: true,  // 表单值变化时自动提交
    target: 'table1',      // 指定提交目标为ID为table1的组件
    body: [
        // 关键字搜索框
        {
            type: 'input-text',
            name: 'keywords',
            placeholder: '关键字',
            size: 'sm',
            className: 'w-auto'
        },
        
        // 使用flex布局组织多个筛选项
        {
            type: 'flex',
            justify: 'start',
            items: [
                // 年月选择器
                {
                    type: 'tpl',
                    tpl: '发放月份',
                    className: 'text-sm mr-1'
                },
                {
                    type: 'input-month',  // 年月选择器
                    name: 'yearMonth',
                    placeholder: '选择年月',
                    format: 'YYYY-MM',    // 格式化为YYYY-MM格式
                    value: '',
                    clearable: true,
                    size: 'sm',
                    className: 'w-auto mr-2'
                },
                
                // 下拉选择框
                {
                    type: 'tpl',
                    tpl: '单据状态',
                    className: 'text-sm mr-1'
                },
                {
                    type: 'select',
                    name: 'recordStatus',
                    size: 'sm',
                    className: 'w-auto mr-2',
                    options: [
                        { label: '全部', value: '' },
                        { label: '暂存', value: '暂存' },
                        { label: '已提交', value: '已提交' },
                        { label: '审核通过', value: '审核通过' }
                    ]
                }
                // ... 其他筛选项
            ]
        }
    ],
    // 表单操作按钮
    actions: [
        {
            type: 'reset',
            label: '重置',
            size: 'sm'
        },
        {
            type: 'submit',
            label: '搜索',
            level: 'primary',
            size: 'sm'
        }
    ]
}
```

### 3.3 数据表格实现

数据表格使用 AMIS 的 `crud` 组件，配置 API 接口、数据适配器、分页和列定义：

```javascript
{
    type: 'crud',
    syncLocation: false,
    className: 'mt-2',
    id: 'table1',  // 与表单的target对应
    api: {
        method: 'post',
        url: '/wageRecord/page',
        data: {
            page: '${page}',
            size: '${perPage}',
            queryDTO: {
                keyWords: '${keywords}',
                recordStatus: '${recordStatus}',
                payStatus: '${payStatus}',
                yearMonth: '${yearMonth}',
                // ... 其他查询参数
            }
        },
        // 数据适配器，处理API返回的数据
        adaptor: function (payload) {
            try {
                if (typeof payload === 'string') {
                    payload = JSON.parse(payload);
                }
                
                if (!payload || !payload.data) {
                    return { status: 0, msg: '', data: { items: [], total: 0 } };
                }
                
                return {
                    status: 0,
                    msg: '',
                    data: {
                        items: payload.data.records,
                        total: payload.data.total
                    }
                };
            } catch (error) {
                console.error('Error processing API response:', error);
                return { status: 0, msg: '', data: { items: [], total: 0 } };
            }
        },
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json, text/plain, */*'
        }
    },
    // 分页配置
    footerToolbar: [
        {
            type: 'pagination',
            layout: ['perPage', 'pager', 'total'],
            perPageAvailable: [10, 20, 50, 100],
            showPerPage: true,
            perPage: 10
        }
    ],
    // 列定义
    columns: [
        {
            name: 'id',
            label: '序号',
            width: 50
        },
        {
            name: 'companyName',
            label: '企业名字',
            width: 150
        },
        // 使用模板渲染带样式的状态标签
        {
            name: 'recordStatus',
            label: '单据状态',
            width: 100,
            type: 'tpl',
            tpl: "<% if (data.recordStatus === '暂存') { %>\n<span class=\"label label-info\">暂存</span>\n<% } else if (data.recordStatus === '已提交') { %>\n<span class=\"label label-primary\" style=\"background-color: #dbe2fb; color: #6678b1;\">已提交</span>\n<% } else if (data.recordStatus === '审核通过') { %>\n<span class=\"label label-success\" style=\"background-color: #d8f5e3; color: #52c41a;\">审核通过</span>\n<% } %>"
        }
        // ... 其他列定义
    ]
}
```

## 4. 最佳实践与技巧

### 4.1 表单与表格联动

- 使用 `submitOnChange: true` 实现表单值变化时自动触发查询
- 通过 `target: 'componentId'` 指定表单提交的目标组件

### 4.2 数据适配器

数据适配器（adaptor）是处理 API 返回数据的关键，可以将各种格式的后端数据转换为 AMIS 所需的标准格式：

```javascript
adaptor: function (payload) {
    // 处理字符串格式的响应
    if (typeof payload === 'string') {
        payload = JSON.parse(payload);
    }
    
    // 转换为AMIS标准格式
    return {
        status: 0,  // 0表示成功
        msg: '',    // 错误消息
        data: {
            items: payload.data.records,  // 数据项数组
            total: payload.data.total     // 总记录数
        }
    };
}
```

### 4.3 条件渲染与样式定制

使用模板（tpl）组件可以根据数据条件渲染不同的内容和样式：

```javascript
{
    name: 'payStatus',
    label: '发放状态',
    type: 'tpl',
    tpl: "<% if (data.payStatus === '未发放') { %>\n<span class=\"label label-warning\">未发放</span>\n<% } else if (data.payStatus === '已发放') { %>\n<span class=\"label label-success\">已发放</span>\n<% } %>"
}
```

### 4.4 默认值与参数处理

使用表达式可以设置默认值或处理参数：

```javascript
exchangeStatus: '${exchangeStatus|default:-1}'  // 如果未指定，默认值为-1
```

## 5. 与后端集成

### 5.1 API 配置

AMIS 可以通过配置与任何 RESTful API 集成：

```javascript
api: {
    method: 'post',  // 请求方法
    url: '/api/data',  // API地址
    data: {  // 请求参数
        page: '${page}',
        size: '${perPage}',
        // 其他参数
    },
    headers: {  // 请求头
        'Content-Type': 'application/json'
    }
}
```

### 5.2 处理不同的响应格式

通过适配器处理各种后端响应格式：

```javascript
adaptor: function (payload) {
    // 自定义处理逻辑
    return {
        status: payload.code === 200 ? 0 : payload.code,
        msg: payload.message || '',
        data: {
            items: payload.data.records || [],
            total: payload.data.total || 0
        }
    };
}
```

## 6. 常见问题与解决方案

### 6.1 数据不显示问题

如果表格没有显示数据，可能的原因和解决方案：

1. **检查 API 响应格式**：确保适配器正确转换数据格式
2. **查看控制台错误**：添加 `console.log` 调试 API 响应
3. **检查筛选条件**：某些筛选条件可能过滤掉所有数据
4. **默认值处理**：为关键参数设置合理的默认值

### 6.2 表单提交问题

如果表单提交不生效：

1. 确保正确设置了 `target` 属性
2. 检查 `submitOnChange` 是否按需配置
3. 验证表单字段名与 API 参数名是否匹配

## 7. 总结

AMIS 是一个强大的低代码前端框架，特别适合快速开发数据管理类应用。通过本文的工资记录管理系统案例，我们展示了 AMIS 的核心功能和使用方法：

1. 通过 JSON 配置构建复杂页面
2. 实现表单与表格的数据联动
3. 与后端 API 集成并处理数据
4. 自定义样式和条件渲染

掌握这些核心概念和技巧，您就能使用 AMIS 高效开发出功能丰富、交互友好的企业级应用。

## 参考资源

- [AMIS 官方文档](https://aisuda.bce.baidu.com/amis/zh-CN/docs/index)
- [AMIS GitHub 仓库](https://github.com/baidu/amis)
- [AMIS 示例集合](https://aisuda.bce.baidu.com/amis/examples/index)
