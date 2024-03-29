function runTask1() {
    //console.log("button pressed");
    var cy = cytoscape({
        container: document.getElementById('cy')
    });
    var g = CTAT.ToolTutor.tutor.getGraph();
    cy.json(JSON.parse(buildJSON(g)));
    var layout = cy.layout({ name: 'grid' });

    console.log("building graph")
    layout.run();
}

function buildJSON(graph, edgeFreqs) {
    var maxFreq = Math.max.apply(null, Object.values(edgeFreqs));
    var jsonGraph = {
        elements: [],

        style: [
            {
                selector: 'node',
                style: {
                    //'background-color': 'green',
                    'label': 'data(info)', // was 'data(id)',
                    "text-valign": "center",
                    "text-halign": "center"
                }
            },

            {
                selector: 'node[id="0"]',
                style: {
                    'background-color': 'purple',
                    'label': 'data(info)',
                    "text-valign": "center",
                    "text-halign": "center"
                }
            },

            {
                selector: 'node[outLinks=0]',
                style:{
                    'background-color': 'blue',
                    'label': 'data(info)',
                    "text-valign": "center",
                    "text-halign": "center"
                }
            },

            {
                selector: 'edge',
                style: {
                    // 'line-color': 'green',
                    'label': 'data(freq)',
                    'width': 'mapData(freq, 0, 1, 1, 20)',
                    'target-arrow-shape': 'triangle',
                    'curve-style': 'bezier',
                    'min-zoomed-font-size': '10'
                }
            },

            {
                selector: 'edge[correct=1]',
                style: {
                    'line-color': 'green',
                    'target-arrow-color': 'green',
                    'label': 'data(freq)',
                    'width': 'mapData(freq, 0, ' + maxFreq + ', 1, 20)',
                    'target-arrow-shape': 'triangle',
                    'curve-style': 'bezier',
                    'min-zoomed-font-size': '10'
                }
            },

            {
                selector: 'edge[correct=-1]',
                style: {
                    'line-color': 'gray',
                    'target-arrow-color': 'gray',
                    'label': 'data(freq)+data(info)',
                    'width': 'mapData(freq, 0, ' + maxFreq + ', 1, 20)',
                    'target-arrow-shape': 'triangle',
                    'curve-style': 'bezier',
                    'min-zoomed-font-size': '10'
                }
            },

            {
                selector: 'edge[correct=0]',
                style: {
                    'line-color': 'red',
                    'target-arrow-color': 'red',
                    'label': 'data(info)',
                    'width': 'mapData(freq, 0, ' + maxFreq + ', 1, 20)',
                    'target-arrow-shape': 'triangle',
                    'curve-style': 'bezier',
                    'min-zoomed-font-size': '10'
                }
            },

            {
                selector: 'edge[selection="hint"]',
                style: {
                    'line-color': 'yellow',
                    'target-arrow-color': 'yellow',
                    'label': 'data(info)',
                    'width': 'mapData(freq, 0, ' + maxFreq + ', 1, 20)',
                    'target-arrow-shape': 'triangle',
                    'curve-style': 'bezier',
                    'min-zoomed-font-size': '10'
                }
            }
        ]
    };

    var addedNodes = [];

    //so graph has no way of getting the # of nodes... guess i have to start with edges
    // Hao: what...
    // I need to start with nodes!

    var links = graph.getLinks();//edges
    let nodes = graph.getAllNodes();
    console.log("nodes: ", nodes)
    console.log("links: ", links)
    console.log("graph: ", graph)
    for (i = 0; i < links.length; i++) {
    
        var prevId = links[i].getPrevNode();
        var nextId = links[i].getNextNode();
        var matcher = links[i].getMatcher();

        //add nodes if necessary
        if (!addedNodes.includes(prevId)) {
            var prevNode = graph.getNode(prevId);
            var pos = prevNode.getVisualData();
            var outLinks = prevNode.getOutLinks();
            console.log("outlink prev:", outLinks.size)
            addNode(jsonGraph, prevId, pos ? parseInt(pos.x) : null,
                pos ? parseInt(pos.y) : null, matcher.getSelection(),
                matcher.getAction(), matcher.getInput(),
                freq, maxFreq, links[i].getActionType(), outLinks.size);

            addedNodes.push(prevId);
        }
        if (!addedNodes.includes(nextId)) {
            var nextNode = graph.getNode(nextId);
            var pos = nextNode.getVisualData();
            var outLinks = nextNode.getOutLinks()
            console.log("outlink next:", outLinks.size)
            addNode(jsonGraph, nextId, pos ? parseInt(pos.x) : null,
                pos ? parseInt(pos.y) : null, matcher.getSelection(),
                matcher.getAction(), matcher.getInput(),
                freq, maxFreq, links[i].getActionType(), outLinks.size);
            addedNodes.push(nextId);
        }

        //add edge
        //console.log(matcher.getAction());
        var freq = edgeFreqs[links[i].getUniqueID()];
        //if (freq < edgeFreq)
        //freq = 0;
        addEdge(jsonGraph, links[i].getUniqueID(), prevId, nextId,
            matcher.getSelection(), matcher.getAction(), matcher.getInput(), freq, maxFreq, links[i].getActionType());
    }
    BRDjson = jsonGraph;

    return JSON.stringify(jsonGraph);
}
var BRDjson = null;

