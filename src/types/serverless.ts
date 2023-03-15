import { SimulateInput } from '@three-em/node';
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
export interface ReadServerlessProps {
  token: string;
  functionId: string;
}

export interface WriteServerlessProps extends ReadServerlessProps {
  inputs: {};
}

export interface TestServerlessFunctionProps {
  functionSource: Uint8Array;
  functionInitState: any;
  functionWrites: SimulateInput[];
}
