<template>
  <div id="home" v-if="state">
    <div class="content">
      <div class="head-messages">
        <div class="head" @click="addHeadMessage">
          <el-icon :size="18">
            <Plus></Plus>
          </el-icon>
          <span>&nbsp;添加新对话</span>
        </div>
        <div class="head-message-content" >
          <div class="head-message" v-for="(message, index) in state.headMessage.data" :key="index"
          :style="selectedMessages!=null&&selectedMessages.headId==message.id?'background-color:blueviolet;color:white':''">
            <el-icon>
              <ChatDotSquare />
            </el-icon>
            <span class="msg-content">{{ message.content }}</span>
            <el-icon @click="removeHeadMessage(index)">
              <Delete />
            </el-icon>
          </div>
        </div>
      </div>
      <div class="messages" >
        <div class="messages-content" v-if="selectedMessages != null">
          <div class="message" v-for="(message, index) in selectedMessages.data" :key="index">
            <div v-if="message.role == ChatRole.assistant" class="left">
              <img src="../imgs/ai.png" class="func-image" />
              <span>{{ message.time.toLocaleString() }}</span>
            </div>
            <div v-if="message.role == ChatRole.user" class="right">
              <img src="../imgs/user.png" class="func-image"/>
              <span>{{ message.time.toLocaleString() }}</span>
            </div>
            <div class="message-body">
              <p v-html="message.content"></p>
              <div class="tools tools-right" v-if="message.role == ChatRole.assistant">
                <el-tooltip effect="dark" content="重新生成当前回答" placement="top-start">
                  <el-icon>
                    <Refresh />
                  </el-icon>
                </el-tooltip>
                <el-tooltip effect="dark" content="删除" placement="top-start">
                  <el-icon>
                    <Delete />
                  </el-icon>
                </el-tooltip>
                <el-tooltip effect="dark" content="复制" placement="top-start">
                  <el-icon>
                    <DocumentCopy />
                  </el-icon>
                </el-tooltip>
              </div>
              <div class="tools tools-left" v-if="message.role == ChatRole.user">
                <el-tooltip effect="dark" content="复制" placement="top-start">
                  <el-icon>
                    <DocumentCopy />
                  </el-icon>
                </el-tooltip>
                <el-tooltip effect="dark" content="删除" placement="top-start">
                  <el-icon>
                    <Delete />
                  </el-icon>
                </el-tooltip>
              </div>
            </div>
          </div>
        </div>
        <div class="send">
          <el-input type="textarea" v-model="state.question" resize="none" :rows="3"
           placeholder="发送消息给ai助手，同时按下Ctrl+Enter可以直接发送" 
           @keydown="keySendMessage"></el-input>
          <el-button @click="sendMessage" type="success"  :disabled="state.question.length == 0" style="margin: 0 5px;"
        ><el-icon>
              <Position />
            </el-icon></el-button>
          <el-tooltip effect="dark" content="开启联网搜索" placement="top-start" v-if="state.userSearch" >
            <img src="../imgs/internet.png" class="func-image" @click="state.userSearch = false" />
          </el-tooltip>
          <el-tooltip effect="dark" content="关闭联网搜索" placement="top-start" v-if="!state.userSearch">
            <img src="../imgs/nointernet.png" class="func-image" @click="state.userSearch = true" />
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { Chat, GetHeadMessageId } from "@/api/Chat";
import { ChatMessage, ChatRole, StorageFormat } from "@/modules/Common";
import stateStroge from "@/modules/StateStorage";
import { reactive, onMounted, ref } from "vue";

const state = reactive({
  message: new StorageFormat("message", {}),
  headMessage: new StorageFormat("head-message", []),
  lastMessage: new StorageFormat("last-message",null),
  question: "",
  userSearch: true
});

const selectedMessages = ref(null);

onMounted(function () {
  if (stateStroge.has(state.message.key))
    state.message.data = stateStroge.get(state.message.key);
  if (stateStroge.has(state.headMessage.key))
    state.headMessage.data = stateStroge.get(state.headMessage.key);
  if(stateStroge.has(state.lastMessage.key))
  {
    state.lastMessage.data = stateStroge.get(state.lastMessage.key);
    selectedMessages.value = state.lastMessage.data;
  }
});

function addHeadMessage(){
  GetHeadMessageId(res=>{
       const headMessage = {
        id:res.data,
        content:"新建对话"
       }
       addedHeadMessage(headMessage);
  });
}

