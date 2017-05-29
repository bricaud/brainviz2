var w = 1000,
    h = 1000,
    fill = d3.scale.category20();

var force = d3.layout.force()
      .charge(-500)
      .linkDistance(200)
      .gravity(0.05)
      .size([w, h])
      .on("tick",tick);    

var drag = force.drag()
    .on("dragstart", dragstart);

var vis = d3.select("#chart")
  .append("svg:svg")
    .attr("width", w)
    .attr("height", h);


var link = vis.selectAll("line.link"),
    node = vis.selectAll("circle.node"),
    texts = vis.selectAll("text.node");

// parameters for the force algorithm
d3.json("braingraph.json", function(error,json) {
  force.nodes(json.nodes)
      .links(json.links)
      .start();

  // define the edges
  link = link.data(json.links)
    .enter().append("svg:line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return -Math.log(d.weight*10)*0.2; })
      .style("stroke", "#999");//function(d) {return fill(d.bb);})
      

  // draw nodes as circles
  node = node.data(json.nodes)
    .enter().append("svg:circle")
      .attr("class", "node")
      .attr("r",12)
      .attr("r", function(d) { return Math.sqrt(d.degree)*2; })
      .style("fill", function(d) { return fill(d.hemisphere); })
      .style("stroke-width",function(d) {return d.ctx?1:5;})
      .style("stroke",function(d) {return d.ctx?"#fff":"#ffa500";})
      .on("dblclick",dblclick)
      .call(drag);//.on("mouseover",fade(.1)).on("mouseout", fade(1));

  //labels of the nodes
  texts = texts.data(json.nodes)
    .enter().append("svg:text")
    .attr("class", "label")
    .attr("fill", "black")
    .style("text-anchor", "middle")
    .style("font-size", "14px")
    .text(function(d) {  return d.name;  }) //d.name or d.lobesnames
    .on("dblclick",dblclick)
    .call(drag);//.on("mouseover",fade(.1)).on("mouseout", fade(1));

  //show node number when the mouse stays on the node
  node.append("svg:title")
      .text(function(d) { return d.id; });


  vis.style("opacity", 1e-6)
    .transition()
      .duration(1000)
      .style("opacity", 0.9);

  //functions needed for handling the opacity effect
  var linkedByIndex = {};
  json.links.forEach(function(d) {
        linkedByIndex[d.source.index + "," + d.target.index] = 1;
  });

  function isConnected(a, b) {
        return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
  }

  function fade(opacity) {
        return function(d) {
            node.style("stroke-opacity", function(o) {
                thisOpacity = isConnected(d, o) ? 1 : opacity;
                this.setAttribute('fill-opacity', thisOpacity);
                return thisOpacity;
            });
            texts.style("stroke-opacity", function(o) {
                thisOpacity = isConnected(d, o) ? 1 : opacity;
                this.setAttribute('fill-opacity', thisOpacity);
                return thisOpacity;
            });
            link.style("stroke-opacity", opacity).style("stroke-opacity", function(o) {
                return o.source === d || o.target === d ? 1 : opacity;
            });
        };
  }

});

function tick() {
  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });

  texts.attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";});
}
function dblclick(d) {
    d3.select(this).classed("fixed", d.fixed = false);
}
function dragstart(d) {
    d3.select(this).classed("fixed", d.fixed = true);
}