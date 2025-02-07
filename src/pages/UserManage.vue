<template>
  <div id="user" v-if="state">
    <header>
      <el-input v-model="state.queryKey" style="width:22%" placeholder="输入关键词">   
      </el-input>
      <div class="select">
         <span>用户状态：</span>
     <el-radio-group v-model="state.status" class="select">
             <el-radio label="">全部</el-radio>
             <el-radio label="true">正常</el-radio>
             <el-radio label="false">异常</el-radio>
         </el-radio-group>
      </div>
      <div class="select">
         <span>用户类型：</span>
         <el-select v-model="state.role" placeholder="用户类型">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(key,value) in UserType()" :key="key" :label="key" :value="value">
            </el-option>
         </el-select>
      </div>
         <el-button type="primary" @click="getData" style="margin-left:4px">
               <el-icon><Search /></el-icon>
            </el-button>
    </header>
    <el-table :data="pagination.data" border>
      <el-table-column label="uid" prop="id" width="130"> </el-table-column>
      <el-table-column label="用户信息" width="220">
        <template #default="scope">
          <div class="user-info">
            <el-image :src="imgSrc(scope.row.avatar)" style="border-radius: 50%;"> </el-image>
            <span class="name">{{ scope.row.nickname }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="电子邮箱" prop="email" width="170"> </el-table-column>
      <el-table-column label="用户状态">
        <template #default="scope">
          <div class="normal" v-if="scope.row.status">
              正常
          </div>
          <div class="abnormal" v-else>
            异常
          </div>
          </template>
      </el-table-column>
      <el-table-column label="用户类型" width="90">
        <template #default="scope">
          <el-tag :type="tagType(scope.row.role)" size="small">{{
            getUserType(scope.row.role)
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="注册时间" width="160">
        <template #default="scope">
          {{ new Date(scope.row.createTime).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column label="上次登录" width="160">
        <template #default="scope">
          {{ new Date(scope.row.lastLoginTime).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column width="150">
        <template #default="scope">
          <el-button type="danger" plain size="small" @click="changeStatus(scope.row,0)" v-if="scope.row.status==1">禁用</el-button>
          <el-button type="success" plain size="small" @click="changeStatus(scope.row,1)" v-else>恢复</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="pagination.current"
      v-model:page-size="pagination.size"
      :page-sizes="pagination.sizes"
      :size="pagination.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total"
      @size-change="getData"
      @current-change="getData"
    />
  </div>
</template>

<script setup>
import { PageOption } from "@/modules/Common";
import { reactive, ref, onMounted } from "vue";
import { imgSrc } from "@/modules/Request";
import { getUserType,UserType,GetUsers, ChangeStatus } from "@/api/User";

const state = reactive({
  queryKey: "",
  status: "",
  role: "",
});
const pagination = ref(new PageOption(1, 10, 0, [10, 20, 30]));

function tagType(type) {
  switch (type) {
    case 1:
      return "primary";
    case 2:
      return "success";
    case 3:
      return "danger";
  }
}

onMounted(async () => {
  await getData();
});

async function getData() {
  await GetUsers(
    pagination.value,
    state.queryKey,
    state.status,
    state.role,
    res=>{
      const data = res.data;
      pagination.value.total = data.total;
      pagination.value.data = data.data;
    }
  );

}

async function changeStatus(user,status) {
  await ChangeStatus(user.id,status,()=>{
    user.status = status;
  });  
}
</script>

<style scoped>
@import url(../css/common.css);
#user {
  position: relative;
  padding: 3px;
  width: fit-content;
}

#user header
{
   display: flex;
   margin-bottom: 6px;
   height: 40px;
   align-items: center;
}

#user header .select
{
   display: flex;
   align-items: center;
   justify-content: center;
   margin:16px;
}

#user .el-table
{
   margin-bottom: 4px;
}

#user .user-info
{
   display: flex;
   align-items: center;
}

#user .user-info .el-image
{
   height: 70px;
   width: 70px;
}

#user .user-info .name
{
   color:black;
   font-size: 16px;
   margin-left: 1%;
}

#user .el-pagination
{
   margin: 0 auto;
   justify-content: center;
}

</style>
