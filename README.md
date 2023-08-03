# ArweaveKit

## Introduction

ArweaveKit aims to lower the barrier of onboarding and building on Arweave by creating a well documented one-stop library.

## Installation

Run the following command to install the package using npm or yarn

```
npm install arweavekit

#OR

yarn add arweavekit
```

## Usage

Functions from specific function types can be imported as follows:

```ts
import { createWallet } from 'arweavekit/wallet';

const wallet = await createWallet({
  seedPhrase: true,
  environment: 'local',
});
```

### Functions available

In this library, the following types of functions are available:

`Wallet Functions`: Functions associated with creating and using wallets. Read more [here](https://docs.arweavekit.com/wallets/introduction).

`Transaction Functions`: Functions associated with creating and interacting with transactions. Read more [here](https://docs.arweavekit.com/transactions/introduction).

`Contract Functions`: Functions associated with creating and interacting with contracts. Read more [here](https://docs.arweavekit.com/smart-contracts/introduction-to-smart-contracts).

`Encryption Functions`: Functions associated with encrypting and decrypting with encryption functions. Read more [here](https://docs.arweavekit.com/encryption/introduction-to-encryption).

`Auth Functions`: Functions associated with authentication. Authentication currently supports ArConnect only. Read more [here](https://docs.arweavekit.com/auth/introduction-to-auth).

### Understanding the docs

Every function has a dedicated page with the following information associated with it:

- Brief description of the function
- Basic syntax for function calls
- Input parameters for the function
  - Parameters with the `optional` keyword means they are optional. Parameters that do not have this keyword are required and must be passed in for successful function calls.
- Returned data for function calls

Read the docs [here](https://community-labs.gitbook.io/arweavekit-docs/permawebjs/introduction)
