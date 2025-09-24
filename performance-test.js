import { renderScene } from "./dist/index.js"

const testScene = {
  boxes: [
    {
      center: { x: 0, y: 0, z: 0 },
      size: { x: 12, y: 1.4, z: 30 },
      faceImages: {
        top: "data:image/svg+xml;base64,PHN2ZyB0cmFuc2Zvcm09J3NjYWxlKDEsIC0xKScgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iODAwIiBoZWlnaHQ9IjIwMDAiPjxzdHlsZT48L3N0eWxlPjxyZWN0IGNsYXNzPSJib3VuZGFyeSIgeD0iMCIgeT0iMCIgZmlsbD0idHJhbnNwYXJlbnQiIHdpZHRoPSI4MDAiIGhlaWdodD0iMjAwMCIvPjxyZWN0IGNsYXNzPSJwY2ItcGFkIiBmaWxsPSIjZmZlMDY2IiB4PSIyNzMuMzI5MzUzMzMzMzI4MjQiIHk9IjE0NjAuMDYwOTUwMDAwMDA3MyIgd2lkdGg9IjE5Ljk5OTk1OTk5OTk5OTk5OCIgaGVpZ2h0PSI4Ni42NjY0OTMzMzMzMzMzNCIvPjwvc3ZnPg=="
      },
      projectionSubdivision: 10,
      color: "rgba(0,140,0,0.8)",
    },
    {
      center: { x: 0, y: 2, z: -12.78749940000003 },
      size: { x: 9.85022159999998, y: 2, z: 6.773170299999838 },
      topLabel: "USBC",
      topLabelColor: "white",
    },
    {
      center: { x: 0, y: 0.7, z: 12 },
      size: { x: 2.7, y: 2, z: 1 },
      topLabel: "LED",
      topLabelColor: "white",
    },
  ],
  camera: {
    position: { x: -45, y: 45, z: -45 },
    lookAt: { x: 0, y: 0, z: 0 },
    focalLength: 2,
  },
}

async function measurePerformance(label, scene, options = {}) {
  console.log(`\n=== ${label} ===`)
  const start = performance.now()
  const svg = await renderScene(scene, options)
  const end = performance.now()
  
  const renderTime = end - start
  const svgSize = new Blob([svg]).size
  
  console.log(`Render time: ${renderTime.toFixed(2)}ms`)
  console.log(`SVG size: ${(svgSize / 1024).toFixed(2)}KB`)
  console.log(`SVG length: ${svg.length} characters`)
  
  return { renderTime, svgSize, svg }
}

async function runPerformanceTest() {
  console.log("Performance Test - simple-3d-svg optimization")
  
  const baseline = await measurePerformance("BASELINE (current)", testScene)
  
  const optimized = await measurePerformance("OPTIMIZED", testScene, {
    optimizePerformance: true,
    coordinatePrecision: 1,
    maxSubdivision: 4
  })
  
  const timeImprovement = baseline.renderTime / optimized.renderTime
  const sizeImprovement = baseline.svgSize / optimized.svgSize
  
  console.log(`\n=== RESULTS ===`)
  console.log(`Render time improvement: ${timeImprovement.toFixed(2)}x`)
  console.log(`SVG size improvement: ${sizeImprovement.toFixed(2)}x`)
  console.log(`Target: 3x improvement`)
  console.log(`Success: ${timeImprovement >= 3 || sizeImprovement >= 3 ? 'YES' : 'NO'}`)
}

runPerformanceTest().catch(console.error)
