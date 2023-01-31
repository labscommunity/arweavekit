export interface CreateServerlessProps {
  token: string;
  functionSource: Uint8Array;
  initialState: string | object;
}
export interface CreateServerlessReturnProps {
  functionId: string;
  functionUrl: string;
  functionSource: string;
  result: {
    status: number;
    statusText: string;
  };
}
export interface ReadserverlessProps {
  token: string;
  functionId: string;
}

export interface WriteserverlessProps extends ReadserverlessProps {
  inputs: {};
}
