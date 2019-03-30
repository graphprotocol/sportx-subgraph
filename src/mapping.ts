import { Market, Order } from './types/schema'
import { MarketRegistered, MarketUnregistered } from './types/Market/MarketRegistry'
import { OrderFill } from "./types/FillOrder/FillOrder";

export function handleMarketRegistered(event: MarketRegistered): void {
  let market = new Market((event.params.marketHash.toHex()))

  market.title = event.params.marketRequest.get('title').toString()
  market.referenceUrl = event.params.marketRequest.get('referenceUrl').toString()
  market.outcomeOne = event.params.marketRequest.get('outcomeOneName').toString()
  market.outcomeTwo = event.params.marketRequest.get('outcomeTwoName').toString()
  market.outcomeVoid = event.params.marketRequest.get('outcomeVoidName').toString()
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
  order.potSize = event.params.orderAmounts.potSize
  order.save()
}