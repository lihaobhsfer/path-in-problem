var students = new Set();
var problemsAndPaths = {};
var problems = [];
var cy;
var edgesToHide, nodesToHide;
var graph;
var edgeFreqs = {};
var allPaths;
var cy2;
var ui;
var interfaceFilePath;
var elts = [];
var g = null;

let numberOfStudentInGraph = 10;




function runTask2() {
  //console.log("button pressed");

  g = CTAT.ToolTutor.tutor.getGraph();
  /*var Gjson = buildJSON(g, []);
  console.log("Gjson", Gjson);
  cy.json(JSON.parse(Gjson));
  var layout = cy.layout({name: 'cose'});
  layout.run();*/
  runTask1GivenJSON(g);
}

/*
* provides Click-on-state which is needed for testing during authoring
*/

function TracePathToNode() {
  //cy.$(":selected").forEach(function(e){console.log(cy.$(e[0]).data)})
  //var P10 = g.getBestSubpath(g.getNode(1), g.getNode(10)).getSortedLinks()
  //get all selected nodes
  var selectedNodes = cy.$(":selected");
  if (selectedNodes.length < 1)
    return null;
  var firstSelect = selectedNodes[0];
  var destNodeID = Number(firstSelect.data('id'));
  console.log("firstSelect, destNodeID", firstSelect, destNodeID);
  let tp = g.getBestSubpath(g.getStartNode(), g.getNode(destNodeID));
  let PP = tp.getSortedLinks();

  PP.forEach(function (link) {
    console.log('link', link);
    CTATCommShell.commShell.processComponentAction(link.getDefaultSAI())
  });
  console.log(PP)


}


// function getInterface() {
//   interfaceFilePath = null;
//   location.search.split(/[?&]/).forEach(function (q) {
//     let NV = q.split(/=/);
//     if (NV.length > 1 && NV[0] == "interfaceFilePath")
//       interfaceFilePath = NV[1]
//   });
//   interfaceFilePath = (interfaceFilePath || document.getElementById('fileItem2').files[0]);
//   console.log(interfaceFilePath)
// }

// //<input type="button" value="Add Selected Path to BG" id="bgAddButton" onclick="addPathToBG()" />
// function addPathToBG(correct) {
//   console.log("addPathToBG called");
//   path = cy.$(":selected");

//   path.forEach(function (ele) {
//     if (!ele.isNode()) {
//       if (!("correct" in ele.data())) {
//         if (correct == 1)
//           ele.json({ data: { correct: 1 } })
//         else if (correct == 0)
//           ele.json({ data: { correct: 0 } })
//         else
//           ele.json({ data: { correct: -1 } })
//       }
//     }
//   });

// cy2.add(path);
// need to do correctness info
// if it's an edge style thing, then need a new data property for each edge/node right
// idk how to do this, UI-wise
// bleh
// cy2.fit();
// }


function getSelectedPath() {
  console.log("called");
  //get all selected nodes
  var selectedNodes = cy.$(":selected");
  if (selectedNodes.length < 1)
    return null;
  var firstSelect = selectedNodes[0];
  console.log(firstSelect);
  var root = cy.$('node[id="0"]');
  //use dijkstra's to get path
  var dijkstra = cy.elements().dijkstra('node[id="0"]',
    function () {
      return 1;
    }, false);
  var path = dijkstra.pathTo(firstSelect);
  path.select();

  //first log the SAIs in path
  path.edges().forEach(function (edge) {
    console.log(edge.data("info"))
  });
  return path;
}

// function addPathXToInterface() {
//   console.log("addPathXToInterface called");

//   getInterface();

//   cy.$().unselect();
//   x = document.getElementById("currentPathNum").value;
//   pathNum = parseInt(x);
//   console.log(x);
//   if (!isNaN(pathNum)) {
//     path = allPaths[pathNum - 1];
//     path.select();
//     var msgs = [], builder = new CTATTutoringServiceMessageBuilder();
//     path.edges().forEach(function (edge) {
//       msgs.push(builder.createInterfaceActionMessage(CTATGuid.guid(), new CTATSAI(edge.data("selection"),
//         edge.data("action"),
//         edge.data("input"))));
//     });
//     if (ui == null || ui.closed) {
//       //this is hardcoded-ish for now
//       ui = window.open(interfaceFilePath.name + "?question_file=../FinalBRDs/empty.brd&show_debug_traces=basic", "_blank");
//       ui.window.onload = (function () {
//         console.log("onload");
//         for (let m in msgs) ui.window.CTAT.ToolTutor.sendToInterface(msgs[m]);
//       }).bind(this);
//       ui.window.onclose = (function () {
//         ui = null;
//       }).bind(this);
//     }
//     else {
//       ui.window.close();
//       //we want to reset the UI somehow
//       ui = window.open(interfaceFilePath.name + "?question_file=../FinalBRDs/empty.brd&show_debug_traces=basic", "_blank");
//       ui.window.onload = (function () {
//         console.log("onload");
//         for (let m in msgs) ui.window.CTAT.ToolTutor.sendToInterface(msgs[m]);
//       }).bind(this);
//       ui.window.onclose = (function () {
//         ui = null;
//       }).bind(this);
//       /*for(let m in msgs) {
//           ui.window.CTAT.ToolTutor.sendToInterface(msgs[m]);
//       }*/
//     }
//   }
// }

