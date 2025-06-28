document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Drawflow...');
    // Initialize Drawflow
    const drawflowElem = document.getElementById('drawflow');
    if (!drawflowElem) {
        console.error('Drawflow container element not found.');
        return;
    }
    const editor = new Drawflow(drawflowElem);
    editor.start();
    console.log('Drawflow started successfully');
    
    // Editor settings
    editor.editor_mode = 'fixed';
    editor.zoom = 0.8;
    editor.zoom_max = 1.5;
    editor.zoom_min = 0.5;
    
    // Create stage nodes
    function addStageNode(stageNum, stageData) {
        console.log(`Adding stage node ${stageNum}:`, stageData);
        
        // Check if node already exists and remove it
        const nodes = editor.drawflow.drawflow.Home.data;
        for (const id in nodes) {
            const node = nodes[id];
            if (node.data.stageNum === stageNum && node.data.type === 'stage') {
                console.log(`Removing existing node for stage ${stageNum}`);
                editor.removeNodeId(id);
                break;
            }
        }
        
        const nodeId = editor.addNode(
            `Stage ${stageNum}`,
            1, 1,
            100,  // X position
            100 + (stageNum - 1) * 300,  // Increased spacing from 200 to 300
            'stage-node',
            { stageNum: stageNum, type: 'stage' },
            `<div class="stage-node-content">
                <div class="node-header">
                    <h3 id="stage${stageNum}-node-title">Stage ${stageNum}: ${stageData.title || ''}</h3>
                    <button class="toggle-details" id="toggle-stage${stageNum}" onclick="toggleNodeDetails(${stageNum})">▼</button>
                </div>
                <div class="node-summary">
                    <p id="stage${stageNum}-node-condition" class="node-detail"><strong>Condition:</strong> ${stageData.condition || 'Not specified'}</p>
                    <p id="stage${stageNum}-node-concern" class="node-detail"><strong>Concern:</strong> ${stageData.concern || 'Not specified'}</p>
                </div>
                <div class="node-details-expanded" id="stage${stageNum}-details" style="display: none;">
                    <div class="detail-section">
                        <h4>Patient Profile</h4>
                        <p id="stage${stageNum}-node-history" class="node-detail"><strong>History:</strong> ${stageData.history || 'Not specified'}</p>
                        <p id="stage${stageNum}-node-symptoms" class="node-detail"><strong>Symptoms:</strong> ${stageData.symptoms || 'Not specified'}</p>
                    </div>
                    <div class="detail-section">
                        <h4>Behavior</h4>
                        <p id="stage${stageNum}-node-emotional" class="node-detail"><strong>Emotional:</strong> ${stageData.emotional || 'Not specified'}</p>
                        <p id="stage${stageNum}-node-cues" class="node-detail"><strong>Cues:</strong> ${stageData.cues || 'Not specified'}</p>
                    </div>
                    <div class="detail-section">
                        <h4>Speech</h4>
                        <p id="stage${stageNum}-node-speech" class="node-detail"><strong>Pattern:</strong> ${stageData.speech || 'Not specified'}</p>
                    </div>
                </div>
            </div>`
        );
        console.log(`Stage node ${stageNum} added with ID:`, nodeId);
        
        // Create trigger node for ALL stages (not just stage 1)
        createTriggerNode(nodeId, stageNum);
        
        // If this is a higher stage, connect previous trigger to this stage
        if (stageNum > 1) {
            const nodes = editor.drawflow.drawflow.Home.data;
            for (const id in nodes) {
                const node = nodes[id];
                if (node.data.type === 'trigger' && node.data.fromStage === stageNum - 1) {
                    try {
                        editor.addConnection(id, 'output_1', nodeId, 'input_1');
                        console.log(`Connected trigger from stage ${stageNum-1} to stage ${stageNum}`);
                    } catch (e) {
                        console.error('Connection error:', e);
                    }
                    break;
                }
            }
        }
        
        return nodeId;
    }
    
    // Create trigger nodes
    function createTriggerNode(sourceNodeId, fromStageNum) {
        console.log(`Creating trigger node for stage ${fromStageNum}`);
        
        // Check if trigger already exists and remove it
        const nodes = editor.drawflow.drawflow.Home.data;
        for (const id in nodes) {
            const node = nodes[id];
            if (node.data.type === 'trigger' && node.data.fromStage === fromStageNum) {
                console.log(`Removing existing trigger for stage ${fromStageNum}`);
                editor.removeNodeId(id);
                break;
            }
        }
        
        // Set Y position for trigger node to be well below the stage node
        const stageY = 100 + (fromStageNum - 1) * 300;
        const triggerY = stageY + 220; // Try 220 or higher for a large gap

        const triggerNodeId = editor.addNode(
            'Trigger',
            1, 1,
            250,  // X position
            triggerY, // Y position
            'trigger-node',
            { type: 'trigger', fromStage: fromStageNum },
            `<div class="trigger-node-content">
                <h3>Trigger</h3>
                <p id="trigger${fromStageNum}-text">Define stage transition</p>
            </div>`
        );
        
        // Connect stage to its trigger
        try {
            editor.addConnection(sourceNodeId, 'output_1', triggerNodeId, 'input_1');
            console.log(`Connected stage ${fromStageNum} to its trigger`);
        } catch (e) {
            console.error('Connection error:', e);
        }
        
        return triggerNodeId;
    }
    
    // Function to update trigger text
    function updateTriggerText(stageNum, triggerText) {
        const triggerElem = document.getElementById(`trigger${stageNum}-text`);
        if (triggerElem) {
            triggerElem.textContent = triggerText || 'Define stage transition';
        }
    }
    
    // Connect to main.js
    window.drawflowEditor = editor;
    window.addStageNode = addStageNode;
    window.updateStageNode = updateStageNode;
    window.updateTriggerText = updateTriggerText;
    
    // Function to update node content
    function updateStageNode(stageNum, stageData) {
        console.log(`Updating stage node ${stageNum}:`, stageData);
        
        // Update title
        const titleElement = document.getElementById(`stage${stageNum}-node-title`);
        if (titleElement) {
            titleElement.textContent = `Stage ${stageNum}: ${stageData.title || ''}`;
        }
        
        // Update basic fields (always visible)
        const conditionElement = document.getElementById(`stage${stageNum}-node-condition`);
        if (conditionElement) {
            conditionElement.innerHTML = `<strong>Condition:</strong> ${stageData.condition || 'Not specified'}`;
        }
        
        const concernElement = document.getElementById(`stage${stageNum}-node-concern`);
        if (concernElement) {
            concernElement.innerHTML = `<strong>Concern:</strong> ${stageData.concern || 'Not specified'}`;
        }
        
        // Update detailed fields (in expandable section)
        const historyElement = document.getElementById(`stage${stageNum}-node-history`);
        if (historyElement) {
            historyElement.innerHTML = `<strong>History:</strong> ${stageData.history || 'Not specified'}`;
        }
        
        const symptomsElement = document.getElementById(`stage${stageNum}-node-symptoms`);
        if (symptomsElement) {
            symptomsElement.innerHTML = `<strong>Symptoms:</strong> ${stageData.symptoms || 'Not specified'}`;
        }
        
        const emotionalElement = document.getElementById(`stage${stageNum}-node-emotional`);
        if (emotionalElement) {
            emotionalElement.innerHTML = `<strong>Emotional:</strong> ${stageData.emotional || 'Not specified'}`;
        }
        
        const cuesElement = document.getElementById(`stage${stageNum}-node-cues`);
        if (cuesElement) {
            cuesElement.innerHTML = `<strong>Cues:</strong> ${stageData.cues || 'Not specified'}`;
        }
        
        const speechElement = document.getElementById(`stage${stageNum}-node-speech`);
        if (speechElement) {
            speechElement.innerHTML = `<strong>Pattern:</strong> ${stageData.speech || 'Not specified'}`;
        }
    }
    
    // IMPORTANT: Remove this line - it's creating an automatic node
    // const initialStageData = { title: 'Initial Assessment', condition: '', trigger: '' };
    // addStageNode(1, initialStageData);
    
    // Export Stage Flow Visualization as PNG
    const exportBtn = document.getElementById('export-stageflow-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            // Select the Drawflow container (adjust selector if needed)
            const container = document.querySelector('.drawflow-container');
            if (!container) {
                alert('Stage Flow Visualization not found!');
                return;
            }
            // Temporarily set background to white for export (optional)
            const prevBg = container.style.background;
            container.style.background = '#fff';
            html2canvas(container, { scale: 3 }).then(function(canvas) {
                container.style.background = prevBg; // revert after export
                const link = document.createElement('a');
                link.download = 'stage-flow-visualization.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            });
        });
    }
});

