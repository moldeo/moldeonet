var time = 0;

/**
 * TODO: 
 *     a) Calculate text size!! and update calculation of boundaries... UpdateBoundary and fixBoundaries
 *     b) Reorder z-index nodes (fathers and childs) para que no tapen los hijos a los padres cuando aparecen? o simplemente que el alpha arranque con un delay
 *     c) Sacar lo de TEATRODANZA por DANZATEATRO
 *     d) Hacer los links con formato ribosomático
 */


/***
 *<!DOCTYPE html>
<meta charset="utf-8">
<body>
<style>

path {
  fill: none;
  stroke: #000;
  stroke-width: 3px;
}

circle {
  fill: steelblue;
  stroke: #fff;
  stroke-width: 3px;
}

</style>
<script src="http://d3js.org/d3.v3.min.js"></script>
<script>

var points = [
  [480, 200],
  [580, 400],
  [680, 100],
  [780, 300],
  [180, 300],
  [280, 100],
  [380, 400]
];

var svg = d3.select("body").append("svg")
    .attr("width", 960)
    .attr("height", 500);

var path = svg.append("path")
    .data([points])
    .attr("d", d3.svg.line()
    .tension(0) // Catmull–Rom
    .interpolate("cardinal-closed"));

svg.selectAll(".point")
    .data(points)
  .enter().append("circle")
    .attr("r", 4)
    .attr("transform", function(d) { return "translate(" + d + ")"; });

var circle = svg.append("circle")
    .attr("r", 13)
    .attr("transform", "translate(" + points[0] + ")");

transition();

function transition() {
  circle.transition()
      .duration(10000)
      .attrTween("transform", translateAlong(path.node()))
      .each("end", transition);
}

// Returns an attrTween for translating along the specified path element.
function translateAlong(path) {
  var l = path.getTotalLength();
  return function(d, i, a) {
    return function(t) {
      var p = path.getPointAtLength(t * l);
      return "translate(" + p.x + "," + p.y + ")";
    };
  };
}

</script>
 
 * 
 */

function resizeall( event ) {
	console.log("resize all");
}

function angleBetween(point1, point2) {
  return Math.atan2( point2.x - point1.x, point2.y - point1.y );
}

