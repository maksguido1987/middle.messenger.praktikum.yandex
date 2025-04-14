export interface Response {
  status: (code: number) => Response;
  json: (data: unknown) => void;
  redirect: (url: string) => void;
}

export interface Router {
  post: (path: string, ...handlers: ((req: unknown, res: Response) => void)[]) => void;
  get: (path: string, ...handlers: ((req: unknown, res: Response) => void)[]) => void;
  put: (path: string, ...handlers: ((req: unknown, res: Response) => void)[]) => void;
  delete: (path: string, ...handlers: ((req: unknown, res: Response) => void)[]) => void;
}
