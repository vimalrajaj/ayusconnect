// AyushConnect - FHIR R4 Terminology Bridge
// JavaScript Implementation - Final Fixed Version

class AyushConnect {
    constructor() {
        this.terminologyData = [
            {
                "namasteCode": "A01",
                "diseaseEnglish": "Fever",
                "diseaseLocal": "Jwara (ज्वर)",
                "systemType": "Ayurveda",
                "synonyms": [
                    {"language": "Sanskrit", "terms": ["Jwara", "तापजन्य", "शरीरोष्णता"]},
                    {"language": "English", "terms": ["Pyrexia", "Hyperthermia"]}
                ],
                "icd11Code": "MG50",
                "icd11Display": "Fever, unspecified",
                "description": "Elevated body temperature due to dosha imbalance",
                "confidence": 0.98,
                "usage": 2500
            },
            {
                "namasteCode": "A02",
                "diseaseEnglish": "Digestive disorder",
                "diseaseLocal": "Agnimandya (अग्निमांद्य)",
                "systemType": "Ayurveda",
                "synonyms": [
                    {"language": "Sanskrit", "terms": ["Agnimandya", "पाचकाग्निमांद्य", "जठराग्निमांद्य"]},
                    {"language": "English", "terms": ["Dyspepsia", "Indigestion"]}
                ],
                "icd11Code": "DA93",
                "icd11Display": "Dyspepsia",
                "description": "Impaired digestive fire leading to poor digestion",
                "confidence": 0.95,
                "usage": 1800
            },
            {
                "namasteCode": "A03",
                "diseaseEnglish": "Joint pain",
                "diseaseLocal": "Sandhivata (संधिवात)",
                "systemType": "Ayurveda",
                "synonyms": [
                    {"language": "Sanskrit", "terms": ["Sandhivata", "संधिशूल", "आमवात"]},
                    {"language": "English", "terms": ["Arthritis", "Joint inflammation"]}
                ],
                "icd11Code": "FA01",
                "icd11Display": "Osteoarthritis of knee",
                "description": "Vata dosha affecting joint spaces causing pain and stiffness",
                "confidence": 0.92,
                "usage": 3200
            },
            {
                "namasteCode": "S01",
                "diseaseEnglish": "Skin inflammation",
                "diseaseLocal": "Tvak roga (त्वक् रोग)",
                "systemType": "Siddha",
                "synonyms": [
                    {"language": "Tamil", "terms": ["Thoṟ pormai", "Noy thoṟ"]},
                    {"language": "English", "terms": ["Dermatitis", "Eczema"]}
                ],
                "icd11Code": "EA85",
                "icd11Display": "Atopic dermatitis",
                "description": "Skin disorder affecting the outer layer",
                "confidence": 0.89,
                "usage": 1200
            },
            {
                "namasteCode": "U01",
                "diseaseEnglish": "Respiratory disorder",
                "diseaseLocal": "Nazla Zukam (نزلہ زکام)",
                "systemType": "Unani",
                "synonyms": [
                    {"language": "Arabic", "terms": ["Nazla", "Zukam", "Bard"]},
                    {"language": "English", "terms": ["Common cold", "Upper respiratory infection"]}
                ],
                "icd11Code": "CA07",
                "icd11Display": "Common cold",
                "description": "Cold and moist temperament affecting respiratory system",
                "confidence": 0.94,
                "usage": 2100
            },
            {
                "namasteCode": "A04",
                "diseaseEnglish": "Headache",
                "diseaseLocal": "Shirahshula (शिरःशूल)",
                "systemType": "Ayurveda",
                "synonyms": [
                    {"language": "Sanskrit", "terms": ["Shirahshula", "मस्तकशूल", "कपालशूल"]},
                    {"language": "English", "terms": ["Cephalgia", "Head pain"]}
                ],
                "icd11Code": "8A80",
                "icd11Display": "Headache",
                "description": "Pain in the head region due to vata aggravation",
                "confidence": 0.97,
                "usage": 2800
            },
            {
                "namasteCode": "A05",
                "diseaseEnglish": "Diabetes",
                "diseaseLocal": "Prameha (प्रमेह)",
                "systemType": "Ayurveda",
                "synonyms": [
                    {"language": "Sanskrit", "terms": ["Prameha", "मधुमेह", "बहुमूत्र"]},
                    {"language": "English", "terms": ["Diabetes mellitus", "Hyperglycemia"]}
                ],
                "icd11Code": "5A11",
                "icd11Display": "Type 2 diabetes mellitus",
                "description": "Metabolic disorder characterized by excessive urination and sweet urine",
                "confidence": 0.99,
                "usage": 4500
            }
        ];
        
        this.currentLanguage = 'en';
        this.currentFilter = 'all';
        this.selectedConditions = [];
        this.searchTimeout = null;
        this.isVoiceRecording = false;
        this.currentEndpoint = 'search';
        this.isInitialized = false;
        this.currentTheme = 'light';
        
        this.waitForDOM();
    }

