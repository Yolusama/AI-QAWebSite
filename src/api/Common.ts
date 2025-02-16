import { asyncApi } from "./Api";


export async function Heartbeat(){
   await asyncApi.get("/Common/Heartbeat",{});
}