from project.Common.entity.ActionResult import response, make_result, make_data_result
from project.Common.funtional import ai


# Create your views here.

def heartbeat(request):
        return response(make_result(message="这是心跳请求",ok=True));


def answer(request):
    print(request)
    question = request.GET.get("question")
    res = ai.transport([{
            "role": "user",
            "content": question
    }])
    return response(make_data_result("恢复",True,res))
