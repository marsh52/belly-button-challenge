// Build the metadata panel
function buildMetadata(selectedSample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // get the metadata field
    let metadata = data.metadata;
    console.log(metadata);
    // Filter the metadata for the object with the desired sample number
    let result = metadata.filter((item) => item.id === Number(selectedSample))[0];
    console.log(result);
    // Use d3 to select the panel with id of `#sample-metadata`
    let metaHtml = d3.select('#sample-metadata');

    // Use `.html("") to clear any existing metadata
    metaHtml.html("");
    
    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(result).forEach(([key, value]) => {
      metaHtml.append('p').text(`${key.toUpperCase()}: ${value}`); 
    });
  }); 
}

// function to build both charts
function buildCharts(selectedSample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;
    console.log(selectedSample);
    // Filter the samples for the object with the desired sample number
    let result = samples.filter((sample) => sample.id === selectedSample.toString())[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otuIds = result.otu_ids;
    let otuLabels = result.otu_labels;
    let sampleValues = result.sample_values;

    // Build a Bubble Chart
    var bubbleTrace = {
      x: otuIds,
      y: sampleValues,
      mode: 'markers',
      marker: {
        color: otuIds,
        size: sampleValues,
        colorscale: 'Viridis',
        showscale: false
      },
      text: otuLabels,
      hoverinfo: 'text'
    };
    
    var data = [bubbleTrace];
    
    var layout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: {title: 'OTU ID'},
      yaxis: {title: 'Number of Bacteria'},
      showlegend: false,
      height: 600,
      width: 1200
    };
    
    // Render the Bubble Chart
    Plotly.newPlot('bubble', data, layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let prefix = 'OTU '
    let otuStrings = otuIds.map(item => prefix + item.toString());
    
    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let sampleSlice = sampleValues.slice(0, 10).reverse();
    let otuSlice = otuStrings.slice(0, 10).reverse();
    let top10OtuIds = otuIds.slice(0, 10).reverse();

    let barTrace = {
      x: sampleSlice,
      y: otuSlice,
      type: 'bar',
      orientation: 'h'
    };

    let barLayout = {
      title: 'Top 10 OTUs',
      xaxis: { title: 'Sample Values' },
      yaxis: { title: 'OTU IDs' }
    };

    // Render the Bar Chartß
    let barData = [barTrace];
    Plotly.newPlot('bar', barData, barLayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    const names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    const dropdown = d3.select('#selDataset');

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach(name => {
      dropdown.append('option').text(name).property('value', name);  
    });

    // Get the first sample from the list
    const first = names[0];
    
    // Build charts and metadata panel with the first sample
    buildCharts(first);
    buildMetadata(first);

    d3.selectAll("#selDataset").on("change", function() {
      const newSample = d3.select(this).property("value");
      optionChanged(newSample);
    });
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
