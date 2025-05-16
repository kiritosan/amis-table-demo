(function() {
    // 获取 amis 渲染器
    let amis = amisRequire;
    
    // 模拟数据
    const mockData = {
        items: [
            { id: 1, projectName: '钢铁煤三期工业', organizationName: '材料组织2', completionDate: '2023-04', status: '配方', approvalStatus: '/', designerCount: 0, builderCount: 0, reviewerCount: 3, designUnit: '西南设计', approvalUnit: '分包单位', operation: '查看 打印' },
            { id: 2, projectName: '钢铁煤三期工业', organizationName: '材料组织材料组织2', completionDate: '2024-01', status: '已提交', approvalStatus: '未审批', designerCount: 6720, builderCount: 0, reviewerCount: 2, designUnit: '西南设计', approvalUnit: '总包单位', operation: '查看' },
            { id: 3, projectName: '钢铁煤二期工业', organizationName: '材料组织材料组织', completionDate: '2024-01', status: '已提交', approvalStatus: '未审批', designerCount: 0, builderCount: 0, reviewerCount: 1, designUnit: '西南设计', approvalUnit: '总包单位', operation: '查看' },
            { id: 4, projectName: '钢铁煤三期工业', organizationName: '材料组织2', completionDate: '2023-01', status: '审核通过', approvalStatus: '已审批', designerCount: 0, builderCount: 0, reviewerCount: 2, designUnit: '西南设计', approvalUnit: '分包单位', operation: '查看 打印' },
            { id: 5, projectName: '钢铁煤三期工业', organizationName: '材料组织材料组织2', completionDate: '2023-09', status: '配方', approvalStatus: '/', designerCount: 0, builderCount: 0, reviewerCount: 5, designUnit: '西南设计', approvalUnit: '总包单位', operation: '查看 打印' },
            { id: 6, projectName: '钢铁煤三期工业', organizationName: '材料组织材料组织2', completionDate: '2023-01', status: '已提交', approvalStatus: '未审批', designerCount: 590, builderCount: 0, reviewerCount: 7, designUnit: '西南设计', approvalUnit: '总包单位', operation: '查看' },
            { id: 7, projectName: '钢铁煤二期工业', organizationName: '材料组织材料组织', completionDate: '2023-01', status: '审核通过', approvalStatus: '已审批', designerCount: 0, builderCount: 0, reviewerCount: 5, designUnit: '西南设计', approvalUnit: '总包单位', operation: '查看 打印' },
            { id: 8, projectName: '钢铁煤三期工业', organizationName: '材料组织材料组织2', completionDate: '2023-03', status: '审核通过', approvalStatus: '已审批', designerCount: 0, builderCount: 0, reviewerCount: 5, designUnit: '西南设计', approvalUnit: '分包单位', operation: '查看 打印' },
            { id: 9, projectName: '钢铁煤三期工业', organizationName: '材料组织材料组织2', completionDate: '2023-03', status: '审核通过', approvalStatus: '未通过', designerCount: 0, builderCount: 0, reviewerCount: 5, designUnit: '西南设计', approvalUnit: '分包单位', operation: '查看' },
            { id: 10, projectName: '钢铁煤三期工业', organizationName: '材料组织2', completionDate: '2023-01', status: '配方', approvalStatus: '/', designerCount: 0, builderCount: 0, reviewerCount: 1, designUnit: '西南设计', approvalUnit: '总包单位', operation: '查看 打印' }
        ],
        total: 10
    };

    // 定义页面配置
    const schema = {
        type: 'page',
        title: '',
        body: [
            {
                type: 'form',
                title: '',
                mode: 'inline',
                wrapWithPanel: false,
                className: 'mb-3',
                body: [
                    {
                        type: 'input-text',
                        name: 'keywords',
                        placeholder: '关键字',
                        size: 'sm',
                        className: 'w-auto'
                    },
                    {
                        type: 'select',
                        name: 'projectType',
                        placeholder: '项目分类',
                        size: 'sm',
                        className: 'w-auto',
                        options: [
                            { label: '全部', value: '' },
                            { label: '项目1', value: '1' },
                            { label: '项目2', value: '2' }
                        ]
                    },
                    {
                        type: 'select',
                        name: 'completionStatus',
                        placeholder: '完成状态',
                        size: 'sm',
                        className: 'w-auto',
                        options: [
                            { label: '全部', value: '' },
                            { label: '配方', value: '配方' },
                            { label: '已提交', value: '已提交' },
                            { label: '审核通过', value: '审核通过' }
                        ]
                    },
                    {
                        type: 'select',
                        name: 'approvalStatus',
                        placeholder: '审批状态',
                        size: 'sm',
                        className: 'w-auto',
                        options: [
                            { label: '全部', value: '' },
                            { label: '未审批', value: '未审批' },
                            { label: '已审批', value: '已审批' },
                            { label: '未通过', value: '未通过' },
                            { label: '/', value: '/' }
                        ]
                    },
                    {
                        type: 'select',
                        name: 'designUnit',
                        placeholder: '设计单位',
                        size: 'sm',
                        className: 'w-auto',
                        options: [
                            { label: '全部', value: '' },
                            { label: '西南设计', value: '西南设计' }
                        ]
                    },
                    {
                        type: 'select',
                        name: 'approvalUnit',
                        placeholder: '审批单位',
                        size: 'sm',
                        className: 'w-auto',
                        options: [
                            { label: '全部', value: '' },
                            { label: '总包单位', value: '总包单位' },
                            { label: '分包单位', value: '分包单位' }
                        ]
                    },
                    {
                        type: 'select',
                        name: 'environment',
                        placeholder: '环境方式',
                        size: 'sm',
                        className: 'w-auto',
                        options: [
                            { label: '全部', value: '' },
                            { label: '环境1', value: '1' },
                            { label: '环境2', value: '2' }
                        ]
                    },
                    {
                        type: 'select',
                        name: 'humanResource',
                        placeholder: '人员配置方式',
                        size: 'sm',
                        className: 'w-auto',
                        options: [
                            { label: '全部', value: '' },
                            { label: '配置1', value: '1' },
                            { label: '配置2', value: '2' }
                        ]
                    }
                ],
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
            },
            {
                type: 'crud',
                syncLocation: false,
                className: 'mt-2',
                data: mockData,
                headerToolbar: [],
                footerToolbar: [
                    {
                        type: 'pagination',
                        layout: ['perPage', 'pager', 'total'],
                        perPageAvailable: [10, 20, 50, 100],
                        showPerPage: true,
                        perPage: 10
                    }
                ],
                columns: [
                    {
                        name: 'id',
                        label: '序号',
                        width: 50
                    },
                    {
                        name: 'projectName',
                        label: '项目名称',
                        width: 150
                    },
                    {
                        name: 'organizationName',
                        label: '组织名称',
                        width: 150
                    },
                    {
                        name: 'completionDate',
                        label: '完成日期',
                        width: 100
                    },
                    {
                        name: 'status',
                        label: '完成状态',
                        width: 100,
                        type: 'mapping',
                        map: {
                            '配方': '<span class="label label-info">配方</span>',
                            '已提交': '<span class="label label-success">已提交</span>',
                            '审核通过': '<span class="label label-warning">审核通过</span>'
                        }
                    },
                    {
                        name: 'approvalStatus',
                        label: '审批状态',
                        width: 100,
                        type: 'mapping',
                        map: {
                            '/': '<span>/</span>',
                            '未审批': '<span class="label label-default">未审批</span>',
                            '已审批': '<span class="label label-success">已审批</span>',
                            '未通过': '<span class="label label-danger">未通过</span>'
                        }
                    },
                    {
                        name: 'designerCount',
                        label: '设计工程',
                        width: 80
                    },
                    {
                        name: 'builderCount',
                        label: '施工工程',
                        width: 80
                    },
                    {
                        name: 'reviewerCount',
                        label: '审核人数',
                        width: 80
                    },
                    {
                        name: 'designUnit',
                        label: '设计单位',
                        width: 100
                    },
                    {
                        name: 'approvalUnit',
                        label: '审批单位',
                        width: 100
                    },
                    {
                        type: 'operation',
                        label: '操作',
                        width: 100,
                        buttons: [
                            {
                                type: 'button',
                                label: '查看',
                                level: 'link',
                                actionType: 'dialog',
                                dialog: {
                                    title: '查看详情',
                                    body: {
                                        type: 'form',
                                        body: [
                                            {
                                                type: 'static',
                                                name: 'id',
                                                label: 'ID'
                                            },
                                            {
                                                type: 'static',
                                                name: 'projectName',
                                                label: '项目名称'
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                type: 'button',
                                label: '打印',
                                level: 'link',
                                visibleOn: "${operation.indexOf('打印') > -1}",
                                actionType: 'dialog',
                                dialog: {
                                    title: '打印',
                                    body: {
                                        type: 'tpl',
                                        tpl: '打印功能'
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    };

    // 渲染页面
    const app = amis.embed('#root', schema, {
        data: mockData
    });
})();
