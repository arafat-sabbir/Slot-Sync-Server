export type TErrorSources = {
  path: string | number;
  message: string;
}[];

export type TGenericErrorResponse = {
  statusCode: number;
  success: boolean;
  message: string | string[];
  errorSources?: TErrorSources;
};
