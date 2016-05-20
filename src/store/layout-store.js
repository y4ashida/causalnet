import Rx from 'rxjs/Rx'
import layout from '../utils/layout.js'

const filterGraph = (vertices, edges, rThreshold, cells, layers, variableTypes) => {
  const usedVariableTypes = new Set()
  for (const variableType of variableTypes) {
    if (variableType.checked) {
      usedVariableTypes.add(variableType.name)
    }
  }
  const usedLayers = new Set()
  for (const layer of layers) {
    if (layer.checked) {
      usedLayers.add(layer.name)
    }
  }
  const usedCells = new Set()
  for (const cell of cells) {
    if (cell.checked) {
      usedCells.add(cell.name)
    }
  }

  const vertexMap = new Map(vertices
    .filter(({d}) => usedVariableTypes.has(d.variableType) && usedLayers.has(d.layer) && d.cells.some((cell) => usedCells.has(cell)))
    .map(({u, d}) => [u, d]))
  const filteredEdges = edges.filter(({u, v, d}) => {
    const ud = vertexMap.get(u)
    const vd = vertexMap.get(v)
    return ud && vd && ud.layer < vd.layer && Math.abs(d.r) >= rThreshold
  })

  const usedVertices = new Set()
  for (const {u, v} of filteredEdges) {
    usedVertices.add(u)
    usedVertices.add(v)
  }
  const filteredVertices = vertices.filter(({u}) => usedVertices.has(u))
  return {
    vertices: filteredVertices,
    edges: filteredEdges
  }
}

const store = (dataSubject, controlSubject) => {
  const state = {
    vertices: [],
    edges: [],
    width: 0,
    height: 0
  }

  const subject = new Rx.BehaviorSubject({state, changed: false})

  Rx.Observable.zip(dataSubject, controlSubject)
    .subscribe(([data, control]) => {
      if (!data.changed && !control.changed) {
        subject.next({state, changed: false})
        return
      }

      const {vertices, edges} = data.state
      const {rThreshold, cells, layers, variableTypes, biclusteringOption} = control.state
      const graph = filterGraph(vertices, edges, rThreshold, cells, layers, variableTypes)
      layout(graph, biclusteringOption).subscribe((result) => {
        Object.assign(state, result)
        subject.next({state, changed: true})
      })
    })

  return subject
}

export default store
