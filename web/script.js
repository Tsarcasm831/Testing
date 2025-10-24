(async function () {
  const diagram = document.getElementById("diagram");
  const details = document.getElementById("details");

  function formatTypeLabel(type) {
    const labels = {
      root: "Root",
      section: "Section",
      class: "Class",
      specialization: "Specialization",
      collection: "Collection",
      technique: "Technique",
      person: "Shinobi",
      category: "Technique Category",
      jutsu: "Technique Entry",
    };
    return labels[type] || type;
  }

  function showDetails(node) {
    if (!node) {
      details.innerHTML = `
        <h2>Node Details</h2>
        <p>Select any node in the diagram to see more information.</p>
      `;
      return;
    }

    const { name, type, metadata = {} } = node.data;
    const lines = [];

    lines.push(`<h2>${name}</h2>`);
    lines.push(`<p class="detail-type">${formatTypeLabel(type)}</p>`);

    if (metadata.description) {
      lines.push(`<p>${metadata.description}</p>`);
    }

    if (type === "class") {
      const stats = [];
      if (metadata.village) {
        stats.push(`<li><strong>Village:</strong> ${metadata.village}</li>`);
      }
      if (metadata.base_chakra_control != null) {
        stats.push(`<li><strong>Base Chakra Control:</strong> ${metadata.base_chakra_control}</li>`);
      }
      if (metadata.base_ninjutsu != null) {
        stats.push(`<li><strong>Base Ninjutsu:</strong> ${metadata.base_ninjutsu}</li>`);
      }
      if (metadata.base_taijutsu != null) {
        stats.push(`<li><strong>Base Taijutsu:</strong> ${metadata.base_taijutsu}</li>`);
      }
      if (stats.length) {
        lines.push(`<ul class="detail-list">${stats.join("")}</ul>`);
      }
    }

    if (metadata.summary) {
      lines.push(`<p>${metadata.summary}</p>`);
    }

    if (metadata.source_file) {
      lines.push(`<p class="detail-source"><strong>Source:</strong> <code>${metadata.source_file}</code></p>`);
    }

    const childCount = (node.children ? node.children.length : 0) + (node._children ? node._children.length : 0);
    if (childCount) {
      lines.push(`<p class="detail-children">Contains ${childCount} ${childCount === 1 ? "item" : "items"}.</p>`);
    }

    details.innerHTML = lines.join("\n");
  }

  const response = await fetch("nrp_skilltree_data.json");
  if (!response.ok) {
    throw new Error(`Failed to load data (${response.status})`);
  }
  const data = await response.json();

  const margin = { top: 24, right: 120, bottom: 24, left: 200 };
  const dx = 36;
  const dy = 220;

  const svg = d3
    .select(diagram)
    .append("svg")
    .attr("width", diagram.clientWidth || 960)
    .attr("height", diagram.clientHeight || 600)
    .style("font", "12px/1.4 'Segoe UI', sans-serif")
    .style("cursor", "grab");

  const content = svg.append("g").attr("class", "content");
  const gLink = content.append("g").attr("class", "links");
  const gNode = content.append("g").attr("class", "nodes");

  const zoom = d3
    .zoom()
    .scaleExtent([0.35, 2.5])
    .on("zoom", (event) => {
      content.attr("transform", event.transform);
    });

  svg.call(zoom);

  const controls = document.createElement("div");
  controls.className = "controls";
  controls.innerHTML = `
    <button type="button" data-action="zoom-in" aria-label="Zoom in">+</button>
    <button type="button" data-action="zoom-out" aria-label="Zoom out">−</button>
    <button type="button" data-action="reset" aria-label="Reset view">Reset</button>
  `;
  diagram.appendChild(controls);

  controls.addEventListener("click", (event) => {
    if (!(event.target instanceof HTMLButtonElement)) return;
    const { action } = event.target.dataset;
    if (action === "zoom-in") {
      svg.transition().duration(200).call(zoom.scaleBy, 1.25);
    } else if (action === "zoom-out") {
      svg.transition().duration(200).call(zoom.scaleBy, 0.8);
    } else if (action === "reset") {
      svg.transition().duration(300).call(zoom.transform, d3.zoomIdentity);
    }
  });

  const root = d3.hierarchy(data);
  root.x0 = 0;
  root.y0 = 0;
  root.descendants().forEach((d, i) => {
    d.id = i;
    d._children = d.children;
    if (d.depth > 1) {
      d.children = null;
    }
  });

  let selectedNode = root;

  const tree = d3.tree().nodeSize([dx, dy]);

  function update(source) {
    tree(root);

    let left = root;
    let right = root;
    root.eachBefore((node) => {
      if (node.x < left.x) left = node;
      if (node.x > right.x) right = node;
    });

    const height = Math.max(600, right.x - left.x + margin.top + margin.bottom);
    const width = root.height * dy + margin.left + margin.right;

    svg.attr("viewBox", [
      -margin.left,
      left.x - margin.top,
      width,
      height,
    ]);

    const transition = svg.transition().duration(400).attr("height", diagram.clientHeight || height);

    // Update the nodes…
    const nodes = root.descendants().reverse();
    const node = gNode.selectAll("g.node").data(nodes, (d) => d.id);

    const nodeEnter = node
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", () => `translate(${source.y0},${source.x0})`)
      .on("click", (event, d) => {
        if (event.defaultPrevented) return;
        if (d.children) {
          d._children = d.children;
          d.children = null;
        } else {
          d.children = d._children;
          d._children = null;
        }
        selectedNode = d;
        showDetails(d);
        update(d);
      })
      .on("mouseenter", () => {
        svg.style("cursor", "pointer");
      })
      .on("mouseleave", () => {
        svg.style("cursor", "grab");
      });

    nodeEnter
      .append("circle")
      .attr("r", 1e-6);

    nodeEnter
      .append("text")
      .attr("dy", "0.32em")
      .attr("x", (d) => (d._children || d.children ? -14 : 14))
      .attr("text-anchor", (d) => (d._children || d.children ? "end" : "start"))
      .text((d) => d.data.name)
      .clone(true)
      .lower()
      .attr("stroke", "rgba(15, 23, 42, 0.75)")
      .attr("stroke-width", 4)
      .attr("paint-order", "stroke");

    const nodeUpdate = nodeEnter.merge(node);

    nodeUpdate
      .classed("node--leaf", (d) => !d.children && !d._children)
      .classed("node--selected", (d) => d === selectedNode)
      .transition(transition)
      .attr("transform", (d) => `translate(${d.y},${d.x})`);

    nodeUpdate
      .select("circle")
      .transition(transition)
      .attr("r", 8);

    nodeUpdate
      .select("text")
      .attr("x", (d) => (d._children || d.children ? -14 : 14))
      .attr("text-anchor", (d) => (d._children || d.children ? "end" : "start"));

    const nodeExit = node.exit().transition(transition).attr("transform", () => `translate(${source.y},${source.x})`);
    nodeExit.select("circle").attr("r", 1e-6);
    nodeExit.select("text").style("fill-opacity", 1e-6);
    nodeExit.remove();

    // Update the links…
    const links = root.links();
    const link = gLink.selectAll("path").data(links, (d) => d.target.id);

    const linkEnter = link
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", () => {
        const o = { x: source.x0, y: source.y0 };
        return diagonal({ source: o, target: o });
      });

    link
      .merge(linkEnter)
      .transition(transition)
      .attr("d", (d) => diagonal(d));

    link
      .exit()
      .transition(transition)
      .attr("d", () => {
        const o = { x: source.x, y: source.y };
        return diagonal({ source: o, target: o });
      })
      .remove();

    root.eachBefore((d) => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  function diagonal(d) {
    return `M${d.source.y},${d.source.x}C${(d.source.y + d.target.y) / 2},${d.source.x} ${(d.source.y + d.target.y) / 2},${d.target.x} ${d.target.y},${d.target.x}`;
  }

  update(root);
  showDetails(root);

  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      svg.attr("width", entry.contentRect.width);
      svg.attr("height", entry.contentRect.height);
      update(root);
    }
  });
  resizeObserver.observe(diagram);
})();
