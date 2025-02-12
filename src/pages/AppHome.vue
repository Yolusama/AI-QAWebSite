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
        <div class="head-message-content">
          <div class="head-message" v-for="(message, index) in state.headMessage.data" :key="index"
            :style="selectedMessages != null && selectedMessages.headId == message.id ? 'background-color:blueviolet;color:white' : ''"
            @click="selectMessages(index)">
            <el-icon>
              <ChatDotSquare />
            </el-icon>
            <div v-if="state.tempHeadMsg != null && state.tempHeadMsg.id == message.id" class="headmsg-edit">
              <el-input v-model="state.tempHeadMsg.content" class="msg-content" size="small"></el-input>
              <el-icon @click.stop="state.tempHeadMsg = null" style="margin-left:3px" color="rgb(245,25,35)">
                <Close />
              </el-icon>
              <el-icon style="margin-left:3px" color="cyan" @click.stop="changeHeadMsg(index)">
                <Check />
              </el-icon>
            </div>
            <span class="msg-content" v-else>{{ message.content }}</span>
            <el-tooltip effect="dark" content="重新写入标题内容" placement="bottom">
              <el-icon @click.stop="editHeadMessage(index)" style="margin-right: 3px;">
                <Edit />
              </el-icon>
            </el-tooltip>
            <el-icon @click.stop="removeHeadMessage(index)">
              <Delete />
            </el-icon>
          </div>
        </div>
      </div>
      <div class="messages">
        <div class="messages-content" v-if="selectedMessages != null" ref="msgsEle">
          <div class="message" v-for="(message, index) in selectedMessages.data" :key="index">
            <div v-if="message.role == ChatRole.assistant" class="role-ai role">
              <img src="../imgs/ai.png" class="func-image" />
              <span class="date-str">{{ getTimeStr(new Date(message.time)) }}</span>
            </div>
            <div v-if="message.role == ChatRole.user" class="role-user role">
              <span class="date-str">{{ getTimeStr(new Date(message.time)) }}</span>
              <img src="../imgs/user.png" class="func-image" />
            </div>
            <div class="message-body">
              <div v-if="message.role == ChatRole.user" class="detail-right">
                <div class="tools tools-left">
                  <el-tooltip effect="dark" content="复制" placement="left">
                    <el-icon @click="copyMessageContent(index)">
                      <DocumentCopy />
                    </el-icon>
                  </el-tooltip>
                  <el-tooltip effect="dark" content="删除" placement="left">
                    <el-icon style="margin-top:3px" color="red" @click="removeMessage(index)">
                      <Delete />
                    </el-icon>
                  </el-tooltip>
                </div>
                <div class="body-content content-user" v-html="marked(message.content)">
                </div>
              </div>
              <div v-if="message.role == ChatRole.assistant" class="detail-left">
                <div class="body-content content-ai" v-html="marked(message.content)"></div>
                <div class="tools tools-right" v-if="message.role == ChatRole.assistant">
                  <el-tooltip effect="dark" content="重新生成当前回答" placement="right">
                    <el-icon color="gray" @click="freshResponse(index)">
                      <Refresh />
                    </el-icon>
                  </el-tooltip>
                  <el-tooltip effect="dark" content="删除" placement="right">
                    <el-icon style="margin:2px 0" color="red" @click="removeMessage(index)">
                      <Delete />
                    </el-icon>
                  </el-tooltip>
                  <el-tooltip effect="dark" content="复制" placement="right">
                    <el-icon @click="copyMessageContent(index)">
                      <DocumentCopy />
                    </el-icon>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="state.model.thinking" class="stop">
          <el-button type="danger" round size="small" @click="stopThinking">停止</el-button>
          <el-button type="primary" loading size="small" plain>
          思考中...
          </el-button>
        </div>
        <div class="send">
          <el-input type="textarea" v-model="state.question" resize="none" :rows="3"
            placeholder="发送消息给ai助手，同时按下Ctrl+Enter可以直接发送" @keydown="keySendMessage"></el-input>
          <el-button @click="sendMessage" type="success" :disabled="state.question.length == 0"
            style="margin: 0 5px;"><el-icon>
              <Position />
            </el-icon></el-button>
          <el-tag type="primary" :effect="state.model.deep ? 'light' : 'plain'"
            @click="state.model.deep = !state.model.deep" style="cursor:pointer;margin-right: 2px;">
            深度思考
          </el-tag>
          <el-tooltip effect="dark" content="开启联网搜索" placement="top" v-if="state.userSearch">
            <img src="../imgs/internet.png" class="func-image" @click="state.userSearch = false" />
          </el-tooltip>
          <el-tooltip effect="dark" content="关闭联网搜索" placement="top" v-if="!state.userSearch">
            <img src="../imgs/nointernet.png" class="func-image" @click="state.userSearch = true" />
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { Chat, GetHeadMessageId } from "@/api/Chat";
import { ChatMessage, ChatRole, confirmDialog, copy, DelayToRun, getTimeStr, StorageFormat, swapArrayItem } from "@/modules/Common";
import { createCancelToken } from "@/modules/Request";
import stateStroge from "@/modules/StateStorage";
import { ElMessage, ElNotification } from "element-plus";
import { marked } from "marked";
import { reactive, onMounted, ref, nextTick } from "vue";

