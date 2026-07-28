export function getIncomingEdges(nodeId, edges) {
  return edges.filter((edge) => edge.target === nodeId);
}

export function getOutgoingEdges(nodeId, edges) {
  return edges.filter((edge) => edge.source === nodeId);
}

export function getUpstreamNodeIds(nodeId, edges) {
  return getIncomingEdges(nodeId, edges).map((edge) => edge.source);
}

export function hasCycle(nodes, edges) {
  const visiting = new Set();
  const visited = new Set();

  function walk(id) {
    if (visiting.has(id)) return true;
    if (visited.has(id)) return false;
    visiting.add(id);
    const cycles = getOutgoingEdges(id, edges).some((edge) => walk(edge.target));
    visiting.delete(id);
    visited.add(id);
    return cycles;
  }

  return nodes.some((node) => walk(node.id));
}

export function topologicalSort(nodes, edges) {
  const nodeIds = new Set(nodes.map((node) => node.id));
  const inDegree = new Map(nodes.map((node) => [node.id, 0]));
  const outgoing = new Map(nodes.map((node) => [node.id, []]));

  edges.forEach((edge) => {
    if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) return;
    inDegree.set(edge.target, inDegree.get(edge.target) + 1);
    outgoing.get(edge.source).push(edge.target);
  });

  const queue = nodes.filter((node) => inDegree.get(node.id) === 0).map((node) => node.id);
  const ordered = [];

  while (queue.length) {
    const id = queue.shift();
    ordered.push(id);
    outgoing.get(id).forEach((target) => {
      inDegree.set(target, inDegree.get(target) - 1);
      if (inDegree.get(target) === 0) queue.push(target);
    });
  }

  if (ordered.length !== nodes.length) {
    throw new Error('Flow contains a cycle');
  }

  return ordered.map((id) => nodes.find((node) => node.id === id));
}
