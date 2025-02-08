import { GetAsync } from "./Api";


export async function Heartbeat(){
   await GetAsync("/Common/Heartbeat",{});
}