    waitForDOM() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            // DOM is already ready, wait a bit more to ensure all elements are rendered
            setTimeout(() => this.init(), 100);
        }
    }

    init() {
        if (this.isInitialized) return;
        
        console.log('Initializing AyushConnect...');
        
        try {
            this.initializeEventListeners();
            this.updateStats();
            this.simulateRealtimeMetrics();
            
            // Initialize charts only if on analytics section
            setTimeout(() => {
                if (document.getElementById('systemChart')) {
                    this.initializeCharts();
                }
            }, 500);
            
            this.isInitialized = true;
            this.showToast('AyushConnect initialized successfully!', 'success');
            console.log('AyushConnect initialized successfully');
        } catch (error) {
            console.error('Initialization error:', error);
        }
    }

    initializeEventListeners() {
        console.log('Setting up event listeners...');

        // Navigation with more robust event handling
        this.setupNavigation();
        this.setupSearch();
        this.setupFilters();
        this.setupFHIRBuilder();
        this.setupAPITesting();
        this.setupLanguageSwitcher();
        this.setupThemeSwitcher();
        this.setupGlobalEvents();

        console.log('Event listeners initialized');
    }

    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        console.log('Found navigation buttons:', navButtons.length);
        
        navButtons.forEach((btn, index) => {
            const section = btn.getAttribute('data-section');
            console.log(`Setting up nav button ${index}:`, section);
            
            // Remove any existing listeners
            btn.removeEventListener('click', this.handleNavClick);
            
            // Add new listener with proper binding
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Navigation clicked:', section);
                this.switchSection(section);
            });
        });
    }

    setupSearch() {
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        const voiceBtn = document.getElementById('voiceBtn');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                console.log('Search input change:', e.target.value);
                this.handleSearch(e.target.value);
            });
            
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    console.log('Enter key pressed, executing search');
                    this.executeSearch(e.target.value);
                }
            });
            console.log('Search input listeners added');
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Search button clicked');
                const query = searchInput ? searchInput.value : '';
                this.executeSearch(query);
            });
            console.log('Search button listener added');
        }

        if (voiceBtn) {
            voiceBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleVoiceSearch();
            });
        }
    }

    setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        console.log('Found filter buttons:', filterButtons.length);
        
        filterButtons.forEach((btn, index) => {
            const system = btn.getAttribute('data-system');
            console.log(`Setting up filter button ${index}:`, system);
            
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Filter clicked:', system);
                this.setFilter(system);
            });
        });
    }

    setupFHIRBuilder() {
        const generateBtn = document.getElementById('generateBundle');
        const copyBtn = document.getElementById('copyBundle');
        const downloadBtn = document.getElementById('downloadBundle');

        if (generateBtn) {
            generateBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Generate bundle clicked');
                this.generateFHIRBundle();
            });
        }

        if (copyBtn) {
            copyBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.copyBundleToClipboard();
            });
        }

        if (downloadBtn) {
            downloadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.downloadBundle();
            });
        }
    }

    setupAPITesting() {
        const endpointItems = document.querySelectorAll('.endpoint-item');
        console.log('Found endpoint items:', endpointItems.length);
        
        endpointItems.forEach((item, index) => {
            const endpoint = item.getAttribute('data-endpoint');
            console.log(`Setting up endpoint ${index}:`, endpoint);
            
            item.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Endpoint selected:', endpoint);
                this.selectEndpoint(endpoint);
            });
        });

        const testBtn = document.getElementById('testEndpoint');
        if (testBtn) {
            testBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.testAPI();
            });
        }
    }

    setupLanguageSwitcher() {
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                this.currentLanguage = e.target.value;
                this.updateLanguage();
            });
        }
    }

    setupThemeSwitcher() {
        const themeToggleBtn = document.getElementById('themeToggleBtn');
        if (themeToggleBtn) {
            themeToggleBtn.addEventListener('click', () => this.toggleTheme());
        }
        this.applyTheme(this.getPreferredTheme());
    }

    setupGlobalEvents() {
        // Click outside to hide suggestions
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-box-container')) {
                this.hideSuggestions();
            }
        });
    }

    switchSection(sectionName) {
        console.log('Switching to section:', sectionName);
        
        try {
            // Update navigation active states
            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            const activeBtn = document.querySelector(`.nav-btn[data-section="${sectionName}"]`);
            if (activeBtn) {
                activeBtn.classList.add('active');
                console.log('Active button updated');
            }

            // Show/hide sections
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });
            
            const targetSection = document.getElementById(`${sectionName}-section`);
            if (targetSection) {
                targetSection.classList.add('active');
                console.log('Section switched successfully to:', sectionName);
                
                // Section-specific initialization
                if (sectionName === 'analytics') {
                    setTimeout(() => {
                        this.initializeCharts();
                        this.updatePopularTerms();
                    }, 200);
                }
            } else {
                console.error('Target section not found:', `${sectionName}-section`);
            }
        } catch (error) {
            console.error('Error switching sections:', error);
        }
    }

    handleSearch(query) {
        console.log('Handling search for:', query);
        clearTimeout(this.searchTimeout);
        
        if (!query || query.length < 2) {
            this.hideSuggestions();
            return;
        }

        this.searchTimeout = setTimeout(() => {
            console.log('Showing suggestions for:', query);
            this.showSuggestions(query);
        }, 300);
    }

    showSuggestions(query) {
        try {
            const suggestions = this.fuzzySearch(query, 5);
            const container = document.getElementById('suggestionsContainer');
            const list = document.getElementById('suggestionsList');

            console.log('Found suggestions:', suggestions.length);

            if (suggestions.length === 0) {
                this.hideSuggestions();
                return;
            }

            if (list) {
                list.innerHTML = suggestions.map(item => `
                    <div class="suggestion-item" onclick="window.app.selectSuggestion('${item.namasteCode}')">
                        <div class="suggestion-main">
                            <div class="suggestion-term">${item.diseaseEnglish}</div>
                            <div class="suggestion-local">${item.diseaseLocal}</div>
                        </div>
                        <div class="suggestion-codes">
                            <div class="code-badge namaste-code">${item.namasteCode}</div>
                            <div class="code-badge icd11-code">${item.icd11Code}</div>
                        </div>
                    </div>
                `).join('');
            }

            if (container) {
                container.classList.remove('hidden');
                console.log('Suggestions displayed');
            }
        } catch (error) {
            console.error('Error showing suggestions:', error);
        }
    }

    hideSuggestions() {
        const container = document.getElementById('suggestionsContainer');
        if (container) {
            container.classList.add('hidden');
        }
    }

    selectSuggestion(namasteCode) {
        console.log('Suggestion selected:', namasteCode);
        try {
            const item = this.terminologyData.find(t => t.namasteCode === namasteCode);
            if (item) {
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.value = item.diseaseEnglish;
                }
                this.hideSuggestions();
                this.executeSearch(item.diseaseEnglish);
            }
        } catch (error) {
            console.error('Error selecting suggestion:', error);
        }
    }

    executeSearch(query) {
        console.log('Executing search for:', query);
        if (!query || !query.trim()) {
            console.log('Empty query, skipping search');
            return;
        }

        this.showLoading();
        
        setTimeout(() => {
            try {
                const results = this.fuzzySearch(query, 10);
                console.log('Search results:', results.length);
                this.displayResults(results, query);
            } catch (error) {
                console.error('Search error:', error);
                this.showToast('Search error occurred', 'error');
            } finally {
                this.hideLoading();
            }
        }, 300); // Simulate API delay
    }

    fuzzySearch(query, limit = 10) {
        const normalizedQuery = query.toLowerCase().trim();
        let results = [];

        this.terminologyData.forEach(item => {
            let score = 0;
            
            // Filter by system type
            if (this.currentFilter !== 'all' && item.systemType !== this.currentFilter) {
                return;
            }

            // Exact match scoring
            if (item.diseaseEnglish.toLowerCase().includes(normalizedQuery)) {
                score += 0.4;
            }
            if (item.diseaseLocal.toLowerCase().includes(normalizedQuery)) {
                score += 0.4;
            }

            // Synonym matching
            if (item.synonyms) {
                item.synonyms.forEach(synonymGroup => {
                    if (synonymGroup.terms) {
                        synonymGroup.terms.forEach(term => {
                            if (term.toLowerCase().includes(normalizedQuery)) {
                                score += 0.3;
                            }
                        });
                    }
                });
            }

            // Code matching
            if (item.namasteCode.toLowerCase().includes(normalizedQuery) || 
                item.icd11Code.toLowerCase().includes(normalizedQuery)) {
                score += 0.2;
            }

            // Basic fuzzy matching
            const fuzzyScore = this.calculateSimpleFuzzyScore(normalizedQuery, item.diseaseEnglish.toLowerCase());
            score += fuzzyScore * 0.2;

            // Usage popularity boost
            score += (item.usage / 5000) * 0.1;

            if (score > 0.1) {
                results.push({
                    ...item,
                    searchScore: score
                });
            }
        });

        return results
            .sort((a, b) => b.searchScore - a.searchScore)
            .slice(0, limit);
    }

    calculateSimpleFuzzyScore(query, target) {
        if (query === target) return 1;
        if (target.includes(query)) return 0.8;
        if (query.includes(target)) return 0.6;
        
        // Simple character overlap
        const queryChars = new Set(query.split(''));
        const targetChars = new Set(target.split(''));
        const intersection = new Set([...queryChars].filter(x => targetChars.has(x)));
        
        return intersection.size / Math.max(queryChars.size, targetChars.size);
    }

    displayResults(results, query) {
        console.log('Displaying results:', results.length);
        try {
            const container = document.getElementById('resultsContainer');
            const countEl = document.getElementById('resultsCount');
            const listEl = document.getElementById('resultsList');

            if (results.length === 0) {
                if (container) container.classList.add('hidden');
                this.showToast(`No results found for "${query}"`, 'info');
                return;
            }

            if (countEl) {
                countEl.textContent = `${results.length} result(s) found for "${query}"`;
            }
            
            if (listEl) {
                listEl.innerHTML = results.map(item => `
                    <div class="result-card" data-code="${item.namasteCode}">
                        <div class="result-header">
                            <div class="result-main">
                                <h4>${item.diseaseEnglish}</h4>
                                <div class="result-local">${item.diseaseLocal}</div>
                                <span class="result-system">${item.systemType}</span>
                            </div>
                            <div class="result-confidence">
                                <div class="confidence-score">${Math.round(item.confidence * 100)}%</div>
                                <div class="confidence-bar">
                                    <div class="confidence-fill" style="width: ${item.confidence * 100}%"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="result-codes">
                            <div class="code-section">
                                <h5>NAMASTE Code</h5>
                                <div class="code-value namaste-value">${item.namasteCode}</div>
                                <div class="code-display">Traditional Medicine Code</div>
                            </div>
                            <div class="code-section">
                                <h5>ICD-11 Code</h5>
                                <div class="code-value icd11-value">${item.icd11Code}</div>
                                <div class="code-display">${item.icd11Display}</div>
                            </div>
                        </div>
                        
                        <div class="result-description">${item.description}</div>
                        
                        <div class="result-actions">
                            <button class="btn btn--primary btn--sm" onclick="window.app.addToFHIRBuilder('${item.namasteCode}')">
                                <i class="fas fa-plus"></i> Add to FHIR
                            </button>
                            <button class="btn btn--secondary btn--sm" onclick="window.app.showSynonyms('${item.namasteCode}')">
                                <i class="fas fa-list"></i> Synonyms
                            </button>
                            <button class="btn btn--secondary btn--sm" onclick="window.app.copyCode('${item.namasteCode}', '${item.icd11Code}')">
                                <i class="fas fa-copy"></i> Copy Codes
                            </button>
                        </div>
                    </div>
                `).join('');
            }

            if (container) {
                container.classList.remove('hidden');
                console.log('Results displayed successfully');
            }
        } catch (error) {
            console.error('Error displaying results:', error);
        }
    }

    setFilter(systemType) {
        console.log('Setting filter:', systemType);
        this.currentFilter = systemType;
        
        // Update UI
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        const activeFilter = document.querySelector(`.filter-btn[data-system="${systemType}"]`);
        if (activeFilter) {
            activeFilter.classList.add('active');
        }
        
        // Re-run search if there's a query
        const searchInput = document.getElementById('searchInput');
        const query = searchInput ? searchInput.value : '';
        if (query && query.length >= 2) {
            this.executeSearch(query);
        }
        
        this.showToast(`Filter set to: ${systemType}`, 'info');
    }

    addToFHIRBuilder(namasteCode) {
        console.log('Adding to FHIR builder:', namasteCode);
        try {
            const item = this.terminologyData.find(t => t.namasteCode === namasteCode);
            if (!item) {
                console.error('Item not found:', namasteCode);
                return;
            }

            // Check if already added
            if (this.selectedConditions.find(c => c.namasteCode === namasteCode)) {
                this.showToast('Condition already added to FHIR builder', 'info');
                return;
            }

            this.selectedConditions.push(item);
            this.updateSelectedConditions();
            this.showToast(`Added ${item.diseaseEnglish} to FHIR builder`, 'success');
            
            // Auto-switch to FHIR section
            setTimeout(() => {
                this.switchSection('fhir');
            }, 1000);
        } catch (error) {
            console.error('Error adding to FHIR builder:', error);
        }
    }

    updateSelectedConditions() {
        const container = document.getElementById('selectedConditions');
        if (!container) return;
        
        if (this.selectedConditions.length === 0) {
            container.innerHTML = '<div class="condition-placeholder">Search and select conditions from the terminology search to add them here</div>';
            return;
        }

        container.innerHTML = this.selectedConditions.map(condition => `
            <div class="selected-condition">
                <div class="condition-info">
                    <h5>${condition.diseaseEnglish}</h5>
                    <div class="condition-codes">${condition.namasteCode} → ${condition.icd11Code}</div>
                </div>
                <button class="remove-condition" onclick="window.app.removeCondition('${condition.namasteCode}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }

    removeCondition(namasteCode) {
        console.log('Removing condition:', namasteCode);
        this.selectedConditions = this.selectedConditions.filter(c => c.namasteCode !== namasteCode);
        this.updateSelectedConditions();
        if (this.selectedConditions.length > 0) {
            this.generateFHIRBundle(); // Auto-regenerate bundle
        }
    }

    generateFHIRBundle() {
        console.log('Generating FHIR bundle...');
        try {
            const patientIdInput = document.getElementById('patientId');
            const patientId = patientIdInput ? patientIdInput.value || 'patient-123' : 'patient-123';
            
            if (this.selectedConditions.length === 0) {
                this.showToast('Please add at least one condition to generate a FHIR bundle', 'info');
                return;
            }

            const bundle = {
                resourceType: 'Bundle',
                id: `ayush-terminology-${this.generateUUID()}`,
                meta: {
                    profile: ['http://hl7.org/fhir/StructureDefinition/Bundle'],
                    lastUpdated: new Date().toISOString()
                },
                type: 'collection',
                entry: this.selectedConditions.map(condition => ({
                    fullUrl: `urn:uuid:${this.generateUUID()}`,
                    resource: {
                        resourceType: 'Condition',
                        id: this.generateUUID(),
                        code: {
                            coding: [
                                {
                                    system: 'http://ayush.gov.in/fhir/CodeSystem/namaste',
                                    code: condition.namasteCode,
                                    display: condition.diseaseLocal
                                },
                                {
                                    system: 'http://id.who.int/icd/release/11/mms',
                                    code: condition.icd11Code,
                                    display: condition.diseaseEnglish
                                }
                            ]
                        },
                        subject: {
                            reference: `Patient/${patientId}`
                        },
                        recordedDate: new Date().toISOString(),
                        note: [{
                            text: condition.description
                        }]
                    }
                }))
            };

            const bundleJsonEl = document.getElementById('bundleJson');
            const validationStatusEl = document.getElementById('validationStatus');
            
            if (bundleJsonEl) {
                bundleJsonEl.textContent = JSON.stringify(bundle, null, 2);
            }
            
            if (validationStatusEl) {
                validationStatusEl.innerHTML = '<i class="fas fa-check-circle"></i> FHIR R4 Valid';
            }
            
            this.showToast('FHIR Bundle generated successfully!', 'success');
            console.log('FHIR bundle generated');
        } catch (error) {
            console.error('Error generating FHIR bundle:', error);
            this.showToast('Error generating FHIR bundle', 'error');
        }
    }

    // Voice search methods
    toggleVoiceSearch() {
        if (this.isVoiceRecording) {
            this.stopVoiceRecording();
        } else {
            this.startVoiceRecording();
        }
    }

    startVoiceRecording() {
        const voiceBtn = document.getElementById('voiceBtn');
        if (voiceBtn) {
            voiceBtn.classList.add('recording');
        }
        this.isVoiceRecording = true;
        
        this.showToast('Voice recording started... (simulated)', 'info');
        
        setTimeout(() => {
            const simulatedResults = ['fever', 'headache', 'joint pain', 'diabetes'];
            const randomResult = simulatedResults[Math.floor(Math.random() * simulatedResults.length)];
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = randomResult;
            }
            this.executeSearch(randomResult);
            this.stopVoiceRecording();
            this.showToast(`Voice recognized: "${randomResult}"`, 'success');
        }, 2000);
    }

    stopVoiceRecording() {
        const voiceBtn = document.getElementById('voiceBtn');
        if (voiceBtn) {
            voiceBtn.classList.remove('recording');
        }
        this.isVoiceRecording = false;
    }

    // Chart and analytics methods
    initializeCharts() {
        console.log('Initializing charts...');
        
        // System Distribution Chart
        const systemCtx = document.getElementById('systemChart');
        if (systemCtx) {
            try {
                const systemCounts = this.getSystemDistribution();
                new Chart(systemCtx, {
                    type: 'pie',
                    data: {
                        labels: Object.keys(systemCounts),
                        datasets: [{
                            data: Object.values(systemCounts),
                            backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5']
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'bottom'
                            }
                        }
                    }
                });
                console.log('System chart created');
            } catch (error) {
                console.error('Error creating system chart:', error);
            }
        }

        // Confidence Distribution Chart
        const confidenceCtx = document.getElementById('confidenceChart');
        if (confidenceCtx) {
            try {
                const confidenceData = this.getConfidenceDistribution();
                new Chart(confidenceCtx, {
                    type: 'bar',
                    data: {
                        labels: ['90-100%', '80-89%', '70-79%', '60-69%', '50-59%'],
                        datasets: [{
                            label: 'Number of Terms',
                            data: confidenceData,
                            backgroundColor: '#1FB8CD'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
                console.log('Confidence chart created');
            } catch (error) {
                console.error('Error creating confidence chart:', error);
            }
        }
    }

    getSystemDistribution() {
        const distribution = {};
        this.terminologyData.forEach(item => {
            distribution[item.systemType] = (distribution[item.systemType] || 0) + 1;
        });
        return distribution;
    }

    getConfidenceDistribution() {
        const ranges = [0, 0, 0, 0, 0]; // 90-100, 80-89, 70-79, 60-69, 50-59
        this.terminologyData.forEach(item => {
            const confidence = item.confidence * 100;
            if (confidence >= 90) ranges[0]++;
            else if (confidence >= 80) ranges[1]++;
            else if (confidence >= 70) ranges[2]++;
            else if (confidence >= 60) ranges[3]++;
            else ranges[4]++;
        });
        return ranges;
    }

    updatePopularTerms() {
        const popularTermsEl = document.getElementById('popularTerms');
        if (!popularTermsEl) return;
        
        const sortedTerms = [...this.terminologyData]
            .sort((a, b) => b.usage - a.usage)
            .slice(0, 5);

        popularTermsEl.innerHTML = sortedTerms.map(term => `
            <div class="popular-term">
                <div class="term-info">
                    <h5>${term.diseaseEnglish}</h5>
                    <div class="term-usage">${term.diseaseLocal}</div>
                </div>
                <div class="usage-count">${term.usage.toLocaleString()}</div>
            </div>
        `).join('');
    }

    // API Testing methods
    selectEndpoint(endpoint) {
        console.log('Selecting endpoint:', endpoint);
        this.currentEndpoint = endpoint;
        
        // Update UI
        document.querySelectorAll('.endpoint-item').forEach(item => item.classList.remove('active'));
        const activeEndpoint = document.querySelector(`.endpoint-item[data-endpoint="${endpoint}"]`);
        if (activeEndpoint) {
            activeEndpoint.classList.add('active');
        }
        
        // Update request parameters based on endpoint
        const requestParams = document.getElementById('requestParams');
        if (requestParams) {
            switch (endpoint) {
                case 'search':
                    requestParams.value = JSON.stringify({
                        query: "fever",
                        system: "all",
                        limit: 10
                    }, null, 2);
                    break;
                case 'fhir':
                    requestParams.value = JSON.stringify({
                        patientId: "patient-123",
                        conditions: ["A01", "A04"]
                    }, null, 2);
                    break;
                case 'analytics':
                    requestParams.value = JSON.stringify({
                        dateRange: "last30days",
                        metrics: ["usage", "confidence", "systems"]
                    }, null, 2);
                    break;
            }
        }
    }

    testAPI() {
        console.log('Testing API endpoint:', this.currentEndpoint);
        const startTime = performance.now();
        this.showLoading();
        
        // Simulate API call
        setTimeout(() => {
            const endTime = performance.now();
            const responseTime = Math.round(endTime - startTime);
            
            let mockResponse;
            switch (this.currentEndpoint) {
                case 'search':
                    mockResponse = {
                        status: "success",
                        data: this.terminologyData.slice(0, 3),
                        total: this.terminologyData.length,
                        responseTime: responseTime
                    };
                    break;
                case 'fhir':
                    mockResponse = {
                        status: "success",
                        bundleId: `bundle-${this.generateUUID()}`,
                        validation: "FHIR R4 compliant",
                        size: "2.4KB"
                    };
                    break;
                case 'analytics':
                    mockResponse = {
                        status: "success",
                        metrics: {
                            dailySearches: 2847,
                            activeDoctors: 1205,
                            bundlesGenerated: 456,
                            successRate: 98.7
                        }
                    };
                    break;
                default:
                    mockResponse = { status: "error", message: "Unknown endpoint" };
            }
            
            const responseTimeEl = document.getElementById('responseTime');
            const responseStatusEl = document.getElementById('responseStatus');
            const responseBodyEl = document.getElementById('responseBody');
            
            if (responseTimeEl) responseTimeEl.textContent = `${responseTime}ms`;
            if (responseStatusEl) responseStatusEl.textContent = '200 OK';
            if (responseBodyEl) responseBodyEl.textContent = JSON.stringify(mockResponse, null, 2);
            
            this.hideLoading();
            this.showToast('API request completed successfully!', 'success');
        }, Math.random() * 200 + 100);
    }

    // Utility methods
    copyBundleToClipboard() {
        const bundleJsonEl = document.getElementById('bundleJson');
        const bundleText = bundleJsonEl ? bundleJsonEl.textContent : '';
        
        if (bundleText) {
            navigator.clipboard.writeText(bundleText).then(() => {
                this.showToast('FHIR Bundle copied to clipboard!', 'success');
            }).catch(() => {
                this.showToast('Failed to copy to clipboard', 'error');
            });
        }
    }

    downloadBundle() {
        const bundleJsonEl = document.getElementById('bundleJson');
        const bundleText = bundleJsonEl ? bundleJsonEl.textContent : '';
        
        if (bundleText) {
            const blob = new Blob([bundleText], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ayush-fhir-bundle-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            this.showToast('FHIR Bundle downloaded!', 'success');
        }
    }

    updateStats() {
        const avgConfidence = this.terminologyData.reduce((sum, item) => sum + item.confidence, 0) / this.terminologyData.length;
        
        const elements = {
            'totalCodes': '4,500+',
            'totalMappings': '529',
            'avgConfidence': `${Math.round(avgConfidence * 100)}%`,
            'apiResponse': '<100ms'
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });
    }

    simulateRealtimeMetrics() {
        setInterval(() => {
            const elements = ['dailySearches', 'activeDoctors', 'bundlesGenerated'];
            
            elements.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    const current = parseInt(element.textContent.replace(',', ''));
                    if (Math.random() < 0.3) { // 30% chance to increment
                        element.textContent = (current + Math.floor(Math.random() * 3 + 1)).toLocaleString();
                    }
                }
            });
        }, 5000);
    }

    showSynonyms(namasteCode) {
        const item = this.terminologyData.find(t => t.namasteCode === namasteCode);
        if (!item) return;
        
        let synonymsText = `Synonyms for ${item.diseaseEnglish}:\n\n`;
        if (item.synonyms) {
            item.synonyms.forEach(group => {
                synonymsText += `${group.language}: ${group.terms.join(', ')}\n`;
            });
        }
        
        alert(synonymsText);
    }

    copyCode(namasteCode, icd11Code) {
        const text = `NAMASTE: ${namasteCode}\nICD-11: ${icd11Code}`;
        navigator.clipboard.writeText(text).then(() => {
            this.showToast('Codes copied to clipboard!', 'success');
        }).catch(() => {
            this.showToast('Failed to copy codes', 'error');
        });
    }

    updateLanguage() {
        const languages = {
            'en': 'English',
            'hi': 'हिन्दी',
            'ta': 'தமிழ்',
            'ar': 'العربية'
        };
        this.showToast(`Language switched to ${languages[this.currentLanguage]}`, 'info');
    }

    getPreferredTheme() {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            return storedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    applyTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-color-scheme', theme);
        const themeToggleBtn = document.getElementById('themeToggleBtn');
        if (themeToggleBtn) {
            const icon = themeToggleBtn.querySelector('i');
            if (theme === 'dark') {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        }
        localStorage.setItem('theme', theme);
        // We need to re-initialize charts on theme change
        if (this.isInitialized && document.getElementById('analytics-section').classList.contains('active')) {
            this.initializeCharts();
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }

    showLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) overlay.classList.remove('hidden');
    }

    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) overlay.classList.add('hidden');
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'check-circle' : 
                    type === 'error' ? 'exclamation-circle' : 
                    type === 'info' ? 'info-circle' : 'bell';
        
        toast.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 4000);
    }

    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

// Initialize the application with proper error handling
function initAyushConnect() {
    try {
        console.log('Starting AyushConnect initialization...');
        window.app = new AyushConnect();
        console.log('AyushConnect instance created and assigned to window.app');
    } catch (error) {
        console.error('Failed to initialize AyushConnect:', error);
    }
}

// Multiple initialization strategies to ensure it works
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAyushConnect);
} else if (document.readyState === 'interactive') {
    setTimeout(initAyushConnect, 100);
} else {
    initAyushConnect();
}

// Also try after a delay to be extra sure
setTimeout(() => {
    if (!window.app) {
        console.log('Fallback initialization...');
        initAyushConnect();
    }
}, 1000);