function nextPath() {
  currentPathInd = parseInt(document.getElementById("currentPathNum").value);
  if (!isNaN(currentPathInd)) {
    if (currentPathInd < allPaths.length) {
      document.getElementById("currentPathNum").value = currentPathInd + 1;
    }
  }
  addPathXToInterface();
}

function prevPath() {
  currentPathInd = parseInt(document.getElementById("currentPathNum").value);
  if (!isNaN(currentPathInd)) {
    if (currentPathInd > 1) {
      document.getElementById("currentPathNum").value = currentPathInd - 1;
    }
  }
  addPathXToInterface();
}

function addPathToInterface() {
  console.log("addPathToInterface called");

  getInterface();

  //get all selected nodes/edges
  //path = getSelectedPath();
  path = cy.$(":selected");
  /*var selectedNodes = cy.$(":selected");
  var firstSelect = selectedNodes[0];
  var root = cy.$('node[id="0"]');
  //use dijkstra's to get path
  var dijkstra = cy.elements().dijkstra('node[id="0"]',
      function() {
            return 1;
          }, false);
  var path = dijkstra.pathTo(firstSelect);
  */
  //path.select();

  //first log the SAIs in path
  path.edges().forEach(function (edge) {
    console.log(edge.data("info"))

  });


  //now we need to pass it on somehow
  var msgs = [], builder = new CTATTutoringServiceMessageBuilder();
  path.edges().forEach(function (edge) {
    msgs.push(builder.createInterfaceActionMessage(CTATGuid.guid(), new CTATSAI(edge.data("selection"),
      edge.data("action"),
      edge.data("input"))));
  });

  msgs.forEach(function (msg) {
    console.log(msg)
  });

  if (ui == null || ui.closed) {
    ui = window.open(interfaceFilePath.name + "?question_file=empty.brd&show_debug_traces=basic", "_blank");
    ui.window.onload = (function () {
      for (let m in msgs) ui.window.CTAT.ToolTutor.sendToInterface(msgs[m]);
    }).bind(this);
    ui.window.onclose = (function () {
      ui = null;
    }).bind(this);
  }
  else {
    /*for(let m in msgs) {
        ui.window.CTAT.ToolTutor.sendToInterface(msgs[m]);
    }*/
    ui.window.close();
    //we want to reset the UI somehow
    ui = window.open(interfaceFilePath.name + "?question_file=../FinalBRDs/empty.brd&show_debug_traces=basic", "_blank");
    ui.window.onload = (function () {
      console.log("onload");
      for (let m in msgs) ui.window.CTAT.ToolTutor.sendToInterface(msgs[m]);
    }).bind(this);
    ui.window.onclose = (function () {
      ui = null;
    }).bind(this);
  }


  /*
  ui=window.open("fractionAddition.html?question_file=empty.brd&show_debug_traces=basic", "_blank");
  ui.window.onload = (function() {
      console.log("hi");
      for(let m in msgs) ui.window.CTAT.ToolTutor.sendToInterface(msgs[m]);
  }).bind(this);*/

  //why is it that when I copypaste this into console, it works
  //but when i run it through the button, it doesn't work?
  //oh I changed it from this.msgs to msgs...
  //idk if the bind() is necessary?
}

function displayNMostFrequentPaths() {
  var N = parseInt(document.getElementById("N_form").value);
  var a = parseInt(document.getElementById("a_form").value);
  console.log(N);
  console.log(a);
  a = a - 1;

  //want the ath through (a+N)th most frequent paths
  //a corresponds to a-1 index -- we want to keep it
  //a+N corresponds to a+N-1 index -- we want to keep it

  if (nodesToHide != null)
    nodesToHide.show();
  if (edgesToHide != null)
    edgesToHide.show();
  //disclaimer: these hide() and show() functions aren't documented

  /*pathFreqs = [];//entries are [original index, path freq]
  for (var i = 0; i < allPaths.length; i++) {
      //freq of path i = min freq of its edges
      total = 0;
      allPaths[i].edges().forEach(function(e){total += e.data("freq")});
      //pathFreqs[i] = [i,allPaths[i].edges().min(function(e){return e.data("freq")})];
      //or instead do average freq because that's probably more useful it seems
      pathFreqs[i] = [i,total/allPaths[i].edges().length];
  }

  pathFreqs.sort(function(a,b) {return b[1]-a[1]});*/

  //allPaths is sorted based on pathFreqs already in runTask1GivenJSON()

  //maybe it's easier to hide everything and then only show the N most frequent ones
  nodesToHide = cy.nodes();
  edgesToHide = cy.edges();
  nodesToHide.hide();
  edgesToHide.hide();
  //all nodes that are in a kept path are kept
  //all edges that are in a kept path are kept
  toKeep = allPaths.slice(a, a + N);
  for (var j = 0; j < toKeep.length; j++) {
    //allPaths[toKeep[j][0]].show();
    toKeep[j].show();
  }
  //return allPaths;
}

