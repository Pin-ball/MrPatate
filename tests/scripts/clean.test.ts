import { describe, expect, it } from 'vitest'
import { canonicalColor, cleanDrawing } from '../../scripts/catalog/clean.ts'

const TITLES = '<title lang="fr">A</title><title lang="en">A</title>'

function svg(body: string, attrs = 'viewBox="0 0 800 1000"') {
  return `<svg xmlns="http://www.w3.org/2000/svg" ${attrs}>${TITLES}${body}</svg>`
}

function messages(source: string, part = 'body') {
  return cleanDrawing(source, part, 'test').findings.map(
    ({ level, message }) => `${level}: ${message}`,
  )
}

describe('canonicalColor', () => {
  it('writes black and white by name and other colors as upper-case hex', () => {
    expect(canonicalColor('#000')).toBe('black')
    expect(canonicalColor('#ffffff')).toBe('white')
    expect(canonicalColor('#21c488')).toBe('#21C488')
    expect(canonicalColor('none')).toBe('none')
  })
})

describe('cleanDrawing', () => {
  it('strips editor leftovers and gives roles by color', () => {
    const { svg: output, findings } = cleanDrawing(
      svg(
        '<defs><clipPath id="c"><rect width="800" height="1000"/></clipPath></defs><g style="clip-path:url(#c)"><path id="p" style="fill:#21c488" d="M10 10H90V90H10Z"/><path class="x" fill="#20a069" d="M10 10H40V40H10Z"/><path fill="#000" d="M0 0H5V5H0Z"/></g>',
        'width="800" height="1000" viewBox="0 0 800 1000" fill="none"',
      ),
      'body',
      'test',
    )
    expect(output).not.toMatch(/\b(id|class|style|width|height|clip-path)=|<defs|<clipPath/)
    expect(output).toContain('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000">')
    expect(output).toContain('<title lang="fr">A</title>')
    expect(output).toMatch(/<path data-role="skin" [^>]*fill="#21C488"/)
    expect(output).toMatch(/<path data-role="shadow" [^>]*fill="#20A069"/)
    expect(output).toMatch(/<path data-role="outline" [^>]*fill="black"/)
    expect(findings.some(({ level }) => level === 'error')).toBe(false)
  })

  it('gives the same file when cleaned again', () => {
    const once = cleanDrawing(
      svg(
        '<circle fill="#fff" cx="150" cy="150" r="50"/><path fill="#000" d="M140.123 140.456C150 130 170 150 160 160Z"/>',
      ),
      'eyes',
      'test',
    ).svg
    expect(cleanDrawing(once, 'eyes', 'test').svg).toBe(once)
  })

  it('reports what the catalog loader refuses as errors', () => {
    expect(messages(svg('', 'viewBox="0 0 400 500"'))).toContain(
      'error: body/test.svg: viewBox must be "0 0 800 1000"',
    )
    expect(
      messages('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000"></svg>'),
    ).toContain('error: body/test.svg: missing label for fr, en')
    expect(messages(svg('<path d="M0 0H5V5H0Z"/>'), 'arms')).toContain(
      'error: arms/test.svg: top-level content must be <g data-plane="…"> (back, front)',
    )
  })

  it('warns about colors close to the drawn colors and roles that do not match their fill', () => {
    const report = messages(
      svg(
        '<path fill="#22C589" d="M0 0H5V5H0Z"/><path data-role="skin" fill="red" d="M9 9H5V5H9Z"/>',
      ),
    )
    expect(report).toContain(
      'warning: <path> at 0,0: fill #22C589 is close to the skin color #21C488',
    )
    expect(report).toContain(
      'warning: <path> at 5,5: role "skin" but fill #FF0000, expected #21C488',
    )
  })

  it('keeps the outline role for lines, not for solid black fills', () => {
    const line = '<path fill="black" d="M100 100H300V104H100Z"/>'
    const solid = '<path fill="black" d="M100 200H160V260H100Z"/>'
    const { svg: output, findings } = cleanDrawing(svg(line + solid), 'body', 'test')
    expect(output).toContain('<path data-role="outline" fill="black" d="M100 100')
    expect(output).toContain('<path fill="black" d="M100 200')
    expect(findings.map(({ message }) => message)).toContain(
      '<path> at 100,200: solid black fill, left without the outline role',
    )
    expect(
      messages(svg('<path data-role="outline" fill="black" d="M100 200H160V260H100Z"/>')),
    ).toContain(
      'warning: <path> at 100,200: role "outline" on a solid black fill, outline is for lines',
    )
  })

  it('measures only the visible part of a black shape', () => {
    const hidden =
      '<path fill="black" d="M100 200H160V260H100Z"/><path fill="white" d="M104 204H156V256H104Z"/>'
    const { svg: output, findings } = cleanDrawing(svg(hidden), 'body', 'test')
    expect(output).toContain('<path data-role="outline" fill="black" d="M100 200')
    expect(findings.some(({ message }) => message.includes('solid'))).toBe(false)
  })

  it('warns about a skin or shadow nested in a group, which the shadow clip ignores', () => {
    expect(
      messages(
        svg(
          '<g opacity=".5"><path fill="#21C488" d="M0 0H5V5H0Z"/><path fill="black" d="M1 1H5V5H1Z"/></g>',
        ),
      ),
    ).toContain(
      'warning: drawing: <path> at 0,0 has role "skin" inside a group, the shadow clip only reads top-level shapes',
    )
  })

  it('names the plane of each report line in a multi-plane part', () => {
    const report = messages(
      svg(
        '<g data-plane="back"><path fill="black" d="M0 0H5V5H0Z"/></g><g data-plane="front"><g><path fill="black" d="M0 0H5V5H0Z"/></g></g>',
      ),
      'arms',
    )
    expect(report).toContain('info: plane back: roles added outline ×1')
    expect(report).toContain('info: plane front: roles added outline ×1')
    expect(report.some((line) => line.startsWith('error'))).toBe(false)
  })
})