function FractalRibosome( root, width, height, options ) {
	
	var self = this;
	
	this.root = root;
	this.options = options || {};
	this.posx = {};
	this.posy = {};
	this.uniqueposy = {};
	this.duration = 3300;
	this.glowduration = 2700;
	this.glowopacity = 0.3;
	this.glowscalexy = 1.03;
	this.anitype = "cubic-in-out";

	this.width = width;
	this.height = height;
	
	this.nodes = {};
	this.links = {};
	
	this.uniqueid = 0;
	this.bfactor = 1.1;//Boundary factor  multiplier
	
	this.textSeparation = 1.4;
	

	this.root = root;
	
	this.node_mode = "tree_ribo"; /** tree_ribo | tree_basic | tree_basic_vertical " */

	/*NODE SIZE*/
	this.node_size  = "random";
	this.node_size_base = 1.4;
	this.node_size_proportion = 1.0;
	this.node_size_fixed = true;

	/*NODE POSITION*/
	this.node_position_mode = "circular";
	this.node_position_radius = "random";
	this.node_position_angle = 0.0;
	this.node_order_proportion = "circular";
	
	/*NODE LINKS RIBO*/
	this.showRiboline = false;
	this.riboSteps = 4;
	this.riboNoise = 0.17;
	this.riboInterpolation = "basis";
	/*internal members*/
	this.diagonal = d3.svg.diagonal()
		.projection(function(d) { 
			return [d.y, d.x]; 
		});
	this.angle_a = 3.1415*17.0/180.0;
	this.angle_b = 3.1415-self.angle_a;
	
	this.tree = options['tree'];
	this.svg = options['svg'];
	
	this.node = {};
	this.link = {};
	this.nodeEnter = {};
	this.nodeExit = {};
	this.xnodeUpdate = {};
	
	this.showVars = false;
	this.showBox = false;
	this.showCenter = false;
	
	for( var option in options) {
		console.log("options: "+  option);
		this[option] = options[option];
	}
	
	this.Init = function( parent_id ) {
		console.log("FractalRibosome::Init() self.height [real W]: "+self.height +" self.width [real H]:" + self.width );	
		if (self.tree==undefined) self.tree = d3.layout.tree().size([self.height, self.width]);
		if (self.svg==undefined) self.svg = d3.select("#"+parent_id).append("svg")
			.attr("id","svghome")
			.attr("width", self.width+"px" )
			.attr("height", self.height+"px" )
			.append("g")
			.attr("transform", "translate(0,0)");
		else console.log("FractalRibosome:Init() > svg creation error");

		self.root.x0 = self.height/2;
		self.root.y0 = self.width/2;
		self.root.children.forEach( self.NodeCollapse );
		self.root.children.forEach( self.NodeSelect );
		self.Update( self.root );
	};
	
	this.Resize = function( w, h ) {
		self.width = w;
		self.height = h;
		self.tree = d3.layout.tree().size([self.height, self.width]);
		d3.select("#svghome").attr("width", self.width+"px" ).attr("height", self.height+"px" );
		
		self.root.x0 = self.height/2;
		self.root.y0 = self.width/2;
	
		self.Update(self.root);

	};
	
	this.NodeSelect = function(d) {
		d.selected = true;
	};
	
	this.NodeUnselect = function(d) {
		d.selected = false;
	};
	
	
	this.NodeCollapse = function( d ) {
		
	   if (d.children) {
	      d._children = d.children;
	      d._children.forEach( self.NodeCollapse );
	      d.children = null;
	   }
	
	};
	
	this.CollapseBranch = function( of_node ) {
		
		/*collapse this one, show the fathers...and uncles*/
	    for(var ii in self.TreeNodes) {
		    var one_node = self.TreeNodes[ii];
		    
		  	/*dont collapse ancester*/					    
		    if ( isNotAncesterOf( one_node, of_node) ) {
			    /*collapse everything else! but family*/		    	
			    if ( BranchExpanded(one_node) ) {
			    	self.NodeCollapse( one_node );
			    }
			    
			    /*console.log("collapsing > : "+ dd.name+" dd.selected:"+dd.selected+" dd.children:"+dd.children);*/
		    }
		    
		    /*Demarca a todos*/
		    self.NodeUnselect( one_node );
		    one_node.focus = false;
		    
			/*keep all the brothers selected (visibles), him and the parent*/
		    if (AreBrothers(one_node,of_node) ) {
		    	self.NodeSelect( one_node );
		    	if (one_node.parent) {
		    		self.NodeSelect( one_node.parent );
			    }
			  }
			  
		    if (one_node==of_node.parent && one_node.parent ) {
		    	one_node.focus = true;
		    }
	    }		
	};
	
	this.NodeExpand = function( d ) {

	   if (d._children) {
		      d.children = d._children;
		      d._children = null;
		   }
			  
	};	
	
	this.ExpandAll = function(of_node) {
		
		if (of_node==undefined )
			of_node = self.TreeNodes[0];
		
		self.NodeExpand(of_node);
		
		if (of_node.children)
			for(var ii in of_node.children) {
				var child_node = of_node.children[ii];
				self.ExpandAll(child_node);
				child_node.focus = false;
			}
		
	};
	
	this.ExpandBranch = function( of_node ) {
		
		/*full tree collapse but not the family tree part (Ancestors)*/
		for(var ii in self.TreeNodes) {
			
		    var one_node = self.TreeNodes[ii];
		    		    
		    /*no podemos colapsar ni el padre ni al abuelo, ni a este ya que lo queremos expandir*/
		    if ( isNotAncesterOf( one_node, of_node)
				    && one_node!=of_node ) {
		    	if ( BranchExpanded(one_node) ) {
		    		self.NodeCollapse( one_node );		    		
		    	}
		    } else self.NodeExpand( one_node );
		    
		    self.NodeUnselect( one_node );//all unselected
		    one_node.focus = false;
		}
		
		self.NodeExpand( of_node );
	    self.NodeSelect( of_node );	    
	    
		/*mark each branch child as selected=true (so they are glowed)*/
		for(var ii in of_node.children) {
		    var child_node = of_node.children[ii];
		    self.NodeSelect( child_node );
		    child_node.focus = false;
	    }
		
		bringOn( of_node );
	};
	
	this.strokeLink = function(d) {
	  if (d.source.children) return "rgba( 0, 0, 0,"+(0.1*d.source.opacity)+")";
	  if (d.source.selected) return "rgba( 0, 0, 0, 0)";
	  if (d.source.children==null) return "rgba( 0, 0, 0, 0)";
	};
	
	this.linkEnter = function(d) {
	  var src = { x: d.source.x0, y: d.source.y0 };
	  var dst = { x: d.target.px0, y: d.target.py0 };
	  
	  if (self.showRiboline) {
		  return self.riboLineFunction( {source: src, target: dst} );
	  }
	  return self.diagonal({source: src, target: dst});
    };
    
    this.linkExit = function(d) {
		var src = { x: d.source.x, y: d.source.y };
		var dst = { x: d.target.px0, y: d.target.py0 };
		if (self.showRiboline) {
			return self.riboLineFunction({source: src, target: dst});
		}
		return self.diagonal({source: src, target: dst});
	
    };
	
    this.linkTransition = function(d) {
    	if (self.showRiboline) {
    	    return self.riboLineFunction({source: d.source, target: d.target});
    	}
    	return self.diagonal({source: d.source, target: d.target});
    };

    this.riboLineFunction = function(d) {
    	
    	var lineData = [];
    	lineData.push({ "x": d.source.y, "y": d.source.x });
    	for( var j=0; j<self.riboSteps; j++ ) {
    		var fract = j*1.0/(self.riboSteps+1.0);
    		var randx = Math.random()*self.riboNoise;
    		var randy = Math.random()*self.riboNoise;
    		lineData.push({ 
    				x: d.source.y + (d.target.y-d.source.y)*(fract+randy),
    				y: d.source.x + (d.target.x-d.source.x)*(fract+randx)
    			}
    		);
    	}
    	d.target.parentLinkData = lineData;
    	lineData.push({ "x": d.target.y, "y": d.target.x });
    	
    	return d3.svg.line()    
			 .x(function(d) { return d.x; })
			 .y(function(d) { return d.y; })
			 .interpolate(self.riboInterpolation)(lineData);
		
    };
	
    this.nodeEnterTransform = function(source, d) { 
		var dpx0 = 0;
		var dpy0 = 0;
		if (d.parent) { dpx0 = d.parent.x; dpy0 = d.parent.y; }
		var dx0 = Number(source.y0)+Number( (d.y-dpy0)*0.3);
		var dy0 = Number(source.x0)+Number( (d.x-dpx0)*0.3);
		d.py0 = dx0;
		d.px0 = dy0;
		d.scale = 1.0;
		if (!d.selected) d.scale = 0.5;
		return "translate("+d.py0+","+d.px0+") scale("+d.scale+")";
    };
    
    /** inverting x and y*/
    this.nodeTransitionTransform = function(d) {
    if (!d.selected) d.scale = 0.618;
  	  return "translate(" + d.y + "," + d.x + ") scale("+d.scale+")";
    };
    
    this.nodeExitTransform  = function(d) {
      if (!d.selected) d.scale = 0.618;
  	  return "translate("+d.py0+","+d.px0+") scale("+d.scale+")";
    };
    
    this.nodeAnimateTransition = function(d) {
		d.rdx = d.x;
		d.rdy = d.y;
		//if (!d.selected) d.scale = 0.618;
		/*
		if (	SonOfSelected(d)
				&& IsChildIteration(d)
				&& d.omega==false)
			scalexy = self.glowscalexy;
			*/
		/*
		if (d.parent) {
			var ddx = d.parent.x-d.x;
			var ddy = d.parent.y-d.y;
			var ang = angleBetween( d, d.parent );
			
			var radius = Math.sqrt( ddx*ddx + ddy*ddy  );
			
			console.log("d.name:"+d.name + " ang:"+ ang);
			
			d.x = d.x;
			d.y = d.y;
		}*/
		/*
		d.rdx = d.x;
		d.rdy = d.y;
		*/
	    return "translate(" + d.rdy + "," + d.rdx + ") scale("+d.scale+")";
	};
/*
	var lineData = [ { "x": 1,   "y": 5},  { "x": 20,  "y": 20},
	                 { "x": 40,  "y": 10}, { "x": 60,  "y": 40},
	                 { "x": 80,  "y": 5},  { "x": 100, "y": 60}];        
*/
	/**Update full TREE*/
	this.Update = function(source) {

		  /* Compute the new tree layout.*/
		  self.TreeNodes = self.tree.nodes( self.root );
		  self.TreeLinks = self.tree.links( self.TreeNodes );
		  
		  /*console.log("FractalRibosome::Update() > root x0:" + self.root.x0+" root y0:" + self.root.y0 );*/
		  /** 
		   * 
		   * Set positions and font sizes for each node at update() 
		   * d {
		   * 	opacity,
		   * 	size,
		   * 	children,
		   * 	selected,
		   * 	x,
		   * 	y,
		   * 	childiteration
		   * 	
		   * }
		   * 
		   * */
		  self.TreeNodes.forEach( self.NodeUpdate );
		  
		  /* Update the nodes (id) */
		  self.NodeObject = self.svg.selectAll("g.node")
		      .data(self.TreeNodes, function(d) { 
			      	return d.id || (d.id = ++(self.uniqueid)); 
			      });

		  /* Enter any new nodes at the parent's previous position.*/
		  self.nodeEnter = self.NodeObject.enter().append("g")
		  	  .attr("id", function (d) {
		  		  return d.wid+"_"+d.type; 
		  	  })
		      .attr("class", function(d) {
					if (d.depth==0) {
							d.selected = true;
							dsel = "";
							if (d.selected) dsel = "nodeselected";
							return "node nodehide node-"+d.depth+" "+dsel;
					}
					dsel = "";
					if (d.selected) dsel = "nodeselected";
					return "node node-"+d.depth+" node-"+d.type+" node-"+d.wid+"_"+d.type+" "+dsel;
		      })
		      .attr("transform", function(d) { return self.nodeEnterTransform(source, d); } )
		      .attr("selected",function(d) {
		    	  if (d.selected) return "true";
		    	  else return "false";
		      })
		      .on("click", self.ClickNode );

		  if (self.showCenter)
			  self.nodeEnter.append("circle")
			  	  .attr("cx", function(d) {
			  		  return 0;
			  	  })
			  	  .attr("cy", 0 )
			      .attr("r", function(d) {
			    	  return 5;
			      })
			      .style("fill", function(d) { return d._children ? "#000" : "#000"; })
			  	  .style("fill-opacity", "0.7");

		  self.nodeEnter.append("text")
		      .attr("class","nodename")
		  	  .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
		      /*.attr("style", "letter-spacing: -2px;")*/
		      .attr("dx", function(d) {
		    	  var result = '';
		    	  for(var c=0;c<d.name.length;c++  ) {
		    		  result+='-1.5 ';
		    	  }
		    	  return result;
		      })
		      .attr("text-anchor", function(d) { return d.children || d._children ? "middle" : "middle"; })
		      .text( self.NodeText )		      
		      .style("fill-opacity", "0.0")
		  	  .style("font-size", self.NodeFontSize );
		  
		  
		/* Transition nodes to their new position.*/
		  self.xnodeUpdate = self.NodeObject.transition()
		      .duration(self.duration)
		      /*.delay(self.nodeDelay)*/
		      .ease(self.anitype)
		      .attr("transform", self.nodeTransitionTransform )
		      .each("end", self.AnimateNodes );
		 
		   
		  
		 if (self.showCenter) {
			 
			 self.xnodeUpdate.select("circle")
				.attr("r", function(d) {
					return 5;
				})
				.style("fill", function(d) { return d._children ? "#fff" : "#fff"; })
				.style("fill-opacity", "0.2");
			
			 self.nodeExit.select("circle")
						.attr("r", 1e-6);
		}
		  
	 	self.xnodeUpdate.select(".nodename")
			.style("fill-opacity", function (d) {
			if (!isNaN(d.opacity)) 
					return d.opacity;
						
			})
			.text( self.NodeText );
		  

		  /* Transition exiting nodes to the parent's new position.*/
		  self.nodeExit = self.NodeObject.exit().transition()
		      .duration(self.duration)
		      /*.delay(self.nodeDelay)*/
		      .ease(self.anitype)
		      .attr("transform", self.nodeExitTransform )
		      .remove();		  

		  self.nodeExit.select(".nodename")
		      .style("fill-opacity", 0.0 );

		  /* Update the links*/
		  self.link = self.svg.selectAll("path.link")
		      .data( self.TreeLinks, function(d) { return d.target.id; });

		  /* Enter any new links at the parent's previous position.*/
		  self.link.enter().insert("path", "g")
		      .attr("class", function(d) { 
			      	if (d.name=="raiz") return "link link-0";
			      	return "link link-"+d.source.depth; 
			      } )
		      .style("stroke",
		    	function(d) {
		    	  return "rgba(0,0,0,0)";
		        })
		      .attr("d", self.linkEnter );
		  
		  /* Transition links to their new position.*/
		  self.link.transition()
		      .duration(self.duration)
		      .delay(self.linkDelay)
		      .ease(self.anitype)
		      .attr("d", self.linkTransition )
		      .style("stroke", self.strokeLink );

		  /* Transition exiting nodes to the parent's new position.*/
		  self.link.exit().transition()
		      .duration(self.duration)
		      .delay(self.linkDelayOut)
		      .ease(self.anitype)
		      .style("stroke", "rgba(0,0,0,0)" /**self.strokeLink*/ )
		      .attr("d", self.linkExit )
		      .remove();

		  /* Stash the old positions for transition.*/
		  self.TreeNodes.forEach(function(d) {
		    d.x0 = d.x;
		    d.y0 = d.y;
		  });

		  self.updateTexts();
		  
		  setTimeout( function() {
			  
			  self.updateBoxes();
		  
			  if (self.showBox) {
				  
				  self.nodeEnter.append("rect")
		  			.attr("class","childsrect")
		  			.attr("fill", "none")
			  		.attr("stroke-width", 4)
			  		.attr("stroke", "blue")
		  			.attr("x",function(d) {
		  				if (d.childtop)
		  					return -d.childtop;
		  			})
		  			.attr("y",function(d) {
		  				if (d.childleft)
		  					return d.childleft;
		  			})
		  			.attr("width",function(d) {
	
		  				if (d.childboxHeight)
		  					return d.childboxHeight;
		  				
		  				return 0;
		  			})
		  			.attr("height",function(d) {
	
		  				if (d.childboxWidth)
		  					return d.childboxWidth;		  			
		  				return 0;
		  			});
				  
				  self.nodeEnter.append("rect")
					.attr("class","textrect")
					.attr("fill", "none")
					.attr("stroke-width", 4)
					.attr("stroke", "red")
					.attr("x",function(d) {							
						return d.textBoxX;
					})
					.attr("y",function(d) {
						return d.textBoxY;
					})
					.attr("width",function(d) {
						return d.textBoxWidth;
					})
					.attr("height",function(d) {
						return d.textBoxHeight;
					});
				  
				
				
					self.xnodeUpdate.select(".textrect")
								.attr("x",function(d) {							
									return d.textBoxX;
								})
								.attr("y",function(d) {
									return d.textBoxY;
								})
								.attr("width",function(d) {
									return d.textBoxWidth;
								})
								.attr("height",function(d) {
									return d.textBoxHeight;
								});				
				
				  self.xnodeUpdate.select(".childsrect")
			  			.attr("x",function(d) {
								if (d.childboxHeight)
									return (d.childtop-d.childboxHeight);
								return 0;
							})
							.attr("y",function(d) {
								if (d.childboxWidth)
									return d.childleft;			
								return 0;
							})
							.attr("width",function(d) {
								if (d.childboxHeight)
									return d.childboxHeight;
								return 0;
							})
							.attr("height",function(d) {
								if (d.childboxWidth)
									return d.childboxWidth;
								return 0;
							});
					
			  }
			  			  
			  self.updateBoundaries();
			  self.updateBoundaries();
			  
		  }, 200 );
	};
	
	this.updateVars = function(d) {
		var dvars = "vars: ";
		if (d.parent) {
		dvars+= " minx:" + Math.floor(d.minx);
		dvars+= "\n"+" maxx: " + Math.floor(d.maxx);
		dvars+= "\n"+" xpos_left: " + Math.floor(d.y+d.minx);
		dvars+= "\n"+" xpos_right: " + Math.floor(d.y+d.maxx);
		dvars+= "\n"+" parent.x: " + Math.floor(d.parent.x);
		dvars+= "\n"+" parent.y: " + Math.floor(d.parent.y);
		dvars+= "\n"+" x: " + Math.floor(d.y);
		dvars+= "\n"+" y: " + Math.floor(d.x);
		dvars+= "\n"+" deltax: " + Math.floor(d.deltay);
		dvars+= "\n"+" deltay: " + Math.floor(d.deltax);
		dvars+= "\n minx:" + Math.floor(d.minx);
		dvars+= "\n miny:" + Math.floor(d.miny);
		dvars+= "\n maxx:" + Math.floor(d.maxx);
		dvars+= "\n maxy:" + Math.floor(d.maxy);
		dvars+= "\n"+" bbox.x: " + Math.floor(d.bbox.x);
		dvars+= "\n"+" bbox.y: " + Math.floor(d.bbox.y);
		dvars+= "\n"+" bbox.maxx: " + Math.floor(d.bbox.maxx);
		dvars+= "\n"+" bbox.maxy: " + Math.floor(d.bbox.maxy);
		}
		return dvars;
	};
	
	/**Update one Node TREE
	 * sets:
	 * 			Position: d.x, d.y ( TODO: d.z ?? )
	 * 			Scale: d.size
	 * 			Order: d.order (affects Scale!! ) ( RELATION WITH FATHER > older, elder, maturity > )
	 * 			Selected: d.selected (d.selected affects opacity!!)
	 * 			Opacity: d.opacity
	 * 			Family Dynamic: Look for his family one by one,
	 * 							d.childiteration: reset child iteration to 0 for parents
	 * 			d.depth: affects d.size!
	 * */
	this.NodeUpdate = function( d ) { 
		
		/** choose between UP and DOWN*/
		/** then choose between Angle 0 and Angle 1*/
		
		/** d.angle_new = 3.1415/2.0 + self.angle_a + ( self.angle_b - self.angle_a ) * Math.random();*/
		var radius = 1.0;
  		
		if (IsRootChild(d)) {
			radius = 1.3;
  		} else {
  			radius = 1.0;
  		}				
		/** d.parent.children.length;*/
		/** console.log("angle_new:" + angle_new);*/
		
		if (d.parent==undefined) {
			if (self.node_size=="random") {
				d.size = 1.4+(Math.random()-0.5)/3.0;
			}
			else 
				d.size = self.node_size_base;
			
			d.angle_new = 0;
			
		} else {
			
			if (self.node_size=="random") {
				d.size = d.parent.size * (1.0/1.3)*(1.4+(Math.random()-0.5)/3.0);
			} else if (self.node_size=="fixed") {
				d.size = self.node_size_base;
			} else if (self.node_size=="proportional") {
				d.size = d.parent.size * d.node_size_proportion;
			}
			var order_proportion = 1.0;
			if (self.node_position_mode=="circular") {
				order_proportion = Math.floor( d.order / 2 ) / Math.floor((d.parent.children.length+1)/2); 
				d.angle_new = 3.1415*0.5 + self.angle_a + ( self.angle_b - self.angle_a ) * order_proportion;
			} else {
				d.angle_new = self.node_position_angle;
			}
			
			
			//odd/even are up/down relative to the parent
			if ((d.order % 2) == 1) d.angle_new = d.angle_new + 3.1415;
		}
	  	/**d.size = 1.4+(Math.random()-0.5)/3.0;*/
	  	
	  	if ( IsRootChild(d) ) {
	  		
			d.size = self.node_size_base;
			if (self.node_size_fixed)
				switch(d.order) {
					case 0:
						{
						d.size = 2.2;
						d.angle_new = 4*3.1415/2 + 0.5;
						radius = radius * 0.25;
						}
						break;
					case 1:
						d.size = 1.5;
						d.angle_new = 2*3.1415/2 + 0.5;
						radius = radius * 0.4;
						break;
					case 2:
						d.size = 1.0;
						{//d.angle_new = -3.1415/2 + 0.7;
						d.angle_new = 2*3.1415/2 + 1.2;
						radius = radius * 0.9;
						}
						break;
					default:
						break;
				}
	  	}
	  	
	  	/** text box*/
	  	self.NodeFontSize(d);

	  	randomangle = 3;
	  	
	  	is_not_root_node = IsNotRootNode(d);	  	  	
	  	
	  	if (is_not_root_node) {

	  		/**radius = rr * ( Math.random()*0.1 + 0.5 + 0.4*(d.order % 2) ) * 0.45 * self.height / self.bfactor;  		
	  		d_angle = d.order * 2 * 3.1415 / d.parent.children.length;
	  		radius = rr * self.height / self.bfactor;
	  		radius = 100.0 + 20*d.order;
	  		*/
	  		
	  		if (self.node_position_radius=="random") {
				{ radius = radius * 0.4 * (self.height / self.bfactor) *( 1.5 - (d.order/d.parent.children.length)*1.1); }
			} else {
				radius = self.node_position_radius;
			}
	  		
	  		{ d_angle = d.angle_new; }
	  		
	  		if (!IsRootChild(d)) {
	  			/** d_angle = d_angle + Math.random()*0.1618*randomangle; */
	  			{ radius = radius; }
	  		}
	  		
	  	}
	  	
	  	if (is_not_root_node) {
	  		
			if (self.node_position_mode=="circular") {
				d.xrel = Math.min(radius, self.height/2) * Math.cos( d_angle );
			} else if (self.node_position_mode=="linear") {
				d.xrel = (d.order - d.parent.children.length/2)*80.0;
			} else {
				d.xrel = 0.0;
			}
	  		
			if ( IsRootChild(d) ) {
				if (self.node_position_mode=="circular") {
					d.xrel =  Math.min(radius*1.2, self.height/2) * Math.cos( d_angle );
				}
			}
	  		  			  		
			/**self.posx[ d.name+"_"+d.type] = Math.min( d.parent.x + xpos, self.height/self.bfactor );*/
	  		self.posx[ d.name+"_"+d.type] = d.parent.x + d.xrel;
	  		
	  			  		
	  		if ( IsRootChild(d) ) {
				if (d.order==0) {
					self.posx[ d.name+"_"+d.type]+= 0.0;
				}
			}
	  	} else {
	  		self.posx[ d.name+"_"+d.type] = 0.5 * self.height;  		
		}
			
	  	if (d.focus==true) d.x = d.x;
	  	else d.x = self.posx[ d.name + "_" + d.type ];
	  	
		if (is_not_root_node) {
			if (self.node_position_mode=="circular") {
				d.yrel = Math.min(radius * 1.3, self.width/2) * Math.sin( d_angle );
			} else if(self.node_position_mode=="linear") {
				d.yrel = 300.0;
			} else {
				d.yrel = 0.0;
			}
			
			if ( IsRootChild(d) ) {
				d.yrel = radius * 1.0 * Math.sin( d_angle );
			}
			
			self.posy[ d.name+"_"+d.type] = d.parent.y + d.yrel;
			/**self.posy[ d.name+"_"+d.type] = Math.min( d.parent.y + ypos, self.width/self.bfactor );*/
			if ( IsRootChild(d) ) {
				if (d.order==0) {
					self.posy[ d.name+"_"+d.type]+= 0.0;
				}
			}
		} else {
			self.posy[ d.name+"_"+d.type] = 0.5 * self.width;
		}

	  	if (d.focus==true) d.y = d.y;
	  	else d.y = self.posy[ d.name+"_"+d.type];
			
			/*opacity: show only two levels: the last expanded ones
			if this one has children he is showing off
			if his father has him as children, so he is showinf off too
			
			has opened ramifications but, it's not the selected one... (ancestors)
			*/
	  	if (d.selected) {
				d.opacity = 1.0;
		} else if (d.children && !d.selected) {
		  	d.opacity = 0.2;
	  	} else {
	  		d.opacity = 0.2;
		  }
	  	if (HasChilds(d)) {
			d.childiteration = 0;/**alway reset*/
	  	}
	  	
	};
	
	this.NodeText = function( d ) {
		
		/**dd = d3.select(this);*/
		{dname = d.name.toLowerCase();}
		
		/**if (d.focus) dname+="(F)";*/
		if (d.fixboundary) { 
			//dname+="(B)[" + Math.floor( d.deltay )+"]";
			if (d.broNear) {
				//dname+=":"+d.broNear.name;
			}
			
		}
		return dname;
	};
	
	this.NodeFontSize = function( d ) {
		var fsize = d.size * 100;
		/**using % relative to parent : see body  */
			
			if (d.type=='seccion') {
				fsize*= 1.8;
			}
			d.fsize = Math.max( fsize, 200 );
			return parseInt( d.fsize ) + "%"; 
			/* % now */
	};
	
	this.updateBoundaries = function() {
		
		/*move this one with their childs to the center screen*/
		self.TreeNodes.forEach( self.UpdateBoundary );
		self.TreeNodes.forEach( self.fixBoundaries );
		
		if (self.showBox) {
			
			self.nodeEnter.append("rect")
				.attr("class","minmax")
				.attr("fill", "none")
				.attr("stroke-width", 4)
				.attr("stroke", function(d) {
					if (d.fixboundary) {
						return "violet";
					} else {
						return "green";
					}					
				})
				.attr("x",function(d) {
				if (d.maxx)
						return d.minx;
					return 0;
				})
				.attr("y",function(d) {
					if (d.maxy)
						return d.miny;
					return 0;
				})
				.attr("width",function(d) {
					if (d.maxx)
						return d.maxx-d.minx;
					return 0;
				})
				.attr("height",function(d) {
					if (d.maxy)
						return d.maxy-d.miny;
					return 0;
				});
			
			self.xnodeUpdate.select(".minmax")
				.attr("stroke-width", 4)
				.attr("stroke", function(d) {
					if (d.fixboundary) {
						return "violet";
					} else {
						return "green";
					}					
				})
				.attr("x",function(d) {
					if (d.maxx)
						return d.minx;
					return 0;
				})
				.attr("y",function(d) {
					if (d.maxy)
						return d.miny;
					return 0;
				})
				.attr("width",function(d) {
					if (d.maxx)
						return d.maxx-d.minx;
					return 0;
				})
				.attr("height",function(d) {
					if (d.maxy)
						return d.maxy-d.miny;
					return 0;
				});
			
			
			self.nodeEnter.append("rect")
				.attr("class","intersect")
				.attr("fill", function(d) {
					if (d.fixboundary) {
						return "green";
					}					
					return "none";
				})
				.attr("stroke-width", 6)
				.attr("stroke", function(d) {
					if (d.fixboundary) {
						return "green";
					} else {
						return "black";
					}					
				})
				.attr("x",function(d) {
					
					return -3;
				})
				.attr("y",function(d) {
					
					return -3;
				})
				.attr("width",function(d) {
					
					return 6;
				})
				.attr("height",function(d) {
					return 6;
				});
		
			self.updateIntersectRect();
		}
		
		if (self.showVars) {
			  self.nodeEnter.append("text")
			  	.attr("class","vars")
			  	.attr("x", function(d) {
			  		return 0;
			  	})
			  	.attr("y", function(d) {
			  		return 0;
			  	})
			  	.text("Vars");
			  
			  self.xnodeUpdate.select(".vars")
			  	.attr("x",function(d) {
			  		return -300;
			  	})
			  	.attr("y",function(d) {
			  		return 30;
			  	})
			  	.text(self.updateVars);
		  }
		
		  /* Stash the old positions for transition.*/
		  self.TreeNodes.forEach(function(d) {
		    d.x0 = d.x;
		    d.y0 = d.y;
		  });		
		
		/* Transition nodes to their new position.*/
		  {
		  self.xnodeUpdate = self.NodeObject.transition()
		      .duration(self.duration)
		      .ease(self.anitype)
		      .attr("transform", self.nodeTransitionTransform )
		      .each("end", self.AnimateNodes );
		  }
			/* Transition links to their new position.*/
		  {
		  self.link.transition()
		      .duration(self.duration)
		      .ease( self.anitype )
		      .attr( "d", self.linkTransition )
		      .style( "stroke", self.strokeLink );
		  }
	};	
	
	this.UpdateBoundary = function( node ) {
		var nodechilds = node.children;/*only expanded one*/
		node.boundaries = true;
		node.childs_x = 0;
		node.childs_y = 0;
		node.childs_w = 0;
		node.childs_h = 0;
		node.minx = 1000000;
		node.maxx = 0;
		node.miny = 1000000;
		node.maxy = 0;
		node.nodechilds = nodechilds;
		if (nodechilds) {
			{
			node.minx = node.childtop - node.childboxHeight;
			node.miny = node.childleft;
			node.maxx = node.minx+node.childboxHeight;
			node.maxy = node.miny+node.childboxWidth;
			}
		} else {						
			node.minx = node.textBoxX;
			node.maxx = node.textBoxX+node.textBoxWidth;
			node.miny = node.textBoxY;
			node.maxy = node.textBoxY+node.textBoxHeight;
		}
		
		node.childs_w = node.maxx - node.minx;
		node.childs_h = node.maxy - node.miny;
		node.childs_x = node.childs_w / 2;
		node.childs_y = node.childs_h / 2;
		
	};
	
	this.OutOfBoundaries = function( node ) {
		
		if ( (node.maxx + node.y)*self.bfactor > window.innerWidth
			|| (node.minx + node.y)*self.bfactor < 0 ) {
			return true;
		}
		if ( (node.maxy+node.x)*self.bfactor > window.innerHeight
			|| (node.miny + node.x)*self.bfactor < 0) {
			return true;
		}
		
		return false;
	};
	
	this.surfaceIntersection = function( node, bro ) {
		
		var distx = (bro.y - node.y);
		var disty = (bro.x - node.x);
		var distc = Math.sqrt( distx*distx + disty*disty );
		var xinter = false;
		var yinter = false;
		
		if ( Math.abs(disty) > ( bro.bbox.height+node.bbox.height)/2 ) return 0;
		if ( Math.abs(distx) > ( bro.bbox.width+node.bbox.width)/2 ) return 0;

		bro.bbox.maxx = bro.bbox.x+bro.bbox.width; 
		bro.bbox.maxy = bro.bbox.y+bro.bbox.height;
		node.bbox.maxx = node.bbox.x+node.bbox.width; 
		node.bbox.maxy = node.bbox.y+node.bbox.height;
		
		xinter = (bro.y+bro.bbox.x) < (node.y+node.bbox.maxx) && (bro.y+bro.bbox.maxx) > (node.y+node.bbox.x);
		yinter = (bro.x+bro.bbox.y) < (node.x+node.bbox.maxy) && (bro.x+bro.bbox.maxy) > (node.x+node.bbox.y);
		
		if ( xinter && yinter ) {
			{
			var surfI = new Object();			

			surfI.miny = Math.max( bro.x+bro.bbox.y, node.x+node.bbox.y ); 
			surfI.maxy = Math.min( bro.x+bro.bbox.maxy, node.x+node.bbox.maxy );
			
			surfI.minx = Math.max( bro.y+bro.bbox.x, node.y+node.bbox.x ); 
			surfI.maxx = Math.min( bro.y+bro.bbox.maxx, node.y+node.bbox.maxx ); 
			surfI.area = (surfI.maxy- surfI.miny)*(surfI.maxx- surfI.minx);
			}
			return surfI;
		}
		
		return 0;
		
	};
	
	this.fixBoundaries = function( node ) {
		
		/*si esta fuera de la pantalla: desplazar todo de un delta X, delta Y*/
		{
		node.deltax = 0;
		node.deltay = 0;
		}
		if (self.OutOfBoundaries(node) && node.children==undefined ) {
			node.fixboundary = true;
			{
				if ((node.maxx+node.y)*self.bfactor > window.innerWidth) node.deltay = window.innerWidth - (node.maxx+node.y)*self.bfactor;
				if ((node.minx+node.y)*self.bfactor < 0) node.deltay = -(node.minx+node.y)*self.bfactor;
	
				if ( (node.maxy+node.x)*self.bfactor > window.innerHeight) node.deltax = window.innerHeight - (node.maxy+node.x)*self.bfactor;
				if ( (node.miny+node.x)*self.bfactor < 0) node.deltax = -(node.miny+node.x)*self.bfactor;

				{
					node.x = node.x + node.deltax;
					node.y = node.y + node.deltay;
				}

			}						
		} else {
			node.fixboundary = false;
		}
		
		/** chequear distancias con hermanos */
		{
		if (node.parent) {
			if (node.parent.children) {
				var broNear = undefined;
				var surfINearest = { area: 0 };
				for( var broi=0; broi<node.parent.children.length; broi++ ) {
					
					/** busca el mas cercano... */
					
					var bro = node.parent.children[ broi ];
					
					if (bro!=node && bro.selected==true && node.focus==false && node.selected==true) {
						var surfI = self.surfaceIntersection(node,bro);
						if (surfI.area>surfINearest.area) {
							surfINearest = surfI;
							broNear = bro;
							node.fixboundary = true;
							node.bro = broNear;
							node.surfI = surfI;
						}
					}
				}
				
				if (broNear && node.surfI) {
					//displace node position to avoid intersection (each are displacing, so we m ake half the way (0.5))
					if (Math.sign==undefined) {
						Math.sign = function(value) {
							if (value>0) return 1.0;
							else return -1;
						};
					}
					node.x = node.x - Math.sign(broNear.x-node.x)*( node.surfI.maxy - node.surfI.miny )*0.5;
					node.y = node.y - Math.sign(broNear.y-node.y)*( node.surfI.maxx - node.surfI.minx )*0.5;
					
					self.svg.selectAll("text").each( function( d , i ) {
						d3.select( this ).text(self.NodeText);						
					});
					self.updateIntersectRect();
					//d3.select()
				  	//  .text( self.NodeText );
					//node.x = broNear.x + Math.abs(broNear.miny+broNear.miny);
					//node.y = broNear.y + Math.abs(broNear.minx+broNear.minx);
				}
			}
		}
		}		
	};
	
	this.updateIntersectRect = function() {
		
		self.xnodeUpdate.select(".intersect")
			.attr("stroke-width", 6)
			.attr("fill", function(d) {
				if (d.fixboundary) {
					return "green";
				}					
				return "none";
			})
			.attr("stroke", function(d) {
				return "cyan";
			})
			.attr("x",function(d) {
				if (d.surfI) {
					return d.surfI.minx-d.y;
				}
				return -3;
			})
			.attr("y",function(d) {
				if (d.surfI) {
					return d.surfI.miny-d.x;
				}
				return -3;
			})
			.attr("width",function(d) {
				if (d.surfI) {
					return (d.surfI.maxx-d.surfI.minx);
				}
				return 6;
			})
			.attr("height",function(d) {
				if (d.surfI) {
					return (d.surfI.maxy-d.surfI.miny);
				}
				return 6;
			});
	}; 
		
	this.updateBoxes = function() {
		
		self.svg.selectAll(".nodename").each( function( d , i ) {
			
			d.bbox = this.getBBox();
			d.bbox.x = d.bbox.x*self.textSeparation;
			d.bbox.y = d.bbox.y*self.textSeparation;
			d.bbox.width = d.bbox.width*self.textSeparation;
			d.bbox.height = d.bbox.height*self.textSeparation;
			
		  	d.textBoxX = d.bbox.x;
		  	d.textBoxY = d.bbox.y;
		  	d.textBoxWidth = d.bbox.width;
		  	d.textBoxHeight = d.bbox.height;

	  		d.xpos_left = Number(d.xrel) + Number(d.textBoxY);
	  		d.xpos_right = Number(d.xrel) + Number(d.textBoxY) + Number(d.textBoxHeight);
	  		d.ypos_top = Number(d.yrel) - Number(d.textBoxX);
	  		d.ypos_bottom = Number(d.yrel) - Number(d.textBoxX) - Number(d.textBoxWidth);		  		
		  	
		  	if (d.parent) {
			  	if (d.parent.childtop==undefined) d.parent.childtop = 0;
				if (d.parent.childtop<d.ypos_top) d.parent.childtop = d.ypos_top;
				if (d.parent.childbottom==undefined) d.parent.childbottom = 100000;
				if (d.parent.childbottom>d.ypos_bottom) d.parent.childbottom = d.ypos_bottom;
				d.parent.childboxHeight = d.parent.childtop - d.parent.childbottom;
				
				if (d.parent.childright==undefined) d.parent.childright = 0;
		  		if (d.parent.childright<d.xpos_right) d.parent.childright = d.xpos_right;	
		  		if (d.parent.childleft==undefined) d.parent.childleft = 100000;
		  		if (d.parent.childleft>d.xpos_left) d.parent.childleft = d.xpos_left;
		  		d.parent.childboxWidth = d.parent.childright - d.parent.childleft;
		  	}
		});
	};
	
	this.updateTexts = function() {
	   self.svg.selectAll("text").each( function( d , i ) {
		   /**
		  dparentname = d3.select( this ).text();
		  d3.select( this ).text(" ");
		  specialnames = [ "produccion", "otrosproyectos", "colaboraciones", "danza","-teatro","cinetv", "intervenciones.instalaciones"];
		  tspecialnames = [ "tcolor2", "", "tcolor2", "", "tcolor2","", "tcolor2"];
		  founded = false;
		  for(var i=0;i<specialnames.length;i++) {
			  dn = specialnames[i];
			  if (dparentname.indexOf(dn)>=0) {
				  founded = true;
				  // replace this one, founded!
				  d3.select( this ).append( "tspan" ).attr("class",tspecialnames[i]).text(dn);
	    	  }
	      }
	      
	      if (founded==false) {
	    	  d3.select( this ).text(dparentname);
	      }
	      */
		  
	   });
		   
	};
	
	

	this.linkDelay = function( d ) {
		/*return 10*d.target.order;*/
		return 0;
	};
	
	this.linkDelayOut = function( d ) {
		/*return 10*d.target.order;*/
		return 0;
	};
	
	this.nodeDelay = function( d ) {
		/*return 20*d.order;*/
		return 0;
	};
	
	this.OpenFamilyBranch = function( Node ) {
		var node_parent = Node.parent;
		if (node_parent) {			
			self.NodeExpand(node_parent);
			self.Update( self.root );
			self.OpenFamilyBranch(node_parent);			
		}				
	};
	
	this.GetFamilyGod = function( basenode ) {

		
	};

	this.GetNodeById = function( basenode, node_id, node_type, it ) {
		var result = null;
		
		if (basenode.wid == node_id && basenode.type==node_type) {
			return basenode;
		}
		
		if (HasChilds(basenode)) {
			var childs = Childrens(basenode);
			for(var ii in childs ) {
				var child_node = childs[ii];
				child_node.parent = basenode;				
				if (result==null) {
					result = self.GetNodeById( child_node, node_id, node_type, it+1 );
				}
			}
		}
		
		return result;
		
	};
	
	this.GotoNode = function( abuelo_id, padre_id, nodo_id  ) {
				
		var Node = self.GetNodeById( self.TreeNodes[0], nodo_id, "obra", 0 );
		
		/*Open Family Tree.*/		
		if (Node) {
			console.log("GotoNode() > " + Node.wid+" name:" + Node.name);
			self.OpenFamilyBranch( Node );
			if ( Node.parent) {
				self.ExpandBranch( Node.parent );
			}
			if (enterspace) enterspace();			
			self.Update( Node.parent );
		} else console.error("GotoNode() > nodo_id not found: " + nodo_id);
				
		self.ClickNode(Node);
		
	};
	
	/* Toggle children on click.*/
	this.ClickNode = function(d) {
		console.log("ClickNode",d);
		if (window["enterspace"]) enterspace();
		
		if (window["playAudioBack"]) playAudioBack();
		
		if (d.type=='obra') {
			
			//retreive and open content...
			//
			if (window["flashOne"]) flashOne();
			if (window["getContent"])
				getContent( 'obra_seleccionada', 
						d.wid, 
						'completo', 
						function() {
							activateClass( document.getElementById('obra_seleccionada'), 'obra_seleccionada_open');
							activateSiteClass( 'state-obra' );
							//console.log('obra_seleccionada -> opened');
							
						
							if (ApplyScrollPane) ApplyScrollPane();
						
							
							$('#obra_seleccionada_cerrar').click( function(e) {
								deactivateSiteClass( 'state-obra' );
								deactivateClass( document.getElementById('obra_seleccionada'), 'obra_seleccionada_open');
							} );
							$('#obra_seleccionada_volver').click( function(e) {
								deactivateSiteClass( 'state-obra' );
								deactivateClass( document.getElementById('obra_seleccionada'), 'obra_seleccionada_open');
							} );
							$('#obra_seleccionada_volver_padre').click( function(e) {
								deactivateSiteClass( 'state-obra' );
								deactivateClass( document.getElementById('obra_seleccionada'), 'obra_seleccionada_open');
							} );
							
						}
					);
			
		} else	
		if (d.type=='seccion') {
			
		  if ( d.children || (!d.children && !d._children) ) { /*EXPANDED > COLLAPSE*/
			
			self.CollapseBranch( d );

		    /*centerOn( d.parent );*/
		    //bringOn( d.parent );
		    
		    self.Update(d);
		   
		  } else if (d._children) { /*COLLAPSED > EXPAND*/
			  
			self.ExpandBranch( d );
			/*centerOn( d );*/		  
		    //bringOn( d );
		    		    
		    self.Update(d);
		    //console.log("nodes:"+JSON.stringify( root ,null, "\t") );
		  }
	  
		}
	};
	
	/** move the nodes a little
	 * 
	 */
	this.AnimateNodes = function() {
		
		//console.log("FractalRibosome.AnimateNodes()");
		// this ->>> node : @see (self.xnodeUpdate)
		d3.select(this)
		.attr("domega",function(d) {
	  		  
			if (d.endediteration==true) {
				//ENDED ITERATION event
				//change to next child iteration
				NextChildIteration(d);
				d.endediteration = false;
				//console.log(" name:"+d.name+" endediteration:"+d.endediteration
				// +" childit:"+d.parent.childiteration);
			} else {
		  
				if (d.omega==undefined || d.omega==false) {
					//start iteration now!
					d.omega = true;
					 d.endediteration = false;
				} else if (d.omega==true) {
					//end iteration now!
					d.omega = false;
					if (IsChildIteration(d)) {
						d.endediteration = true;
					 }
				}
			}
			return d.omega;
		});
	  
		d3.select(this)       // this is the object 
			.transition()         // a new transition!
			.duration(self.glowduration)
			.ease("linear")     
			.style("opacity", function (d) {
				
				//console.log("d.name:"+d.name+"d.opacity:"+d.opacity);
				//console.log("SonOfSelected(d):"+SonOfSelected(d)+" IsChildIteration(d):" + IsChildIteration(d) );
				/// solo le anima a los nodos colapsados que son hijos
				/// del expandido/seleccionado...
		  		if (	SonOfSelected(d)
		  				&&
		  				IsChildIteration(d)
		  				&&
		  				d.omega==false) {
		  			//console.log("self.glowopacity*d.opacity:"+(self.glowopacity*d.opacity));
					return self.glowopacity*d.opacity;		  		
		  		}
				if (!isNaN(d.opacity)) 
						return d.opacity;
			
			} )
			.attr("transform", self.nodeAnimateTransition )
			.each('end', self.AnimateNodes );
    };
    
	/** UTILITY FUNCTIONS  */
	function BranchExpanded( node ) {
		return node.children;
	}
	function IsNotRootNode( node ) {	
		return ( node.parent && node.parent.children);
	}
	function IsRoot( node ) {	
		return ( node.parent == undefined);
	}
	function IsRootChild( node ) {	
		return ( node.parent && node.parent.parent == undefined);
	}
	function HasChilds( node ) {
		
		return (node.children || node._children);
		
	}
	
	function Childrens( node ) {
		if (node.children) {
			return node.children;
		} else if (node._children) {
			return node._children; 
		}
		return null;
	}
	
	function NumChilds(node) {
		var cn = 0;
		var childs = node.children || node._children;
		
		if (childs) {
			for( var c in childs) {
				if (c) cn++;
			}
		}
		return cn;
	}
	/** SonOfSelected
	 * @param node
	 * @return true if parent is in selected state!*/
	function SonOfSelected( node ) {
		if (node.parent && node.parent.selected)
			return node.parent.selected;
		return false;
		
	}
	function AreBrothers(brother1, brother2) {
		return brother1.parent && brother2.parent && ( brother1.parent==brother2.parent);
	}
	function IsChildIteration(node) {
		/*console.log("node.name: "+node.name
				+" childiteration:"+node.parent.childiteration
				+" order:"+node.order);*/
		return (node.parent && node.parent.childiteration==node.order);
	}
	function IsNotRootNode(d) {
		return d.parent && d.parent.children;
	}
	function NextChildIteration(node) {
		if (node.parent) {
			node.parent.childiteration+= 1;
			if (node.parent.childiteration>= NumChilds(node.parent)) {
				node.parent.childiteration = 0;
			}
		}
	}
	function isNotAncesterOf( dd, d ) {
		if (d.parent) {
			return (dd!=d.parent) && isNotAncesterOf( dd, d.parent );
		}
		else {
			return true;
		}
	}
	function centerOn( d ) {
		  var tx = -d.x + self.height/2;
		  var ty = -d.y + self.width/2;
		  self.svg.transition()
		      .duration(self.duration)
		      .ease("linear")
		      .attr("transform","translate("+ty+","+tx+")");
		  
	}
	function bringOn( d ) {

	  /*
	  var tx = -d.x + height/2;
	  var ty = -d.y + width/2;
	  */
		if (IsRootChild(d)) {
		  d.x = 0.0;
		  d.y = 0.0;
		}	  
	  
	  console.log( " bringOn(d) : d.name: "+d.name );
	  
	  if ( IsNotRootNode( d ) ) {
		  d.x = 0;
		  d.y = 0;
	  }
	  
	  if (IsRoot(d)) {
		  d.x = height / 2;
		  d.y = width / 2;
	  }
	  
	  d.focus = true;
	  
	}
	
};


				