//not useful anymore
//this one and updateEdgeFreqs only work after having some graph displayed
function displayNMostFrequent() {
  var N = parseInt(document.getElementById("N_form").value);
  var a = parseInt(document.getElementById("a_form").value);

  //want to only display edges [a, a+N] most frequent
  [g, edgeFreqs] = buildGraphForProblem();
  var freqsArray = Object.entries(edgeFreqs);

  freqsArray.sort(function (e1, e2) {
    return -(e1[1] - e2[1]);
  });

  var subArray = freqsArray.slice(a, a + N);
  //
  //convert back to object
  var subObj = subArray.reduce(function (acc, cur, i) {
    acc[cur[0]] = cur[1];
    return acc;
  }, {});

  if (nodesToHide != null)
    nodesToHide.restore();
  if (edgesToHide != null)
    edgesToHide.restore();
  var edgeFreq = parseInt(document.getElementById("edgeFreq").value);
  edgesToHide = cy.filter(function (element, i) {
    if (element.isEdge() && !(element.data("CTATid") in subObj))
      return true;
    return false;
  });
  nodesToHide = cy.filter(function (element, i) {
    if (element.isNode()) {
      var keep = false;
      element.connectedEdges().forEach(function (edge, ind) {
        if (edge.data("CTATid") in subObj)
          keep = true;
      });
      return !keep;
    }
  })
  edgesToHide.remove();
  nodesToHide.remove();
}

function updateEdgeFreqs() {
  if (nodesToHide != null)
    nodesToHide.restore();
  if (edgesToHide != null)
    edgesToHide.restore();
  var edgeFreq = parseInt(document.getElementById("edgeFreq").value);
  edgesToHide = cy.filter(function (element, i) {
    if (element.isEdge() && element.data("freq") < edgeFreq)
      return true;
    return false;
  });
  nodesToHide = cy.filter(function (element, i) {
    if (element.isNode()) {
      var keep = false;
      element.connectedEdges().forEach(function (edge, ind) {
        if (edge.data("freq") >= edgeFreq)
          keep = true;
      });
      return !keep;
    }
  })
  edgesToHide.remove();
  nodesToHide.remove();
}

function runTask1GivenJSON(ggraph) {
  cy = cytoscape({
    container: document.getElementById('cy'),
    hideLabelsOnViewport: true
  });

  if (ggraph) {
    graph = ggraph;
  }
  else {


    buildGraphForProblem();  //sets global graph

  }
  //console.log("button pressed 2");
  cy.json(JSON.parse(buildJSON(graph, edgeFreqs)));
  var layout = cy.layout({
    name: 'grid',
    fit: true,
    padding: 30,
    boundingBox: undefined,
    nodeDimensionsIncludeLabels: false,
    randomize: true,
    componentSpacing: 80,
    nodeRepulsion: function (node) { return 1020480; },
    nodeOverlap: 4,
    idealEdgeLength: function (edge) { return 50; },
    edgeElasticity: function (edge) { return 20; },
    nestingFactor: 1.2,
    gravity: 0.1
  });

  layout.pon('layoutstop').then(function (event) {
    cy.nodes().positions(function (node, i) {
      return CTAT.ToolTutor.tutor.getGraph().getNode(node.data().id).getDimension();
    });
  });

  layout.run();


  allPaths = [];
  cy.nodes().leaves().forEach(function (leaf) {
    var dijkstra = cy.elements().dijkstra('node[id="0"]',
      function () {
        return 1;
      }, false);
    var path = dijkstra.pathTo(leaf);
    allPaths.push(path);
  });

  pathFreqs = [];//entries are [original index, path freq]
  for (var i = 0; i < allPaths.length; i++) {
    //freq of path i = min freq of its edges
    total = 0;
    allPaths[i].edges().forEach(function (e) { total += e.data("freq") });
    //pathFreqs[i] = [i,allPaths[i].edges().min(function(e){return e.data("freq")})];
    //or instead do average freq because that's probably more useful it seems
    pathFreqs[i] = [i, total / allPaths[i].edges().length];
  }
  pathFreqs.sort(function (a, b) { return b[1] - a[1] });
  sortedAllPaths = []
  for (var i = 0; i < allPaths.length; i++) {
    sortedAllPaths.push(allPaths[pathFreqs[i][0]])
  }
  allPaths = sortedAllPaths

  cy.nodes().on('select', function (event) {
    getSelectedPath();
  });

  document.getElementById("N_form").value = allPaths.length
  document.getElementById("N_form").text = allPaths.length

  //populate overall info fields
  document.getElementById("numStudents").value = students.size;
  document.getElementById("numProblems").value = problems.length;

  //populate problem-specific info
  //need to update on switching problem too...
  pathLens = allPaths.map(function (path) {//path length is = to # of edges
    return path.edges().length;
  });
  totalLen = 0;
  for (i = 0; i < pathLens.length; i++) {
    totalLen += pathLens[i];
  }
  document.getElementById("averagePathLength").value = Math.round(totalLen / pathLens.length)
  document.getElementById("longestPath").value = Math.min(...pathLens)
  document.getElementById("shortestPath").value = Math.max(...pathLens)

  var chosenProblem = 0;
  var problemRadios = document.getElementsByName("problem");
  for (var k = 0; k < problems.length; k++) {
    if (problemRadios[k].checked) {
      chosenProblem = k;
      break;
    }
  }

  if (ggraph)
    return;
  document.getElementById("numStudentsProblem").value = Object.entries(problemsAndPaths[problems[chosenProblem]]).length;

  totalSAIs = 0;
  objectified = Object.entries(edgeFreqs)
  objectified.forEach(function (entry) { totalSAIs += entry[1] });
  document.getElementById("numSAIs").value = totalSAIs;

  //totalSAs = 0;
  allSAs = {};
  bigArray = Object.entries(problemsAndPaths)
  for (var problemInd = 0; problemInd < bigArray.length; problemInd++) {
    problemArray = Object.entries(bigArray[problemInd][1]);
    for (var studentInd = 0; studentInd < problemArray.length; studentInd++) {
      saiList = Object.entries(problemArray[studentInd][1])
      for (var SAind = 0; SAind < saiList.length; SAind++) {
        if (!allSAs.hasOwnProperty(saiList[SAind][0])) {
          allSAs[saiList[SAind][0]] = 1;
        }
      }
    }
  }

  //totalSAs = Object.entries(allSAs)
  document.getElementById("numSAs").value = Object.entries(allSAs).length;

  document.getElementById("averageEdgeFrequency").value = Math.round(totalSAIs / objectified.length)

  document.getElementById("currentPathNum").value = 1//reset
}

