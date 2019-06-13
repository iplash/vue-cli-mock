 <template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="primary" icon="el-icon-plus" @click="dialogVisible = true">添加平台</el-button>
      <div>
        <el-dialog
          title="添加平台"
          :visible.sync="dialogVisible"
          width="530px"
          :before-close="closeDialog"
        >
          <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            <el-form-item label="平台名称：" prop="name">
              <el-input v-model="form.name" style="width:252px;"></el-input>
            </el-form-item>
            <el-form-item label="积分设置：" prop="type">
              <el-checkbox-group v-model="form.type">
                <el-checkbox label="增加积分" name="type"></el-checkbox>
                <el-checkbox label="减少积分" name="type"></el-checkbox>
                <el-checkbox label="注册用户" name="type"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="resetForm('form')">取 消</el-button>
            <el-button :loading="addLoading" type="primary" @click="handleAddPlatform('form')">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
    <el-table v-loading="listLoading" :data="list" border style="width: 100%">
      <el-table-column prop="appName" label="平台" width="180" align="center"></el-table-column>
      <el-table-column prop="appId" label="APP ID" width="360" align="center"></el-table-column>
      <el-table-column label="增加积分" align="center">
        <template slot-scope="{row}">
          <el-checkbox
            v-if="row.add"
            checked
            @change="val => handleCheckAllChange(val, row.id, 'add')"
          ></el-checkbox>
          <el-checkbox v-else @change="val => handleCheckAllChange(val, row.id, 'add')"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="减少积分" align="center">
        <template slot-scope="{row}">
          <el-checkbox
            v-if="row.sub"
            checked
            @change="val => handleCheckAllChange(val, row.id, 'sub')"
          ></el-checkbox>
          <el-checkbox v-else @change="val => handleCheckAllChange(val, row.id, 'sub')"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="注册用户" align="center">
        <template slot-scope="{row}">
          <el-checkbox
            v-if="row.reg"
            checked
            @change="val => handleCheckAllChange(val, row.id, 'reg')"
          ></el-checkbox>
          <el-checkbox v-else @change="val => handleCheckAllChange(val, row.id, 'reg')"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{row}">
          <el-button
            v-if="row.stat"
            type="danger"
            size="mini"
            @click="changeStatus(row.id, row.stat)"
          >停用</el-button>
          <el-button v-else type="primary" size="mini" @click="changeStatus(row.id, row.stat)">启用</el-button>
          <el-button type="danger" size="mini" @click="deletePlatForm(row.id)" plain>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {
  getAuthList,
  openOrDown,
  updateRights,
  deletePlatForm,
  addPlatform,
} from '@/api/points';

export default {
  data() {
    return {
      form: {
        name: '',
        type: [],
      },
      rules: {
        name: [
          { required: true, message: '请输入平台名称', trigger: 'blur' },
          { message: '平台名称为必填项', trigger: 'blur' },
        ],
      },
      dialogVisible: false,
      checked: false,
      addLoading: false,
      listLoading: true,
      list: null,
      total: 0,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
      },
    };
  },
  created() {
    console.log('2');
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      getAuthList(this.listQuery).then((response) => {
        this.list = response.pageData;
        this.total = response.total;

        setTimeout(() => {
          this.listLoading = false;
        }, 200);
      });
    },
    handleCheckAllChange(val, id, type) {
      updateRights({ id, rightsKey: type, rightsValue: val ? 1 : 0 }).then(
        (response) => {
          if (response.code === 200) {
            this.getList();
          }
        },
      );
    },
    changeStatus(id, status) {
      openOrDown({ id, stat: status ? 0 : 1 }).then((response) => {
        if (response.code === 200) {
          this.getList();
        }
      });
    },
    deletePlatForm(id) {
      deletePlatForm({ ids: [id] }).then((response) => {
        const { code, msg } = response;
        this.$message({
          message: msg,
          type: code === 200 ? 'success' : 'error',
          duration: 3 * 1000,
        });
        if (code === 200) {
          this.getList();
        }
      });
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    handleAddPlatform(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addLoading = true;
          const { name, type } = this.form;
          const payload = {
            addRights: type.includes('增加积分') ? 1 : 0,
            appName: name,
            regRights: type.includes('注册用户') ? 1 : 0,
            subRights: type.includes('减少积分') ? 1 : 0,
          };
          addPlatform(payload).then((response) => {
            this.addLoading = false;
            const { code, msg } = response;
            this.$message({
              message: msg,
              type: code === 200 ? 'success' : 'error',
              duration: 3 * 1000,
            });
            if (code === 200) {
              this.dialogVisible = false;
              this.getList();
              this.resetForm(formName);
            }
          });
        } else {
          console.log('error submit!!');
        }
      });
    },
    resetForm(formName) {
      this.dialogVisible = false;
      this.$refs[formName].resetFields();
    },
  },
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