function addedHeadMessage(headMessage){
    const headMessages = state.headMessage.data;
    headMessages.push(headMessage);
    stateStroge.set(state.headMessage.key,headMessages);
    const lastMessageData = {
      headId:headMessage.id,
      data:[]
    };
    stateStroge.set(state.lastMessage.key,lastMessageData);
    state.lastMessage.data = lastMessageData;
    selectedMessages.value = lastMessageData;
    console.log(selectedMessages.value);
}

function removeHeadMessage(index){
  resetLastMessage(index);
  const headMessage = state.headMessage.data[index];
  state.headMessage.data.splice(index,1);
  removedHeadMessage(index,headMessage);
}

function removedHeadMessage(headMessage){
  const headMessages = state.headMessage.data;
  stateStroge.set(state.headMessage.key,headMessages);
  const messageData = {};
  for(let pro in state.message.data){
    if(pro!=headMessage.id)
       messageData[pro] = state.message.data[pro];
  }
  state.message.data = messageData;
  stateStroge.set(state.message.key,messageData);
}

function resetLastMessage(headMessageIndex){
   var index = headMessageIndex;
   if(index == state.headMessage.data.length - 1)
     index--;
  else
     index++;
   if(index<0)
   {
    stateStroge.remove(state.lastMessage.key);
    state.message.data = {};
    selectedMessages.value = null;
    return; 
  }
   const headMessage = state.headMessage.data[index]; 
   const lastMessageData = state.lastMessage.data;
   lastMessageData.headId = headMessage.id;
   lastMessageData.data = state.message.data[headMessage.id];
   stateStroge.set(state.lastMessage.key,lastMessageData);
   selectedMessages.value = lastMessageData;
}

function keySendMessage(e){
  if(e.ctrlKey&&e.key === 'Enter')
     sendMessage();
}

function sendMessage(){
  if(state.question.length==0)return;
  if(selectedMessages.value == null)
     {
       GetHeadMessageId(res=>{
          const headMessage = {
            id:res.data,
            content:state.question
          };
          addedHeadMessage(headMessage);
          addMessage();
       });
     }
  else
     addMessage();
}

function addMessage(){
  const message = new ChatMessage(ChatRole.user,state.question);
  const selectedHeadId = selectedMessages.value.headId;
  addedMessage(message,selectedHeadId);
  Chat(state.message.data[selectedHeadId],state.userSearch,res=>{
      const content = res.data;
      const aiMessage = new ChatMessage(ChatRole.assistant,content);
      addedMessage(aiMessage,selectedHeadId);
      state.question = "";
  });
}

function addedMessage(message,headId){
   const data = selectedMessages.value.data;
   data.push(message);
   state.message.data[headId] = data;
   stateStroge.set(state.message.key,data);
}


</script>
<style scoped>
#home {
  position: relative;
  width: 100%;
  display: flex;
  padding: 1%;
  background-color: aliceblue;
}

#home .content {
  display: flex;
  width: 100%;
  height: 96.5vh;
}

#home .content .messages {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 72%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

#home .messages .messages-content{
  height: 86%;
  overflow-y: auto;
  overflow-x: hidden;
}

#home .content .head-messages {
  display: flex;
  width: 26%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  flex-direction: column;
  align-content: center;
  padding-top: 1%;
  margin-right: 2%;
  background-color: azure;
  border-radius: 10px;
  padding: 1%;
}

.head-messages .head {
  display: flex;
  height: 40px;
  color: white;
  background-color: rgb(0, 125, 225);
  font-size: 16px;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 50ms;
}

.head-messages .head:active{
 background-color: blue; 
}

.messages .send{
  position: absolute;
  bottom: 2%;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
}

.messages .func-image{
  width:30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
}

.head-messages .head-message{
  width: 100%;
  display: flex;
  height: 45px;
  align-items: center;
  cursor: pointer;
  border-radius: 7px;
  margin-top: 5px;
  border: 1px solid blueviolet;
  padding: 0 1%;
}

.head-message:hover{
  background-color: blueviolet;
  color: white;
}

.head-message .msg-content{
  width: 85%;
  overflow: hidden;
  text-wrap: nowrap;
  text-overflow: ellipsis;
  font-size: 13px;
  text-align: left;
  text-indent: 1.5px;
}
</style> 