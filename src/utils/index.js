function random(min, max, exclude = false)
{
  if (exclude === false) {
    return Math.floor(Math.random() * max + min);
  }
  else {
    for (let i = 0; i < 10; i++) {
      let rand = Math.floor(Math.random() * max + min);
      if (rand !== exclude) return rand
    }
  }
}

function downloadSvg(svg, name)
{
  const svgBlob = new Blob([svg.outerHTML], {type:"image/svg+xml;charset=utf-8"})
  const downloadLink = document.createElement("a")
  downloadLink.href = URL.createObjectURL(svgBlob)
  downloadLink.download = name
  downloadLink.click()
}

export { random, downloadSvg }