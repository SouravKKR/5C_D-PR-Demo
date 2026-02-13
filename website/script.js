const nodes = {
  A: { x: 60, y: 70, label: 'Entrance' },
  B: { x: 170, y: 70, label: 'Lobby' },
  C: { x: 280, y: 70, label: 'Classroom 101' },
  D: { x: 390, y: 70, label: 'Lab 1' },
  E: { x: 500, y: 70, label: 'Staircase' },
  F: { x: 280, y: 200, label: 'Faculty Cabin' },
  G: { x: 500, y: 200, label: 'Emergency Exit' }
};

const edges = [
  ['A', 'B', 20], ['B', 'C', 25], ['C', 'D', 18], ['D', 'E', 22],
  ['C', 'F', 15], ['E', 'G', 12], ['F', 'G', 25], ['B', 'F', 30]
];

const wifiAccessPoints = [
  { bssid: 'AC:11:00:AA:01', node: 'A', signal: -62 },
  { bssid: 'AC:11:00:AA:02', node: 'C', signal: -48 },
  { bssid: 'AC:11:00:AA:03', node: 'F', signal: -58 },
  { bssid: 'AC:11:00:AA:04', node: 'G', signal: -70 }
];

const sourceSel = document.getElementById('source');
const destinationSel = document.getElementById('destination');
const routeBtn = document.getElementById('routeBtn');
const wifiBtn = document.getElementById('wifiBtn');
const wifiZone = document.getElementById('wifiZone');
const routeResult = document.getElementById('routeResult');
const distanceResult = document.getElementById('distanceResult');
const floorMap = document.getElementById('floorMap');

Object.keys(nodes).forEach((node) => {
  sourceSel.add(new Option(`${node} - ${nodes[node].label}`, node));
  destinationSel.add(new Option(`${node} - ${nodes[node].label}`, node));
});
destinationSel.value = 'G';

function adjacencyMap() {
  const adj = {};
  Object.keys(nodes).forEach((k) => { adj[k] = []; });
  edges.forEach(([u, v, w]) => {
    adj[u].push({ to: v, weight: w });
    adj[v].push({ to: u, weight: w });
  });
  return adj;
}

function dijkstra(start, end) {
  const adj = adjacencyMap();
  const dist = {};
  const prev = {};
  const unvisited = new Set(Object.keys(nodes));

  Object.keys(nodes).forEach((k) => { dist[k] = Infinity; prev[k] = null; });
  dist[start] = 0;

  while (unvisited.size) {
    let u = null;
    unvisited.forEach((n) => {
      if (u === null || dist[n] < dist[u]) u = n;
    });
    if (u === end || dist[u] === Infinity) break;
    unvisited.delete(u);

    for (const { to, weight } of adj[u]) {
      if (!unvisited.has(to)) continue;
      const alt = dist[u] + weight;
      if (alt < dist[to]) {
        dist[to] = alt;
        prev[to] = u;
      }
    }
  }

  const path = [];
  let curr = end;
  while (curr) {
    path.unshift(curr);
    curr = prev[curr];
  }

  if (path[0] !== start) return { path: [], distance: Infinity };
  return { path, distance: dist[end] };
}

function drawMap(activePath = []) {
  floorMap.innerHTML = '';

  edges.forEach(([u, v]) => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', nodes[u].x);
    line.setAttribute('y1', nodes[u].y);
    line.setAttribute('x2', nodes[v].x);
    line.setAttribute('y2', nodes[v].y);
    line.setAttribute('stroke', '#64748b');
    line.setAttribute('stroke-width', '4');
    floorMap.appendChild(line);
  });

  for (let i = 0; i < activePath.length - 1; i++) {
    const u = activePath[i];
    const v = activePath[i + 1];
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', nodes[u].x);
    line.setAttribute('y1', nodes[u].y);
    line.setAttribute('x2', nodes[v].x);
    line.setAttribute('y2', nodes[v].y);
    line.setAttribute('stroke', '#3b82f6');
    line.setAttribute('stroke-width', '7');
    line.setAttribute('stroke-linecap', 'round');
    floorMap.appendChild(line);
  }

  Object.entries(nodes).forEach(([key, node]) => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', node.x);
    circle.setAttribute('cy', node.y);
    circle.setAttribute('r', '11');
    circle.setAttribute('fill', activePath.includes(key) ? '#34d399' : '#cbd5e1');
    floorMap.appendChild(circle);

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', node.x + 14);
    text.setAttribute('y', node.y - 14);
    text.setAttribute('fill', '#f8fafc');
    text.setAttribute('font-size', '12');
    text.textContent = `${key}: ${node.label}`;
    floorMap.appendChild(text);
  });
}

routeBtn.addEventListener('click', () => {
  const source = sourceSel.value;
  const destination = destinationSel.value;
  const result = dijkstra(source, destination);

  if (!result.path.length) {
    routeResult.textContent = 'No route found.';
    distanceResult.textContent = '-';
    drawMap([]);
    return;
  }

  routeResult.textContent = result.path.join(' → ');
  distanceResult.textContent = `${result.distance} meters`;
  drawMap(result.path);
});

wifiBtn.addEventListener('click', () => {
  const noisyScan = wifiAccessPoints.map((ap) => ({
    ...ap,
    signal: ap.signal + Math.floor(Math.random() * 8) - 4
  }));
  noisyScan.sort((a, b) => b.signal - a.signal);
  const strongest = noisyScan[0];
  wifiZone.textContent = `${strongest.node} (${nodes[strongest.node].label}) • ${strongest.bssid} • ${strongest.signal} dBm`;
  sourceSel.value = strongest.node;
});

drawMap();
