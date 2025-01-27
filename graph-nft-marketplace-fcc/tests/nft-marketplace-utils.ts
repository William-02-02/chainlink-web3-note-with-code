import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  NftBought,
  NftListed,
  NftListingCancelled,
  NftListingUpdated
} from "../generated/NftMarketplace/NftMarketplace"

export function createNftBoughtEvent(
  nftAddress: Address,
  tokenId: BigInt,
  buyer: Address,
  price: BigInt
): NftBought {
  let nftBoughtEvent = changetype<NftBought>(newMockEvent())

  nftBoughtEvent.parameters = new Array()

  nftBoughtEvent.parameters.push(
    new ethereum.EventParam(
      "nftAddress",
      ethereum.Value.fromAddress(nftAddress)
    )
  )
  nftBoughtEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  nftBoughtEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )
  nftBoughtEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )

  return nftBoughtEvent
}

export function createNftListedEvent(
  nftAddress: Address,
  tokenId: BigInt,
  price: BigInt,
  seller: Address
): NftListed {
  let nftListedEvent = changetype<NftListed>(newMockEvent())

  nftListedEvent.parameters = new Array()

  nftListedEvent.parameters.push(
    new ethereum.EventParam(
      "nftAddress",
      ethereum.Value.fromAddress(nftAddress)
    )
  )
  nftListedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  nftListedEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )
  nftListedEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )

  return nftListedEvent
}

export function createNftListingCancelledEvent(
  nftAddress: Address,
  tokenId: BigInt
): NftListingCancelled {
  let nftListingCancelledEvent = changetype<NftListingCancelled>(newMockEvent())

  nftListingCancelledEvent.parameters = new Array()

  nftListingCancelledEvent.parameters.push(
    new ethereum.EventParam(
      "nftAddress",
      ethereum.Value.fromAddress(nftAddress)
    )
  )
  nftListingCancelledEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return nftListingCancelledEvent
}

export function createNftListingUpdatedEvent(
  nftAddress: Address,
  tokenId: BigInt,
  newPrice: BigInt
): NftListingUpdated {
  let nftListingUpdatedEvent = changetype<NftListingUpdated>(newMockEvent())

  nftListingUpdatedEvent.parameters = new Array()

  nftListingUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "nftAddress",
      ethereum.Value.fromAddress(nftAddress)
    )
  )
  nftListingUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  nftListingUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newPrice",
      ethereum.Value.fromUnsignedBigInt(newPrice)
    )
  )

  return nftListingUpdatedEvent
}
