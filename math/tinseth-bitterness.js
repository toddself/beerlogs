'use strict'

const convert = require('convert-units')
const HOP_UTILIZATION = 7490
const BIGNESS_MULTIPLIER = 1.65
const BIGNESS_GRAVITY_BASE = 0.000125
const MAX_UTILZIATION = 4.15
const CURVE_SHAPE = -0.04
const HOP_WEIGHT_UNIT = 'oz'

function bignessFactor (gravity) {
  const adjustedGravity = Math.pow(BIGNESS_GRAVITY_BASE, (gravity - 1))
  return BIGNESS_MULTIPLIER * adjustedGravity
}

function boilTimeFactor (boilTime) {
  return (1 - Math.pow(Math.E, (CURVE_SHAPE * boilTime))) / MAX_UTILZIATION
}

module.exports = function tinseth (hop, recipeVolume, originalGravity) {
  const bigness = bignessFactor(originalGravity)
  const hopWeight = convert(hop.weight).from(hop.weightUnit).to(HOP_WEIGHT_UNIT)
  const boilFactor = boilTimeFactor(hop.boilTime)
  const decimalAA = bigness * boilFactor
  const aa = hop.aa / 100
  const AAU = decimalAA * ((aa * hopWeight * HOP_UTILIZATION) / recipeVolume)
  return AAU
}
