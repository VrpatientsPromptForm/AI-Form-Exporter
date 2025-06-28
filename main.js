document.addEventListener('DOMContentLoaded', function() {
    const addStageBtn = document.getElementById('addStageBtn');
    const stagesContainer = document.getElementById('stagesContainer');
    let stageCount = 0;

    function createStage(stageNumber) {
        const stage = document.createElement('div');
        stage.className = 'stage';
        stage.dataset.stageNumber = stageNumber;
        stage.innerHTML = `
            <div class="stage-header">
                <span class="stage-number">${stageNumber}</span>
                <input type="text" class="stage-title" value="Stage ${stageNumber}" placeholder="Enter stage name">
                <div class="stage-controls">
                    <button class="btn btn-sm btn-circle move-up">↑</button>
                    <button class="btn btn-sm btn-circle move-down">↓</button>
                    <button class="btn btn-sm btn-circle delete-stage">✕</button>
                </div>
            </div>
            <div class="stage-content">
                <div class="clarifiers-section">
                    <h3 class="subsection-title">Knowledge Clarifiers</h3>
                    <div class="clarifiers-container" id="stage${stageNumber}-clarifiers">
                        <!-- Clarifiers will be added here dynamically -->
                    </div>
                    <div class="clarifier-buttons">
                        <button class="btn btn-sm add-knows" onclick="addClarifier(${stageNumber}, 'knows')">
                            <span class="icon">✓</span> Add Known
                        </button>
                        <button class="btn btn-sm add-unknown" onclick="addClarifier(${stageNumber}, 'unknown')">
                            <span class="icon">✗</span> Add Unknown
                        </button>
                    </div>
                </div>
                
                <h3 class="subsection-title">Patient Profile</h3>
                <div class="form-group">
                    <label for="stage${stageNumber}-condition">Current Condition</label>
                    <textarea id="stage${stageNumber}-condition" placeholder="Describe admitting condition and current state"></textarea>
                </div>
                <div class="form-group">
                    <label for="stage${stageNumber}-history">Relevant History</label>
                    <textarea id="stage${stageNumber}-history" placeholder="Specific history relevant to this stage"></textarea>
                </div>
                <div class="form-group">
                    <label for="stage${stageNumber}-primary-concern">Primary Concern</label>
                    <textarea id="stage${stageNumber}-primary-concern" placeholder="Patient's main concern in this stage"></textarea>
                </div>
                <div class="form-group">
                    <label for="stage${stageNumber}-symptoms">Current Symptoms</label>
                    <textarea id="stage${stageNumber}-symptoms" placeholder="List current symptoms"></textarea>
                </div>

                <h3 class="subsection-title">Behavioral Reference</h3>
                <div class="form-group">
                    <label for="stage${stageNumber}-emotional">Emotional Baseline</label>
                    <textarea id="stage${stageNumber}-emotional" placeholder="Describe emotional state and baseline behavior"></textarea>
                </div>
                <div class="form-group">
                    <label for="stage${stageNumber}-cues">Behavioral Cues</label>
                    <textarea id="stage${stageNumber}-cues" placeholder="List physical and verbal cues (e.g., sighing, rubbing forehead, fidgeting)"></textarea>
                </div>
                <div class="form-group">
                    <label for="stage${stageNumber}-dialogue">Dialogue Examples</label>
                    <textarea id="stage${stageNumber}-dialogue" placeholder="Provide example responses and dialogue patterns"></textarea>
                </div>

                <h3 class="subsection-title">Speech Pattern</h3>
                <div class="form-group">
                    <label for="stage${stageNumber}-speech-pattern">Select Base Pattern</label>
                    <select id="stage${stageNumber}-speech-pattern" class="speech-pattern-select">
                        <option value="">Choose a speech pattern</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="stage${stageNumber}-phonetic">Phonetic Reference</label>
                    <textarea id="stage${stageNumber}-phonetic" placeholder="IPA notation and examples"></textarea>
                </div>

                <h3 class="subsection-title">Stage Transition</h3>
                <div class="form-group">
                    <label for="stage${stageNumber}-trigger">Key Trigger</label>
                    <textarea id="stage${stageNumber}-trigger" placeholder="Define the trigger that moves to next stage"></textarea>
                </div>
                <div class="form-group">
                    <label for="stage${stageNumber}-breaking">Breaking Point</label>
                    <textarea id="stage${stageNumber}-breaking" placeholder="Conditions that cause significant changes in behavior"></textarea>
                </div>
            </div>`;

        const triggerTextarea = stage.querySelector(`#stage${stageNumber}-trigger`);
        triggerTextarea.addEventListener('input', function() {
            if (window.updateTriggerText) {
                window.updateTriggerText(stageNumber, this.value);
            }
        });

        // Add event listeners to update the mind map when form fields change
        const stageTitle = stage.querySelector('.stage-title');
        const stageCondition = stage.querySelector(`#stage${stageNumber}-condition`);
        const stageConcern = stage.querySelector(`#stage${stageNumber}-primary-concern`);

        // Update the updateMindMapFromForm function to include all fields

        function updateMindMapFromForm() {
            if (window.updateStageNode) {
                const stageData = {
                    title: stageTitle.value || `Stage ${stageNumber}`,
                    condition: stageCondition.value || '',
                    concern: stageConcern.value || '',
                    history: stage.querySelector(`#stage${stageNumber}-history`).value || '',
                    symptoms: stage.querySelector(`#stage${stageNumber}-symptoms`).value || '',
                    emotional: stage.querySelector(`#stage${stageNumber}-emotional`).value || '',
                    cues: stage.querySelector(`#stage${stageNumber}-cues`).value || '',
                    speech: stage.querySelector(`#stage${stageNumber}-speech-pattern`).value || '',
                    dialogue: stage.querySelector(`#stage${stageNumber}-dialogue`).value || '',
                    breaking: stage.querySelector(`#stage${stageNumber}-breaking`).value || ''
                };
                window.updateStageNode(stageNumber, stageData);
            }
        }

        // Add listeners to ALL fields
        stageTitle.addEventListener('input', updateMindMapFromForm);
        stageCondition.addEventListener('input', updateMindMapFromForm);
        stageConcern.addEventListener('input', updateMindMapFromForm);
        stage.querySelector(`#stage${stageNumber}-history`).addEventListener('input', updateMindMapFromForm);
        stage.querySelector(`#stage${stageNumber}-symptoms`).addEventListener('input', updateMindMapFromForm);
        stage.querySelector(`#stage${stageNumber}-emotional`).addEventListener('input', updateMindMapFromForm);
        stage.querySelector(`#stage${stageNumber}-cues`).addEventListener('input', updateMindMapFromForm);
        stage.querySelector(`#stage${stageNumber}-speech-pattern`).addEventListener('change', updateMindMapFromForm);
        stage.querySelector(`#stage${stageNumber}-dialogue`).addEventListener('input', updateMindMapFromForm);
        stage.querySelector(`#stage${stageNumber}-breaking`).addEventListener('input', updateMindMapFromForm);

        // KEEP ONLY THIS ONE node creation call
        if (window.addStageNode) {
            console.log('Adding stage node from main.js:', stageNumber);
            const stageData = {
                title: stageTitle.value || `Stage ${stageNumber}`,
                condition: stageCondition.value || '',
                concern: stageConcern.value || '',
                history: stage.querySelector(`#stage${stageNumber}-history`).value || '',
                symptoms: stage.querySelector(`#stage${stageNumber}-symptoms`).value || '',
                emotional: stage.querySelector(`#stage${stageNumber}-emotional`).value || '',
                cues: stage.querySelector(`#stage${stageNumber}-cues`).value || '',
                speech: stage.querySelector(`#stage${stageNumber}-speech-pattern`).value || '',
                dialogue: stage.querySelector(`#stage${stageNumber}-dialogue`).value || '',
                breaking: stage.querySelector(`#stage${stageNumber}-breaking`).value || ''
            };
            window.addStageNode(stageNumber, stageData);
        } else {
            console.error('addStageNode function not available');
        }

        // Example usage after creating a new stage
        const speechSelect = stage.querySelector('.speech-pattern-select');
        const phoneticTextarea = stage.querySelector(`#stage${stageNumber}-phonetic`);
        let customSpeechInput = null;

        populateSpeechPatternSelect(speechSelect);

        speechSelect.addEventListener('change', function() {
            if (speechSelect.value === "other") {
                // If not already present, add a custom input
                if (!customSpeechInput) {
                    customSpeechInput = document.createElement('input');
                    customSpeechInput.type = 'text';
                    customSpeechInput.placeholder = 'Enter custom speech pattern';
                    customSpeechInput.className = 'custom-speech-pattern';
                    customSpeechInput.style.marginTop = '8px';
                    speechSelect.parentNode.appendChild(customSpeechInput);

                    // When user types, update the phonetic textarea
                    customSpeechInput.addEventListener('input', function() {
                        phoneticTextarea.value = customSpeechInput.value;
                    });
                }
                customSpeechInput.style.display = '';
                phoneticTextarea.value = '';
            } else {
                if (customSpeechInput) customSpeechInput.style.display = 'none';
                setPhoneticReference(speechSelect, phoneticTextarea);
            }
        });

        return stage;
    }

    addStageBtn.addEventListener('click', function() {
        stageCount++;
        const newStage = createStage(stageCount);
        stagesContainer.appendChild(newStage);
    });

    // Create initial stage
    stageCount++;
    const initialStage = createStage(stageCount);
    stagesContainer.appendChild(initialStage);
});

