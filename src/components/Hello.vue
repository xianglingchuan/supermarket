<template>
  <VGroup>
    <el-row class="breadcrumb_row">
      <el-col :span="24">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>XX管理</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <VSpacer height="5px"></VSpacer>
    <HGroup>
      <el-button type="primary" size="small" icon="plus" @click="openCreateRecordDialog">新&nbsp;建</el-button>
      <el-button type="primary" size="small" @click="doEnableBatch">启&nbsp;用</el-button>
      <el-button type="primary" size="small" @click="doDisableBatch">禁&nbsp;用</el-button>
      <el-button type="primary" size="small" @click="doArchiveBatch">封&nbsp;存</el-button>
      <el-button type="danger" size="small" icon="delete" @click="doDeleteBatch">删&nbsp;除</el-button>
      <HSpacer width="10px"></HSpacer>
      <el-dropdown trigger="click" @command="doUnArchiveBatch_handleCommand">
        <el-button type="primary" size="small">
          解封<i class="el-icon-caret-bottom el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="command_doUnArchiveToEnableBatch">解封到启用</el-dropdown-item>
          <el-dropdown-item command="command_doUnArchiveToDisableBatch">解封到禁用</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </HGroup>
    <AdvanceSearchBar :query="load" :queryLoading="viewCtrl.queryLoading">
      <SearchItem label="名称: ">
        <el-input v-model="queryParam.name" size="small" placeholder="请输入XX名称" class="input_query_param_name"></el-input>
      </SearchItem>
      <HSpacer width="20px"></HSpacer>
      <SearchItem label="状态: ">
        <el-select v-model="queryParam.statusList" size="small" clearable multiple placeholder="请选择">
          <el-option
            v-for="item in $vo.Status.statusList"
            :key="item.value"
            :label="item.label"
            :value="item">
          </el-option>
        </el-select>
      </SearchItem>
    </AdvanceSearchBar>

    <el-row class="table_row" ref="tableRow">
      <el-col :span="24" class="table_row_col" ref="tableRowCol">
        <el-table ref="mainTable" :data="mainDataList" border stripe highlight-current-row fit :max-height="viewCtrl.mainTabelMaxHeight"
          @selection-change="handleSelectionChange"
          >
          <el-table-column fixed prop="id" label="No." width="61" align="center">
            <template scope="scope">
              <span>{{scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column fixed type="selection" width="47"></el-table-column>
          <el-table-column sortable prop="name" label="名称" width="300" show-overflow-tooltip></el-table-column>
          <el-table-column sortable prop="status" label="状态" width="90" align="center" :formatter="$vo.Status.formatter"></el-table-column>
          <el-table-column prop="remark" label="备注" min-width="200" show-overflow-tooltip></el-table-column>
          <el-table-column fixed="right" label="操作" width="160">
            <template scope="scope">
              <el-button type="text" size="small" @click.native.prevent="openShowDialog(scope.$index)">
                查看
              </el-button>
              <el-button type="text" size="small" @click.native.prevent="openUpdateDialog(scope.$index)">
                修改
              </el-button>
              <el-dropdown trigger="click" @command="other_handleCommand">
                <el-button type="text" size="small">更多<i class="el-icon-caret-bottom el-icon--right"></i></el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="item in moreAction(scope.$index)" :key="item.actionCode" :command="item.command">{{item.actionName}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-row class="paging_row">
      <el-col :span="24" class="paging_row_col">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentPageChange"
          :current-page="currentPage"
          :page-sizes="pageSizes"
          :page-size="queryParam.limit"
          layout="prev, pager, next, sizes, jumper, total"
          :total="total">
        </el-pagination>
      </el-col>
    </el-row>

    <el-dialog title="新建XX" :visible.sync="viewCtrl.createRecordDialogVisible" 
        :close-on-click-modal="!viewCtrl.createRecordDialogCloseDisabled" 
        :close-on-press-escape="!viewCtrl.createRecordDialogCloseDisabled" 
        :show-close="!viewCtrl.createRecordDialogCloseDisabled">
      <el-form ref="createRecordForm" :model="createRecordUpdateParam" :rules="updateParamRules">
        <el-form-item prop="name" label="XX名称" :label-width="viewCtrl.createRecordDialogFormLabelWidth">
          <el-input v-model="createRecordUpdateParam.name" auto-complete="off" placeholder="请输入XX名称"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="viewCtrl.createRecordDialogFormLabelWidth">
          <el-input type="textarea" v-model="createRecordUpdateParam.remark" auto-complete="off" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeCreateRecordDialog" :disabled="viewCtrl.createRecordDialogCloseDisabled">取 消</el-button>
        <el-button type="primary" @click="createRecord" :loading="viewCtrl.createRecordLoading">保 存</el-button>
      </div>
    </el-dialog>

    <el-dialog v-if="currentOperatingRecord" title="查看XX" :visible.sync="viewCtrl.showRecordDialogVisible">
      <el-form>
        <el-form-item prop="name" label="名称" :label-width="viewCtrl.showRecordDialogFormLabelWidth">
          <span>{{currentOperatingRecord.name}}</span>
        </el-form-item>
        <el-form-item label="状态" :label-width="viewCtrl.showRecordDialogFormLabelWidth">
          <span>{{$vo.Status.statusMap[currentOperatingRecord.status.value].label}}</span>
        </el-form-item>
        <el-form-item label="备注" :label-width="viewCtrl.showRecordDialogFormLabelWidth">
        <span>{{currentOperatingRecord.remark}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeShowRecordDialog">关 闭</el-button>
      </div>
    </el-dialog>

    <el-dialog v-if="currentOperatingRecord" title="修改XX" :visible.sync="viewCtrl.updateRecordDialogVisible" 
        :close-on-click-modal="!viewCtrl.updateRecordDialogCloseDisabled" 
        :close-on-press-escape="!viewCtrl.updateRecordDialogCloseDisabled" 
        :show-close="!viewCtrl.updateRecordDialogCloseDisabled">
      <el-form ref="updateRecordForm" :model="updateRecordUpdateParam" :rules="updateParamRules">
        <el-form-item prop="name" label="名称" :label-width="viewCtrl.updateRecordDialogFormLabelWidth">
          <el-input v-model="updateRecordUpdateParam.name" auto-complete="off" placeholder="请输入XX名称"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="viewCtrl.updateRecordDialogFormLabelWidth">
          <el-input v-model="updateRecordUpdateParam.remark" type="textarea" :row="2" auto-complete="off" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeUpdateRecordDialog" :disabled="viewCtrl.updateRecordDialogCloseDisabled">取 消</el-button>
        <el-button type="primary" @click="updateRecord" :loading="viewCtrl.updateRecordLoading">保 存</el-button>
      </div>
    </el-dialog>

  </VGroup>
</template>

<script>
export default {
  name: 'hello',
  data () {
    let data = {
      pageSizes:[50, 100, 200, 400, 800],
      queryParam: {
        name: '',
        statusList: [],
        start: 0
      },
      createRecordUpdateParam: {
        name: '',
        remark: ''
      },
      updateRecordUpdateParam: {
        id: '',
        name: '',
        remark: ''
      },
      updateParamRules: {
        name: [{ 
          required: true, 
          message: '请输入XX名称', 
          trigger: 'blur' 
        }, { 
          min: 2, 
          max: 50, 
          message: '长度在 2 到 50 个字符', 
          trigger: 'blur' 
        }],
      },
      mainDataList: [],
      total: 0, 
      currentPage: 1,
      selections: [],
      currentOperatingRecord: undefined,
      viewCtrl: {
        moreActionDefList: [{
          visible: true,
          actionCode: 'command_doEnable',
          actionName: '启用',
          divided: false
        }, {
          visible: true,
          actionCode: 'command_doDisable',
          actionName: '禁用',
          divided: false
        }, {
          visible: true,
          actionCode: 'command_doArchive',
          actionName: '封存',
          divided: false
        }, {
          visible: true,
          actionCode: 'command_doUnArchiveToEnable',
          actionName: '解封到启用',
          divided: true
        }, {
          visible: true,
          actionCode: 'command_doUnArchiveToDisable',
          actionName: '解封到禁用',
          divided: false
        }, {
          visible: true,
          actionCode: 'command_doDelete',
          actionName: '删除',
          divided: true
        }],
        queryLoading: false, 
        mainTabelMaxHeight: 200,
        createRecordDialogVisible: false,
        createRecordLoading: false,
        createRecordDialogFormLabelWidth: '80px',
        createRecordDialogCloseDisabled: false, 
        showRecordDialogVisible: false,
        showRecordDialogFormLabelWidth: '100px',
        updateRecordDialogVisible: false,
        updateRecordLoading: false,
        updateRecordDialogFormLabelWidth: '80px',
        updateRecordDialogCloseDisabled: false,
      }
    }
    data.queryParam.limit = data.pageSizes[0];
    return data;
  },
  components: {
  },
  props: {
    
  },
  //实例初始化最之前，无法获取到data里的数据
  beforeCreate() {

  },
  created: function () {
    
  }, 
  //在挂载开始之前被调用
  beforeMount() {

  },
  //已成功挂载，相当ready()
  mounted() {
    const self = this
    
    // ================== 基于resize事件监听的实现方案(放到APP.vue去统一监听，这时里注册处理器) start ================================
    const tableRowColElement = self.$refs.tableRowCol.$el;
    const viewCtrl = self.viewCtrl;
    const mainTable = self.$refs.mainTable;
    const resize_handler = function () {
      if (viewCtrl.mainTabelMaxHeight !== tableRowColElement.clientHeight) {
        viewCtrl.mainTabelMaxHeight = tableRowColElement.clientHeight;
        setTimeout(mainTable.doLayout);
      }
    };
    self.$root.$children[0].viewCtrl.resizeHandlerMap['hello'] = resize_handler;
    setTimeout(resize_handler);
    // ================== 基于resize事件监听的实现方案(放到APP.vue去统一监听，这时里注册处理器) end ================================

    this.load();
  },
  beforeUpdate: function () {
    
  }, 
  updated: function () {
    
  }, 
  beforeDestroy: function () {
    
  },
  destroyed: function () {

  }, 
  computed: {

  },
  methods: {
    moreAction(index) {
      var arr = [];
      for (var i = 0; i < this.viewCtrl.moreActionDefList.length; i++) {
        let actionDef = this.viewCtrl.moreActionDefList[i];
        let actionObj = Object.assign({}, actionDef);
        let dataStatus = this.mainDataList[index].status;
        let joined = false;
        if (actionObj.actionCode === 'command_doEnable') {
          if (!dataStatus.isArchive() 
            && dataStatus.canChangeTo(this.$vo.Status.ENABLE)) {
            arr.push(actionObj);
            joined = true;
          }
        } else if (actionObj.actionCode === 'command_doDisable') {
          if (!dataStatus.isArchive() 
            && dataStatus.canChangeTo(this.$vo.Status.DISABLE)) {
            arr.push(actionObj);
            joined = true;
          }
        } else if (actionObj.actionCode === 'command_doArchive') {
          if (!dataStatus.isArchive() 
            && dataStatus.canChangeTo(this.$vo.Status.ARCHIVE)) {
            arr.push(actionObj);
            joined = true;
          }
        } else if (actionObj.actionCode === 'command_doUnArchiveToEnable') {
          if (dataStatus.isArchive() 
            && dataStatus.canChangeTo(this.$vo.Status.ENABLE)) {
            arr.push(actionObj);
            joined = true;
          }
        } else if (actionObj.actionCode === 'command_doUnArchiveToDisable') {
          if (dataStatus.isArchive() 
            && dataStatus.canChangeTo(this.$vo.Status.DISABLE)) {
            arr.push(actionObj);
            joined = true;
          }
        } else if (actionObj.actionCode === 'command_doDelete') {
          if (dataStatus.isDraft()) {
            arr.push(actionObj);
            joined = true;
          }
        } else {
          throw new Error('未支持的操作: ${actionObj.actionCode}');
        }
        if (joined) {
          actionObj.command = {
            action: actionObj.actionCode, 
            index: index
          }
        }
      }
      //处理分隔线
      if (arr.length > 0 && arr[0].divided) {
        arr[0].divided = false;
      }
      return arr;
    },
    handleSizeChange(val) {
      this.queryParam.limit = val;
      this.load();
    },
    handleCurrentPageChange(val) {
      this.queryParam.start = (this.currentPage - 1) * this.queryParam.limit;
      this.load();
    }, 
    filterTag(value, row) {
      return row.tag === value;
    },
    handleSelectionChange(selections) {
      this.selections = selections;
    }, 
    other_handleCommand(command) {
      if (command.action == 'command_doEnable') {
        this.doEnable(command.index);
      } else if (command.action == 'command_doDisable') {
        this.doDisable(command.index);
      } else if (command.action == 'command_doArchive') {
        this.doArchive(command.index);
      } else if (command.action == 'command_doUnArchiveToEnable') {
        this.doUnArchiveToEnable(command.index);
      } else if (command.action == 'command_doUnArchiveToDisable') {
        this.doUnArchiveToDisable(command.index);
      } else if (command.action == 'command_doDelete') {
        this.doDelete(command.index);
      } else {
        throw new Error(`未支持的指令: ${command.action}`);
      }
    }, 
    doUnArchiveBatch_handleCommand(command) {
      if (command === "command_doUnArchiveToEnableBatch") {
        this.doUnArchiveToEnableBatch();
      } else if (command === "command_doUnArchiveToDisableBatch") {
        this.doUnArchiveToDisableBatch();
      } else {
        throw new Error(`未支持的指令: ${command}`);
      }
    }, 
    doEnable(index) {
      var self = this;
      self.$ajax.load({url:`/mock/funcGroupList?token=aaa`}, {id:self.mainDataList[index].id}, function (result) {
        self.$message({
          type: 'success',
          message: '启用成功!'
        });
        self.load();
      }, function (result) {

      });
    },
    doEnableBatch() {
      if (!this.selections || this.selections.length == 0) {
        this.$alert('没有选择任何记录', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            //do nothing
          }
        });
        return;
      }
      var self = this;
      self.$confirm('此操作将启用选择的记录, 是否继续？', '批量启用记录？', {
        confirmButtonText: '批量启用记录',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        var selectionsArray = [];
        for (var i = self.selections.length - 1; i >= 0; i--) {
          selectionsArray.push(self.selections[i].id);
        }
        self.$ajax.load({url:`/mock/funcGroupList`}, {idList:selectionsArray}, function (result) {
          self.$message({
            type: 'success',
            message: '启用成功!'
          });
          self.load();
        }, function (result) {

        });
      }).catch(() => {
        // do nothing         
      });
    }, 
    doDisable(index) {
      var self = this;
      self.$ajax.load({url:`/mock/funcGroupList`}, {id:self.mainDataList[index].id}, function (result) {
        self.$message({
          type: 'success',
          message: '禁用成功!'
        });
        self.load();
      }, function (result) {

      });
    },
    doDisableBatch() {
      if (!this.selections || this.selections.length == 0) {
        this.$alert('没有选择任何记录', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            //do nothing
          }
        });
        return;
      }
      var self = this;
      self.$confirm('此操作将禁用选择的记录, 是否继续？', '批量禁用记录？', {
        confirmButtonText: '批量禁用记录',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        var selectionsArray = [];
        for (var i = self.selections.length - 1; i >= 0; i--) {
          selectionsArray.push(self.selections[i].id);
        }
        self.$ajax.load({url:`/mock/funcGroupList`}, {idList:selectionsArray}, function (result) {
          self.$message({
            type: 'success',
            message: '禁用成功!'
          });
          self.load();
        }, function (result) {

        });
      }).catch(() => {
        // do nothing         
      });
    }, 
    doArchive(index) {
      var self = this;
      self.$ajax.load({url:`/mock/funcGroupList`}, {id:self.mainDataList[index].id}, function (result) {
        self.$message({
          type: 'success',
          message: '封存成功!'
        });
        self.load();
      }, function (result) {

      });
    }, 
    doArchiveBatch() {
      if (!this.selections || this.selections.length == 0) {
        this.$alert('没有选择任何记录', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            //do nothing
          }
        });
        return;
      }
      var self = this;
      self.$confirm('此操作将封存选择的记录, 是否继续?', '批量封存记录？', {
        confirmButtonText: '批量封存记录',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        var selectionsArray = [];
        for (var i = self.selections.length - 1; i >= 0; i--) {
          selectionsArray.push(self.selections[i].id);
        }
        self.$ajax.load({url:`/mock/funcGroupList`}, {idList:selectionsArray}, function (result) {
          self.$message({
            type: 'success',
            message: '封存成功!'
          });
          self.load();
        }, function (result) {

        });
      }).catch(() => {
        // do nothing         
      });
    },
    doUnArchiveToEnable(index) {
      var self = this;
      self.$ajax.load({url:`/mock/funcGroupList`}, {id:self.mainDataList[index].id}, function (result) {
        self.$message({
          type: 'success',
          message: '解封成功!'
        });
        self.load();
      }, function (result) {

      });
    },
    doUnArchiveToEnableBatch() {
      if (!this.selections || this.selections.length == 0) {
        this.$alert('没有选择任何记录', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            //do nothing
          }
        });
        return;
      }
      var self = this;
      self.$confirm('此操作将解封选择的记录, 是否继续？', '批量解封记录？', {
        confirmButtonText: '批量解封记录',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        var selectionsArray = [];
        for (var i = self.selections.length - 1; i >= 0; i--) {
          selectionsArray.push(self.selections[i].id);
        }
        self.$ajax.load({url:`/mock/funcGroupList`}, {idList:selectionsArray}, function (result) {
          self.$message({
            type: 'success',
            message: '解封成功!'
          });
          self.load();
        }, function (result) {

        });
      }).catch(() => {
        // do nothing         
      });
    }, 
    doUnArchiveToDisable(index) {
      var self = this;
      self.$ajax.load({url:`/mock/funcGroupList`}, {id:self.mainDataList[index].id}, function (result) {
        self.$message({
          type: 'success',
          message: '解封成功!'
        });
        self.load();
      }, function (result) {

      });
    },
    doUnArchiveToDisableBatch() {
      if (!this.selections || this.selections.length == 0) {
        this.$alert('没有选择任何记录', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            //do nothing
          }
        });
        return;
      }
      var self = this;
      self.$confirm('此操作将解封选择的记录, 是否继续？', '批量解封记录？', {
        confirmButtonText: '批量解封记录',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        var selectionsArray = [];
        for (var i = self.selections.length - 1; i >= 0; i--) {
          selectionsArray.push(self.selections[i].id);
        }
        self.$ajax.load({url:`/mock/funcGroupList`}, {idList:selectionsArray}, function (result) {
          self.$message({
            type: 'success',
            message: '解封成功!'
          });
          self.load();
        }, function (result) {

        });
      }).catch(() => {
        // do nothing         
      });
    }, 
    doDelete(index) {
      var self = this;
      self.$confirm('此操作将删除该记录, 是否继续？', '删除记录？', {
        confirmButtonText: '删除记录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.$ajax.load({url:`/mock/funcGroupList`}, {id:self.mainDataList[index].id}, function (result) {
          self.$message({
            type: 'success',
            message: '删除成功!'
          });
          self.load();
        }, function (result) {

        });
      }).catch(() => {
        // do nothing         
      });
    }, 
    doDeleteBatch() {
      if (!this.selections || this.selections.length == 0) {
        this.$alert('没有选择任何记录', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            //do nothing
          }
        });
        return;
      }
      var self = this;
      self.$confirm('此操作将删除选择的记录, 是否继续？', '批量删除记录？', {
        confirmButtonText: '批量删除记录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var selectionsArray = [];
        for (var i = self.selections.length - 1; i >= 0; i--) {
          selectionsArray.push(self.selections[i].id);
        }
        self.$ajax.load({url:`/mock/funcGroupList`}, {idList:selectionsArray}, function (result) {
          self.$message({
            type: 'success',
            message: '删除成功!'
          });
          self.load();
        }, function (result) {

        });
      }).catch(() => {
        // do nothing         
      });
    },
    load() {
      this.viewCtrl.queryLoading = true;
      var self = this;
      self.$ajax.load({url:`/mock/funcGroupList`}, this.queryParam, function (result) {
        if (result.data && result.data.length > 0) {
          for (var i = 0; i < result.data.length; i++) {
            result.data[i].status = new self.$vo.Status(result.data[i].status);
          }
        }
        self.mainDataList = result.data;
        self.total = result.total;
        self.viewCtrl.queryLoading = false;
      }, function (result) {
        self.viewCtrl.queryLoading = false;
      });
    }, 
    openCreateRecordDialog() {
      this.viewCtrl.createRecordDialogVisible = true;
    },
    closeCreateRecordDialog() {
      this.viewCtrl.createRecordDialogVisible = false;
    },
    createRecord(){
      var self = this;
      self.$refs['createRecordForm'].validate((valid) => {
        if (valid) {
          self.viewCtrl.createRecordLoading = true;
          self.viewCtrl.createRecordDialogCloseDisabled = true;
          self.$ajax.load({url:`/mock/funcGroupList`}, self.createRecordUpdateParam, function (result) {
            self.$message({
              type: 'success',
              message: '新建成功!'
            });
            self.load();
            self.viewCtrl.createRecordLoading = false;
            self.viewCtrl.createRecordDialogVisible = false;
            self.viewCtrl.createRecordDialogCloseDisabled = false;
          }, function (result) {
            self.viewCtrl.createRecordLoading = false;
            self.viewCtrl.createRecordDialogVisible = false;
            self.viewCtrl.createRecordDialogCloseDisabled = false;
          });
        }
      });
    }, 
    openShowDialog(index) {
      this.currentOperatingRecord = this.mainDataList[index];
      this.viewCtrl.showRecordDialogVisible = true;
    }, 
    closeShowRecordDialog() {
      this.viewCtrl.showRecordDialogVisible = false;
      this.currentOperatingRecord = undefined;
    },
    openUpdateDialog(index) {
      this.currentOperatingRecord = this.mainDataList[index];
      this.updateRecordUpdateParam.id = this.currentOperatingRecord.id;
      this.updateRecordUpdateParam.name = this.currentOperatingRecord.name;
      this.updateRecordUpdateParam.remark = this.currentOperatingRecord.remark;
      this.viewCtrl.updateRecordDialogVisible = true;
    }, 
    closeUpdateRecordDialog() {
      this.viewCtrl.updateRecordDialogVisible = false;
      this.currentOperatingRecord = undefined;
    },
    updateRecord(){
      var self = this;
      self.$refs['updateRecordForm'].validate((valid) => {
        if (valid) {
          self.viewCtrl.updateRecordLoading = true;
          self.viewCtrl.updateRecordDialogCloseDisabled = true;
          self.$ajax.load({url:`/mock/funcGroupList`}, self.updateRecordUpdateParam, function (result) {
            self.$message({
              type: 'success',
              message: '修改成功!'
            });
            self.load();
            self.viewCtrl.updateRecordLoading = false;
            self.viewCtrl.updateRecordDialogVisible = false;
            self.viewCtrl.updateRecordDialogCloseDisabled = false;
          }, function (result) {
            self.viewCtrl.updateRecordLoading = false;
            self.viewCtrl.updateRecordDialogVisible = false;
            self.viewCtrl.updateRecordDialogCloseDisabled = false;
          });
        }
      });
    }, 
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.breadcrumb_row {
  padding: 5px 5px 5px 5px;
  border-bottom: 1px solid #ccc;
  /*margin-bottom: 3px;*/
}

.input_query_param_name {
  width: 150px;
}

.table_row {
  flex:1 1 auto;
  height: 1px;
  max-height: 100%;
}
.table_row_col {
  height: 100%;
}
.paging_row {
  flex:0 0 auto;

}
.paging_row_col {

}
.el-pagination {
  padding: 2px 0px 2px 0px;
}
</style>
