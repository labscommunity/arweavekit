import { Exm, ContractType } from '@execution-machine/sdk';
import dotenv from 'dotenv';
import {
  CreateServerlessProps,
  CreateServerlessReturnProps,
  ReadserverlessProps,
  WriteserverlessProps,
} from '../types/serverless';

dotenv.config();

export async function createServerlessFunction(
  params: CreateServerlessProps
): Promise<CreateServerlessReturnProps> {
  const exm = new Exm({
    token: params.token as string,
  });

  const { id: functionId } = await exm.functions.deploy(
    params.functionSource,
    params.initialState,
    ContractType.JS
  );

  const functionUrl = `https://${functionId}.exm.run`;
  const functionSource = `https://arweave.net/${functionId}`;

  return { functionId, functionUrl, functionSource };
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
