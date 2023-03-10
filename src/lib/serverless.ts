import { Exm } from '@execution-machine/sdk';
import {
  CreateServerlessProps,
  CreateServerlessReturnProps,
  ReadserverlessProps,
  WriteserverlessProps,
} from '../types/serverless';

const URL = 'https://api.exm.dev';

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

  const url = `${URL}/api/contract/deploy?token=${params.token}`;

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
  const exm = new Exm({ token: params.token });

  const inputs = [{ ...params.inputs }];

  const { data, status } = await exm.functions.write(params.functionId, inputs);

  let responseStatus = {
    code: 404,
    message: 'UNSUCCESSFUL',
  };

  if (status === 'SUCCESS') {
    responseStatus = {
      code: 200,
      message: 'SUCCESSFUL',
    };
  }

  return { data, responseStatus };
}

export async function readServerlessFunction(params: ReadserverlessProps) {
  const url = `${URL}/read/${params.functionId}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const state = await response.json();

  return state;
}
