import json

from project.Common.entity.ActionResult import (
    response, make_result, make_data_result)
from project.Common.funtional import ai, random_head_message_id


# Create your views here.

def heartbeat(request):
        return response(make_result(message="这是心跳请求",ok=True));


def answer(request):
    data = json.loads(request.body)
    messages = data.get("messages")
    use_search = data.get("userSearch")
    model = data.get("model")
    res = ai.transport(messages,use_search,model)
    return response(make_data_result("回复",True,res))

def gen_head_message_id(request):
    res = random_head_message_id();
    return response(make_data_result("生成头信息id",True,res))