/** See inputCompare() for values. */
var specialInputCompare = "removeSpaces";

/**
 * @param {string} a left operand
 * @param {string} b right operand
 * @return {number} -1 if a < b, 0 if a == b, 1 if a > b
 */
function inputCompare(a, b) {
  let vt = new CTATVariableTable()
  let lp = new CTATLogicParser(vt)
  if (a == "-1" && b == "-1")
    return 0
  if (a == "hint request" && b == "hint request")
    return 0

  // parse first then compare
  if (lp.logicParse(a) && lp.logicParse(b)) {
    // console.log("locale compare", a.localeCompare(b))
    // console.log("logic identical", lp.logicIdentical(a, b))
    return lp.logicIdentical(a, b) === true ? 0 : 1

  }

  switch (specialInputCompare) {
    case "removeSpaces": {
      let rs = new RegExp("\\s", "g");
      let as = (a || "").replace(rs, ""), bs = (b || "").replace(rs, "");
      return as.localeCompare(bs);
    }
    default:
      return (a || "").localeCompare(b || "");
  }
}



// will be mostly focusing on this function
// or we can make a json file out of this question and put it in d3

function buildGraphForProblem() {
  let sankeyData = {
    "nodes": ["start"],
    "links": [],
    'sinksRight': false
  }
  // logic variable
  let vt = new CTATVariableTable()
  let lp = new CTATLogicParser(vt)
  //get params from the form (it should have defaults too)
  //for problem #:
  var chosenProblem = 0;
  var problemRadios = document.getElementsByName("problem");
  for (var k = 0; k < problems.length; k++) {
    if (problemRadios[k].checked) {
      chosenProblem = k;
      break;
    }
  }//wait this is pointless if it's always 0 whatever keep for now
  console.log("chosen problem: " + problems[chosenProblem]);

  //ordered/unordered
  var ordered = $('input[name=ordered]:checked').val();
  console.log("ordered? " + ordered);
  //edge freq -- default threshold is 0 -- ignore this for now
  //var edgeFreq = document.getElementById("edgeFreq");
  //console.log("edge frequency threshold: " + edgeFreq.value);

  var problem = problemsAndPaths[problems[chosenProblem]];
  //start by sorting paths by length and SAIs
  //ohh so length is overall, and within a path, you want the SAIs to be sorted in some canonical ordering
  var entries = Object.entries(problem);
  for (i = 0; i < entries.length; i++) {
    entries[i][1] = Object.entries(entries[i][1])
  }

  //sort by path length -- unchanged and working...
  entries.sort(function (a, b) {
    //each entry of problem is [studentId, object that contains sais -- the path]
    return -(a[1].length - b[1].length);//want descending order
  });

  //unordered case:
  //we now want to get the average position of edges within all paths
  //like say you have edge E and it appears in some subset of the paths
  //go through each path where it appears and record its position
  //so then E is associated with an average position?

  //but we don't have edges until we start building the graph
  //we only have SAIs in some order within each path
  //so yeah we're actually sorting based on SAI position
  if (ordered === "unordered") {
    console.log("doing unordered");
    var SAIpositions = {};
    for (i = 0; i < entries.length; i++) {
      var sais = entries[i][1];
      for (j = 0; j < sais.length; j++) {
        var saiKey = sais[j][0]; //selection-action
        if (!SAIpositions.hasOwnProperty(saiKey)) {
          SAIpositions[saiKey] = [];
        }
        SAIpositions[saiKey].push(j);
      }
    }
    //so now SAIpositions is populated; compute averages
    var averageSAIpositions = {};
    var keys = Object.keys(SAIpositions);
    keys.forEach(function (SAkey, index) {
      averageSAIpositions[SAkey] = 0;
      SAIpositions[SAkey].forEach(function (saiPos, ind) {
        averageSAIpositions[SAkey] += saiPos;
      });
      averageSAIpositions[SAkey] /= SAIpositions[SAkey].length;
    });

    //now go through each path and sort it
    //now sort by average position
    for (i = 0; i < entries.length; i++) {
      var sais = entries[i][1];
      sais.sort(function (a, b) {
        //a is [selection-action as key, [selection,action,input] as value]
        //sort by selection-action key
        //return (a[0].toString()).localeCompare(b[0].toString());
        return averageSAIpositions[a[0]] - averageSAIpositions[b[0]];
      });
    }
  }
  else {
    console.log("doing ordered");
  }

  //now need to do path branching outward (no inward yet)
  //also need to keep track of edge frequency
  //this means that I do an intermediate step before actually building the json?
  edgeFreqs = {};
  graph = new CTATExampleTracerGraph(false, true, null);//isOrdered, youStartYouFinish, givenVT... idk what all the settings do
  var nodeCounter = 0;
  var startNode = new CTATExampleTracerNode(nodeCounter);
  nodeCounter++;
  var edgeCounter = 0;
  graph.addNode(startNode);
  console.log("startNode", startNode.getClassName())
  console.log("startNode", startNode)

  let nodesArray = []
  let linksArray = []
  let edgesArray = []


  // for (i = 0; i < entries.length; i++) {
    // testing for 2 students
    for (i = 0; i < numberOfStudentInGraph; i++) {
    var currentNode = startNode;
    var studentId = entries[i][0];
    var sais = entries[i][1];
    for (var ind = 0; ind < sais.length; ind++) {
      var selection = sais[ind][1][0];
      var action = sais[ind][1][1];
      var input = sais[ind][1][2];
      var evaluation = sais[ind][1][3];
      console.log("sais[" + ind + "][1]: " + selection + " " + action + " " + input + " " + evaluation);

      var matched = false
      // for (var j = 0; j < linksArray.length && !matched; j++) {

      // traversing all nodes
      for (var j = 0; j < nodesArray.length && !matched; j++) {
        // var defSAI = linksArray[j].getDefaultSAI();
        var defSAI = nodesArray[j].link.getDefaultSAI();
        console.log(defSAI.getInput())
        // console.log("logic stringify", lp.logicStringify(input))
        if (defSAI.getSelection().localeCompare(selection) == 0 &&
          defSAI.getAction().localeCompare(action) == 0 &&
          inputCompare(defSAI.getInput(), input) == 0) {

          // increment the freq for edge with the same source and target
          // ignoring this part for now
          // edgeFreqs[linksArray[j].getUniqueID()] += 1;


          for (var k = 0; k < edgesArray.length; k++) {
            if (edgesArray[k].getPrevNode() === currentNode.getNodeID() && edgesArray[k].getNextNode() === nodesArray[j].getNodeID()) {
              edgeFreqs[edgesArray[k].getUniqueID()] += 1
              console.log("freq:", edgeFreqs[edgesArray[k].getUniqueID()])
            }
          }

          //console.log(edgeFreqs[linksArray[j].getUniqueID()]);
          matched = true
          currentNode = graph.getNode(nodesArray[j].getNodeID())
        }
      }
      if (matched) {
        var newLink = new CTATExampleTracerLink(edgeCounter, currentNode.getNodeID(), newNode.getNodeID());

        newLink.setActionType(/^CORRECT/i.test(evaluation) ? CTATExampleTracerLink.CORRECT_ACTION : CTATExampleTracerLink.FIREABLE_BUGGY_ACTION);
        var SelectionMatchers = new CTATMatcher();
        var ActionMatchers = new CTATMatcher();
        var InputMatchers = new CTATMatcher();
        var actor = null;

        var vectorMatcher = new CTATVectorMatcher(SelectionMatchers, ActionMatchers, InputMatchers, actor);
        vectorMatcher.setDefaultSAI(new CTATSAI(selection, action, input, null));
        //vectorMatcher.setCaseInsensitive(caseInsensitive);
        //vectorMatcher.setLinkTriggered(linkTriggered);
        newLink.setMatcher(vectorMatcher)
        // OK so I need to make a new matcher and give it the selection, action, and input
        graph.addLink(newLink, null);//don't worry about groups for now
        edgesArray.push(newLink)


        continue;
      }
      //new edge otherwise
      var newNode = new CTATExampleTracerNode(nodeCounter);
      newNode.setNodeName(newNode.getNodeID)
      graph.addNode(newNode)
      console.log("newNode.name", newNode.getName())
      edgeFreqs[edgeCounter] = 1;

      var newLink = new CTATExampleTracerLink(edgeCounter, currentNode.getNodeID(), newNode.getNodeID());

      newLink.setActionType(/^CORRECT/i.test(evaluation) ? CTATExampleTracerLink.CORRECT_ACTION : CTATExampleTracerLink.FIREABLE_BUGGY_ACTION);
      var SelectionMatchers = new CTATMatcher();
      var ActionMatchers = new CTATMatcher();
      var InputMatchers = new CTATMatcher();
      var actor = null;

      var vectorMatcher = new CTATVectorMatcher(SelectionMatchers, ActionMatchers, InputMatchers, actor);
      vectorMatcher.setDefaultSAI(new CTATSAI(selection, action, input, null));
      //vectorMatcher.setCaseInsensitive(caseInsensitive);
      //vectorMatcher.setLinkTriggered(linkTriggered);
      newLink.setMatcher(vectorMatcher)
      // OK so I need to make a new matcher and give it the selection, action, and input
      graph.addLink(newLink, null);//don't worry about groups for now
      edgesArray.push(newLink)
      console.log("newLink:", newLink)
      currentNode.addOutLink(newLink);
      newNode.addInLink(newLink);

      nodeCounter++;
      edgeCounter++;
      newNode.link = newLink
      nodesArray.push(newNode)
      currentNode = newNode;
    }
  }

  //populate allPaths
  //need to enumerate all paths in the graph from root to leaves
  //for all leaves, do dijkstra's to get path to root


  // used to find all distinct input for the first step
  let nodes = [];
  // for (let i = 0; i < entries.length; i++) {

  //   var previousNode = startNode;
  //   var studentId = entries[i][0];
  //   //console.log(studentId);
  //   var sais = entries[i][1];

  //   for (let ind = 0; ind < sais.length; ind++) {
  //     let selection = sais[ind][1][0]
  //     let action = sais[ind][1][1]
  //     let input = sais[ind][1][2]
  //     let evaluation = sais[ind][1][3]

  //     // if (ind === 0 && nodes.indexOf(input) == -1){
  //     //   nodes.push(input)
  //     // }

  //     let inArray = false;

  //     if (ind === 0) {
  //       for (let index = 0; index < nodes.length; index++) {
  //         if (inputCompare(nodes[index], input) == 0) {
  //           inArray = true;
  //         }
  //       }

  //       if (!inArray) {
  //         nodes.push(input)
  //       }
  //     }


  //     let prevOutLinks = previousNode.getOutLinks()
  //     linksArray = Array.from(prevOutLinks)
  //     let matched = false
  //     for (let j = 0; j < linksArray.length; j++) {
  //       let defSAI = linksArray[j].getDefaultSAI()

  //       if (defSAI.getSelection().localeCompare(selection) == 0 &&
  //         defSAI.getAction().localeCompare(action) == 0 &&
  //         inputCompare(defSAI.getInput(), input) == 0) {
  //         // update existing json
  //         matched = true
  //       }
  //     }


  //     if (matched) {
  //       continue
  //     }

  //   }
  // }
  // console.log("sankey data", nodes)
  return [graph, edgeFreqs];
}

