/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../../../../common";

export interface IPoolAddressesProviderInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "getACLAdmin"
      | "getACLAdmin()"
      | "getACLManager"
      | "getACLManager()"
      | "getAddress"
      | "getAddress(bytes32)"
      | "getMarketId"
      | "getMarketId()"
      | "getPool"
      | "getPool()"
      | "getPoolConfigurator"
      | "getPoolConfigurator()"
      | "getPoolDataProvider"
      | "getPoolDataProvider()"
      | "getPriceOracle"
      | "getPriceOracle()"
      | "getPriceOracleSentinel"
      | "getPriceOracleSentinel()"
      | "setACLAdmin"
      | "setACLAdmin(address)"
      | "setACLManager"
      | "setACLManager(address)"
      | "setAddress"
      | "setAddress(bytes32,address)"
      | "setAddressAsProxy"
      | "setAddressAsProxy(bytes32,address)"
      | "setMarketId"
      | "setMarketId(string)"
      | "setPoolConfiguratorImpl"
      | "setPoolConfiguratorImpl(address)"
      | "setPoolDataProvider"
      | "setPoolDataProvider(address)"
      | "setPoolImpl"
      | "setPoolImpl(address)"
      | "setPriceOracle"
      | "setPriceOracle(address)"
      | "setPriceOracleSentinel"
      | "setPriceOracleSentinel(address)"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "ACLAdminUpdated"
      | "ACLAdminUpdated(address,address)"
      | "ACLManagerUpdated"
      | "ACLManagerUpdated(address,address)"
      | "AddressSet"
      | "AddressSet(bytes32,address,address)"
      | "AddressSetAsProxy"
      | "AddressSetAsProxy(bytes32,address,address,address)"
      | "MarketIdSet"
      | "MarketIdSet(string,string)"
      | "PoolConfiguratorUpdated"
      | "PoolConfiguratorUpdated(address,address)"
      | "PoolDataProviderUpdated"
      | "PoolDataProviderUpdated(address,address)"
      | "PoolUpdated"
      | "PoolUpdated(address,address)"
      | "PriceOracleSentinelUpdated"
      | "PriceOracleSentinelUpdated(address,address)"
      | "PriceOracleUpdated"
      | "PriceOracleUpdated(address,address)"
      | "ProxyCreated"
      | "ProxyCreated(bytes32,address,address)"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "getACLAdmin",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getACLAdmin()",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getACLManager",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getACLManager()",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getAddress",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getAddress(bytes32)",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getMarketId",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getMarketId()",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "getPool", values?: undefined): string;
  encodeFunctionData(functionFragment: "getPool()", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getPoolConfigurator",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getPoolConfigurator()",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getPoolDataProvider",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getPoolDataProvider()",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getPriceOracle",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getPriceOracle()",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getPriceOracleSentinel",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getPriceOracleSentinel()",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setACLAdmin",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setACLAdmin(address)",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setACLManager",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setACLManager(address)",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setAddress",
    values: [BytesLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setAddress(bytes32,address)",
    values: [BytesLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setAddressAsProxy",
    values: [BytesLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setAddressAsProxy(bytes32,address)",
    values: [BytesLike, AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "setMarketId", values: [string]): string;
  encodeFunctionData(
    functionFragment: "setMarketId(string)",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "setPoolConfiguratorImpl",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setPoolConfiguratorImpl(address)",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setPoolDataProvider",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setPoolDataProvider(address)",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setPoolImpl",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setPoolImpl(address)",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setPriceOracle",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setPriceOracle(address)",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setPriceOracleSentinel",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setPriceOracleSentinel(address)",
    values: [AddressLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "getACLAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getACLAdmin()",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getACLManager",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getACLManager()",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getAddress", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getAddress(bytes32)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getMarketId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getMarketId()",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getPool", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getPool()", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getPoolConfigurator",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPoolConfigurator()",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPoolDataProvider",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPoolDataProvider()",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPriceOracle",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPriceOracle()",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPriceOracleSentinel",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPriceOracleSentinel()",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setACLAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setACLAdmin(address)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setACLManager",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setACLManager(address)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setAddress", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setAddress(bytes32,address)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setAddressAsProxy",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setAddressAsProxy(bytes32,address)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setMarketId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setMarketId(string)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setPoolConfiguratorImpl",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setPoolConfiguratorImpl(address)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setPoolDataProvider",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setPoolDataProvider(address)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setPoolImpl",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setPoolImpl(address)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setPriceOracle",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setPriceOracle(address)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setPriceOracleSentinel",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setPriceOracleSentinel(address)",
    data: BytesLike
  ): Result;
}

export namespace ACLAdminUpdatedEvent {
  export type InputTuple = [oldAddress: AddressLike, newAddress: AddressLike];
  export type OutputTuple = [oldAddress: string, newAddress: string];
  export interface OutputObject {
    oldAddress: string;
    newAddress: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace ACLManagerUpdatedEvent {
  export type InputTuple = [oldAddress: AddressLike, newAddress: AddressLike];
  export type OutputTuple = [oldAddress: string, newAddress: string];
  export interface OutputObject {
    oldAddress: string;
    newAddress: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace AddressSetEvent {
  export type InputTuple = [
    id: BytesLike,
    oldAddress: AddressLike,
    newAddress: AddressLike
  ];
  export type OutputTuple = [
    id: string,
    oldAddress: string,
    newAddress: string
  ];
  export interface OutputObject {
    id: string;
    oldAddress: string;
    newAddress: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace AddressSetAsProxyEvent {
  export type InputTuple = [
    id: BytesLike,
    proxyAddress: AddressLike,
    oldImplementationAddress: AddressLike,
    newImplementationAddress: AddressLike
  ];
  export type OutputTuple = [
    id: string,
    proxyAddress: string,
    oldImplementationAddress: string,
    newImplementationAddress: string
  ];
  export interface OutputObject {
    id: string;
    proxyAddress: string;
    oldImplementationAddress: string;
    newImplementationAddress: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace MarketIdSetEvent {
  export type InputTuple = [oldMarketId: string, newMarketId: string];
  export type OutputTuple = [oldMarketId: string, newMarketId: string];
  export interface OutputObject {
    oldMarketId: string;
    newMarketId: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace PoolConfiguratorUpdatedEvent {
  export type InputTuple = [oldAddress: AddressLike, newAddress: AddressLike];
  export type OutputTuple = [oldAddress: string, newAddress: string];
  export interface OutputObject {
    oldAddress: string;
    newAddress: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace PoolDataProviderUpdatedEvent {
  export type InputTuple = [oldAddress: AddressLike, newAddress: AddressLike];
  export type OutputTuple = [oldAddress: string, newAddress: string];
  export interface OutputObject {
    oldAddress: string;
    newAddress: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace PoolUpdatedEvent {
  export type InputTuple = [oldAddress: AddressLike, newAddress: AddressLike];
  export type OutputTuple = [oldAddress: string, newAddress: string];
  export interface OutputObject {
    oldAddress: string;
    newAddress: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace PriceOracleSentinelUpdatedEvent {
  export type InputTuple = [oldAddress: AddressLike, newAddress: AddressLike];
  export type OutputTuple = [oldAddress: string, newAddress: string];
  export interface OutputObject {
    oldAddress: string;
    newAddress: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace PriceOracleUpdatedEvent {
  export type InputTuple = [oldAddress: AddressLike, newAddress: AddressLike];
  export type OutputTuple = [oldAddress: string, newAddress: string];
  export interface OutputObject {
    oldAddress: string;
    newAddress: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace ProxyCreatedEvent {
  export type InputTuple = [
    id: BytesLike,
    proxyAddress: AddressLike,
    implementationAddress: AddressLike
  ];
  export type OutputTuple = [
    id: string,
    proxyAddress: string,
    implementationAddress: string
  ];
  export interface OutputObject {
    id: string;
    proxyAddress: string;
    implementationAddress: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface IPoolAddressesProvider extends BaseContract {
  connect(runner?: ContractRunner | null): IPoolAddressesProvider;
  waitForDeployment(): Promise<this>;

  interface: IPoolAddressesProviderInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  getACLAdmin: TypedContractMethod<[], [string], "view">;

  "getACLAdmin()": TypedContractMethod<[], [string], "view">;

  getACLManager: TypedContractMethod<[], [string], "view">;

  "getACLManager()": TypedContractMethod<[], [string], "view">;

  getAddress: TypedContractMethod<[id: BytesLike], [string], "view">;

  "getAddress(bytes32)": TypedContractMethod<[id: BytesLike], [string], "view">;

  getMarketId: TypedContractMethod<[], [string], "view">;

  "getMarketId()": TypedContractMethod<[], [string], "view">;

  getPool: TypedContractMethod<[], [string], "view">;

  "getPool()": TypedContractMethod<[], [string], "view">;

  getPoolConfigurator: TypedContractMethod<[], [string], "view">;

  "getPoolConfigurator()": TypedContractMethod<[], [string], "view">;

  getPoolDataProvider: TypedContractMethod<[], [string], "view">;

  "getPoolDataProvider()": TypedContractMethod<[], [string], "view">;

  getPriceOracle: TypedContractMethod<[], [string], "view">;

  "getPriceOracle()": TypedContractMethod<[], [string], "view">;

  getPriceOracleSentinel: TypedContractMethod<[], [string], "view">;

  "getPriceOracleSentinel()": TypedContractMethod<[], [string], "view">;

  setACLAdmin: TypedContractMethod<
    [newAclAdmin: AddressLike],
    [void],
    "nonpayable"
  >;

  "setACLAdmin(address)": TypedContractMethod<
    [newAclAdmin: AddressLike],
    [void],
    "nonpayable"
  >;

  setACLManager: TypedContractMethod<
    [newAclManager: AddressLike],
    [void],
    "nonpayable"
  >;

  "setACLManager(address)": TypedContractMethod<
    [newAclManager: AddressLike],
    [void],
    "nonpayable"
  >;

  setAddress: TypedContractMethod<
    [id: BytesLike, newAddress: AddressLike],
    [void],
    "nonpayable"
  >;

  "setAddress(bytes32,address)": TypedContractMethod<
    [id: BytesLike, newAddress: AddressLike],
    [void],
    "nonpayable"
  >;

  setAddressAsProxy: TypedContractMethod<
    [id: BytesLike, newImplementationAddress: AddressLike],
    [void],
    "nonpayable"
  >;

  "setAddressAsProxy(bytes32,address)": TypedContractMethod<
    [id: BytesLike, newImplementationAddress: AddressLike],
    [void],
    "nonpayable"
  >;

  setMarketId: TypedContractMethod<[newMarketId: string], [void], "nonpayable">;

  "setMarketId(string)": TypedContractMethod<
    [newMarketId: string],
    [void],
    "nonpayable"
  >;

  setPoolConfiguratorImpl: TypedContractMethod<
    [newPoolConfiguratorImpl: AddressLike],
    [void],
    "nonpayable"
  >;

  "setPoolConfiguratorImpl(address)": TypedContractMethod<
    [newPoolConfiguratorImpl: AddressLike],
    [void],
    "nonpayable"
  >;

  setPoolDataProvider: TypedContractMethod<
    [newDataProvider: AddressLike],
    [void],
    "nonpayable"
  >;

  "setPoolDataProvider(address)": TypedContractMethod<
    [newDataProvider: AddressLike],
    [void],
    "nonpayable"
  >;

  setPoolImpl: TypedContractMethod<
    [newPoolImpl: AddressLike],
    [void],
    "nonpayable"
  >;

  "setPoolImpl(address)": TypedContractMethod<
    [newPoolImpl: AddressLike],
    [void],
    "nonpayable"
  >;

  setPriceOracle: TypedContractMethod<
    [newPriceOracle: AddressLike],
    [void],
    "nonpayable"
  >;

  "setPriceOracle(address)": TypedContractMethod<
    [newPriceOracle: AddressLike],
    [void],
    "nonpayable"
  >;

  setPriceOracleSentinel: TypedContractMethod<
    [newPriceOracleSentinel: AddressLike],
    [void],
    "nonpayable"
  >;

  "setPriceOracleSentinel(address)": TypedContractMethod<
    [newPriceOracleSentinel: AddressLike],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "getACLAdmin"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getACLAdmin()"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getACLManager"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getACLManager()"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getAddress"
  ): TypedContractMethod<[id: BytesLike], [string], "view">;
  getFunction(
    nameOrSignature: "getAddress(bytes32)"
  ): TypedContractMethod<[id: BytesLike], [string], "view">;
  getFunction(
    nameOrSignature: "getMarketId"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getMarketId()"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getPool"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getPool()"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getPoolConfigurator"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getPoolConfigurator()"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getPoolDataProvider"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getPoolDataProvider()"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getPriceOracle"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getPriceOracle()"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getPriceOracleSentinel"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getPriceOracleSentinel()"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "setACLAdmin"
  ): TypedContractMethod<[newAclAdmin: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setACLAdmin(address)"
  ): TypedContractMethod<[newAclAdmin: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setACLManager"
  ): TypedContractMethod<[newAclManager: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setACLManager(address)"
  ): TypedContractMethod<[newAclManager: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setAddress"
  ): TypedContractMethod<
    [id: BytesLike, newAddress: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setAddress(bytes32,address)"
  ): TypedContractMethod<
    [id: BytesLike, newAddress: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setAddressAsProxy"
  ): TypedContractMethod<
    [id: BytesLike, newImplementationAddress: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setAddressAsProxy(bytes32,address)"
  ): TypedContractMethod<
    [id: BytesLike, newImplementationAddress: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setMarketId"
  ): TypedContractMethod<[newMarketId: string], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setMarketId(string)"
  ): TypedContractMethod<[newMarketId: string], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setPoolConfiguratorImpl"
  ): TypedContractMethod<
    [newPoolConfiguratorImpl: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setPoolConfiguratorImpl(address)"
  ): TypedContractMethod<
    [newPoolConfiguratorImpl: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setPoolDataProvider"
  ): TypedContractMethod<[newDataProvider: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setPoolDataProvider(address)"
  ): TypedContractMethod<[newDataProvider: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setPoolImpl"
  ): TypedContractMethod<[newPoolImpl: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setPoolImpl(address)"
  ): TypedContractMethod<[newPoolImpl: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setPriceOracle"
  ): TypedContractMethod<[newPriceOracle: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setPriceOracle(address)"
  ): TypedContractMethod<[newPriceOracle: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setPriceOracleSentinel"
  ): TypedContractMethod<
    [newPriceOracleSentinel: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setPriceOracleSentinel(address)"
  ): TypedContractMethod<
    [newPriceOracleSentinel: AddressLike],
    [void],
    "nonpayable"
  >;

  getEvent(
    key: "ACLAdminUpdated"
  ): TypedContractEvent<
    ACLAdminUpdatedEvent.InputTuple,
    ACLAdminUpdatedEvent.OutputTuple,
    ACLAdminUpdatedEvent.OutputObject
  >;
  getEvent(
    key: "ACLAdminUpdated(address,address)"
  ): TypedContractEvent<
    ACLAdminUpdated_address_address_Event.InputTuple,
    ACLAdminUpdated_address_address_Event.OutputTuple,
    ACLAdminUpdated_address_address_Event.OutputObject
  >;
  getEvent(
    key: "ACLManagerUpdated"
  ): TypedContractEvent<
    ACLManagerUpdatedEvent.InputTuple,
    ACLManagerUpdatedEvent.OutputTuple,
    ACLManagerUpdatedEvent.OutputObject
  >;
  getEvent(
    key: "ACLManagerUpdated(address,address)"
  ): TypedContractEvent<
    ACLManagerUpdated_address_address_Event.InputTuple,
    ACLManagerUpdated_address_address_Event.OutputTuple,
    ACLManagerUpdated_address_address_Event.OutputObject
  >;
  getEvent(
    key: "AddressSet"
  ): TypedContractEvent<
    AddressSetEvent.InputTuple,
    AddressSetEvent.OutputTuple,
    AddressSetEvent.OutputObject
  >;
  getEvent(
    key: "AddressSet(bytes32,address,address)"
  ): TypedContractEvent<
    AddressSet_bytes32_address_address_Event.InputTuple,
    AddressSet_bytes32_address_address_Event.OutputTuple,
    AddressSet_bytes32_address_address_Event.OutputObject
  >;
  getEvent(
    key: "AddressSetAsProxy"
  ): TypedContractEvent<
    AddressSetAsProxyEvent.InputTuple,
    AddressSetAsProxyEvent.OutputTuple,
    AddressSetAsProxyEvent.OutputObject
  >;
  getEvent(
    key: "AddressSetAsProxy(bytes32,address,address,address)"
  ): TypedContractEvent<
    AddressSetAsProxy_bytes32_address_address_address_Event.InputTuple,
    AddressSetAsProxy_bytes32_address_address_address_Event.OutputTuple,
    AddressSetAsProxy_bytes32_address_address_address_Event.OutputObject
  >;
  getEvent(
    key: "MarketIdSet"
  ): TypedContractEvent<
    MarketIdSetEvent.InputTuple,
    MarketIdSetEvent.OutputTuple,
    MarketIdSetEvent.OutputObject
  >;
  getEvent(
    key: "MarketIdSet(string,string)"
  ): TypedContractEvent<
    MarketIdSet_string_string_Event.InputTuple,
    MarketIdSet_string_string_Event.OutputTuple,
    MarketIdSet_string_string_Event.OutputObject
  >;
  getEvent(
    key: "PoolConfiguratorUpdated"
  ): TypedContractEvent<
    PoolConfiguratorUpdatedEvent.InputTuple,
    PoolConfiguratorUpdatedEvent.OutputTuple,
    PoolConfiguratorUpdatedEvent.OutputObject
  >;
  getEvent(
    key: "PoolConfiguratorUpdated(address,address)"
  ): TypedContractEvent<
    PoolConfiguratorUpdated_address_address_Event.InputTuple,
    PoolConfiguratorUpdated_address_address_Event.OutputTuple,
    PoolConfiguratorUpdated_address_address_Event.OutputObject
  >;
  getEvent(
    key: "PoolDataProviderUpdated"
  ): TypedContractEvent<
    PoolDataProviderUpdatedEvent.InputTuple,
    PoolDataProviderUpdatedEvent.OutputTuple,
    PoolDataProviderUpdatedEvent.OutputObject
  >;
  getEvent(
    key: "PoolDataProviderUpdated(address,address)"
  ): TypedContractEvent<
    PoolDataProviderUpdated_address_address_Event.InputTuple,
    PoolDataProviderUpdated_address_address_Event.OutputTuple,
    PoolDataProviderUpdated_address_address_Event.OutputObject
  >;
  getEvent(
    key: "PoolUpdated"
  ): TypedContractEvent<
    PoolUpdatedEvent.InputTuple,
    PoolUpdatedEvent.OutputTuple,
    PoolUpdatedEvent.OutputObject
  >;
  getEvent(
    key: "PoolUpdated(address,address)"
  ): TypedContractEvent<
    PoolUpdated_address_address_Event.InputTuple,
    PoolUpdated_address_address_Event.OutputTuple,
    PoolUpdated_address_address_Event.OutputObject
  >;
  getEvent(
    key: "PriceOracleSentinelUpdated"
  ): TypedContractEvent<
    PriceOracleSentinelUpdatedEvent.InputTuple,
    PriceOracleSentinelUpdatedEvent.OutputTuple,
    PriceOracleSentinelUpdatedEvent.OutputObject
  >;
  getEvent(
    key: "PriceOracleSentinelUpdated(address,address)"
  ): TypedContractEvent<
    PriceOracleSentinelUpdated_address_address_Event.InputTuple,
    PriceOracleSentinelUpdated_address_address_Event.OutputTuple,
    PriceOracleSentinelUpdated_address_address_Event.OutputObject
  >;
  getEvent(
    key: "PriceOracleUpdated"
  ): TypedContractEvent<
    PriceOracleUpdatedEvent.InputTuple,
    PriceOracleUpdatedEvent.OutputTuple,
    PriceOracleUpdatedEvent.OutputObject
  >;
  getEvent(
    key: "PriceOracleUpdated(address,address)"
  ): TypedContractEvent<
    PriceOracleUpdated_address_address_Event.InputTuple,
    PriceOracleUpdated_address_address_Event.OutputTuple,
    PriceOracleUpdated_address_address_Event.OutputObject
  >;
  getEvent(
    key: "ProxyCreated"
  ): TypedContractEvent<
    ProxyCreatedEvent.InputTuple,
    ProxyCreatedEvent.OutputTuple,
    ProxyCreatedEvent.OutputObject
  >;
  getEvent(
    key: "ProxyCreated(bytes32,address,address)"
  ): TypedContractEvent<
    ProxyCreated_bytes32_address_address_Event.InputTuple,
    ProxyCreated_bytes32_address_address_Event.OutputTuple,
    ProxyCreated_bytes32_address_address_Event.OutputObject
  >;

  filters: {
    "ACLAdminUpdated(address,address)": TypedContractEvent<
      ACLAdminUpdatedEvent.InputTuple,
      ACLAdminUpdatedEvent.OutputTuple,
      ACLAdminUpdatedEvent.OutputObject
    >;
    ACLAdminUpdated: TypedContractEvent<
      ACLAdminUpdatedEvent.InputTuple,
      ACLAdminUpdatedEvent.OutputTuple,
      ACLAdminUpdatedEvent.OutputObject
    >;

    "ACLManagerUpdated(address,address)": TypedContractEvent<
      ACLManagerUpdatedEvent.InputTuple,
      ACLManagerUpdatedEvent.OutputTuple,
      ACLManagerUpdatedEvent.OutputObject
    >;
    ACLManagerUpdated: TypedContractEvent<
      ACLManagerUpdatedEvent.InputTuple,
      ACLManagerUpdatedEvent.OutputTuple,
      ACLManagerUpdatedEvent.OutputObject
    >;

    "AddressSet(bytes32,address,address)": TypedContractEvent<
      AddressSetEvent.InputTuple,
      AddressSetEvent.OutputTuple,
      AddressSetEvent.OutputObject
    >;
    AddressSet: TypedContractEvent<
      AddressSetEvent.InputTuple,
      AddressSetEvent.OutputTuple,
      AddressSetEvent.OutputObject
    >;

    "AddressSetAsProxy(bytes32,address,address,address)": TypedContractEvent<
      AddressSetAsProxyEvent.InputTuple,
      AddressSetAsProxyEvent.OutputTuple,
      AddressSetAsProxyEvent.OutputObject
    >;
    AddressSetAsProxy: TypedContractEvent<
      AddressSetAsProxyEvent.InputTuple,
      AddressSetAsProxyEvent.OutputTuple,
      AddressSetAsProxyEvent.OutputObject
    >;

    "MarketIdSet(string,string)": TypedContractEvent<
      MarketIdSetEvent.InputTuple,
      MarketIdSetEvent.OutputTuple,
      MarketIdSetEvent.OutputObject
    >;
    MarketIdSet: TypedContractEvent<
      MarketIdSetEvent.InputTuple,
      MarketIdSetEvent.OutputTuple,
      MarketIdSetEvent.OutputObject
    >;

    "PoolConfiguratorUpdated(address,address)": TypedContractEvent<
      PoolConfiguratorUpdatedEvent.InputTuple,
      PoolConfiguratorUpdatedEvent.OutputTuple,
      PoolConfiguratorUpdatedEvent.OutputObject
    >;
    PoolConfiguratorUpdated: TypedContractEvent<
      PoolConfiguratorUpdatedEvent.InputTuple,
      PoolConfiguratorUpdatedEvent.OutputTuple,
      PoolConfiguratorUpdatedEvent.OutputObject
    >;

    "PoolDataProviderUpdated(address,address)": TypedContractEvent<
      PoolDataProviderUpdatedEvent.InputTuple,
      PoolDataProviderUpdatedEvent.OutputTuple,
      PoolDataProviderUpdatedEvent.OutputObject
    >;
    PoolDataProviderUpdated: TypedContractEvent<
      PoolDataProviderUpdatedEvent.InputTuple,
      PoolDataProviderUpdatedEvent.OutputTuple,
      PoolDataProviderUpdatedEvent.OutputObject
    >;

    "PoolUpdated(address,address)": TypedContractEvent<
      PoolUpdatedEvent.InputTuple,
      PoolUpdatedEvent.OutputTuple,
      PoolUpdatedEvent.OutputObject
    >;
    PoolUpdated: TypedContractEvent<
      PoolUpdatedEvent.InputTuple,
      PoolUpdatedEvent.OutputTuple,
      PoolUpdatedEvent.OutputObject
    >;

    "PriceOracleSentinelUpdated(address,address)": TypedContractEvent<
      PriceOracleSentinelUpdatedEvent.InputTuple,
      PriceOracleSentinelUpdatedEvent.OutputTuple,
      PriceOracleSentinelUpdatedEvent.OutputObject
    >;
    PriceOracleSentinelUpdated: TypedContractEvent<
      PriceOracleSentinelUpdatedEvent.InputTuple,
      PriceOracleSentinelUpdatedEvent.OutputTuple,
      PriceOracleSentinelUpdatedEvent.OutputObject
    >;

    "PriceOracleUpdated(address,address)": TypedContractEvent<
      PriceOracleUpdatedEvent.InputTuple,
      PriceOracleUpdatedEvent.OutputTuple,
      PriceOracleUpdatedEvent.OutputObject
    >;
    PriceOracleUpdated: TypedContractEvent<
      PriceOracleUpdatedEvent.InputTuple,
      PriceOracleUpdatedEvent.OutputTuple,
      PriceOracleUpdatedEvent.OutputObject
    >;

    "ProxyCreated(bytes32,address,address)": TypedContractEvent<
      ProxyCreatedEvent.InputTuple,
      ProxyCreatedEvent.OutputTuple,
      ProxyCreatedEvent.OutputObject
    >;
    ProxyCreated: TypedContractEvent<
      ProxyCreatedEvent.InputTuple,
      ProxyCreatedEvent.OutputTuple,
      ProxyCreatedEvent.OutputObject
    >;
  };
}
