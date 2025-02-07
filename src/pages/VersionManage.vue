<template>
  <div id="version">
    <div class="header">
      <div style="display: flex;flex-direction: column;">
        <span>应用图标</span>
        <el-image class="image" :src="imgSrc(app.icon)"></el-image>
      </div>
      <div style="display: flex;flex-direction: column;margin-left:5px;">
        <span>应用名称</span>
        <span style="color:black;">{{ app.name }}</span>
      </div>
      <div style="display: flex;flex-direction: column;margin-left: 12px;"><span>版号</span><span>{{ VersionCode }}</span>
      </div>
      <el-button type="primary" @click="state.show = true" style="margin-left:7px">发布版本</el-button>
    </div>
    <div class="search">
      <el-input v-model="state.querykey" style="margin-right: 3px;width: 250px;" maxlength="30"></el-input>
      <el-select placeholder="类型" v-model="state.type">
             <el-option label="全部" value="''"></el-option>
             <el-option v-for="(item,index) in [1,2,3,4]" :key="index" :label="getVersionType(item)" :value="item"></el-option>
        </el-select>
        <el-input type="number" v-model="state.year" min="1970" :max="new Date().getFullYear()" style="margin: 0 5px;width: 130px;"></el-input>
        <el-button type="primary" @click="getData"><el-icon><Search></Search></el-icon></el-button>
    </div>
    <el-table :data="pagination.data" >
      <el-table-column prop="id" label="版本id" width="160">
      </el-table-column>
      <el-table-column label="发布日期">
        <template #default="version">
          <span>{{ new Date(version.row.publishDate).toLocaleDateString() }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="160">
        <template #default="version">
          <span>{{ new Date(version.row.createTime).toLocaleString() }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述信息" width="125">
        <template #default="version">
          <p class="description" @click="showAll(version)">{{ version.row.description }}</p>
        </template>
      </el-table-column>
      <el-table-column label="类型">
        <template #default="version">
          <span>{{ getVersionType(version.row.type)}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200">
        <template #default="version">
          <span class="download"  type="download" 
          @click="toDownload(version.row.fileName)">{{ version.row.number }}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination v-model:current-page="pagination.current" v-model:page-size="pagination.size"
      :page-sizes="pagination.sizes" :size="pagination.size" layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total" @size-change="getData" @current-change="getData" style="margin-top: 3px;" />
  </div>

  <el-dialog v-model="state.show" @close="closed">
    <div class="version">
      <el-form>
        <el-form-item label="版本号">
          <el-input v-model="state.version.number" placeholder="版本号"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select placeholder="类型" v-model="state.version.type">
             <el-option v-for="(item,index) in [1,2,3,4]" :key="index" :label="getVersionType(item)" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="state.version.description" type="textarea" :rows="5" placeholder="描述" resize="none"></el-input>
        </el-form-item>
        <el-form-item label="文件名称">
          <el-input placeholder="文件名称" v-model="state.version.fileName"></el-input>
        </el-form-item>
        <div>
          <el-button type="success" size="small" @click="publish">确定</el-button>
          <el-button type="info" size="small">取消</el-button>
        </div>
      </el-form>
    </div>
  </el-dialog>
</template>

<script setup>
import { Download, GetVersions, Publish, VersionCode } from "@/api/Version";
import { PageOption, copy, getVersionType, onlyDate } from "@/modules/Common";
import {  imgSrc } from "@/modules/Request";
import stateStroge from "@/modules/StateStorage";
import { reactive, ref, onMounted } from "vue";

const state = reactive({
  querykey: "",
  year: 2025,
  type: "",
  version: {
    number: "",
    type: 1,
    description: "",
    fileName: ""
  },
  show: false
});

const pagination = ref(new PageOption(1, 6, 0, [6, 12, 24]));

const app = ref({
  name: "KList",
  icon: "app.png"
});

onMounted(async () => {
  const user = stateStroge.get("user");
  console.log(user);
  await getData();
});

async function getData() {
  await GetVersions(pagination.value, state.querykey, state.year, state.type, res => {
    const data = res.data;
    pagination.value.data = data.data;
    pagination.value.total = data.total;
  });
}

function closed(){
  state.version =  {
    number: "",
    type: 1,
    description: "",
    fileName: ""
  };
}

async function publish() {
  const model = {
     versionNumber:state.version.number,
     versionCode:VersionCode,
     publishDate:onlyDate(new Date()),
     description:state.version.description,
     versionType:state.version.type,
     fileName:state.version.fileName
  }
  await Publish(model,stateStroge.get("user").id,res=>{
      const versionId = res.data;
      const version = {};
      copy(state.version,version);
      version.id = versionId;
      version.publishDate = model.publishDate;
      version.createTime = new Date();
      if(pagination.value.data.length<pagination.value.size)
         pagination.value.data.splice(0,0,version);
      state.show = false;  
  });
}

async function toDownload(fileName) {
  await Download(fileName);
}

</script>

<style scoped>
#version {
  position: relative;
  padding: 3px;
  margin-left: 15px;
}

#version .header {
  width: 80%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

#version .image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

#version .search{
  display: flex;
  align-items: center;
}

#version .download{
  text-wrap: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: rgb(0,75,235);
  text-decoration: underline;
  cursor: pointer;
}
</style>