const state = reactive({
  message: new StorageFormat("message", {}),
  headMessage: new StorageFormat("head-message", []),
  lastMessage: new StorageFormat("last-message", null),
  question: "",
  userSearch: true,
  model: {
    deep: false,
    used: function () {
      return this.deep ? "deepseek-reasoner" : "deepseek-chat"
    },
    thinking: false,
    cancelToken: null
  },
  tempHeadMsg: null
});

const selectedMessages = ref(null);
const msgsEle = ref(null);

onMounted(function () {
  if (stateStroge.has(state.message.key))
    state.message.data = stateStroge.get(state.message.key);
  if (stateStroge.has(state.headMessage.key))
    state.headMessage.data = stateStroge.get(state.headMessage.key);
  if (stateStroge.has(state.lastMessage.key)) {
    state.lastMessage.data = stateStroge.get(state.lastMessage.key);
    selectedMessages.value = state.lastMessage.data;
  }

  nextTick(() => {
    msgsEle.value.scroll({top:msgsEle.value.scrollHeight});
  });
});

function addHeadMessage() {
  GetHeadMessageId(res => {
    const headMessage = {
      id: res.data,
      content: "新建对话"
    };
    addedHeadMessage(headMessage);
  });
}

function addedHeadMessage(headMessage) {
  const headMessages = state.headMessage.data;
  headMessages.splice(0, 0, headMessage);
  stateStroge.set(state.headMessage.key, headMessages);
  const lastMessageData = {
    headId: headMessage.id,
    data: []
  };
  const messageData = state.message.data;
  messageData[headMessage.id] = [];
  stateStroge.set(state.lastMessage.key, lastMessageData);
  stateStroge.set(state.message.key, messageData);
  state.lastMessage.data = lastMessageData;
  selectedMessages.value = lastMessageData;
  state.message.data = messageData;
}

function removeHeadMessage(index) {
  confirmDialog("移除", "确定移除？", "确定", "取消", () => {
    resetLastMessage(index);
    const headMessage = state.headMessage.data[index];
    state.headMessage.data.splice(index, 1);
    removedHeadMessage(headMessage);
  });
}

function removedHeadMessage(headMessage) {
  const headMessages = state.headMessage.data;
  stateStroge.set(state.headMessage.key, headMessages);
  const messageData = {};
  for (let pro in state.message.data) {
    if (pro != headMessage.id)
      messageData[pro] = state.message.data[pro];
  }
  state.message.data = messageData;
  stateStroge.set(state.message.key, messageData);
}

