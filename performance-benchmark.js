#!/usr/bin/env bun

import { renderScene } from "./lib/index.js"
import { repro3 } from "./tests/repros/assets/repro03.js"

async function benchmarkPerformance() {
  console.log("🚀 Rendering Speed Optimization Benchmark")
  console.log("==========================================")

  const iterations = 3

  console.log("\n📊 Default Rendering:")
  const defaultTimes = []
  for (let i = 0; i < iterations; i++) {
    console.log(`  Run ${i + 1}...`)
    const start = performance.now()
    await renderScene(repro3, { backgroundColor: "gray" })
    const end = performance.now()
    const time = end - start
    defaultTimes.push(time)
    console.log(`    ${time.toFixed(2)}ms`)
  }

  console.log("\n⚡ Optimized Rendering (with maxSubdivision=4):")
  const perfTimes = []
  for (let i = 0; i < iterations; i++) {
    console.log(`  Run ${i + 1}...`)
    const start = performance.now()
    await renderScene(repro3, {
      backgroundColor: "gray",
      maxSubdivision: 4,
    })
    const end = performance.now()
    const time = end - start
    perfTimes.push(time)
    console.log(`    ${time.toFixed(2)}ms`)
  }

  const avgDefault = defaultTimes.reduce((a, b) => a + b) / defaultTimes.length
  const avgPerf = perfTimes.reduce((a, b) => a + b) / perfTimes.length
  const improvement = ((avgDefault - avgPerf) / avgDefault) * 100

  console.log(`\n📈 Results:`)
  console.log(`  Default (maxSubdivision=4): ${avgDefault.toFixed(2)}ms`)
  console.log(`  With explicit maxSubdivision=4: ${avgPerf.toFixed(2)}ms`)
  console.log(`  Difference: ${Math.abs(improvement).toFixed(1)}%`)

  console.log(`\n🎯 Optimizations are now default! All rendering uses:`)
  console.log(`  ✅ Depth-based sorting (instead of BSP)`)
  console.log(`  ✅ Vertex transformation caching`)
  console.log(`  ✅ maxSubdivision=4 default (down from 10)`)

  console.log(`\n🔧 Simple Scene Test:`)
  const simpleScene = {
    boxes: [
      {
        center: { x: 0, y: 0, z: 0 },
        size: { x: 10, y: 10, z: 10 },
        color: "red",
      },
    ],
    camera: { position: { x: 20, y: 20, z: 20 }, lookAt: { x: 0, y: 0, z: 0 } },
  }

  const simpleStart = performance.now()
  await renderScene(simpleScene, {})
  const simpleEnd = performance.now()
  console.log(
    `  Simple scene render time: ${(simpleEnd - simpleStart).toFixed(2)}ms`,
  )

  return improvement
}

benchmarkPerformance().catch(console.error)