// Add this function to handle clarifier creation
function addClarifier(stageNumber, type) {
    const container = document.getElementById(`stage${stageNumber}-clarifiers`);
    const clarifierDiv = document.createElement('div');
    clarifierDiv.className = `clarifier-item ${type}`;
    
    clarifierDiv.innerHTML = `
        <span class="clarifier-type">${type === 'knows' ? 'Knows' : 'Does Not Know'}</span>
        <input type="text" class="clarifier-input" 
            placeholder="${type === 'knows' ? 'You know...' : 'You do not know...'}"
        >
        <button class="btn btn-sm btn-remove" onclick="this.parentElement.remove()">✕</button>
    `;
    
    container.appendChild(clarifierDiv);
}

document.addEventListener('DOMContentLoaded', function() {
    const previewBtn = document.getElementById('preview-copy-btn');
    const modal = document.getElementById('form-preview-modal');
    const modalContent = document.getElementById('form-preview-content');
    const copyBtn = document.getElementById('copy-preview-btn');
    const closeBtn = document.getElementById('close-preview-modal');

    if (previewBtn && modal && modalContent && copyBtn && closeBtn) {
        previewBtn.addEventListener('click', function() {
            let txt = "";

            // Grab Patient Information section
            const patientName = document.getElementById('patientName')?.value || '';
            const patientAge = document.getElementById('patientAge')?.value || '';
            const patientGender = document.getElementById('patientGender')?.value || '';
            const medicalHistory = document.getElementById('medicalHistory')?.value || '';
            const visitReason = document.getElementById('visitReason')?.value || '';

            txt += `PATIENT INFORMATION\n`;
            txt += `Name: ${patientName}\n`;
            txt += `Age: ${patientAge}\n`;
            txt += `Gender: ${patientGender}\n`;
            txt += `Medical History: ${medicalHistory}\n`;
            txt += `Reason for Visit: ${visitReason}\n`;
            txt += `\n${'-'.repeat(40)}\n\n`;

            // Loop through all stages
            document.querySelectorAll('.stage').forEach((stage, idx) => {
                const stageNum = idx + 1;
                const title = stage.querySelector('.stage-title')?.value || `Stage ${stageNum}`;
                const currentCondition = stage.querySelector(`#stage${stageNum}-condition`)?.value || '';
                const relevantHistory = stage.querySelector(`#stage${stageNum}-history`)?.value || '';
                const primaryConcern = stage.querySelector(`#stage${stageNum}-primary-concern`)?.value || '';
                const currentSymptoms = stage.querySelector(`#stage${stageNum}-symptoms`)?.value || '';
                const emotionalBaseline = stage.querySelector(`#stage${stageNum}-emotional`)?.value || '';
                const behavioralCues = stage.querySelector(`#stage${stageNum}-cues`)?.value || '';
                const dialogueExamples = stage.querySelector(`#stage${stageNum}-dialogue`)?.value || '';
                const speechPattern = stage.querySelector(`#stage${stageNum}-speech-pattern`)?.value || '';
                const phonetic = stage.querySelector(`#stage${stageNum}-phonetic`)?.value || '';
                const trigger = stage.querySelector(`#stage${stageNum}-trigger`)?.value || '';
                const breaking = stage.querySelector(`#stage${stageNum}-breaking`)?.value || '';

                // Clarifiers
                let knows = [];
                let unknowns = [];
                stage.querySelectorAll('.clarifier-item.knows .clarifier-input').forEach(input => {
                    if (input.value.trim()) knows.push(input.value.trim());
                });
                stage.querySelectorAll('.clarifier-item.unknown .clarifier-input').forEach(input => {
                    if (input.value.trim()) unknowns.push(input.value.trim());
                });

                txt += `STAGE: ${title}\n\n`;

                if (knows.length || unknowns.length) {
                    txt += `Knowledge Clarifiers\n`;
                    if (knows.length) {
                        knows.forEach(k => txt += `✓ ${k}\n`);
                    }
                    if (unknowns.length) {
                        unknowns.forEach(u => txt += `✗ ${u}\n`);
                    }
                    txt += `\n`;
                }

                txt += `Patient Profile\n`;
                txt += `Current Condition: ${currentCondition}\n`;
                txt += `Relevant History: ${relevantHistory}\n`;
                txt += `Primary Concern: ${primaryConcern}\n`;
                txt += `Current Symptoms: ${currentSymptoms}\n\n`;

                txt += `Behavioral Reference\n`;
                txt += `Emotional Baseline: ${emotionalBaseline}\n`;
                txt += `Behavioral Cues: ${behavioralCues}\n`;
                txt += `Dialogue Examples: ${dialogueExamples}\n\n`;

                txt += `Speech Pattern\n`;
                txt += `Base Pattern: ${speechPattern}\n`;
                txt += `Phonetic Reference: ${phonetic}\n\n`;

                txt += `Stage Transition\n`;
                txt += `Key Trigger: ${trigger}\n`;
                txt += `Breaking Point: ${breaking}\n`;

                txt += `\n${'-'.repeat(40)}\n\n`;
            });

            modalContent.textContent = txt.trim();
            modal.style.display = 'flex';
        });

        copyBtn.addEventListener('click', function() {
            navigator.clipboard.writeText(modalContent.textContent).then(() => {
                copyBtn.textContent = "Copied!";
                setTimeout(() => copyBtn.textContent = "Copy to Clipboard", 1200);
            });
        });

        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });

        // Optional: close modal when clicking outside the box
        modal.addEventListener('click', function(e) {
            if (e.target === modal) modal.style.display = 'none';
        });
    }
});

