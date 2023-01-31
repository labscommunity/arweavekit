import { Exm, ContractType } from '@execution-machine/sdk';
import dotenv from 'dotenv';
import {
  CreateServerlessProps,
  CreateServerlessReturnProps,
  ReadserverlessProps,
  WriteserverlessProps,
} from '../../types/serverless';

dotenv.config();

jest.setTimeout(30000);

export async function createServerlessFunction(
  params: CreateServerlessProps
): Promise<CreateServerlessReturnProps> {
  let initialState = '{}';

  if (params.initialState) {
    if (typeof params.initialState === 'object') {
      initialState = JSON.stringify(params.initialState);
    } else {
      initialState = String(params.initialState);
    }
  }

  const body = {
    initState: initialState,
    contractOwner: '',
    contentType: 'application/javascript',
    contractSrc: Array.from(params.functionSource.values()),
  };

  const url = `https://api.exm.dev/api/contract/deploy?token=${params.token}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const { id: functionId } = await response.json();

  let result = {
    status: 404,
    statusText: 'UNSUCCESSFUL',
  };
  if (functionId) {
    result = {
      status: 200,
      statusText: 'SUCCESSFUL',
    };
  }

  const functionUrl = `https://${functionId}.exm.run`;
  const functionSource = `https://arweave.net/${functionId}`;

  return { functionId, functionUrl, functionSource, result };
}

export async function writeServerlessFunction(params: WriteserverlessProps) {
  const exm = new Exm({
    token: params.token as string,
  });

  const inputs = [{ ...params.inputs }];

  const { status, data } = await exm.functions.write(params.functionId, inputs);

  const state = data.execution.state;

  return { status, data, state };
}

export async function readServerlessFunction(params: ReadserverlessProps) {
  const exm = new Exm({ token: params.token });

  const state = await exm.functions.read(params.functionId);

  return { state };
}
