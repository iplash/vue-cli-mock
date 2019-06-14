 <template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="primary" icon="el-icon-plus" @click="dialogVisible = true">添加规则</el-button>
      <div>
        <el-dialog
          title="添加活动"
          :visible.sync="dialogVisible"
          width="635px"
          :before-close="closeDialog"
        >
          <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="130px">
            <el-form-item label="活动名称" prop="promotionName">
              <el-input v-model="ruleForm.promotionName" style="width:380px;"></el-input>
            </el-form-item>
            <el-form-item label="活动描述" prop="description">
              <el-input v-model="ruleForm.description" style="width:380px;"></el-input>
            </el-form-item>
            <el-form-item label="使用平台" prop="targetAppId">
              <el-select v-model="ruleForm.targetAppId" placeholder="请选择使用平台">
                <el-option
                  v-for="item in authList"
                  :key="item.appId"
                  :label="item.appName"
                  :value="item.appId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="活动规格" prop="calculateWay">
              <el-input
                placeholder="请输入数量"
                v-model="ruleForm.calculateIndex"
                style="width:320px"
                class="input-with-select"
              >
                <el-select
                  v-model="ruleForm.calculateWay"
                  slot="prepend"
                  placeholder="请选择"
                  style="width:110px"
                >
                  <el-option label="增加积分" value="add"></el-option>
                  <el-option label="积分倍数" value="multi"></el-option>
                </el-select>
                <template slot="append">{{ ruleForm.calculateWay === 'add' ? '积分' : '倍' }}</template>
              </el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="resetForm('ruleForm')">取 消</el-button>
            <el-button
              :loading="addLoading"
              type="primary"
              @click="handleAddActivity('ruleForm', ruleForm.id, ruleForm.promotionCode)"
            >确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
    <el-table v-loading="listLoading" :data="list" border style="width: 100%">
      <el-table-column prop="id" label="序列号" width="80" align="center"></el-table-column>
      <el-table-column prop="promotionName" label="活动名称" align="center"></el-table-column>
      <el-table-column prop="targetAppId" label="活动平台" align="center" :formatter="getPlatformName"></el-table-column>
      <el-table-column prop="promotionCode" label="活动编号" align="center"></el-table-column>
      <el-table-column prop="description" label="计分方式" align="center" width="150"></el-table-column>
      <el-table-column
        prop="calculateWay"
        label="积分奖励"
        align="center"
        :formatter="setRateValue"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="stat"
        label="活动状态"
        align="center"
        :formatter="activityStatus"
        width="120"
      ></el-table-column>
      <el-table-column label="操作" align="center" width="240">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="editRule(row.id)">编辑</el-button>
          <el-button
            v-if="row.stat === 0"
            type="primary"
            size="mini"
            @click="changeStatus(row.id, row.stat)"
            plain
          >开启</el-button>
          <el-button
            v-else
            type="danger"
            size="mini"
            @click="changeStatus(row.id, row.stat)"
            plain
          >关闭</el-button>
          <el-button type="danger" size="mini" @click="deleteActivity(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {
  getAllAuthList,
  getPromotionList,
  addPromotion,
  updatePromotion,
  deletePromotion,
  openOrDownPromotion
} from "@/api/points";
export default {
  data() {
    return {
      ruleForm: {
        calculateIndex: 0,
        calculateWay: "add",
        description: "",
        promotionName: "",
        targetAppId: ""
      },
      rules: {
        calculateIndex: [
          { required: true, message: "请输入对应的数量", trigger: "change" }
        ],
        calculateWay: [
          { required: true, message: "请选择积分增加方式", trigger: "change" }
        ],
        description: [
          { required: true, message: "请输入活动描述", trigger: "change" }
        ],
        promotionName: [
          { required: true, message: "请输入活动名称", trigger: "change" }
        ],
        targetAppId: [
          { required: true, message: "请选择使用平台", trigger: "change" }
        ]
      },
      dialogVisible: false,
      addLoading: false,
      listLoading: true,
      list: null,
      authList: [],
      total: 0,
      listQuery: {
        pageNum: 1,
        pageSize: 20
      }
    };
  },
  created() {
    this.getAllList();
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      getPromotionList(this.listQuery).then(response => {
        const { code, pageData, total } = response;
        this.list = response.pageData;
        this.total = response.total;

        setTimeout(() => {
          this.listLoading = false;
        }, 200);
      });
    },
    getAllList() {
      getAllAuthList().then(res => {
        this.authList = res.data;
      });
    },
    getPlatformName(row) {
      const authList = this.authList.find(
        item => item.appId === row.targetAppId
      );
      return authList ? authList.appName : "";
    },
    setRateValue(row) {
      return `${row.calculateWay === "add" ? "+" : "x"} ${row.calculateIndex}`;
    },
    activityStatus(row) {
      return row.stat ? "开启" : "关闭";
    },
    changeStatus(id, status) {
      openOrDownPromotion({ id: id, stat: status ? 0 : 1 }).then(response => {
        const { code, msg } = response;
        this.$message({
          message: msg,
          type: code === 200 ? "success" : "error",
          duration: 3 * 1000
        });
        if (code === 200) {
          this.getList();
        }
      });
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    deleteActivity(id) {
      deletePromotion({ ids: [ id ] }).then(response => {
        const { code, msg } = response;
        this.$message({
          message: msg,
          type: code === 200 ? "success" : "error",
          duration: 3 * 1000
        });
        if (code === 200) {
          this.getList();
        }
      });
    },
    editRule(id) {
      this.dialogVisible = true;
      const rule = { ...this.list.find(item => item.id === id) };
      this.ruleForm = rule;
    },
    handleAddActivity(ruleForm, id, code) {
      this.$refs[ruleForm].validate(async valid => {
        if (valid) {
          this.addLoading = true;
          const {
            calculateIndex,
            calculateWay,
            description,
            promotionName,
            targetAppId
          } = this.ruleForm;
          let payload = {
            calculateIndex: calculateIndex,
            calculateWay: calculateWay,
            description: description,
            promotionName: promotionName,
            targetAppId: targetAppId,
            id: id ? id : null,
            promotionCode: code ? code : null
          };
          try {
            let response = id
              ? await updatePromotion(payload)
              : await addPromotion(payload);
            this.addLoading = false;
            const { code, msg } = response;
            this.$message({
              message: msg,
              type: code === 200 ? "success" : "error",
              duration: 3 * 1000
            });
            if (code === 200) {
              this.getList();
              this.resetForm(ruleForm);
            }
          } catch (error) {
            this.resetForm(ruleForm);
            console.log(error);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(ruleForm) {
      this.dialogVisible = false;
      this.addLoading = false;
      this.ruleForm = {
        calculateIndex: 0,
        calculateWay: "add",
        description: "",
        promotionName: "",
        targetAppId: ""
      };
      this.$refs[ruleForm].resetFields();
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.app-container {
  padding: 20px;
}
.filter-container {
  padding-bottom: 10px;

  .filter-item {
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 10px;
  }
}
</style>