//
//*assume transactions are grouped by student*
//


//user-determined parameters
var detector_list = ["Detectors/system_misuse.js", "Detectors/critical_struggle.js", "Detectors/struggle__moving_average.js", "Detectors/student_doing_well__moving_average.js", "Detectors/idle.js"];
var KC_model = "KC (Default)";


//declare global variables
//

var currSkills_indices;
var studentId_index; var sessionId_index; var transactionId_index; var toolTime_index; var tutorTime_index; var problemName_index; var stepName_index; var stepId; var stepId_index; var selection_index; var action_index; var input_index; var outcome_index; var helpLevel_index; var totalNumHints_index; var dateTime_index;
var studentId; var sessionId; var dateTime; var transactionId; var actor; var toolTime; var tutorTime; var problemName; var stepName; var selection; var action; var input; var outcome; var tutorSelection; var tutorAction; var helpLevel; var totalNumHints;
var currSkills;
var BKTparams = {
  p_transit: 0.2,
  p_slip: 0.1,
  p_guess: 0.2,
  p_know: 0.25
};
var BKThistory = {};
var pastSteps = {}; var pastStudentProblems = new Set(); var pastStudents = new Set();
var i = 0;
currDetectorValues = {};
outputStr = "";
var problemScripts = [];



function clone(obj) {
  var copy;

  // Handle the 3 simple types, and null or undefined
  if (null == obj || "object" != typeof obj) return obj;

  // Handle Date
  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  // Handle Array
  if (obj instanceof Array) {
    copy = [];
    for (var i = 0, len = obj.length; i < len; i++) {
      copy[i] = clone(obj[i]);
    }
    return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
    copy = {};
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
    }
    return copy;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
}



