// Language Detection App JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('detection-form');
    const textInput = document.getElementById('text-input');
    const loadingSection = document.getElementById('loading-section');
    const resultsSection = document.getElementById('results-section');
    const errorSection = document.getElementById('error-section');
    const traditionalResults = document.getElementById('traditional-results');
    const pretrainedResults = document.getElementById('pretrained-results');
    const errorMessage = document.getElementById('error-message');

    // Form submission handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const text = textInput.value.trim();
        const method = document.querySelector('input[name="method"]:checked').value;
        const submitButton = document.querySelector('.detect-button');
        
        // Validation
        if (!text) {
            showError('Please enter some text to analyze.');
            return;
        }
        
        if (text.length < 3) {
            showError('Text must be at least 3 characters long for accurate detection.');
            return;
        }
        
        // Show loading state
        submitButton.classList.add('loading');
        submitButton.disabled = true;
        showLoading();
        
        try {
            const response = await fetch('/detect', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text,
                    method: method
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Detection failed');
            }
            
            hideLoading();
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            displayResults(data, method);
            
        } catch (error) {
            hideLoading();
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            showError(error.message);
        }
    });

    function showLoading() {
        loadingSection.style.display = 'block';
        resultsSection.style.display = 'none';
        errorSection.style.display = 'none';
    }

    function hideLoading() {
        loadingSection.style.display = 'none';
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorSection.style.display = 'block';
        resultsSection.style.display = 'none';
        loadingSection.style.display = 'none';
    }

    function displayResults(data, method) {
        // Smooth reveal of results section
        resultsSection.style.opacity = '0';
        resultsSection.style.display = 'block';
        errorSection.style.display = 'none';
        
        // Clear previous results
        traditionalResults.innerHTML = '';
        pretrainedResults.innerHTML = '';
        
        // Show/hide cards based on method
        const traditionalCard = document.getElementById('traditional-card');
        const pretrainedCard = document.getElementById('pretrained-card');
        
        // Add animation classes
        traditionalCard.classList.add('results-enter');
        pretrainedCard.classList.add('results-enter');
        
        // Adjust parent columns for responsive display
        const traditionalCol = traditionalCard.parentElement;
        const pretrainedCol = pretrainedCard.parentElement;
        
        if (method === 'traditional') {
            traditionalCol.style.display = 'block';
            pretrainedCol.style.display = 'none';
            traditionalCol.className = 'col-12 mb-4';
            traditionalCard.className = 'card h-100 results-enter';
        } else if (method === 'pretrained') {
            traditionalCol.style.display = 'none';
            pretrainedCol.style.display = 'block';
            pretrainedCol.className = 'col-12 mb-4';
            pretrainedCard.className = 'card h-100 results-enter';
        } else {
            traditionalCol.style.display = 'block';
            pretrainedCol.style.display = 'block';
            traditionalCol.className = 'col-xl-6 col-lg-12 col-md-12 mb-4';
            pretrainedCol.className = 'col-xl-6 col-lg-12 col-md-12 mb-4';
            traditionalCard.className = 'card h-100 results-enter';
            pretrainedCard.className = 'card h-100 results-enter';
        }
        
        // Display traditional results with staggered animation
        if (data.traditional) {
            setTimeout(() => {
                if (data.traditional.error) {
                    traditionalResults.innerHTML = createErrorDisplay(data.traditional.error);
                } else {
                    traditionalResults.innerHTML = createTraditionalResultDisplay(data.traditional);
                }
                animateElements(traditionalResults);
            }, 200);
        }
        
        // Display pre-trained results with staggered animation
        if (data.pretrained) {
            setTimeout(() => {
                if (data.pretrained.error) {
                    pretrainedResults.innerHTML = createErrorDisplay(data.pretrained.error);
                } else {
                    pretrainedResults.innerHTML = createPretrainedResultDisplay(data.pretrained);
                }
                animateElements(pretrainedResults);
            }, method === 'both' ? 400 : 200);
        }
        
        // Fade in results section
        setTimeout(() => {
            resultsSection.style.opacity = '1';
            resultsSection.style.transition = 'opacity 0.5s ease-in-out';
        }, 100);
        
        // Animate confidence bars and other elements
        setTimeout(() => {
            animateConfidenceBars();
            scrollToResults();
        }, 600);
    }

    function createTraditionalResultDisplay(result) {
        return `
            <div class="language-result text-success">
                <i class="fas fa-flag me-2"></i>
                ${result.language}
            </div>
            <div class="confidence-text mb-3">
                Confidence: <strong>${result.confidence}%</strong>
            </div>
            
            <div class="confidence-meter mb-3">
                <div class="confidence-meter-fill ${getConfidenceClass(result.confidence)}" 
                     style="width: ${result.confidence}%"></div>
            </div>
            
            <div class="method-info mb-3">
                <small class="text-muted">
                    <i class="fas fa-info-circle me-1"></i>
                    ${result.method}
                </small>
            </div>
            
            ${result.analysis ? createAnalysisDisplay(result.analysis) : ''}
        `;
    }

    function createPretrainedResultDisplay(result) {
        return `
            <div class="language-result text-info">
                <i class="fas fa-flag me-2"></i>
                ${result.language}
            </div>
            <div class="confidence-text mb-3">
                Confidence: <strong>${result.confidence}%</strong>
            </div>
            
            <div class="confidence-meter mb-3">
                <div class="confidence-meter-fill ${getConfidenceClass(result.confidence)}" 
                     style="width: ${result.confidence}%"></div>
            </div>
            
            <div class="method-info mb-3">
                <small class="text-muted">
                    <i class="fas fa-info-circle me-1"></i>
                    ${result.method}
                </small>
            </div>
            
            ${result.alternatives ? createAlternativesDisplay(result.alternatives) : ''}
        `;
    }

    function createAnalysisDisplay(analysis) {
        return `
            <div class="analysis-details">
                <h6 class="mb-3">
                    <i class="fas fa-chart-line me-2"></i>
                    N-gram Analysis
                </h6>
                
                <div class="row mb-3">
                    <div class="col-6">
                        <div class="text-center">
                            <div class="h5 text-success">${analysis.total_bigrams}</div>
                            <small class="text-muted">Total Bigrams</small>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="text-center">
                            <div class="h5 text-success">${analysis.unique_bigrams}</div>
                            <small class="text-muted">Unique Bigrams</small>
                        </div>
                    </div>
                </div>
                
                <div class="mb-3">
                    <strong>Most Common Bigrams:</strong>
                    <div class="mt-2">
                        ${analysis.common_bigrams.map(([ngram, count]) => 
                            `<span class="ngram-item">${ngram} (${count})</span>`
                        ).join('')}
                    </div>
                </div>
                
                <div>
                    <strong>Most Common Trigrams:</strong>
                    <div class="mt-2">
                        ${analysis.common_trigrams.map(([ngram, count]) => 
                            `<span class="ngram-item">${ngram} (${count})</span>`
                        ).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    function createAlternativesDisplay(alternatives) {
        return `
            <div class="analysis-details">
                <h6 class="mb-3">
                    <i class="fas fa-list me-2"></i>
                    Alternative Predictions
                </h6>
                
                <div class="alternatives-list">
                    ${alternatives.map((alt, index) => `
                        <div class="alternative-item">
                            <div>
                                <span class="badge bg-secondary me-2">${index + 1}</span>
                                ${alt.language}
                            </div>
                            <div>
                                <span class="badge bg-info">${alt.confidence}%</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    function createErrorDisplay(error) {
        return `
            <div class="alert alert-danger" role="alert">
                <i class="fas fa-exclamation-triangle me-2"></i>
                ${error}
            </div>
        `;
    }

    function getConfidenceClass(confidence) {
        if (confidence >= 80) return 'confidence-high';
        if (confidence >= 60) return 'confidence-medium';
        return 'confidence-low';
    }

    function animateConfidenceBars() {
        const bars = document.querySelectorAll('.confidence-meter-fill');
        bars.forEach((bar, index) => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
                bar.style.transform = 'scaleX(1)';
            }, 100 + (index * 200));
        });
    }

    function animateElements(container) {
        const elements = container.querySelectorAll('.language-result, .confidence-text, .method-info, .analysis-details > *');
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(10px)';
            setTimeout(() => {
                element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    function scrollToResults() {
        const resultsTop = resultsSection.offsetTop - 100;
        window.scrollTo({
            top: resultsTop,
            behavior: 'smooth'
        });
    }

    // Add floating particles effect
    function createFloatingParticles() {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'floating-particles';
        particleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        `;
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: rgba(102, 126, 234, ${Math.random() * 0.3 + 0.1});
                border-radius: 50%;
                animation: float ${Math.random() * 10 + 10}s infinite ease-in-out;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 5}s;
            `;
            particleContainer.appendChild(particle);
        }
        
        document.body.appendChild(particleContainer);
    }

    // Add sample text buttons for demonstration
    const sampleTexts = [
        { text: "Bonjour tout le monde, comment allez-vous aujourd'hui?", label: "French Sample" },
        { text: "Hola amigo, ¿cómo estás? Espero que tengas un buen día.", label: "Spanish Sample" },
        { text: "これは日本語のサンプルテキストです。今日はとても良い天気ですね。", label: "Japanese Sample" },
        { text: "Hello world, this is a sample text in English for testing purposes.", label: "English Sample" },
        { text: "Привет мир, это образец текста на русском языке для тестирования.", label: "Russian Sample" }
    ];

    // Add sample text buttons
    const sampleButtonsContainer = document.createElement('div');
    sampleButtonsContainer.className = 'mt-3';
    sampleButtonsContainer.innerHTML = `
        <div class="d-flex flex-wrap gap-2">
            <small class="text-muted me-2 align-self-center">Quick samples:</small>
            ${sampleTexts.map(sample => `
                <button type="button" class="btn btn-outline-secondary btn-sm sample-btn" 
                        data-text="${sample.text.replace(/"/g, '&quot;')}">
                    ${sample.label}
                </button>
            `).join('')}
        </div>
    `;
    
    textInput.parentNode.appendChild(sampleButtonsContainer);

    // Add event listeners for sample buttons with enhanced animation
    document.querySelectorAll('.sample-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Type animation effect
            const targetText = this.dataset.text;
            textInput.value = '';
            textInput.focus();
            
            let currentIndex = 0;
            const typingInterval = setInterval(() => {
                if (currentIndex < targetText.length) {
                    textInput.value += targetText[currentIndex];
                    currentIndex++;
                } else {
                    clearInterval(typingInterval);
                    // Add a subtle flash effect when typing is complete
                    textInput.style.boxShadow = '0 0 10px rgba(102, 126, 234, 0.5)';
                    setTimeout(() => {
                        textInput.style.boxShadow = '';
                    }, 300);
                }
            }, 30);
        });
    });

    // Initialize floating particles
    createFloatingParticles();

    // Add smooth scroll behavior for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add form input validation with real-time feedback
    textInput.addEventListener('input', function() {
        const length = this.value.trim().length;
        const formText = this.parentNode.querySelector('.form-text');
        
        if (length < 3 && length > 0) {
            formText.style.color = '#dc3545';
            formText.innerHTML = `<i class="fas fa-exclamation-circle me-1"></i>Need ${3 - length} more characters for accurate detection.`;
        } else if (length >= 3) {
            formText.style.color = '#28a745';
            formText.innerHTML = `<i class="fas fa-check-circle me-1"></i>Text length is good for detection (${length} characters).`;
        } else {
            formText.style.color = '';
            formText.innerHTML = 'Minimum 3 characters required for accurate detection.';
        }
    });

    // Responsive handling for method selection
    function updateMethodLabels() {
        const isMobile = window.innerWidth <= 576;
        const methodLabels = document.querySelectorAll('.form-check-label span');
        
        methodLabels.forEach(span => {
            if (isMobile) {
                span.classList.add('d-block');
                span.classList.remove('d-sm-inline');
            } else {
                span.classList.remove('d-block');
                span.classList.add('d-sm-inline');
            }
        });
    }

    // Handle window resize for responsive updates
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateMethodLabels();
            // Re-adjust results layout if displayed
            if (resultsSection.style.display !== 'none') {
                const method = document.querySelector('input[name="method"]:checked').value;
                adjustResultsLayout(method);
            }
        }, 250);
    });

    function adjustResultsLayout(method) {
        const traditionalCol = document.getElementById('traditional-card').parentElement;
        const pretrainedCol = document.getElementById('pretrained-card').parentElement;
        
        if (window.innerWidth <= 1200 && method === 'both') {
            // Stack vertically on smaller screens
            traditionalCol.className = 'col-12 mb-4';
            pretrainedCol.className = 'col-12 mb-4';
        } else if (method === 'both') {
            // Side by side on larger screens
            traditionalCol.className = 'col-xl-6 col-lg-12 col-md-12 mb-4';
            pretrainedCol.className = 'col-xl-6 col-lg-12 col-md-12 mb-4';
        }
    }

    // Initialize responsive features
    updateMethodLabels();
});

// Add CSS for floating particles animation
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.3;
        }
        25% {
            transform: translateY(-20px) rotate(90deg);
            opacity: 0.6;
        }
        50% {
            transform: translateY(-40px) rotate(180deg);
            opacity: 1;
        }
        75% {
            transform: translateY(-20px) rotate(270deg);
            opacity: 0.6;
        }
    }
`;
document.head.appendChild(style);
