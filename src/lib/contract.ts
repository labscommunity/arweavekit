import {
  DeployPlugin,
  ArweaveSigner,
  InjectedArweaveSigner,
  InjectedEthereumSigner,
  EthereumSigner,
} from 'warp-contracts-plugin-deploy';
import {
  JWKInterface,
  Tag,
  WarpFactory,
  defaultCacheOptions,
} from 'warp-contracts';
import * as Types from '../types/contract';
import { Othent as othent } from 'othent';
import { ethers } from 'ethers';
import { PermissionType } from 'arconnect';

/**
 * Get a Warp instance based on the specified environment and options.
 * @param environment - The environment ('local', 'testnet', or 'mainnet').
 * @param useDeployPlugin - Whether to use the DeployPlugin (Default: false).
 * @param cacheOptions - Options for caching (defaults {@link defaultCacheOptions}).
 * @returns An instance of Warp.
 */
const getWarpInstance = (
  environment: 'local' | 'testnet' | 'mainnet',
  useDeployPlugin = false,
  cacheOptions = defaultCacheOptions
) => {
  // Set dbLocation randomly for testing purposes only
  // to avoid database is not open issue
  if (process.env.NODE_ENV === 'test') {
    const randomWord = Math.random().toString(36).substring(2, 7);
    cacheOptions.dbLocation = `./cache/${randomWord}`;
  }
  const warp =
    environment === 'local'
      ? WarpFactory.forLocal()
      : environment === 'testnet'
      ? WarpFactory.forTestnet(cacheOptions)
      : WarpFactory.forMainnet(cacheOptions);

  if (useDeployPlugin) {
    warp.use(new DeployPlugin());
  }

  return warp;
};

/**
 * Check if the passed argument is a valid JSON Web Key (JWK) for Arweave.
 * @param obj - The object to check for JWK validity.
 * @returns {boolean} True if it's a valid Arweave JWK, otherwise false.
 */
const isJwk = (obj: any): boolean => {
  if (typeof obj !== 'object') return false;
  const requiredKeys = ['n', 'e', 'd', 'p', 'q', 'dp', 'dq', 'qi'];
  return requiredKeys.every((key) => key in obj);
};

/**
 * Checks if the passed key is a valid Ethereum private key.
 * @param key - The key to check for Ethereum private key validity.
 * @returns {boolean} True if it's a valid Ethereum private key, otherwise false.
 */
const isEthPrivateKey = (key: any): boolean => {
  if (typeof key !== 'string') return false;
  const privateKeyRegex = /^[0-9a-fA-F]{64}$/;
  key = key.startsWith('0x') ? key.substring(2) : key;
  return key.length === 64 && privateKeyRegex.test(key);
};

/**
 * Check if passed address is a valid Arweave address.
 * @param address - Arweave address
 * @returns
 */
function isValidArweaveAddress(address: string) {
  if (typeof address !== 'string' || address.length !== 43) {
    return false;
  }

  const ADDRESS_REGEX = /^[A-Za-z0-9_-]+$/;
  if (!ADDRESS_REGEX.test(address)) {
    return false;
  }

  return true;
}

/**
 * Initialize wallet and run callback function
 * @param params CreateContractProps | WriteContractProps
 * @param callback Callback function
 * @returns wallet and callback function response
 */
