import { Exm, ContractType } from '@execution-machine/sdk';
import dotenv from 'dotenv';
import {
  CreateServerlessProps,
  WriteserverlessProps,
} from '../types/serverless';

dotenv.config();

export async function createServerlessFunction(input: CreateServerlessProps) {
  const exm = new Exm({ token: input.token });

  const deployment = await exm.functions.deploy(
    input.functionSource,
    input.initialState,
    ContractType.JS
  );

  return { deployment };
}

export async function writeServerlessFunction(input: WriteserverlessProps) {
  const exm = new Exm({ token: input.token });

  const write = await exm.functions.write(input.functionId, input.inputs);

  return { write };
}

export async function readServerlessFunction(input: WriteserverlessProps) {
  const exm = new Exm({ token: input.token });

  const read = await exm.functions.read(input.functionId);

  return { read };
}
