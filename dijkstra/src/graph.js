const R = require('ramda');

function calculateNumberEdges(nVertices, density) {
  return Math.round(
    nVertices -
      1 +
      (density / 100) * ((nVertices * (nVertices - 1)) / 2 - (nVertices - 1)),
  );
}

function createEdgePool(nVertices) {
  const lowerEdges = (id) => R.pipe(R.range(0), R.map(R.pair(id)))(id);
  return R.chain(lowerEdges, R.range(1, nVertices));
}

const groupEdgePool = R.pipe(
  R.groupWith(R.eqBy(R.head)),
  R.map((p) => R.assoc('pool', p, {})),
  R.map(R.assoc('edges', [])),
);

const pickEdges = R.curry((getInt, nEdges, edges) => {
  const pick = R.curry((idx, e) => {
    return R.pipe(
      R.assoc('edges', R.append(R.nth(idx, e.pool), e.edges)),
      R.assoc('pool', R.remove(idx, 1, e.pool)),
    )({});
  });
  return R.unless(
    R.pipe(R.prop('edges'), R.length, R.equals(nEdges)),
    R.pipe(
      pick(getInt(0, R.length(edges.pool) - 1)),
      pickEdges(getInt, nEdges),
    ),
  )(edges);
});

const joinEdges = (edges) => {
  return R.pipe(
    R.assoc('edges', R.unnest(R.pluck('edges', edges))),
    R.assoc('pool', R.unnest(R.pluck('pool', edges))),
  )({});
};

const createEdges = R.curry((getInt, nVertices, nEdges) => {
  return R.pipe(
    createEdgePool,
    groupEdgePool,
    R.map(pickEdges(getInt, 1)),
    joinEdges,
    pickEdges(getInt, nEdges),
    R.prop('edges'),
  )(nVertices);
});

// function pickEdges(nVertices, nEdges, pool) {}
// const generateEdges = R.curry((getRandomInt, nVertices, nEdges) => {
//   return [];
// });

// function createNode(id) {
//   return { id, edges: [] };
// }

// function createEdge(id, cost) {
//   return { id, cost };
// }

// function connectNodes(getRandomInt, maxEdgeCost) {
//   return (nodes) => {
//     // R.append()
//     const sup = [];
//     nodes[0] = {};

//     nodes.forEach((n) => {
//       const id = getRandomInt(n.id);
//       const cost = getRandomInt(maxEdgeCost);
//       const edge = createEdge(id, cost);
//       n.edges.push(edge);
//       nodes[id].edges.push(edge);
//     });
//     return nodes;
//   };
// }

// function createGraph(nodes) {
//   return { nodes, root: nodes[0] };
// }
// const createEdges = R.curry((getRandomInt, nVertices, nEdges) => {});

// function createGraph(getRandomInt) {
//   return (nVertices, density, maxEdgeCost) =>
//     R.pipe(
//       R.always(calculateNumberEdges(nVertices, density)),
//       createEdges(getRandomInt, nVertices),
//       R.range(0, nVertices).map((i) => createNode(i)),
//       // connectNodes(getRandomInt, maxEdgeCost),
//       // createGraph,
//     );
// }

module.exports = {
  calculateNumberEdges,
  createEdgePool,
  createEdges,
};