// Expose the toggle function globally for the onclick handler
window.toggleNodeDetails = function(stageNum) {
    const detailsElement = document.getElementById(`stage${stageNum}-details`);
    const toggleButton = document.getElementById(`toggle-stage${stageNum}`);
    
    if (detailsElement && toggleButton) {
        if (detailsElement.style.display === 'none') {
            detailsElement.style.display = 'block';
            toggleButton.textContent = '▲';
        } else {
            detailsElement.style.display = 'none';
            toggleButton.textContent = '▼';
        }
        // Reposition the trigger node after expanding/collapsing
        setTimeout(() => repositionTriggerNode(stageNum), 200);
    }
};

function repositionTriggerNode(stageNum) {
    // Find the stage node element in the DOM
    const stageNodeElem = document.querySelector(`[id^="node-"] .stage-node-content #stage${stageNum}-node-title`);
    if (!stageNodeElem) return;

    // Traverse up to the node container
    let nodeContainer = stageNodeElem;
    while (nodeContainer && !nodeContainer.classList.contains('drawflow_node')) {
        nodeContainer = nodeContainer.parentElement;
    }
    if (!nodeContainer) return;

    // Get the bottom position of the stage node
    const stageRect = nodeContainer.getBoundingClientRect();

    // Find the trigger node for this stage
    const triggerNodeElem = Array.from(document.querySelectorAll('.drawflow_node.trigger-node')).find(el => {
        return el.innerHTML.includes(`trigger${stageNum}-text`);
    });
    if (!triggerNodeElem) return;

    // Get the parent container's top for relative positioning
    const parentRect = nodeContainer.parentElement.getBoundingClientRect();

    // Set the trigger node's top position to be just below the stage node (+5px)
    const newTop = stageRect.bottom - parentRect.top + 5;
    triggerNodeElem.style.position = 'absolute'; // <-- Ensure absolute positioning
    triggerNodeElem.style.top = `${newTop}px`;
}