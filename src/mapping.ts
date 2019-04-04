import { Market, Order } from './types/schema'
import { MarketRegistered, MarketUnregistered } from './types/Market/MarketRegistry'
import { OrderFill } from "./types/FillOrder/FillOrder";

export function handleMarketRegistered(event: MarketRegistered): void {
  let market = new Market((event.params.marketHash.toHex()))

  market.title = event.params.marketRequest.title
  market.baseToken = event.params.marketRequest.baseToken
  market.referenceUrl = event.params.marketRequest.referenceUrl
  market.outcomeOne = event.params.marketRequest.outcomeOneName
  market.outcomeTwo = event.params.marketRequest.outcomeTwoName
  market.outcomeVoid = event.params.marketRequest.outcomeVoidName
  market.registered = true
  market.save()
}

export function handleMarketUnRegistered(event: MarketUnregistered): void {
  let market = Market.load( event.params.marketHash.toHex())
  market.registered = false
  market.save()
}

export function handleOrder(event: OrderFill): void {
  let order = new Order(event.params.orderHash.toHex())

  order.maker= event.params.maker
  order.taker= event.params.taker
  order.newFilledAmount = event.params.newFilledAmount
  order.totalBetSize = event.params.makerOrder.totalBetSize
  order.percentageOdds = event.params.makerOrder.percentageOdds
  order.expiry = event.params.makerOrder.expiry
  order.oracleFee = event.params.makerOrder.oracleFee
  order.relayerMakerFee = event.params.makerOrder.relayerMakerFee
  order.relayerTakerFee = event.params.makerOrder.relayerTakerFee
  order.salt= event.params.makerOrder.salt
  order.isMakerBettingOutcomeOne = event.params.makerOrder.isMakerBettingOutcomeOne

  order.takerAmount = event.params.orderAmounts.takerAmount
  order.takerEscrow = event.params.orderAmounts.takerEscrow
  order.potSize = event.params.orderAmounts.potSize
  order.makerOracleFee = event.params.orderAmounts.makerOracleFee
  order.takerOracleFee = event.params.orderAmounts.takerOracleFee

  order.save()
}