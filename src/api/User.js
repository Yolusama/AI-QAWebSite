import { authorization, Get, Patch, Post } from "./Api";

const userType = [];
userType[2] = "普通用户";
userType[3] = "VIP用户";
userType[1] = "管理员";
const _userType = {};
_userType['1'] = userType[1];
_userType['2'] = userType[2];
_userType['3'] = userType[3];

export function getUserType(type)
{
   return userType[type];
}

export function UserType()
{ 
    return _userType;
}


export async function Login(account,password,successCallback)
{
   await Post("/Admin/Login",{},{
        account:account,
        password:password
    },successCallback);
}

export async function GetUsers(pagination,queryKey,status,role,successCallback){
    await Get(`/Admin/GetUsers?page=${pagination.current}&pageSize=${pagination.size}&queryKey=${queryKey}&status=${status}&role=${role}`,
        authorization(),successCallback
    );
}

export async function ChangeStatus(userId,status,successCallback) {
    await Patch(`/Admin/ChangeStatus/${userId}?status=${status}`,authorization(),{},successCallback);
}

export async function Logout(userId,email,successCallback) {
    await Post(`/Index/Logout/${userId}?cancelAccount=false&email=${email}`,authorization(),{},successCallback);
}
