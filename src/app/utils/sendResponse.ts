import { Response } from "express";

interface TResponse<T> {
  message: string;
  data?: T;
  statusCode?: number;
}

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data?.statusCode || 200).json({
    success: true,
    status: data?.statusCode || 200,
    message: data.message,
    data: data.data,
  });
};

export default sendResponse;
