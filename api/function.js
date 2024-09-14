export async function onRequest(context) {
    const { request, next } = context;
    const url = new URL(request.url);
  
    
    const response = await fetch(`http://ec2-43-201-19-45.ap-northeast-2.compute.amazonaws.com:8080${url.pathname}`);
    return next.Response.json(await response.json());
  }