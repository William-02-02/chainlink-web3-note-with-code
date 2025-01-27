import { BigInt, Address, ethereum, Bytes } from "@graphprotocol/graph-ts"
import {
  NftBought as NftBoughtEvent,
  NftListed as NftListedEvent,
  NftListingCancelled as NftListingCancelledEvent,
  NftListingUpdated as NftListingUpdatedEvent
} from "../generated/NftMarketplace/NftMarketplace"
import {
  NftBought,
  NftListed,
  NftListingCancelled,
  NftListingUpdated,
  ActiveNft
} from "../generated/schema"

export function handleNftBought(event: NftBoughtEvent): void {
  let id = getIdFromEvent(event.params.tokenId, event.params.nftAddress)

  let nftBought = NftBought.load(id)
  let activeNft = ActiveNft.load(id)
  if (!nftBought) {
    nftBought = new NftBought(id)
  }

  nftBought.nftAddress = event.params.nftAddress
  nftBought.tokenId = event.params.tokenId
  nftBought.buyer = event.params.buyer
  nftBought.price = event.params.price

  nftBought.blockNumber = event.block.number
  nftBought.blockTimestamp = event.block.timestamp
  nftBought.transactionHash = event.transaction.hash
  activeNft!.buyer = event.params.buyer

  nftBought.save()
  activeNft!.save()
}

export function handleNftListed(event: NftListedEvent): void {
  let id = getIdFromEvent(event.params.tokenId, event.params.nftAddress)

  let nftListed = NftListed.load(id)
  let activeNft = ActiveNft.load(id)

  if (!nftListed) {
    nftListed = new NftListed(id)
  }
  if (!activeNft) {
    activeNft = new ActiveNft(id)
  }

  nftListed.nftAddress = event.params.nftAddress
  nftListed.tokenId = event.params.tokenId
  nftListed.price = event.params.price
  nftListed.seller = event.params.seller
  nftListed.blockNumber = event.block.number
  nftListed.blockTimestamp = event.block.timestamp
  nftListed.transactionHash = event.transaction.hash
  nftListed.save()

  activeNft.nftAddress = event.params.nftAddress
  activeNft.tokenId = event.params.tokenId
  activeNft.price = event.params.price
  activeNft.seller = event.params.seller
  activeNft.blockNumber = event.block.number
  activeNft.blockTimestamp = event.block.timestamp
  activeNft.transactionHash = event.transaction.hash
  activeNft.save()
}

export function handleNftListingCancelled(
  event: NftListingCancelledEvent
): void {
  let id = getIdFromEvent(event.params.tokenId, event.params.nftAddress)

  let nftListingCancelled = NftListingCancelled.load(id)
  let activeNft = ActiveNft.load(id)

  if (!nftListingCancelled) {
    nftListingCancelled = new NftListingCancelled(id)
  }

  nftListingCancelled.nftAddress = event.params.nftAddress
  nftListingCancelled.tokenId = event.params.tokenId
  nftListingCancelled.blockNumber = event.block.number
  nftListingCancelled.blockTimestamp = event.block.timestamp
  nftListingCancelled.transactionHash = event.transaction.hash

  activeNft!.buyer = Address.fromString("0x000000000000000000000000000000000000dEaD")

  nftListingCancelled.save()
  activeNft!.save()
}

export function handleNftListingUpdated(event: NftListingUpdatedEvent): void {
  let id = getIdFromEvent(event.params.tokenId, event.params.nftAddress)

  let nftListingUpdated = NftListingUpdated.load(id)
  let activeNft = ActiveNft.load(id)

  if (!nftListingUpdated) {
    nftListingUpdated = new NftListingUpdated(id)
  }

  nftListingUpdated.nftAddress = event.params.nftAddress
  nftListingUpdated.tokenId = event.params.tokenId
  nftListingUpdated.newPrice = event.params.newPrice
  nftListingUpdated.blockNumber = event.block.number
  nftListingUpdated.blockTimestamp = event.block.timestamp
  nftListingUpdated.transactionHash = event.transaction.hash

  activeNft!.price = event.params.newPrice

  nftListingUpdated.save()
  activeNft!.save()
}

function getIdFromEvent(tokenId: BigInt, nftAddress: Address): Bytes {
  return Bytes.fromHexString(tokenId.toString() + "-" + nftAddress.toHexString())
}
