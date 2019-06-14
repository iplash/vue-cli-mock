 <template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.phone"
        placeholder="手机号码"
        style="width: 120px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.outTradeNumber"
        placeholder="订单编号"
        style="width: 180px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.stat"
        placeholder="状态"
        clearable
        style="width: 110px;"
        class="filter-item"
      >
        <el-option v-for="(item, index) in status" :key="index" :label="item" :value="index"/>
      </el-select>
      <el-select
        v-model="listQuery.appId"
        placeholder="订单平台"
        clearable
        style="width: 160px;"
        class="filter-item"
      >
        <el-option
          v-for="item in authList"
          :key="item.appId"
          :label="item.appName"
          :value="item.appId"
        />
      </el-select>
      <el-date-picker
        v-model="listQuery.time"
        type="daterange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['00:00:00', '23:59:59']"
      ></el-date-picker>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border style="width: 100%">
      <el-table-column prop="phoneNum" label="手机号" align="center"></el-table-column>
      <el-table-column prop="outTradeNum" label="订单编号" align="center"></el-table-column>
      <el-table-column prop="appName" label="订单平台" align="center"></el-table-column>
      <el-table-column prop="stat" label="状态" align="center" :formatter="formatStatus"></el-table-column>
      <el-table-column prop="points" label="积分" align="center"></el-table-column>
      <el-table-column prop="createTime" label="交易时间" align="center" :formatter="formatTime"></el-table-column>
      <el-table-column prop="remark" label="备注" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="openDialog(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />

    <el-dialog title="积分修正" :visible.sync="dialogVisible" width="635px" :before-close="closeDialog">
      <el-form ref="ruleForm" :model="ruleForm" label-width="130px">
        <el-form-item label="订单编号" prop="outTradeNum">
          <el-input disabled v-model="ruleForm.outTradeNum" style="width:380px;"></el-input>
        </el-form-item>
        <el-form-item label="备注信息" prop="remark">
          <el-input
            type="textarea"
            v-model="ruleForm.remark"
            style="width:380px;"
            placeholder="备注信息"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog()">取 消</el-button>
        <el-button
          :loading="addLoading"
          type="primary"
          @click="updatePointsFails(ruleForm.id, ruleForm.remark)"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getAllAuthList, getPointsFails, addPointsFails } from "@/api/points";
import Pagination from "@/components/Pagination";
import moment from "moment";

export default {
  components: { Pagination },
  data() {
    return {
      ruleForm: {
        remark: ""
      },
      dialogVisible: false,
      addLoading: false,
      status: ["未处理", "处理失败", "处理成功"],
      listLoading: true,
      list: null,
      authList: [],
      total: 0,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        stat: undefined,
        outTradeNumber: undefined,
        phone: undefined,
        appId: undefined,
        time: undefined,
        startTime: undefined,
        endTime: undefined
      }
    };
  },
  created() {
    this.getAllList();
    this.getList();
  },
  methods: {
    getList() {
      const { time, type } = this.listQuery;
      this.listLoading = true;
      const query = time
        ? {
            ...this.listQuery,
            startTime: moment(time[0]).format("YYYY-MM-DD HH:mm:ss"),
            endTime: moment(time[1]).format("YYYY-MM-DD HH:mm:ss"),
            time: undefined
          }
        : { ...this.listQuery };
      getPointsFails(query).then(response => {
        const { code, pageData, total } = response;
        this.list = response.pageData;
        this.total = response.total;

        setTimeout(() => {
          this.listLoading = false;
        }, 200);
      });
    },
    handleFilter() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    getAllList() {
      getAllAuthList().then(res => {
        this.authList = res.data;
      });
    },
    formatTime(row) {
      return moment(row.createTime).format("YYYY-MM-DD HH:mm:ss");
    },
    formatStatus(row) {
      return this.status[row.stat];
    },
    closeDialog() {
      this.dialogVisible = false;
      this.ruleForm = { remark: "" };
    },
    openDialog(row) {
      this.dialogVisible = true;
      this.ruleForm = { ...row, remark: "" };
    },
    updatePointsFails(id, remark) {
      this.addLoading = true;
      addPointsFails({ id: id, remark: remark })
        .then(response => {
          this.addLoading = false;
          const { code, msg } = response;
          this.$message({
            message: msg,
            type: code === 200 ? "success" : "error",
            duration: 3 * 1000
          });
          if (code === 200) {
            this.closeDialog();
            this.getList();
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.app-container {
  padding: 0;
}
.filter-container {
  padding-bottom: 20px;
  display: flex;

  .filter-item:last-child {
    margin: 0 20px;
  }

  .filter-item {
    display: inline-block;
    vertical-align: middle;
    margin-right: 20px;
  }
}
</style>