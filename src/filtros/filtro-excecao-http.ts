import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Request, Response } from "express";

@Catch(HttpException)
export class FiltroExcecaoHttp implements ExceptionFilter{
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log(exception)

    const contexto = host.switchToHttp()
    const resposta = contexto.getResponse<Response>()
    const requisicao = contexto.getRequest<Request>()

    const { status, body } = exception instanceof HttpException
      ? {
        status: exception.getStatus(),
        body: exception.getResponse(),
      }
      : {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        body: {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          timestamp: new Date().toISOString(),
          path: requisicao.url,
        },
      };

    resposta.status(status).json(body);
  }
}