function populateSpeechPatternSelect(selectElem) {
    const patterns = [
        { value: "", label: "Select a speech pattern..." },
        { value: "stuttering", label: 'Stuttering (e.g., "I... I w-want to g-go home.")' },
        { value: "slurring", label: 'Slurring (e.g., "I wansh to go h-home.")' },
        { value: "drunk", label: 'Drunk (e.g., "I jus\' wanna... go h-home, y\'know?")' },
        { value: "stroke", label: 'Stroke (e.g., "I... want... go... home.")' },
        { value: "other", label: "Other (custom)" }
    ];
    selectElem.innerHTML = "";
    patterns.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.value;
        opt.textContent = p.label;
        selectElem.appendChild(opt);
    });
}

function setPhoneticReference(selectElem, phoneticElem) {
    const pattern = selectElem.value;
    let text = "";
    switch (pattern) {
        case "stuttering":
            text = `IPA: [ˈaɪ ... ˈaɪ wˈwɑːnt tə ɡˈɡoʊ hˈhoʊm]\nExample: "I... I w-want to g-go home."`;
            break;
        case "slurring":
            text = `IPA: [aɪ wænʃ tə ɡoʊ h-hoʊm]\nExample: "I wansh to go h-home."`;
            break;
        case "drunk":
            text = `IPA: [aɪ dʒəs ˈwɑːnə ... ɡoʊ hˈhoʊm jəˈnoʊ]\nExample: "I jus' wanna... go h-home, y'know?"`;
            break;
        case "stroke":
            text = `IPA: [aɪ ... wɑːnt ... ɡoʊ ... hoʊm]\nExample: "I... want... go... home."`;
            break;
        default:
            text = "";
    }
    phoneticElem.value = text;
}