function resetLastMessage(headMessageIndex) {
  var index = headMessageIndex;
  if (index == state.headMessage.data.length - 1)
    index--;
  else
    index++;
  if (index < 0) {
    stateStroge.remove(state.lastMessage.key);
    state.message.data = {};
    selectedMessages.value = null;
    return;
  }
  const headMessage = state.headMessage.data[index];
  const lastMessageData = state.lastMessage.data;
  lastMessageData.headId = headMessage.id;
  lastMessageData.data = state.message.data[headMessage.id];
  stateStroge.set(state.lastMessage.key, lastMessageData);
  selectedMessages.value = lastMessageData;
}

function keySendMessage(e) {
  if (e.ctrlKey && e.key === 'Enter')
    sendMessage();
}

function sendMessage() {
  if (state.question.length == 0) return;
  if (selectedMessages.value == null) {
    GetHeadMessageId(res => {
      const headMessage = {
        id: res.data,
        content: state.question
      };
      addedHeadMessage(headMessage);
      addMessage();
    });
  }
  else
    addMessage();
}

function addMessage() {
  const message = new ChatMessage(ChatRole.user, state.question);
  const selectedHeadId = selectedMessages.value.headId;
  const data = selectedMessages.value.data;
  data.push(message);
  addedMessage(selectedHeadId);
  state.model.thinking = true;
  state.question = "";
  const aiMessage = new ChatMessage(ChatRole.assistant, "");
  const cancelToken = createCancelToken();
  data.push(aiMessage);
  DelayToRun(()=> msgsEle.value.scroll({top:msgsEle.value.scrollHeight}),50);
  Chat(state.message.data[selectedHeadId].filter(m=>m.normal), state.userSearch, state.model.used(), cancelToken.token, res => {
    const content = res.data;
    let i = 0;
    const timer = setInterval(() => {
      if (!state.model.thinking) {
        clearInterval(timer);
        addedMessage(selectedHeadId);
        return;
      }
      data[data.length - 1].content = content.slice(0, i + 1);
      i++;
      msgsEle.value.scroll({top:msgsEle.value.scrollHeight,behavior:"smooth"});
      if (i == content.length)
        clearThinking();
    }, 50);
  }, () => {
    aiMessage.content = "系统出现错误或者加载超时！";
    aiMessage.normal = false;
    message.normal = false;
    addedMessage(selectedHeadId);
    clearThinking();
  });
  state.model.cancelToken = cancelToken;
}

function addedMessage(headId) {
  const data = selectedMessages.value.data;
  state.message.data[headId] = data;
  stateStroge.set(state.message.key, state.message.data);
}

function copyMessageContent(index) {
  if(state.model.thinking){
    ElNotification({
      message:"思考中，无法复制内容！",
      type:"warning"
    });
    return;
  }
  const content = selectedMessages.value.data[index].content;
  navigator.clipboard.writeText(content);
  ElMessage({
    message: "已复制",
    type: "info"
  });
}

function removeMessage(index) {
  if(state.model.thinking){
    stopThinking();
    return;
  }
  confirmDialog("移除消息", "确认移除这条消息？", "确定", "取消", () => {
    const headId = selectedMessages.value.headId;
    const data = selectedMessages.value.data;
    data.splice(index, 1);
    state.message.data[headId] = data;
    stateStroge.set(state.message.key, state.message.data);
    stateStroge.set(state.lastMessage.key, {
      headId: headId,
      data: data
    });
  });
}

function editHeadMessage(index) {
  state.tempHeadMsg = {};
  copy(state.headMessage.data[index], state.tempHeadMsg);
}

function changeHeadMsg(index) {
  const msg = state.headMessage.data[index];
  msg.content = state.tempHeadMsg.content;
  state.tempHeadMsg = null;
  stateStroge.set(state.headMessage.key, state.headMessage.data);
}