// function simulateNewProblem(studentId, problemName) {
//   console.log("simulateNewProblem(", studentId, problemName, ")");
//   problemScripts.push({ user_guid: studentId, studentInterface: "", problemFile: problemName, script: [] });
//   //also clear BKT pastSteps
//   pastSteps = {};
// }

// function simulateNewStudent(studentId, problemName) {
//   simulateNewProblem(studentId, problemName);
//   //also clear BKT pastSteps
//   BKThistory = {};
// }

//convert transaction to JSON format in which detectors
//  would typically receive transactions

function constructTransaction(e) {
  //construct JSON message and return JSON

  var template = {
    actor: actor,
    transaction_id: transactionId,
    context: {
      class_description: "",
      class_instructor_name: "",
      class_name: "",
      class_period_name: "",
      class_school: "",
      context_message_id: "",
      dataset_level_name1: "",
      dataset_level_name2: "",
      dataset_level_type1: "",
      dataset_level_type2: "",
      dataset_name: "",
      problem_context: problemName,
      problem_name: problemName,
      problem_tutorFlag: "",
      study_condition_name1: "",
      study_condition_type1: ""
    },
    meta: {
      date_time: dateTime,
      session_id: sessionId,
      user_guid: studentId
    },
    semantic_event: "",
    tool_data: {
      selection: selection,
      action: action,
      input: input,
      tool_event_time: toolTime
    },
    tutor_data: {
      selection: tutorSelection,
      action: tutorAction,
      input: input,
      action_evaluation: outcome,
      skills: [],
      step_id: stepId,
      tutor_advice: "",
      tutor_event_time: tutorTime
    }
  }

  return template
}

