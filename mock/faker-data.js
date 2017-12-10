module.exports = function () {
 var faker = require("faker");
 faker.locale = "zh_CN";
 var _ = require("lodash");
 return {
     doLogin: {
       ver: 0,
       ret: true,
       err: {
         code: undefined,
         msg: undefined,
         detail: undefined
       },
       total: -2,
       data: {
         userNo: faker.random.words(1),
         pwd: faker.random.uuid()
       }
     },
     passportList: {
        ver: 0,
        ret: true,
        err: {
            code: undefined,
            msg: undefined,
            detail: undefined
        },
        total: faker.random.number({min:0, max:1000000}),
        data: _.times(10, function (n) {
                return {
                    id: faker.random.uuid(),
                    userNo: faker.random.words(1),
                    name: faker.random.words(5),
                    sex: {
                        value: faker.random.arrayElement([1,2])
                    },
                    mobile: faker.random.words(1),
                    qq: faker.random.words(1),
                    wechat: faker.random.words(1),
                    loginCtrl: {
                        value: faker.random.arrayElement([1,2])
                    },
                    validDate: {
                        validDateStart: undefined,
                        validDateEnd: undefined
                    },
                    remark: faker.random.words(2),
                    lastLogin: undefined,
                    status: {
                        value: faker.random.arrayElement([1,2,3,4])
                    },
                }
            })
     },
     userList: {
        ver: 0,
        ret: true,
        err: {
            code: undefined,
            msg: undefined,
            detail: undefined
        },
        total: faker.random.number({min:0, max:1000000}),
        data: _.times(10, function (n) {
                return {
                    id: faker.random.uuid(),
                    orgCode: faker.random.words(1),
                    userNo: faker.random.words(1),
                    name: faker.random.words(5),
                    sex: {
                        value: faker.random.arrayElement([1,2])
                    },
                    mobile: faker.random.words(1),
                    qq: faker.random.words(1),
                    wechat: faker.random.words(1),
                    passportRelated: {
                        value: faker.random.arrayElement([1,2])
                    },
                    loginCtrl: {
                        value: faker.random.arrayElement([1,2])
                    },
                    validDate: {
                        validDateStart: undefined,
                        validDateEnd: undefined
                    },
                    remark: faker.random.words(2),
                    lastLogin: undefined,
                    status: {
                        value: faker.random.arrayElement([1,2,3,4])
                    },
                }
            })
     },
     assignedDivisionList: {
        ver: 0,
        ret: true,
        err: {
            code: undefined,
            msg: undefined,
            detail: undefined
        },
        total: faker.random.number({min:0, max:1000000}),
        data: _.times(10, function (n) {
                return {
                    id: faker.random.uuid(),
                    departmentType: {
                        value: faker.random.arrayElement([1,2,3,4,5,6,7])
                    },
                    code: faker.random.words(1),
                    name: faker.random.words(5),
                    shortName: faker.random.words(2)
                }
            })
     },
     assignedOrgList: {
        ver: 0,
        ret: true,
        err: {
            code: undefined,
            msg: undefined,
            detail: undefined
        },
        total: faker.random.number({min:0, max:1000000}),
        data: _.times(10, function (n) {
                return {
                    id: faker.random.uuid(),
                    code: faker.random.words(1),
                    name: faker.random.words(5),
                    shortName: faker.random.words(2)
                }
            })
     },
     assignedOrgGroupList: {
        ver: 0,
        ret: true,
        err: {
            code: undefined,
            msg: undefined,
            detail: undefined
        },
        total: faker.random.number({min:0, max:1000000}),
        data: _.times(10, function (n) {
                return {
                    id: faker.random.uuid(),
                    name: faker.random.words(3)
                }
            })
     },
     orgGroupList: {
        ver: 0,
        ret: true,
        err: {
            code: undefined,
            msg: undefined,
            detail: undefined
        },
        total: faker.random.number({min:0, max:1000000}),
        data: _.times(15, function (n) {
                return {
                    id: faker.random.uuid(),
                    name: faker.random.words(3),
                    status: {
                        value: faker.random.arrayElement([1,2,3,4])
                    },
                    remark: faker.random.words(5)
                }
            })
    },
    orgList: {
        ver: 0,
        ret: true,
        err: {
            code: undefined,
            msg: undefined,
            detail: undefined
        },
        total: faker.random.number({min:0, max:1000000}),
        data: _.times(15, function (n) {
                return {
                    id: faker.random.uuid(),
                    code: faker.random.words(1),
                    name: faker.random.words(5),
                    shortName: faker.random.words(2),
                    status: {
                        value: faker.random.arrayElement([1,2,3,4])
                    },
                    remark: faker.random.words(2),
                }
            })
    },
    divisionList: {
        ver: 0,
        ret: true,
        err: {
            code: undefined,
            msg: undefined,
            detail: undefined
        },
        total: faker.random.number({min:0, max:1000000}),
        data: _.times(15, function (n) {
                return {
                    id: faker.random.uuid(),
                    code: faker.random.words(1),
                    name: faker.random.words(5),
                    shortName: faker.random.words(2),
                    status: {
                        value: faker.random.arrayElement([1,2,3,4])
                    },
                    remark: faker.random.words(2),
                }
            })
    },
    funcList: {
        ver: 0,
        ret: true,
        err: {
            code: undefined,
            msg: undefined,
            detail: undefined
        },
        total: faker.random.number({min:0, max:1000000}),
        data: _.times(faker.random.number({min:10, max:100}), function (n) {
                    return {
                        id: faker.random.uuid(),
                        code: faker.random.words(2),
                        name: faker.random.words(2),
                        checkCtrl: {
                            yesNo: {
                                value: faker.random.arrayElement([1,2])
                            }
                        },
                        status: {
                            value: faker.random.arrayElement([1,2,3,4])
                        },
                        funcGroupList:_.times(faker.random.number({min:1, max:3}), function (n) {
                            return {
                                id: faker.random.uuid(),
                                name: faker.random.words(2)
                            }
                        }),
                        remark: faker.random.words(5)
                    }
                })
    },
    funcGroupList: {
        ver: 0,
        ret: true,
        err: {
            code: undefined,
            msg: undefined,
            detail: undefined
        },
        total: faker.random.number({min:0, max:1000000}),
        data: _.times(faker.random.number({min:10, max:100}), function (n) {
                    return {
                        id: faker.random.uuid(),
                        name: faker.random.words(2),
                        status: {
                            value: faker.random.arrayElement([1,2,3,4])
                        },
                        remark: faker.random.words(5)
                    }
                })
    },
    departmentList: {
        ver: 0,
        ret: true,
        err: {
            code: undefined,
            msg: undefined,
            detail: undefined
        },
        total: faker.random.number({min:0, max:1000000}),
        data: _.times(faker.random.number({min:10, max:20}), function (n) {
                    return {
                        id: faker.random.uuid(),
                        name: faker.random.words(2),
                        departmentType: {
                            value: faker.random.arrayElement([1,2,3,4,5,6,7])
                        },
                        businessType: {
                            value: faker.random.arrayElement([1,2,3])
                        },
                        status: {
                            value: faker.random.arrayElement([1,2,3,4])
                        },
                        remark: faker.random.words(5)
                    }
                })
    },
    departmentTreeData: {
        ver: 0,
        ret: true,
        err: {
            code: undefined,
            msg: undefined,
            detail: undefined
        },
        total: faker.random.number({min:0, max:1000000}),
        data: _.times(faker.random.number({min:10, max:20}), function (n) {
                    return {
                        id: faker.random.uuid(),
                        name: faker.random.words(2),
                        children: _.times(faker.random.number({min:3, max:10}), function (n) {
                            return {
                                id: faker.random.uuid(),
                                name: faker.random.words(2),
                            }
                        })
                    }
                })
    },
    funcGroupTreeData: {
        ver: 0,
        ret: true,
        err: {
            code: undefined,
            msg: undefined,
            detail: undefined
        },
        total: faker.random.number({min:0, max:1000000}),
        data: _.times(faker.random.number({min:10, max:20}), function (n) {
                    return {
                        id: faker.random.uuid(),
                        name: faker.random.words(2),
                        remark: faker.random.words(5),
                        children: _.times(faker.random.number({min:3, max:10}), function (n) {
                            return {
                                id: faker.random.uuid(),
                                name: faker.random.words(2),
                                remark: faker.random.words(5),
                            }
                        })
                    }
                })
    },
    divisionTree: {
        ver: 0,
        ret: true,
        err: {
            code: undefined,
            msg: undefined,
            detail: undefined
        },
        total: faker.random.number({min:0, max:1000000}),
        data: [{
                id: faker.random.uuid(),
                departmentType: {
                    value: 1
                },
                code: '',
                name: '平台',
                shortName: '平台',
                children: _.times(15, function (n) {
                    return {
                        id: faker.random.uuid(),
                        departmentType: {
                            value: 2
                        },
                        code: faker.random.words(1),
                        name: faker.random.words(5),
                        shortName: faker.random.words(2),
                        children: _.times(15, function (n) {
                            return {
                                id: faker.random.uuid(),
                                departmentType: {
                                    value: 3
                                },
                                code: faker.random.words(1),
                                name: faker.random.words(5),
                                shortName: faker.random.words(2)
                            }
                        })
                    }
                })
            }]
    },
    rowCtrlPolicyList: {
        ver: 0,
        ret: true,
        err: {
            code: undefined,
            msg: undefined,
            detail: undefined
        },
        total: faker.random.number({min:0, max:1000000}),
        data: _.times(faker.random.number({min:1, max:50}), function (n) {
                return {
                    id: faker.random.uuid(),
                    clazzStoreId: faker.random.uuid(),
                    clazzStoreName: faker.random.words(1),
                    name: faker.random.words(3),
                    penetrateDivision: {
                        yesNo: {
                            value: faker.random.arrayElement([1,2])
                        }
                    },
                    penetrateDepartment: {
                        yesNo: {
                            value: faker.random.arrayElement([1,2])
                        }
                    },
                    status: {
                        value: faker.random.arrayElement([1,2,3,4])
                    },
                    remark: faker.random.words(5)
                }
            })
    },
    policyManagementList: {
        ver: 0,
        ret: true,
        err: {
            code: undefined,
            msg: undefined,
            detail: undefined
        },
        total: faker.random.number({min:0, max:1000000}),
        data: _.times(50, function (n) {
                return {
                    id: faker.random.uuid(),
                    type: faker.random.words(1),
                    name: faker.random.words(3),
                    clazzName: faker.random.words(3),
                    templateKey: faker.random.words(3),
                    loadable: {
                        yesNo: {
                            value: faker.random.arrayElement([1,2])
                        }
                    },
                    remark: faker.random.words(5),
                    status: {
                        value: faker.random.arrayElement([1,2,3,4])
                    },
                    privatelyOwned: {
                        yesNo: {
                            value: faker.random.arrayElement([1,2])
                        }
                    }
                }
            })
    },
    platformCtrlParamManagementList: {
        ver: 0,
        ret: true,
        err: {
            code: undefined,
            msg: undefined,
            detail: undefined
        },
        total: faker.random.number({min:0, max:1000000}),
        data: _.times(50, function (n) {
                return {
                    id: faker.random.uuid(),
                    code: faker.random.words(5),
                    name: faker.random.words(3),
                    value: faker.random.words(2),
                    remark: faker.random.words(5),
                    status: {
                        value: faker.random.arrayElement([1,2,3,4])
                    }
                }
            })
    },
    orgCtrlParamManagementList: {
        ver: 0,
        ret: true,
        err: {
            code: undefined,
            msg: undefined,
            detail: undefined
        },
        total: faker.random.number({min:0, max:1000000}),
        data: _.times(50, function (n) {
                return {
                    id: faker.random.uuid(),
                    code: faker.random.words(5),
                    name: faker.random.words(3),
                    ctrlParamType: {
                        value: faker.random.arrayElement([1,2])
                    },
                    remark: faker.random.words(5),
                    status: {
                        value: faker.random.arrayElement([1,2,3,4])
                    }
                }
            })
    },
    divisionCtrlParamManagementList: {
        ver: 0,
        ret: true,
        err: {
            code: undefined,
            msg: undefined,
            detail: undefined
        },
        total: faker.random.number({min:0, max:1000000}),
        data: _.times(50, function (n) {
                return {
                    id: faker.random.uuid(),
                    code: faker.random.words(5),
                    name: faker.random.words(3),
                    ctrlParamType: {
                        value: faker.random.arrayElement([1,2])
                    },
                    remark: faker.random.words(5),
                    status: {
                        value: faker.random.arrayElement([1,2,3,4])
                    }
                }
            })
    },
    platformCtrlParamSettingList: {
        ver: 0,
        ret: true,
        err: {
            code: undefined,
            msg: undefined,
            detail: undefined
        },
        total: faker.random.number({min:0, max:1000000}),
        data: _.times(50, function (n) {
                return {
                    id: faker.random.uuid(),
                    code: faker.random.words(5),
                    name: faker.random.words(3),
                    value: faker.random.words(2),
                    remark: faker.random.words(5)
                }
            })
    },
    platformToOrgCtrlParamSettingList: {
        ver: 0,
        ret: true,
        err: {
            code: undefined,
            msg: undefined,
            detail: undefined
        },
        total: faker.random.number({min:0, max:1000000}),
        data: _.times(50, function (n) {
                return {
                    id: faker.random.uuid(),
                    code: faker.random.words(5),
                    name: faker.random.words(3),
                    orgId: faker.random.uuid(),
                    orgName: faker.random.words(5),
                    orgShortName: faker.random.words(2),
                    ctrlParamType: {
                        value: faker.random.arrayElement([1,2])
                    },
                    value: faker.random.words(2),
                    remark: faker.random.words(5)
                }
            })
    },
    orgCtrlParamSettingList: {
        ver: 0,
        ret: true,
        err: {
            code: undefined,
            msg: undefined,
            detail: undefined
        },
        total: faker.random.number({min:0, max:1000000}),
        data: _.times(50, function (n) {
                return {
                    id: faker.random.uuid(),
                    code: faker.random.words(5),
                    name: faker.random.words(3),
                    shortName: faker.random.words(2),
                    value: faker.random.words(2),
                    remark: faker.random.words(5)
                }
            })
    },
    orgToDivisionCtrlParamSettingList: {
        ver: 0,
        ret: true,
        err: {
            code: undefined,
            msg: undefined,
            detail: undefined
        },
        total: faker.random.number({min:0, max:1000000}),
        data: _.times(50, function (n) {
                return {
                    id: faker.random.uuid(),
                    code: faker.random.words(5),
                    name: faker.random.words(3),
                    divisionId: faker.random.uuid(),
                    divisionName: faker.random.words(5),
                    divisionShortName: faker.random.words(2),
                    ctrlParamType: {
                        value: faker.random.arrayElement([1,2])
                    },
                    value: faker.random.words(2),
                    remark: faker.random.words(5)
                }
            })
    },
    divisionCtrlParamSettingList: {
        ver: 0,
        ret: true,
        err: {
            code: undefined,
            msg: undefined,
            detail: undefined
        },
        total: faker.random.number({min:0, max:1000000}),
        data: _.times(50, function (n) {
                return {
                    id: faker.random.uuid(),
                    code: faker.random.words(5),
                    name: faker.random.words(3),
                    shortName: faker.random.words(2),
                    ctrlParamType: {
                        value: faker.random.arrayElement([1,2])
                    },
                    value: faker.random.words(2),
                    remark: faker.random.words(5)
                }
            })
    },
    people: _.times(100, function (n) {
        return {
            id: n,
            name: faker.name.findName(),
            avatar: faker.internet.avatar()
        }
    }),
    address: _.times(100, function (n) {
        return {
            id: faker.random.uuid(),
            city: faker.address.city(),
            county: faker.address.county()
        }
    })
 }
}