function selectMessages(index) {
  const headMessage = state.headMessage.data[index];
  const data = {
    headId: headMessage.id,
    data: state.message.data[headMessage.id]
  };
  state.lastMessage.data = data;
  selectedMessages.value = data;
  stateStroge.set(state.lastMessage.key, data);
}

function stopThinking() {
  state.model.cancelToken.cancel();
  clearThinking();
}

function clearThinking() {
  state.model.thinking = false;
  state.model.cancelToken = null;
}

function freshResponse(index) {
  if(state.model.thinking){
    stopThinking();
    return;
  }
  function setItem(data)
  { 
    const selectedHeadId = selectedMessages.value.headId;
    state.message.data[selectedHeadId] = data;
    stateStroge.set(state.message.key,state.message.data);
    stateStroge.set(state.lastMessage.key,{
      headId:selectedHeadId,
      data:data
    });
  }
 
  const data = selectedMessages.value.data;
  const message = data[index];
  message.content = "";
  message.normal = true;
  data[index-1].normal = true;
  swapArrayItem(data, index - 1, data.length - 2)
  swapArrayItem(data, index, data.length - 1);
  const cancelToken = createCancelToken();
  state.model.thinking = true;
  Chat(data.filter(m=>m.normal), state.userSearch, state.model.used(), cancelToken.token, res => {
    const content = res.data;
    let i = 0;
    const timer = setInterval(() => {
      if (!state.model.thinking) {
        clearInterval(timer);
        setItem(data,false);
        return;
      }
      data[data.length - 1].content = content.slice(0, i + 1);
      msgsEle.value.scroll({top:msgsEle.value.scrollHeight,behavior:"smooth"});
      i++;
      if (i == content.length)
        clearThinking(); 
    }, 50);
  }, () => {
    message.content = "系统出现错误或者加载超时！";
    message.normal = false;
    data[index-1].normal = false;
    setItem(data);
    clearThinking();
  });
  state.model.cancelToken = cancelToken;
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

#home .messages .messages-content {
  height: 84%;
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

.head-messages .head:active {
  background-color: blue;
}

.messages .send {
  position: absolute;
  bottom: 1%;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
}

.messages .stop {
  position: absolute;
  bottom: 12%;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
}

.messages .func-image {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
}

.head-messages .head-message {
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

.head-message:hover {
  background-color: blueviolet;
  color: white;
}

.head-message .msg-content {
  width: 85%;
  overflow: hidden;
  text-wrap: nowrap;
  text-overflow: ellipsis;
  font-size: 13px;
  text-align: left;
  text-indent: 1.5px;
}

#home .role {
  display: flex;
  width: 100%;
  height: 42px;
  align-items: center;
}

#home .role-user {
  justify-content: flex-end;
}

#home .role-ai {
  justify-content: flex-start;
}

.role .date-str {
  font-size: 13px;
  color: gray;
  margin: 0 5px;
}

.messages .message-body {
  position: relative;
}

.message-body .body-content {
  line-height: 22px;
  padding: 1%;
  border-radius: 5px;
  width: fit-content;
  text-align: left;
  font-size: 14px;
  height: fit-content;
  text-wrap: wrap;
  min-height: 30px;
}

.message-body .content-user {
  background-color: rgb(0, 147, 205);
  color: white;
}

.message-body .content-ai {
  background-color: white;
}

.message-body .detail-left,
.message-body .detail-right {
  display: flex;
  padding: 0 1%;
}

.message-body .detail-left {
  justify-content: flex-start;
}

.message-body .detail-right {
  justify-content: flex-end;
}

.message-body .tools {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-end;
  align-items: center;
}

.message-body .tools-right {
  margin-left: 3px;
}

.message-body .tools-left {
  margin-right: 2px;
}

.message-body .el-icon {
  cursor: pointer;
}

.head-messages .headmsg-edit {
  display: flex;
  width: 85%;
  align-items: center;
  justify-content: center;
}
</style>