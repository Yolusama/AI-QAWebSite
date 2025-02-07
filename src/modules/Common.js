import { ElLoading } from "element-plus";
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

export function percentage(current,total)
{
    return current>=total ? 100 : ((current/total).toPrecision(2))*100;
}

export function getFileSuffix(fileName)
{
  return fileName.substring(fileName.lastIndexOf('.')+1);
}

export const DefaultAvatar = "default.png";

export function getVersionType(type){
   switch(type){
      case 1:return "正式版";
      case 2:return "α测试版";
      case 3:return "β测试版";
      case 4:return "γ测试版";
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