async function initWalletCallback(
  params: Types.CreateContractProps | Types.WriteContractProps,
  callback: (wallet: any) => Promise<any>
) {
  let wallet: any;
  let callbackResponse: any;

  const handleArweaveWallet = async () => {
    const permissions = await window.arweaveWallet.getPermissions();
    const requiredPermissions = [
      'ACCESS_PUBLIC_KEY',
      'SIGNATURE',
      'SIGN_TRANSACTION',
    ];

    const missingPermissions = requiredPermissions.filter(
      (permission) => permissions.indexOf(permission as PermissionType) === -1
    );

    if (permissions.length === 0 || missingPermissions.length > 0) {
      // await window.arweaveWallet.disconnect();
      await window.arweaveWallet.connect([
        ...permissions,
        ...missingPermissions,
      ] as PermissionType[]);
    }
    wallet = new InjectedArweaveSigner(window.arweaveWallet);
    await wallet.setPublicKey();
  };

  const handleEthereumWallet = async () => {
    await window.ethereum?.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.BrowserProvider(window.ethereum!);
    const signer = await provider.getSigner();
    // @ts-ignore
    provider.getSigner = () => signer;

    // @ts-ignore
    wallet = new InjectedEthereumSigner(provider);
    await wallet.setPublicKey();
  };

  if (params.wallet === 'use_wallet') {
    callbackResponse = await callback(params.wallet);
    return { wallet: params.wallet, callbackResponse };
  }

  if (typeof window !== 'undefined') {
    if (params.strategy === 'arweave' && window.arweaveWallet) {
      await handleArweaveWallet();
    } else if (
      params.strategy === 'ethereum' &&
      window.ethereum &&
      !!window.ethereum?.request
    ) {
      await handleEthereumWallet();
    } else {
      try {
        await handleEthereumWallet();
        callbackResponse = await callback(wallet);
      } catch (err) {
        console.log(`[ArweaveKit] ${err}`);
        if (window.arweaveWallet) {
          await handleArweaveWallet();
          callbackResponse = await callback(wallet);
        } else {
          throw new Error('[ArweaveKit] Failed to initialize signer');
        }
      }
    }
  } else {
    if (params.strategy === 'arweave' && isJwk(params.wallet)) {
      wallet =
        params.environment === 'local' ||
        (params as Types.WriteContractProps)?.contractTxId
          ? params.wallet
          : new ArweaveSigner(params.wallet as JWKInterface);
    } else if (
      params.strategy === 'ethereum' &&
      isEthPrivateKey(params.wallet)
    ) {
      wallet = new EthereumSigner(params.wallet as string);
    } else {
      try {
        wallet = new EthereumSigner(params.wallet as string);
        callbackResponse = await callback(wallet);
      } catch (err) {
        console.log(`[ArweaveKit] ${err}`);
        if (isJwk(params.wallet)) {
          wallet =
            params.environment === 'local' ||
            (params as Types.WriteContractProps)?.contractTxId
              ? params.wallet
              : new ArweaveSigner(params.wallet as JWKInterface);
          callbackResponse = await callback(wallet);
        } else {
          throw new Error('[ArweaveKit] Failed to initialize signer');
        }
      }
    }
  }

  if (!callbackResponse) {
    callbackResponse = await callback(wallet);
  }

  return { wallet, callbackResponse };
}

/**
 * Initialize strategy based on wallet
 * @param params - CreateContractProps | WriteContractProps
 */
function initStrategy(
  params: Types.CreateContractProps | Types.WriteContractProps
) {
  if (typeof window === 'undefined') {
    params.strategy = isJwk(params.wallet)
      ? 'arweave'
      : isEthPrivateKey(params.wallet)
      ? 'ethereum'
      : 'both';
  } else {
    params.strategy = params.strategy || 'both';
  }
}

/***
 * create warp contract
 * @params CreateContractProps
 * @returns CreateContractReturnProps
 */
export async function createContract(
  params: Types.CreateContractProps
): Promise<Types.CreateContractReturnProps> {
  let status: number = 400;
  let statusText: string = 'UNSUCCESSFUL';
  const warp = getWarpInstance(params.environment, true);
  initStrategy(params);

  if (params.environment === 'local' && isJwk(params.wallet)) {
    await warp.testing
      .addFunds(params.wallet as JWKInterface)
      .catch((e) => console.log('ERROR', e.message));
  }

  const callback = async (wallet: any) => {
    const disableBundling =
      wallet === 'use_wallet' || params.environment === 'local';
    const contractData = {
      wallet,
      initState: params.initialState,
      evaluationManifest: params.evaluationManifest,
      tags: params.tags,
      data: params.data,
    };
    if (
      typeof params.contractSource === 'string' &&
      isValidArweaveAddress(params.contractSource)
    ) {
      return warp.deployFromSourceTx(
        { ...contractData, srcTxId: params.contractSource },
        disableBundling
      );
    } else {
      return warp.deploy(
        { ...contractData, src: params.contractSource },
        disableBundling
      );
    }
  };

  const { wallet, callbackResponse } = await initWalletCallback(
    params,
    callback
  );

  let contractTxId = callbackResponse?.contractTxId;

  const contract = warp.contract(contractTxId).connect(wallet);

  if (contractTxId) {
    status = 200;
    statusText = 'SUCCESSFUL';
  }

  return {
    contract,
    contractTxId,
    result: {
      status,
      statusText,
    },
  };
}

