export interface CreateServerlessProps {
  token: string;
  functionSource: Uint8Array;
  initialState: string;
}

export interface ReadserverlessProps {
  token: string;
  functionId: string;
}

export interface WriteserverlessProps extends ReadserverlessProps {
  inputs: {}[];
}
