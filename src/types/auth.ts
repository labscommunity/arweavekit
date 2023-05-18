type Permissions =
  | 'ACCESS_ADDRESS'
  | 'ACCESS_PUBLIC_KEY'
  | 'ACCESS_ALL_ADDRESSES'
  | 'SIGN_TRANSACTION'
  | 'DISPATCH'
  | 'ENCRYPT'
  | 'DECRYPT'
  | 'SIGNATURE'
  | 'ACCESS_ARWEAVE_CONFIG';

export interface ConnectProps {
  permissions: Permissions[];
  appInfo?: {
    name?: string;
    logo?: string;
  };
  gateway?: {
    host: string;
    port: number;
    protocol: 'http' | 'https';
  };
}

export interface UserDetailsReturnProps {
  contract_id: string,
  given_name: string,
  family_name: string,
  nickname: string,
  name: string,
  picture: string,
  locale: string,
  email: string,
  email_verified: string,
  sub: string,
}

export interface OthentInstanceConenctionProps {
  apiId: string,
}