/**
 * write to warp contract
 * @params WriteContractProps
 */

export async function writeContract(params: Types.WriteContractProps) {
  const warp = getWarpInstance(params.environment);
  initStrategy(params);

  let status: number = 400;
  let statusText: string = 'UNSUCCESSFUL';

  const callback = async (wallet: any) => {
    const contract = warp
      .contract(params.contractTxId)
      .setEvaluationOptions({ ...params.evaluationOptions })
      .connect(wallet);

    return contract.writeInteraction(params.options, {
      tags: [
        ...(params.tags || []),
        { name: 'ArweaveKit', value: '1.4.9' },
      ] as Tag[],
      vrf: params.vrf,
      disableBundling:
        wallet === 'use_wallet' || params.environment === 'local',
    });
  };
  let { wallet, callbackResponse } = await initWalletCallback(params, callback);

  const contract = warp.contract(params.contractTxId).connect(wallet);

  const readState = await contract.readState();

  if (callbackResponse?.originalTxId) {
    status = 200;
    statusText = 'SUCCESSFUL';
  }

  return {
    writeContract: callbackResponse,
    state: readState.cachedValue.state,
    result: {
      status,
      statusText,
    },
  };
}

/**
 * read state of warp contract
 * @params ReadContractProps
 */

export async function readContractState(params: Types.ReadContractProps) {
  const warp = getWarpInstance(params.environment, false, {
    ...defaultCacheOptions,
    inMemory: true,
  });

  let status: number = 400;
  let statusText: string = 'UNSUCCESSFUL';

  const contract = warp
    .contract(params.contractTxId)
    .setEvaluationOptions({ ...params.evaluationOptions });

  const readContract = await contract.readState();

  if (readContract.sortKey && readContract.cachedValue) {
    status = 200;
    statusText = 'SUCCESSFUL';
  }

  return {
    readContract,
    result: {
      status,
      statusText,
    },
  };
}

/**
 * get contract
 * @params contractTxId: string
 * @returns Contract
 */
export async function getContract(contractTxId: string) {
  const url = 'https://gateway.warp.cc/gateway';

  const response = await fetch(`${url}/contract?txId=${contractTxId}`, {
    method: 'GET',
  });

  const contract = await response.json();
  return { contract };
}

/**
 * writeContractWOthent
 * @params WriteContractWOthentProps
 * @returns WriteContractWOthentReturnProps
 */

export async function writeContractWOthent(
  params: Types.WriteContractWOthentProps
): Promise<Types.WriteContractWOthentReturnProps> {
  const othentInstance = await othent({
    API_ID: params.apiId,
  });
  const signedTransaction = await othentInstance.signTransactionWarp({
    othentFunction: params.othentFunction,
    data: params.data,
    tags: [{ name: 'ArweaveKit', value: '1.4.9' }],
  });

  const postedTransaction = await othentInstance.sendTransactionWarp(
    signedTransaction
  );

  if (postedTransaction.success) {
    return postedTransaction as Types.WriteContractWOthentReturnProps;
  } else {
    throw new Error('Transaction creation unsuccessful.');
  }
}

/**
 * readContractWOthent
 * @params ReadContractWOthentProps
 * @returns ReadContractWOthentReturnProps
 */

export async function readContractWOthent(
  params: Types.ReadContractWOthentProps
): Promise<Types.ReadContractWOthentReturnProps> {
  const othentInstance = await othent({
    API_ID: params.apiId,
  });
  const res = await othentInstance.readCustomContract({
    contract_id: params.contractTxId,
  });

  return res;
}
