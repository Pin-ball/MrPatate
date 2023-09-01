import OPTIONS from "src/config/config.json";

export default async function downloadSvg(layers) {
  const svgSources = orderLayers(layers)
  const svgElement = await createSvgElement(svgSources)
  saveSvg(svgElement, 'Pierre')
}

function orderLayers(parts) {
  let mergeSrc = []

  OPTIONS.parts.map(part => {
    if (part.active === false || part.key === 'background') return

    let option = part.options[parts.indexes[part.key]]
    if (option.id === null) return

    let srcUrl = `./assets/parts/${part.prefix + option.id}.svg`
    if (mergeSrc[option.zIndex] === undefined) mergeSrc[option.zIndex] = []
    mergeSrc[option.zIndex].push(srcUrl)
  })
  return mergeSrc.flat()
}

async function createSvgElement(srcs) {
  let ns = "http://www.w3.org/2000/svg";
  let svgElement = document.createElementNS(ns, "svg");
  svgElement.setAttribute("xmlns", ns);
  svgElement.setAttribute("viewBox", "0 0 800 1000");

  const parser = new DOMParser();
  // let pathArray = []

  for (let src of srcs) {
    let svgXml = await fetchSvg(src);
    let paths = parser.parseFromString(svgXml, "application/xml").querySelectorAll('path');
    for(let path of paths) {
      svgElement.appendChild(path)
    }
  }
  return svgElement
}

async function fetchSvg(src) {
  const response = await fetch(src);
  return await response.text();
}

function saveSvg(svgElement, name ) {
  svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  let preface = '<?xml version="1.0" standalone="no"?>\r\n',
      svgData = svgElement.outerHTML,
      svgBlob = new Blob([preface, svgData], {type:"image/svg+xml;charset=utf-8"}),
      downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(svgBlob);
  downloadLink.download = name;
  downloadLink.click();
}