describe('eyes', () => {
  it('groups a white shape and the single small black shape inside it, hole filled', () => {
    const { svg: output, findings } = cleanDrawing(
      svg(
        '<path fill="#fff" d="M100 100H200V200H100Z M140 140V160H160V140Z"/><path fill="#000" d="M142 142H158V158H142Z"/>',
      ),
      'eyes',
      'test',
    )
    expect(output).toMatch(
      /<g data-role="eye">\s*<path data-role="eye-white" [^>]*\/>\s*<path data-role="eye-pupil"/,
    )
    expect(output).not.toMatch(/eye-white" [^>]*d="[^"]*M[^"]*M/)
    expect(findings.map(({ message }) => message)).toEqual([
      '<path> at 100,100: hole under the pupil filled',
      'drawing: 1 eye(s) grouped',
    ])
  })

  it('takes a round pupil near the curved edge of the white', () => {
    const { svg: output } = cleanDrawing(
      svg(
        '<circle fill="#fff" cx="150" cy="150" r="50"/><circle fill="#000" cx="185" cy="150" r="10"/>',
      ),
      'eyes',
      'test',
    )
    expect(output).toContain('data-role="eye-pupil"')
  })

  it('groups no eye when the black shapes are not a single small pupil, and keeps the line rule', () => {
    const several = cleanDrawing(
      svg(
        '<path fill="#fff" d="M100 100H200V200H100Z"/><path fill="#000" d="M110 110H120V120H110Z"/><path fill="#000" d="M150 150H160V160H150Z"/>',
      ),
      'eyes',
      'test',
    )
    expect(several.svg).not.toContain('eye')
    expect(several.svg.match(/data-role="outline"/g)).toHaveLength(2)
    expect(several.findings.map(({ message }) => message)).toContain(
      '<path> at 100,100: 2 black shape(s) inside a white shape, not a pupil, no eye grouped',
    )
    const iris = cleanDrawing(
      svg(
        '<path fill="#fff" d="M100 100H200V200H100Z"/><path fill="#000" d="M110 110H190V190H110Z"/>',
      ),
      'eyes',
      'test',
    )
    expect(iris.svg).not.toContain('data-role')
    expect(iris.findings.map(({ message }) => message)).toContain(
      '<path> at 110,110: solid black fill, left without the outline role',
    )
  })

  it('only looks for eyes in the eyes part', () => {
    const { svg: output } = cleanDrawing(
      svg(
        '<path fill="#fff" d="M100 100H200V200H100Z"/><path fill="#000" d="M140 140H160V143H140Z"/>',
      ),
      'mouth',
      'test',
    )
    expect(output).not.toContain('eye')
    expect(output).toContain('data-role="outline"')
  })
})

describe('shadow check', () => {
  const skin = '<path fill="#21C488" d="M100 100H300V300H100Z"/>'

  it('accepts a shadow extended 3 units beyond the skin', () => {
    expect(messages(svg(`${skin}<path fill="#20A069" d="M97 97H150V303H97Z"/>`))).toContain(
      'info: drawing: shadow extends 3 units beyond the skin (expected 3)',
    )
  })

  it('warns when the shadow stops at the silhouette or goes too far', () => {
    expect(messages(svg(`${skin}<path fill="#20A069" d="M100 100H150V300H100Z"/>`))).toContain(
      'warning: drawing: shadow stops at the silhouette, extend it 3 units beyond',
    )
    expect(messages(svg(`${skin}<path fill="#20A069" d="M80 100H150V300H80Z"/>`))).toContain(
      'warning: drawing: shadow extends 20 units beyond the skin (expected 3)',
    )
  })

  it('fails when the skin does not cover the area under the shadow', () => {
    const holed =
      '<path fill="#21C488" fill-rule="evenodd" d="M100 100H300V300H100Z M150 150V200H200V150Z"/>'
    expect(messages(svg(`${holed}<path fill="#20A069" d="M140 140H210V210H140Z"/>`))).toContain(
      'error: drawing: skin missing under the shadow (2500 units²)',
    )
  })
})
