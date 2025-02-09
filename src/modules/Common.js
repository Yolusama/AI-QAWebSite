import { ElLoading, ElMessageBox } from "element-plus";
import Route from "./Route";

export function copy(src,to)
{
  for(let pro in src)
    to[pro] = src[pro];
}

export function DelayToRun(func,expire)
{
  const timer = setTimeout(()=>{
    func();
    clearInterval(timer);
  },expire);
}

export const defalutLodingColor = "rgba(235,235,236,.75)";

export function LoadingOperate(
  fullscreen,
  title,
  backgroundColor,
  func,
  expire,
  selector="body"
) {
  const instance = ElLoading.service({
    fullscreen: fullscreen,
    target: selector,
    background: backgroundColor,
    text: title,
  });
  const timer = setTimeout(() => {
    instance.close();
    func();
    clearTimeout(timer);
  }, expire);
}

export function BeforeRouteLeave(to,from,next,notPrevented)
{
 if (notPrevented) {
   next();
 }
 if (to.redirectedFrom != undefined) {
   Route.switch("#" + from.fullPath);
 }
 next(from);
}

export function PageOption(current,size,total,sizes)
{
  this.data = [];
  this.current = current;
  this.size = size;
  this.total = total;
  this.maxPage =function(){
    return Math.ceil(this.total/this.size);
  };
  this.sizes = sizes;
}

export function previewOpenFile(file,func)
{
  if (file) {
    var reader = new FileReader();

    reader.onload = function (e) {
      func(e.target.result);
    };
    reader.readAsDataURL(file);
  } 
}
export function onlyDate(date=new Date()){
     const res = new Date(date);
     res.setHours(0);
     res.setMinutes(0);
     res.setSeconds(0);
     res.setMilliseconds(0);
     return res;
}

export function StorageFormat(key,data){
  this.key = key;
  this.data = data;
}

export const ChatRole = {
  user:"user",
  assistant:"assistant",
  sytstem:"system"
}

export function ChatMessage(role,content){
      this.role = role;
      this.content = content;
      this.time = new Date();
}

export function getTimeStr(date){
  const year = date.getFullYear();
  function withZeroStr(num){
    return num>=10 ? num : "0" + num;
  }
  return `${year}-${withZeroStr(date.getMonth()+1)}-${withZeroStr(date.getDate())}`+
           ` ${withZeroStr(date.getHours())}:${withZeroStr(date.getMinutes())}`;
}

export function confirmDialog(title,content,confirmButtonText,cancelButtonText,successCallback,failCallback=()=>{}){
   ElMessageBox.confirm(
    content,
    title,
    {
      confirmButtonText:confirmButtonText,
      cancelButtonText:cancelButtonText
    }
   ).then(successCallback).catch(failCallback);
}

export function swapArrayItem(array,index1,index2){
  const temp = array[index1];
  array[index1] = array[index2];
  array[index2] = temp;
}