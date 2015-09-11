'use strict'

const convert = require('convert-units')

const OG_THRESHOLD = 1.050
const ADJUSTMENT_FACTOR = 0.2
const HOP_UTILIZATION = 7462
const UTILIZATION_FACTOR = 31.97
const BOIL_TIME_ADJUSTMENT = 31.32
const BOIL_TIME_FACTOR = 18.27
const HOP_WEIGHT_UNIT = 'oz'

module.exports = function rager (hop, recipeVolume, originalGravity) {
  let gravityAdjustment = 0
  if (originalGravity > OG_THRESHOLD) {
    gravityAdjustment = (originalGravity - OG_THRESHOLD) / ADJUSTMENT_FACTOR
  }

  const boilUtilization = Math.tanh((hop.boilTime - BOIL_TIME_ADJUSTMENT) / BOIL_TIME_FACTOR)
  const utilization = (UTILIZATION_FACTOR * boilUtilization) / 100
  const hopWeight = convert(hop.weight).from(hop.weightUnit).to(HOP_WEIGHT_UNIT)
  const aa = hop.aa / 100
  const hopLevel = hopWeight * utilization * aa * HOP_UTILIZATION
  const AAU = hopLevel / (recipeVolume * (1 + gravityAdjustment))

  return AAU
}
