    var nodes = new vis.DataSet([
        {id: 1, label: 'map'},
        {id: 2, label: '# (fn of %)'},
        {id: 3, label: 'range'},
        {id: 12, label: '10'},
        {id: 4, label: '+'},
        {id: 5, label: '+'},
        {id: 6, label: '2'},
        {id: 7, label: '%'},
        {id: 8, label: '1'},
        {id: 9, label: '*'},
        {id: 10, label: '3'},
        {id: 11, label: '%'}
    ]);

    var edges = new vis.DataSet([
        {from: 1, to: 2},
        {from: 1, to: 3},
        {from: 3, to: 12},
        {from: 2, to: 4, label: '% even?'},
        {from: 2, to: 5, label: '% odd?'},
        {from: 4, to: 6},
        {from: 4, to: 7},
        {from: 5, to: 8},
        {from: 5, to: 9},
        {from: 9, to: 10},
        {from: 9, to: 11}
    ]);

    var container = document.getElementById('mynetwork2');

    var data = {
        nodes: nodes,
        edges: edges
    };
    var options = {
        layout:  {
                 hierarchical: {
                 enabled:true,
                 sortMethod: 'directed',
                 levelSeparation: 100}
        }
    };

    // initialize your network!
    var network = new vis.Network(container, data, options);
