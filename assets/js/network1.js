    var nodes = new vis.DataSet([
        {id: 1, label: 'function1'},
        {id: 2, label: 'function2'},
        {id: 3, label: 'expr1'},
        {id: 4, label: 'expr2'}
    ]);

    var edges = new vis.DataSet([
        {from: 1, to: 2},
        {from: 2, to: 4},
        {from: 1, to: 3}
    ]);

    var container = document.getElementById('mynetwork');

    var data = {
        nodes: nodes,
        edges: edges
    };
    var options = {
        layout:  {
                 hierarchical: {
                 levelSeparation: 100,
                 enabled:true }
        }
    };

    // initialize your network!
    var network = new vis.Network(container, data, options);
