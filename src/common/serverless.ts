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
  const url = `${URL}/api/transactions?token=${params.token}`;
  const inputs = [{ ...params.inputs }];

  const body = {
    functionId: params.functionId,
    inputs: [
      {
        input: JSON.stringify(inputs),
        tags: [],
      },
    ],
  };

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  let result = {
    status: 404,
    statusText: 'UNSUCCESSFUL',
  };

  const { status, data } = await response.json();

  if (status === 'SUCCESS') {
    result = {
      status: 200,
      statusText: 'SUCCESSFUL',
    };
  }

  return { data, result };
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