function getRowVariables(thisrow) {
  if (!thisrow || !thisrow.length || !thisrow[0]) return false;
  //initialize all relevant indices
  if (i == 0) {
    currSkills_indices = getAllIndices(thisrow, KC_model);
    studentId_index = thisrow.indexOf("Anon Student Id");
    sessionId_index = thisrow.indexOf("Session Id");
    transactionId_index = thisrow.indexOf("Transaction Id");
    toolTime_index = thisrow.indexOf("CF (tool_event_time)");
    tutorTime_index = thisrow.indexOf("CF (tutor_event_time)");
    problemName_index = thisrow.indexOf("Problem Name");
    stepName_index = thisrow.indexOf("Step Name");
    stepId_index = thisrow.indexOf("CF (step_id)");
    selection_index = thisrow.indexOf("Selection");
    action_index = thisrow.indexOf("Action");
    input_index = thisrow.indexOf("Input");
    outcome_index = thisrow.indexOf("Outcome");
    helpLevel_index = thisrow.indexOf("Help Level");
    totalNumHints_index = thisrow.indexOf("Total Num Hints");
    actor_index = thisrow.indexOf("Student Response Subtype");
    dateTime_index = thisrow.indexOf("Time");
  }
  else {
    sessionId = thisrow[sessionId_index];
    studentId = thisrow[studentId_index] + "_" + sessionId;
    transactionId = thisrow[transactionId_index];
    toolTime = thisrow[toolTime_index];
    tutorTime = thisrow[tutorTime_index];
    problemName = thisrow[problemName_index];
    stepName = thisrow[stepName_index];
    stepId = thisrow[stepId_index];
    tutorSelection = stepName.split(" ")[0];
    tutorAction = stepName.split(" ")[1];
    selection = thisrow[selection_index];
    action = thisrow[action_index];
    input = thisrow[input_index];
    outcome = thisrow[outcome_index];
    helpLevel = thisrow[helpLevel_index];
    totalNumHints = thisrow[totalNumHints_index];
    actor = (thisrow[actor_index] != "tutor-performed") ? "student" : "tutor";
    dateTime = thisrow[dateTime_index];

    currSkills = [];
    //populate skill names
    for (j in currSkills_indices) {
      var thisSkill = thisrow[currSkills_indices[j]];
      if (thisSkill != "") {
        currSkills.push(thisSkill);
      }
    }

  }
  return true;
}

// function update_BKT(t) {

//   var currStep = t.tool_data.selection;
//   for (var i in currSkills) {
//     var skill = currSkills[i];

//     if (!(currStep in pastSteps)) {
//       if (!(skill in BKThistory)) {    //if this skill has not been encountered before
//         BKThistory[skill] = clone(BKTparams);
//       }

//       var p_know_tminus1 = BKThistory[skill]["p_know"];
//       var p_slip = BKThistory[skill]["p_slip"];
//       var p_guess = BKThistory[skill]["p_guess"];
//       var p_transit = BKThistory[skill]["p_transit"];


//       if (t.tutor_data.action_evaluation.toLowerCase() == "correct") {
//         var p_know_given_obs = (p_know_tminus1 * (1 - p_slip)) / ((p_know_tminus1 * (1 - p_slip)) + ((1 - p_know_tminus1) * p_guess));
//       }
//       else {
//         var p_know_given_obs = (p_know_tminus1 * p_slip) / ((p_know_tminus1 * p_slip) + ((1 - p_know_tminus1) * (1 - p_guess)));
//       }

