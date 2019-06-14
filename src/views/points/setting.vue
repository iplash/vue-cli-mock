 <template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="primary" icon="el-icon-plus" @click="dialogVisible = true">添加规则</el-button>
      <div>
        <el-dialog
          title="积分设置"
          :visible.sync="dialogVisible"
          width="635px"
          :before-close="closeDialog"
        >
          <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="150px">
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
            <el-form-item label="积分比例" prop="rateValue">
              <el-input placeholder v-model="ruleForm.rateValue" style="width:158px">
                <template slot="append">积分</template>
              </el-input>
              <span>= 1元 请填写1的倍数</span>
            </el-form-item>
            <el-form-item label="最小兑换单位" prop="onceMinPoints">
              <el-input placeholder="1的倍数" v-model="ruleForm.onceMinPoints" style="width:158px">
                <template slot="append">积分</template>
              </el-input>
              <span>如填10，只能按照10积分的整数倍兑换</span>
            </el-form-item>
            <el-form-item label="设置最大兑换" prop="isMaxLimit">
              <el-radio-group v-model="ruleForm.isMaxLimit" @change="changeIsMax">
                <el-radio label="是"></el-radio>
                <el-radio label="否"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="单次使用限制"
              prop="onceMaxPoints"
              v-if="ruleForm.isMaxLimit === '是'"
            >
              <el-input placeholder="1的倍数" v-model="ruleForm.onceMaxPoints" style="width:158px">
                <template slot="append">积分</template>
              </el-input>
              <span>如填2000，只能兑换≤2000的积分</span>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="resetForm('ruleForm')">取 消</el-button>
            <el-button :loading="addLoading" type="primary" @click="handleAddRule('ruleForm', ruleForm.id)">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
    <el-table v-loading="listLoading" :data="list" border style="width: 100%">
      <el-table-column prop="id" label="序列号" width="80" align="center"></el-table-column>
      <el-table-column prop="ruleName" label="规则名称" align="center"></el-table-column>
      <el-table-column prop="targetAppId" label="平台名称" align="center" :formatter="getPlatformName"></el-table-column>
      <el-table-column prop="description" label="计分方式" align="center"></el-table-column>
      <el-table-column prop="rateValue" label="积分比例" align="center" :formatter="setRateValue"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{row}">
          <el-button type="danger" size="mini" @click="editRule(row.id)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getAllAuthList, getRuleList, addRule, updateRule } from "@/api/points";
export default {
  data() {
    return {
      ruleForm: {
        isMaxLimit: "否",
        onceMaxPoints: 0,
        onceMinPoints: 0,
        rateValue: 0,
        targetAppId: ""
      },
      rules: {        
        isMaxLimit: [
          { required: true, message: "请选择是否限制最大兑换", trigger: "change" }
        ],
        onceMaxPoints: [
          { required: true, message: "请输入单次使用限制", trigger: "change" }
        ],
        onceMinPoints: [
          { required: true, message: "请输入最小兑换单位", trigger: "change" }
        ],
        rateValue: [
          { required: true, message: "请输入积分比例", trigger: "change" }
        ],
        targetAppId: [
          { required: true, message: "请选择使用平台", trigger: "change" },
        ],
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
      getRuleList(this.listQuery).then(response => {
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
      return `${row.rateValue} 积分= 1 元`;
    },
    changeStatus(id, status) {
      openOrDown({ id: id, stat: status ? 0 : 1 }).then(response => {
        if (response.code === 200) {
          this.getList();
        }
      });
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    changeIsMax(value){
      const { onceMaxPoints } = this.ruleForm;
      this.ruleForm = value === '是' && onceMaxPoints === -1 ? { ...this.ruleForm, isMaxLimit: value, onceMaxPoints: 0  } : { ...this.ruleForm, isMaxLimit: value };
    },
    editRule(id){
      this.dialogVisible = true;
      const rule = { ...this.list.find(item => item.id === id) };
      rule.isMaxLimit ? rule.isMaxLimit = '是' : rule.isMaxLimit = '否';
      this.ruleForm = rule;
    },
    handleAddRule(ruleForm, id) {
      this.$refs[ruleForm].validate(async (valid) => {
        if (valid) {
          this.addLoading = true;
          const { isMaxLimit, onceMaxPoints, onceMinPoints, rateValue, targetAppId } = this.ruleForm;
          let payload = {
            isMaxLimit: isMaxLimit === '是' ? 1 : 0,
            onceMaxPoints: onceMaxPoints,
            onceMinPoints: onceMinPoints,
            rateValue: rateValue,
            targetAppId: targetAppId,
            id: id ? id : null
          };          
          try {
            let response = id ? await updateRule(payload) : await addRule(payload);
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
            console.log(error)
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
        isMaxLimit: "否",
        onceMaxPoints: 0,
        onceMinPoints: 0,
        rateValue: 0,
        targetAppId: ""
      }
      this.$refs[ruleForm].resetFields();
    }
  }
};
</script>