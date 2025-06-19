import { HttpStatus, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class Feature {
  protected loggable = false;

  protected responseSuccess(
    status: number = HttpStatus.OK,
    message = 'Operation successful',

    data: any = null,
  ) {
    return {
      status: status,
      response: {
        statusCode: status,
        message: message,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data: data,
      },
    };
  }

  protected responseError(
    status: number = HttpStatus.BAD_REQUEST,
    message = 'Something went wrong, Please try again later',

    data: any = null,
  ) {
    this.setLogger(data);
    return {
      status: status,
      response: {
        statusCode: status,
        message: message,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data: data,
      },
    };
  }

  protected setLogger(error: any): void {
    if (this.loggable) {
      Logger.debug(error);
    }
  }
}