//       BKThistory[skill]["p_know"] = p_know_given_obs + (1 - p_know_given_obs) * p_transit;

//       //following TutorShop, round down to two decimal places
//       BKThistory[skill]["p_know"] = Math.floor(BKThistory[skill]["p_know"] * 100) / 100;

//     }

//   }

//   //update isNotFirstAttempt
//   if (!(currStep in pastSteps)) {
//     pastSteps[currStep] = true;
//   }

// }

function getAllIndices(arr, val) {
  var indices = [], i;
  for (i = 0; i < arr.length; i++)
    if (arr[i] === val)
      indices.push(i);
  return indices;
}

// construct an InterfaceAction or UntutoredAction message from a transaction t
function txToStudentAction(t) {
  if (!(/^student/.test(actor)))
    return null;
  if (/^hint/i.test(outcome))    // need multiple selections, actions to handle hint requests
    return null;
  if (/^hint/i.test(selection))  // need multiple selections, actions to handle hint requests
    return null;

  var saiMsg = "<message><verb>NotePropertySet</verb><properties><MessageType>";
  saiMsg += (outcome || /^done/i.test(selection) ? "InterfaceAction" : "UntutoredAction") + "</MessageType>";
  saiMsg += "<transaction_id>" + transactionId + "</transaction_id>";
  saiMsg += "<Selection><value>" + selection + "</value></Selection>";
  saiMsg += "<Action><value>" + action + "</value></Action>";
  saiMsg += "<Input><value><![CDATA[" + input + "]]></value></Input>";
  saiMsg += "</properties></message>";
  return saiMsg;
}


//test detectors on historical data (this function acts on one row)
function simulateDataStream(e, parser) {
  var thisrow = e.data[0];
  //console.log("simulateDataStream(i=="+i+")", e, thisrow);
  if (!getRowVariables(thisrow)) return;

  if (i != 0) {
    //task 2 stuff
    if (!(problemsAndPaths.hasOwnProperty(problemName))) { //need to add the problem
      problemsAndPaths[problemName] = {};
      problems.push(problemName);
    }
    if (!(problemsAndPaths[problemName].hasOwnProperty(studentId))) { //this student needs to be added to the problem
      problemsAndPaths[problemName][studentId] = {};
    }
    //need to ignore hints for now
    //need to ignore tutor-performed actions
    //NtpDate is because it causes issues with the Large Dog Kennel; you get better results this way...
    if (input.indexOf("hint") == -1 && (actor === "student") && (selection != "NtpDate")) {
      console.log("Adding to problemsAndPaths[" + problemName + "][" + studentId + "][s-a]:", [selection, action, input, outcome]);
      //problemsAndPaths[problemName][studentId][selection] = [action,input];//add this row's SAI to the student's data
      delete problemsAndPaths[problemName][studentId][selection + "-" + action];
      problemsAndPaths[problemName][studentId][selection + "-" + action] = [selection, action, input, outcome];//I guess we want to do it this way now?   
    }

    if (!(students.has(studentId))) {
      students.add(studentId);
    }
  }
  i++;
}

//called when papa finishes parsing
function buildOptions() {
  //select which problem
  var problemChoices = document.getElementById("problemChoicesForm");
  for (var k = 0; k < problems.length; k++) {
    var radio = document.createElement("input");
    var label = document.createElement("label");
    radio.type = "radio";
    radio.name = "problem";
    radio.value = problems[k];
    if (k == 0)
      radio.checked = "checked";
    problemChoices.appendChild(radio);
    problemChoices.appendChild(label);
    label.appendChild(document.createTextNode(problems[k]));
  }

  runTask1GivenJSON();
}


//open all detectors in detector_list as WebWorkers
//
//   set up event listeners
//
//var path = window.location.pathname;
//path = path.split("/").slice(0,-1).join("/");


// function downloadCSV(args) {
//   // var data, filename, link;
//   // var csv = outputStr;
//   // if (csv == null) return;

//   // filename = args.filename || 'export.csv';

//   // if (!csv.match(/^data:text\/csv/i)) {
//   //     csv = 'data:text/csv;charset=utf-8,' + csv;
//   // }
//   // data = encodeURI(csv);

//   // link = document.createElement('a');
//   // link.setAttribute('href', data);
//   // link.setAttribute('download', filename);
//   // link.click();

//   var csvData = new Blob([outputStr], { type: 'text/csv;charset=utf-8;' });

//   exportFilename = args.filename || 'export.csv';

//   //IE11 & Edge
//   if (navigator.msSaveBlob) {
//     navigator.msSaveBlob(csvData, exportFilename);
//   } else {
//     //In FF link must be added to DOM to be clicked
//     var link = document.createElement('a');
//     link.href = window.URL.createObjectURL(csvData);
//     link.setAttribute('download', exportFilename);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   }
// }
