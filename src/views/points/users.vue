 <template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.phone" placeholder="注册手机号码" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.appId" placeholder="注册平台" clearable style="width: 160px;" class="filter-item">
        <el-option v-for="item in authList" :key="item.appId" :label="item.appName" :value="item.appId" />
      </el-select>
      <el-date-picker
        v-model="listQuery.time"
        type="daterange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['00:00:00', '23:59:59']">
      </el-date-picker>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border style="width: 100%">
      <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
      <el-table-column prop="registerAppId" label="注册平台" align="center" :formatter="getPlatformName"></el-table-column>
      <el-table-column prop="createTime" label="注册时间" align="center" :formatter="formatTime"></el-table-column>
      <el-table-column prop="points" label="总积分" align="center"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getAllAuthList, getVipUser } from "@/api/points";
import moment from 'moment';
export default {
  data() {
    return {
      listLoading: true,
      list: null,
      authList: [],
      total: 0,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        phone: undefined,
        appId: undefined,
        time: undefined,
        startTime: undefined,
        endTime: undefined,
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
      const { time } = this.listQuery;
      const query = time ? { ...this.listQuery, startTime: moment(time[0]).format('YYYY-MM-DD HH:mm:ss'), endTime: moment(time[1]).format('YYYY-MM-DD HH:mm:ss'), time: undefined } : { ...this.listQuery };
      getVipUser(query).then(response => {
        const { code, pageData, total } = response;
        this.list = response.pageData;
        this.total = response.total;

        setTimeout(() => {
          this.listLoading = false;
        }, 200);
      });
    },
    handleFilter() {     
      this.listQuery.pageNum = 1
      this.getList()
    },
    getAllList() {
      getAllAuthList().then(res => {
        this.authList = res.data;
      });
    },
    getPlatformName(row) {
      const authList = this.authList.find(
        item => item.appId === row.registerAppId
      );
      return authList ? authList.appName : "";
    },
    formatTime(row) {
      return moment(row.createTime).format('YYYY-MM-DD HH:mm:ss');
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.app-container {
  padding: 20px;
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