function addNode(jsonGraph, id, x, y, selection, action, input, freq, maxFreq, actionType, outLinks) {
    if (x == null) {
        var node = {
            group: 'nodes',
            data: {
                id: id,
                CTATid: id,
                selection: selection,
                action: action,
                input: input,
                info: makeNodeLabel(freq, selection, action, input),  // was selection+"-"+action+"-"+input
                freq: freq,
                maxFreq: maxFreq,
                outLinks: outLinks
            },

            scratch: {

            },

            /*position: {
                x: 1,
                y: 1
            },*/

            selected: false,

            selectable: true,

            locked: false,

            grabbable: true
        };
        jsonGraph.elements.push(node);
    }
    else {
        var node = {
            group: 'nodes',

            data: {
                id: id,
                CTATid: id,
                source: source,
                target: target,
                selection: selection,
                action: action,
                input: input,
                info: makeEdgeLabel(freq, source, target, selection, action, input),  // was selection+"-"+action+"-"+input
                freq: freq,
                maxFreq: maxFreq,
                outLinks: outLinks
            },

            scratch: {

            },

            position: {
                x: x,
                y: y
            },

            selected: false,

            selectable: true,

            locked: false,

            grabbable: true
        };
        jsonGraph.elements.push(node);
    }
}

function makeEdgeLabel(freq, source, target, selection, action, input) {
    let result = "";
    // if (freq && freq > 1) result += (freq + ": ");
    if (/^done$/i.test(selection)) result += "Done";
    else if (/^[a-z]*_table_c[0-9]+/i.test(selection)) result += input;
    else result += (selection + "-" + input);
    return result;
}

function makeNodeLabel(freq, selection, action, input) {
    let result = "";
    if (freq && freq > 1) result += (freq + ": ");
    if (/^done$/i.test(selection)) result += "Done";
    else if (/^[a-z]*_table_c[0-9]+/i.test(selection)) result += input;
    // else result += (selection + "-" + input);
    else result += (selection);
    return result;
}

function addEdge(jsonGraph, id, source, target, selection, action, input, freq, maxFreq, actionType) {
    var edge = {
        group: 'edges',

        data: {
            id: source + "-" + id + "-" + target,
            CTATid: id,
            source: source,
            target: target,
            selection: selection,
            action: action,
            input: input,
            info: makeEdgeLabel(freq, source, target, selection, action, input),  // was selection+"-"+action+"-"+input
            freq: freq,
            maxFreq: maxFreq,
            correct: (/^CORRECT/i.test(actionType) ? 1 : 0)
        }
    };
    jsonGraph.elements.push(edge);
}
