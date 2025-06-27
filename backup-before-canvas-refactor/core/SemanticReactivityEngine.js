/**
 * SemanticReactivityEngine.js - Sentiment Analysis Drives Visual Parameters
 * 
 * Analyzes text content and user interaction patterns to drive visual parameter changes.
 * Creates an emotional-responsive interface where content sentiment directly influences
 * the visual system behavior, making the interface feel emotionally intelligent.
 * 
 * Architecture: Content Analysis → Emotional Mapping → Visual Parameter Updates
 */

class SemanticReactivityEngine {
    constructor(homeMaster, reactivityBridge) {
        console.log('🧠 SemanticReactivityEngine - Emotion-driven visuals initializing...');
        
        this.homeMaster = homeMaster;
        this.reactivityBridge = reactivityBridge;
        
        // Emotional state tracking
        this.emotionalState = {
            valence: 0.0,        // Positive/negative sentiment (-1.0 to 1.0)
            arousal: 0.0,        // Energy/intensity level (0.0 to 1.0)
            dominance: 0.0,      // Control/confidence level (0.0 to 1.0)
            engagement: 0.0,     // User engagement level (0.0 to 1.0)
            coherence: 1.0,      // Emotional stability (0.0 to 1.0)
            
            // Content-specific emotions
            technical: 0.0,      // Technical content density
            creative: 0.0,       // Creative/artistic content
            urgency: 0.0,        // Time-sensitive content
            complexity: 0.0      // Cognitive complexity level
        };
        
        // Sentiment analysis patterns (simplified for production)
        this.sentimentPatterns = {
            positive: /\b(amazing|awesome|excellent|fantastic|great|love|perfect|wonderful|brilliant|outstanding|superb|magnificent|incredible|spectacular|phenomenal|marvelous|exceptional|extraordinary|remarkable|impressive|stunning|beautiful|elegant|powerful|innovative|groundbreaking|revolutionary|cutting-edge|exciting|thrilling|delightful|charming|inspiring|motivating|uplifting|encouraging|optimistic|confident|successful|achievement|victory|triumph|celebration|joy|happiness|euphoria|bliss|satisfaction|fulfillment|prosperity|abundance|freedom|liberation|empowerment|breakthrough|solution|improvement|enhancement|upgrade|evolution|progress|advancement|development|growth|expansion|success|win|benefit|advantage|opportunity|potential|possibility|hope|future|vision|dream|aspiration|goal|mission|purpose|meaning|significance|value|worth|quality|excellence|mastery|expertise|skill|talent|ability|capability|strength|power|energy|vitality|passion|enthusiasm|excitement|anticipation|eagerness|curiosity|interest|fascination|wonder|awe|admiration|respect|appreciation|gratitude|thankfulness|blessing|gift|treasure|gem|diamond|gold|platinum|premium|luxury|exclusive|unique|special|rare|precious)\b/gi,
            
            negative: /\b(awful|terrible|horrible|bad|worst|hate|disgusting|revolting|appalling|dreadful|atrocious|abysmal|pathetic|useless|worthless|pointless|meaningless|hopeless|helpless|desperate|frustrated|annoyed|irritated|angry|furious|enraged|livid|outraged|disgusted|disappointed|dissatisfied|unhappy|sad|depressed|miserable|devastated|heartbroken|broken|shattered|crushed|defeated|failed|failure|disaster|catastrophe|crisis|problem|issue|trouble|difficulty|challenge|obstacle|barrier|hindrance|impediment|setback|delay|interruption|disruption|chaos|confusion|mess|disorder|complexity|complication|struggle|fight|battle|war|conflict|tension|stress|pressure|burden|weight|load|strain|exhaustion|fatigue|tiredness|weakness|frailty|vulnerability|insecurity|uncertainty|doubt|fear|anxiety|worry|concern|panic|terror|horror|nightmare|threat|danger|risk|hazard|warning|alert|emergency|urgent|critical|serious|severe|extreme|intense|overwhelming|unbearable|intolerable|unacceptable|inappropriate|wrong|incorrect|false|fake|artificial|superficial|shallow|empty|hollow|void|missing|absent|lacking|insufficient|inadequate|incomplete|unfinished|broken|damaged|corrupted|infected|poisoned|toxic|harmful|destructive|dangerous|risky|unsafe|insecure|unstable|unreliable|untrustworthy|suspicious|questionable|dubious|uncertain|unclear|confusing|ambiguous|vague|obscure|hidden|secret|mysterious|unknown|unfamiliar|strange|weird|odd|bizarre|abnormal|unusual|unexpected|surprising|shocking|startling|alarming|disturbing|troubling|concerning|worrying|frightening|scary|terrifying|horrifying|nightmarish)\b/gi,
            
            technical: /\b(API|algorithm|architecture|backend|blockchain|cache|cloud|code|compiler|cryptography|database|deployment|DevOps|Docker|framework|frontend|GraphQL|infrastructure|JavaScript|Kubernetes|machine learning|microservices|optimization|protocol|query|REST|SDK|server|TypeScript|webhook|authentication|authorization|configuration|debugging|documentation|encryption|integration|monitoring|performance|scalability|security|testing|validation|automation|continuous integration|continuous deployment|artificial intelligence|data science|neural network|deep learning|natural language processing|computer vision|robotics|internet of things|augmented reality|virtual reality|quantum computing|distributed systems|load balancing|fault tolerance|high availability|disaster recovery|version control|git|repository|commit|merge|branch|pull request|code review|refactoring|technical debt|legacy system|migration|upgrade|modernization|digital transformation|agile|scrum|kanban|sprint|backlog|user story|acceptance criteria|definition of done|minimum viable product|proof of concept|prototype|beta|alpha|production|staging|development|environment|container|orchestration|service mesh|API gateway|message queue|event streaming|data pipeline|ETL|data warehouse|data lake|analytics|business intelligence|dashboard|metrics|KPI|ROI|SLA|uptime|downtime|latency|throughput|bandwidth|storage|compute|networking|firewall|VPN|SSL|TLS|HTTPS|OAuth|JWT|session|cookie|CORS|CSRF|XSS|SQL injection|penetration testing|vulnerability|threat|risk assessment|compliance|GDPR|HIPAA|SOC|ISO|audit|governance|privacy|consent|opt-in|opt-out)\b/gi,
            
            creative: /\b(art|artistic|beauty|creative|creativity|design|elegant|aesthetic|visual|imagination|innovative|inspiration|original|unique|style|stylish|gorgeous|stunning|magnificent|brilliant|vibrant|colorful|dynamic|fluid|organic|flowing|graceful|harmony|balance|composition|symmetry|asymmetry|contrast|texture|pattern|rhythm|movement|energy|life|soul|spirit|emotion|feeling|passion|expression|artistic expression|visual language|creative process|brainstorming|ideation|conceptual|abstract|surreal|dreamlike|fantastical|magical|mystical|enchanting|captivating|mesmerizing|hypnotic|transcendent|transformative|evocative|expressive|communicative|storytelling|narrative|journey|adventure|exploration|discovery|revelation|insight|enlightenment|awakening|consciousness|awareness|mindfulness|presence|flow state|zone|focus|concentration|attention|intention|purpose|meaning|significance|depth|layers|complexity|nuance|subtlety|sophistication|refinement|polish|craftsmanship|artistry|mastery|skill|talent|genius|virtuosity|excellence|perfection|flawless|seamless|effortless|natural|intuitive|instinctive|spontaneous|improvisation|experimentation|innovation|invention|creation|generation|production|manifestation|realization|actualization|embodiment|incarnation|materialization|visualization|representation|interpretation|translation|adaptation|transformation|metamorphosis|evolution|development|growth|expansion|enhancement|improvement|optimization|refinement|iteration|version|variant|alternative|option|possibility|potential|opportunity|chance|luck|fortune|destiny|fate|serendipity|synchronicity|magic|miracle|wonder|awe|amazement|astonishment|surprise|delight|joy|pleasure|satisfaction|fulfillment|contentment|peace|tranquility|serenity|calm|stillness|silence|space|void|emptiness|fullness|abundance|richness|wealth|treasure|gift|blessing|grace|beauty|truth|goodness|love|compassion|empathy|understanding|wisdom|knowledge|learning|education|teaching|sharing|giving|receiving|exchange|dialogue|conversation|communication|connection|relationship|bond|unity|oneness|wholeness|completeness|integration|synthesis|fusion|merger|combination|collaboration|cooperation|teamwork|partnership|alliance|community|collective|group|tribe|family|home|belonging|acceptance|inclusion|diversity|variety|difference|uniqueness|individuality|personality|character|identity|self|essence|core|heart|center|foundation|root|source|origin|beginning|start|birth|creation|genesis|alpha|omega|end|completion|conclusion|closure|resolution|solution|answer|key|secret|mystery|puzzle|riddle|question|inquiry|search|quest|journey|path|way|road|direction|destination|goal|target|objective|purpose|mission|vision|dream|aspiration|hope|faith|trust|confidence|certainty|clarity|understanding|comprehension|realization|recognition|acknowledgment|appreciation|gratitude|thankfulness|reverence|respect|honor|dignity|worth|value|importance|significance|relevance|meaning|purpose|function|role|responsibility|duty|obligation|commitment|dedication|devotion|loyalty|faithfulness|constancy|steadiness|stability|reliability|dependability|trustworthiness|integrity|honesty|authenticity|genuineness|sincerity|truth|reality|actuality|fact|evidence|proof|demonstration|illustration|example|instance|case|situation|circumstance|condition|state|status|position|place|location|context|environment|setting|atmosphere|mood|tone|feeling|emotion|sentiment|attitude|perspective|viewpoint|opinion|belief|conviction|philosophy|ideology|principle|value|standard|criterion|measure|metric|benchmark|reference|guide|direction|instruction|advice|suggestion|recommendation|proposal|idea|concept|notion|thought|reflection|contemplation|meditation|introspection|self-reflection|self-awareness|consciousness|mindfulness|presence|attention|focus|concentration|dedication|commitment|devotion|passion|enthusiasm|excitement|energy|vitality|life|spirit|soul|essence|being|existence|reality|truth|authenticity|genuine|real|actual|concrete|tangible|physical|material|substantial|solid|strong|powerful|mighty|potent|effective|efficient|productive|successful|triumphant|victorious|winning|achieving|accomplishing|fulfilling|satisfying|rewarding|beneficial|advantageous|favorable|positive|good|excellent|outstanding|exceptional|extraordinary|remarkable|impressive|stunning|amazing|awesome|fantastic|wonderful|marvelous|magnificent|spectacular|phenomenal|incredible|unbelievable|astonishing|astounding|breathtaking|awe-inspiring|mind-blowing|game-changing|revolutionary|groundbreaking|innovative|cutting-edge|state-of-the-art|advanced|sophisticated|complex|intricate|detailed|elaborate|comprehensive|thorough|complete|full|total|entire|whole|unified|integrated|cohesive|consistent|coherent|logical|rational|reasonable|sensible|practical|useful|helpful|valuable|worthwhile|meaningful|significant|important|essential|crucial|vital|necessary|required|needed|wanted|desired|sought|requested|demanded|popular|trending|viral|influential|impactful|effective|powerful|strong|robust|solid|stable|secure|safe|protected|defended|guarded|shielded|covered|supported|backed|endorsed|approved|accepted|welcomed|embraced|adopted|chosen|selected|preferred|favored|liked|loved|adored|cherished|treasured|valued|appreciated|respected|honored|revered|worshipped|idolized|admired|praised|acclaimed|celebrated|recognized|acknowledged|credited|awarded|rewarded|compensated|paid|funded|sponsored|invested|supported|helped|assisted|aided|facilitated|enabled|empowered|strengthened|enhanced|improved|upgraded|optimized|refined|polished|perfected|completed|finished|done|accomplished|achieved|fulfilled|satisfied|content|happy|joyful|delighted|pleased|glad|cheerful|upbeat|positive|optimistic|hopeful|confident|assured|certain|sure|convinced|determined|resolute|decisive|committed|dedicated|devoted|loyal|faithful|true|honest|sincere|genuine|authentic|real|actual|factual|accurate|correct|right|proper|appropriate|suitable|fitting|perfect|ideal|optimal|best|top|supreme|ultimate|final|conclusive|definitive|authoritative|official|formal|legitimate|valid|legal|lawful|permissible|allowed|permitted|authorized|approved|sanctioned|endorsed|supported|backed|confirmed|verified|validated|proven|tested|tried|reliable|dependable|trustworthy|credible|believable|convincing|persuasive|compelling|attractive|appealing|charming|engaging|interesting|fascinating|intriguing|captivating|enchanting|enthralling|spellbinding|mesmerizing|hypnotic|magnetic|irresistible|compelling|urgent|pressing|immediate|instant|quick|fast|rapid|swift|speedy|efficient|effective|productive|successful|fruitful|profitable|beneficial|advantageous|favorable|positive|good|great|excellent|outstanding|exceptional|extraordinary|remarkable|impressive|stunning|amazing|awesome|fantastic|wonderful|marvelous|magnificent|spectacular|phenomenal|incredible|unbelievable|astonishing|astounding|breathtaking|awe-inspiring|mind-blowing)\b/gi,
            
            urgency: /\b(urgent|emergency|critical|immediate|now|asap|deadline|time-sensitive|breaking|alert|warning|crisis|disaster|failure|problem|issue|bug|error|fix|repair|restore|recover|rescue|save|help|support|assistance|action required|must|need|require|essential|crucial|vital|important|priority|high priority|top priority|urgent priority|time-critical|time-bound|limited time|expiring|expires|due|overdue|late|delay|postpone|reschedule|cancel|abort|stop|halt|pause|wait|hold|pending|suspended|blocked|stuck|frozen|locked|jammed|broken|damaged|corrupted|infected|compromised|vulnerable|exposed|at risk|dangerous|risky|unsafe|insecure|unstable|unreliable|failing|declining|deteriorating|worsening|escalating|intensifying|accelerating|speeding up|rushing|hurrying|racing|running|sprinting|dashing|flying|zooming|fast|quick|rapid|swift|speedy|instant|instantaneous|immediate|prompt|timely|punctual|on time|in time|just in time|last minute|final|ultimate|end|conclusion|finish|complete|done|over|finished|ended|concluded|closed|sealed|locked|secured|protected|safe|sound|stable|solid|strong|robust|reliable|dependable|trustworthy|guaranteed|assured|certain|sure|confident|positive|definite|absolute|complete|total|full|entire|whole|comprehensive|thorough|extensive|detailed|elaborate|complex|complicated|difficult|challenging|hard|tough|demanding|requiring|needing|wanting|seeking|looking for|searching|hunting|pursuing|chasing|following|tracking|monitoring|watching|observing|checking|inspecting|examining|investigating|analyzing|studying|researching|exploring|discovering|finding|locating|identifying|recognizing|detecting|spotting|noticing|seeing|viewing|looking|glancing|staring|gazing|focusing|concentrating|paying attention|listening|hearing|understanding|comprehending|grasping|getting|catching|realizing|recognizing|acknowledging|accepting|agreeing|approving|endorsing|supporting|backing|helping|assisting|aiding|facilitating|enabling|empowering|strengthening|enhancing|improving|upgrading|optimizing|refining|polishing|perfecting|completing|finishing|ending|concluding|closing|sealing|locking|securing|protecting|defending|guarding|shielding|covering|hiding|concealing|masking|disguising|camouflaging|obscuring|blocking|preventing|stopping|halting|pausing|delaying|postponing|rescheduling|canceling|aborting|terminating|ending|finishing|completing|concluding|closing|finalizing|wrapping up|summing up|summarizing|recapping|reviewing|reflecting|thinking|considering|pondering|contemplating|meditating|introspecting|examining|analyzing|evaluating|assessing|judging|deciding|choosing|selecting|picking|opting|preferring|favoring|liking|loving|adoring|cherishing|treasuring|valuing|appreciating|respecting|honoring|revering|worshipping|idolizing|admiring|praising|complimenting|congratulating|celebrating|acknowledging|recognizing|crediting|rewarding|compensating|paying|funding|sponsoring|investing|supporting|helping|assisting|aiding|facilitating|enabling|empowering|strengthening|enhancing|improving|upgrading|optimizing|refining|polishing|perfecting)\b/gi
        };
        
        // Emotional parameter mappings
        this.emotionalMappings = {
            valence: {
                parameter: 'baseColor',
                mapping: (value) => {
                    // Positive = warmer colors, Negative = cooler colors
                    if (value > 0) {
                        return {hueShift: value * 60, saturation: 1.0 + value * 0.3}; // Warm (yellow-red)
                    } else {
                        return {hueShift: value * 60 + 240, saturation: 1.0 + Math.abs(value) * 0.2}; // Cool (blue-purple)
                    }
                }
            },
            arousal: {
                parameter: 'speed',
                mapping: (value) => 0.3 + value * 1.2 // 0.3 to 1.5 speed range
            },
            dominance: {
                parameter: 'dimension',
                mapping: (value) => 3.2 + value * 0.6 // 3.2 to 3.8 dimension range
            },
            engagement: {
                parameter: 'intensity',
                mapping: (value) => 0.4 + value * 0.5 // 0.4 to 0.9 intensity range
            },
            technical: {
                parameter: 'geometry',
                mapping: (value) => value > 0.5 ? 1.0 : 0.0 // Tetrahedron vs Hypercube
            },
            creative: {
                parameter: 'morphFactor',
                mapping: (value) => 0.2 + value * 0.6 // 0.2 to 0.8 morph range
            },
            urgency: {
                parameter: 'glitchIntensity',
                mapping: (value) => value * 0.8 // 0.0 to 0.8 glitch range
            },
            complexity: {
                parameter: 'density',
                mapping: (value) => 0.8 + value * 0.4 // 0.8 to 1.2 density range
            }
        };
        
        // Content analysis state
        this.contentAnalysis = {
            lastAnalyzedText: '',
            analysisCache: new Map(),
            analysisHistory: [],
            maxHistoryLength: 50
        };
        
        // Interaction pattern tracking
        this.interactionPatterns = {
            scrollVelocityHistory: [],
            clickFrequency: 0,
            dwellTimes: [],
            focusChanges: 0,
            lastInteractionTime: performance.now()
        };
        
        this.initialize();
    }
    
    initialize() {
        this.setupContentAnalysis();
        this.setupInteractionTracking();
        this.startEmotionalUpdateLoop();
        
        console.log('✅ SemanticReactivityEngine initialized - Emotion-driven visuals active');
    }
    
    setupContentAnalysis() {
        // Analyze visible text content automatically
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    this.scheduleContentAnalysis();
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
        
        // Initial content analysis
        this.scheduleContentAnalysis();
    }
    
    scheduleContentAnalysis() {
        // Debounce content analysis to avoid excessive processing
        clearTimeout(this.contentAnalysisTimeout);
        this.contentAnalysisTimeout = setTimeout(() => {
            this.analyzeVisibleContent();
        }, 500);
    }
    
    analyzeVisibleContent() {
        const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, article, .article-title, .article-excerpt, .blog-subtitle');
        let combinedText = '';
        
        textElements.forEach(element => {
            if (this.isElementVisible(element)) {
                combinedText += element.textContent + ' ';
            }
        });
        
        combinedText = combinedText.trim();
        
        if (combinedText !== this.contentAnalysis.lastAnalyzedText && combinedText.length > 20) {
            const sentiment = this.analyzeSentiment(combinedText);
            this.updateEmotionalState(sentiment);
            
            this.contentAnalysis.lastAnalyzedText = combinedText;
            this.contentAnalysis.analysisHistory.push({
                text: combinedText.substring(0, 100) + '...',
                sentiment: sentiment,
                timestamp: performance.now()
            });
            
            if (this.contentAnalysis.analysisHistory.length > this.contentAnalysis.maxHistoryLength) {
                this.contentAnalysis.analysisHistory.shift();
            }
        }
    }
    
    isElementVisible(element) {
        const rect = element.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    }
    
    analyzeSentiment(text) {
        const cacheKey = this.hashText(text);
        if (this.contentAnalysis.analysisCache.has(cacheKey)) {
            return this.contentAnalysis.analysisCache.get(cacheKey);
        }
        
        const analysis = {
            valence: this.calculateValence(text),
            arousal: this.calculateArousal(text),
            dominance: this.calculateDominance(text),
            engagement: this.calculateEngagement(text),
            technical: this.calculateTechnical(text),
            creative: this.calculateCreative(text),
            urgency: this.calculateUrgency(text),
            complexity: this.calculateComplexity(text)
        };
        
        this.contentAnalysis.analysisCache.set(cacheKey, analysis);
        return analysis;
    }
    
    calculateValence(text) {
        const positiveMatches = (text.match(this.sentimentPatterns.positive) || []).length;
        const negativeMatches = (text.match(this.sentimentPatterns.negative) || []).length;
        const totalWords = text.split(/\s+/).length;
        
        if (totalWords === 0) return 0.0;
        
        const positiveRatio = positiveMatches / totalWords;
        const negativeRatio = negativeMatches / totalWords;
        
        return Math.max(-1.0, Math.min(1.0, (positiveRatio - negativeRatio) * 10));
    }
    
    calculateArousal(text) {
        const intensity = (text.match(/[!?]{1,3}|[A-Z]{3,}|\b(amazing|incredible|explosive|intense|powerful|extreme|massive|huge|enormous|gigantic|spectacular|phenomenal|extraordinary|remarkable|outstanding|exceptional|breakthrough|revolutionary|game-changing|mind-blowing|cutting-edge|state-of-the-art|next-level|world-class|best-in-class|top-tier|premium|luxury|exclusive|ultimate|supreme|maximum|optimal|perfect|flawless|seamless|effortless|smooth|fast|quick|rapid|instant|immediate|lightning|blazing|turbo|super|hyper|mega|ultra|supreme|ultimate|infinite|unlimited|boundless|endless|eternal|everlasting|permanent|lasting|durable|robust|strong|powerful|mighty|potent|dynamic|energetic|vibrant|lively|active|engaged|excited|thrilled|ecstatic|euphoric|elated|overjoyed|delighted|pleased|satisfied|content|happy|joyful|blissful|serene|peaceful|calm|tranquil|relaxed|comfortable|cozy|warm|inviting|welcoming|friendly|kind|gentle|soft|smooth|silky|luxurious|elegant|sophisticated|refined|polished|sleek|stylish|chic|trendy|fashionable|modern|contemporary|current|up-to-date|latest|newest|fresh|new|novel|original|unique|distinctive|special|rare|precious|valuable|worthwhile|meaningful|significant|important|essential|crucial|vital|necessary|required|needed|wanted|desired|sought|popular|trending|viral|hot|cool|awesome|fantastic|wonderful|marvelous|magnificent|spectacular|brilliant|genius|clever|smart|intelligent|wise|knowledgeable|experienced|skilled|talented|gifted|expert|professional|qualified|certified|licensed|authorized|approved|validated|verified|confirmed|proven|tested|reliable|dependable|trustworthy|credible|authentic|genuine|real|true|honest|sincere|transparent|open|clear|obvious|evident|apparent|visible|noticeable|remarkable|notable|noteworthy|memorable|unforgettable|impressive|striking|stunning|breathtaking|awe-inspiring|mind-boggling|jaw-dropping|eye-opening|enlightening|inspiring|motivating|encouraging|uplifting|empowering|liberating|freeing|releasing|unleashing|unlocking|opening|revealing|exposing|uncovering|discovering|finding|solving|resolving|fixing|healing|curing|treating|helping|supporting|assisting|aiding|facilitating|enabling|empowering|strengthening|enhancing|improving|upgrading|optimizing|maximizing|boosting|accelerating|speeding|rushing|hurrying|racing|flying|soaring|climbing|rising|ascending|elevating|lifting|raising|increasing|growing|expanding|developing|evolving|progressing|advancing|moving|shifting|changing|transforming|converting|adapting|adjusting|modifying|updating|refreshing|renewing|revitalizing|rejuvenating|restoring|recovering|bouncing|rebounding|returning|coming|arriving|reaching|achieving|accomplishing|fulfilling|completing|finishing|succeeding|winning|triumphing|conquering|dominating|ruling|leading|directing|guiding|mentoring|teaching|educating|training|coaching|developing|building|creating|making|producing|generating|manufacturing|constructing|assembling|organizing|planning|designing|engineering|architecting|developing|programming|coding|scripting|automating|optimizing|streamlining|simplifying|clarifying|explaining|illustrating|demonstrating|showing|presenting|displaying|exhibiting|featuring|highlighting|emphasizing|stressing|underlining|pointing|indicating|suggesting|recommending|proposing|offering|providing|supplying|delivering|giving|sharing|contributing|participating|engaging|involving|including|incorporating|integrating|combining|merging|uniting|connecting|linking|joining|binding|bonding|attaching|fastening|securing|protecting|defending|guarding|shielding|covering|wrapping|enclosing|surrounding|embracing|hugging|holding|grasping|gripping|clutching|catching|capturing|seizing|grabbing|taking|getting|obtaining|acquiring|gaining|earning|achieving|reaching|attaining|accomplishing|fulfilling|realizing|actualizing|materializing|manifesting|embodying|expressing|communicating|conveying|transmitting|broadcasting|publishing|releasing|launching|debuting|introducing|presenting|unveiling|revealing|announcing|declaring|proclaiming|stating|saying|telling|speaking|talking|discussing|conversing|chatting|interacting|socializing|networking|connecting|relating|bonding|befriending|loving|caring|nurturing|supporting|helping|assisting|serving|contributing|giving|donating|sharing|spreading|distributing|disseminating|propagating|promoting|advertising|marketing|selling|trading|exchanging|swapping|switching|changing|altering|modifying|adjusting|tuning|calibrating|configuring|setting|establishing|founding|starting|beginning|initiating|launching|kickstarting|bootstrapping|jumpstarting|catalyzing|triggering|sparking|igniting|lighting|illuminating|brightening|shining|glowing|radiating|emitting|projecting|reflecting|mirroring|echoing|resonating|vibrating|pulsing|beating|throbbing|pumping|flowing|streaming|rushing|gushing|pouring|flooding|overflowing|abundant|plentiful|rich|wealthy|prosperous|successful|thriving|flourishing|blooming|blossoming|growing|expanding|developing|evolving|progressing|advancing|improving|enhancing|upgrading|optimizing|perfecting|mastering|excelling|outperforming|surpassing|exceeding|transcending|rising|ascending|climbing|soaring|flying|floating|drifting|gliding|sliding|slipping|moving|flowing|dancing|swaying|swinging|rocking|rolling|spinning|rotating|revolving|circling|orbiting|cycling|repeating|recurring|returning|coming|going|traveling|journeying|exploring|adventuring|discovering|finding|searching|seeking|looking|hunting|pursuing|chasing|following|tracking|monitoring|watching|observing|studying|examining|investigating|analyzing|evaluating|assessing|measuring|calculating|computing|processing|handling|managing|controlling|directing|leading|guiding|steering|navigating|piloting|driving|operating|running|executing|performing|delivering|producing|creating|making|building|constructing|developing|designing|planning|organizing|arranging|coordinating|synchronizing|harmonizing|balancing|stabilizing|securing|protecting|maintaining|preserving|conserving|saving|storing|keeping|holding|retaining|containing|housing|sheltering|harboring|hosting|accommodating|welcoming|inviting|attracting|drawing|pulling|magnetizing|captivating|enchanting|charming|delighting|pleasing|satisfying|fulfilling|rewarding|gratifying|enriching|enhancing|improving|bettering|upgrading|advancing|progressing|developing|growing|expanding|increasing|multiplying|amplifying|magnifying|enlarging|extending|stretching|reaching|spanning|covering|encompassing|including|incorporating|embracing|adopting|accepting|welcoming|receiving|getting|obtaining|acquiring|gaining|earning|winning|achieving|accomplishing|succeeding|triumphing|conquering|overcoming|defeating|beating|surpassing|exceeding|outperforming|excelling|mastering|perfecting|optimizing|maximizing|boosting|enhancing|improving|upgrading|advancing|progressing|developing|growing|expanding|evolving|transforming|changing|shifting|moving|flowing|streaming|rushing|racing|flying|soaring|climbing|rising|ascending|elevating|lifting|raising|increasing|growing|expanding|developing|evolving|progressing|advancing)\b/gi) || []).length;
        const wordCount = text.split(/\s+/).length;
        
        return Math.min(1.0, intensity / wordCount * 5);
    }
    
    calculateDominance(text) {
        const dominanceWords = (text.match(/\b(control|master|lead|command|direct|manage|rule|dominate|conquer|achieve|succeed|win|triumph|overcome|defeat|power|strength|authority|confidence|certain|sure|definite|absolute|complete|total|full|perfect|optimal|best|top|supreme|ultimate|expert|professional|skilled|talented|experienced|proven|reliable|trustworthy|guaranteed|assured|secure|stable|solid|strong|robust|effective|efficient|successful|productive|profitable|beneficial|valuable|important|essential|crucial|vital|necessary|required|advanced|sophisticated|premium|luxury|exclusive|superior|excellent|outstanding|exceptional|extraordinary|remarkable|impressive|amazing|incredible|fantastic|wonderful|brilliant|genius|innovative|revolutionary|groundbreaking|cutting-edge|state-of-the-art|world-class|industry-leading|market-leading|award-winning|recognized|certified|validated|verified|approved|endorsed|recommended|preferred|chosen|selected|featured|highlighted|showcased|demonstrated|proven|tested|established|founded|built|created|developed|designed|engineered|architected|constructed|manufactured|produced|delivered|provided|supplied|offered|available|accessible|ready|prepared|equipped|enabled|empowered|authorized|licensed|qualified|certified|trained|educated|experienced|skilled|expert|professional|specialized|focused|dedicated|committed|devoted|loyal|faithful|true|honest|genuine|authentic|real|actual|factual|accurate|correct|precise|exact|specific|detailed|comprehensive|thorough|complete|full|total|entire|whole|universal|global|worldwide|international|national|regional|local|community|public|open|free|available|accessible|inclusive|diverse|varied|multiple|numerous|many|several|various|different|unique|special|distinctive|original|creative|innovative|inventive|imaginative|visionary|forward-thinking|progressive|modern|contemporary|current|latest|newest|fresh|new|recent|updated|upgraded|improved|enhanced|optimized|refined|polished|perfected|flawless|seamless|smooth|effortless|easy|simple|straightforward|clear|obvious|evident|apparent|visible|transparent|open|honest|direct|frank|candid|sincere|genuine|authentic|real|true|factual|accurate|reliable|dependable|trustworthy|credible|believable|convincing|persuasive|compelling|influential|impactful|powerful|effective|successful|productive|efficient|fast|quick|rapid|swift|instant|immediate|prompt|timely|punctual|organized|systematic|methodical|logical|rational|reasonable|sensible|practical|useful|helpful|beneficial|valuable|worthwhile|meaningful|significant|important|essential|necessary|required|fundamental|basic|core|central|primary|main|principal|key|critical|crucial|vital|indispensable|irreplaceable|unique|one-of-a-kind|exclusive|rare|precious|valuable|priceless|invaluable|treasured|cherished|beloved|admired|respected|honored|celebrated|praised|acclaimed|recognized|acknowledged|appreciated|grateful|thankful|blessed|fortunate|lucky|successful|prosperous|wealthy|rich|abundant|plentiful|generous|kind|caring|loving|compassionate|empathetic|understanding|supportive|helpful|encouraging|inspiring|motivating|uplifting|positive|optimistic|hopeful|confident|assured|certain|sure|determined|resolute|decisive|committed|dedicated|devoted|passionate|enthusiastic|excited|eager|motivated|driven|ambitious|goal-oriented|focused|concentrated|attentive|mindful|aware|conscious|present|engaged|involved|active|energetic|dynamic|vibrant|lively|spirited|animated|expressive|communicative|articulate|eloquent|persuasive|influential|charismatic|magnetic|attractive|appealing|charming|engaging|interesting|fascinating|captivating|mesmerizing|hypnotic|spellbinding|enchanting|magical|mystical|mysterious|intriguing|compelling|irresistible|undeniable|unquestionable|indisputable|undoubted|certain|sure|definite|absolute|complete|total|perfect|flawless|ideal|optimal|best|finest|greatest|highest|top|supreme|ultimate|maximum|peak|pinnacle|summit|apex|zenith|climax|culmination|achievement|accomplishment|success|victory|triumph|win|breakthrough|milestone|landmark|turning point|pivotal|crucial|critical|essential|fundamental|vital|important|significant|meaningful|valuable|worthwhile|beneficial|advantageous|favorable|positive|good|great|excellent|outstanding|exceptional|extraordinary|remarkable|impressive|stunning|amazing|incredible|unbelievable|fantastic|wonderful|marvelous|magnificent|spectacular|brilliant|genius|masterful|skillful|talented|gifted|expert|professional|qualified|competent|capable|able|powerful|strong|mighty|potent|effective|efficient|productive|successful|profitable|rewarding|satisfying|fulfilling|gratifying|pleasing|delightful|enjoyable|entertaining|engaging|interesting|fun|exciting|thrilling|exhilarating|invigorating|energizing|stimulating|inspiring|motivating|encouraging|uplifting|empowering|liberating|freeing|releasing|unleashing|unlocking|opening|revealing|discovering|finding|solving|creating|building|making|producing|generating|developing|growing|expanding|increasing|improving|enhancing|upgrading|advancing|progressing|evolving|transforming|changing|revolutionizing|innovating|pioneering|leading|directing|guiding|mentoring|teaching|sharing|giving|contributing|helping|supporting|serving|benefiting|blessing|enriching|enhancing|improving|bettering|upgrading|advancing|elevating|raising|lifting|boosting|amplifying|magnifying|strengthening|empowering|enabling|facilitating|accelerating|expediting|streamlining|optimizing|maximizing|perfecting|mastering|excelling|surpassing|exceeding|transcending|overcoming|conquering|defeating|winning|succeeding|achieving|accomplishing|fulfilling|realizing|actualizing|manifesting|creating|producing|generating|developing|building|constructing|establishing|founding|starting|launching|initiating|beginning|opening|unveiling|revealing|introducing|presenting|showcasing|demonstrating|proving|validating|confirming|verifying|certifying|guaranteeing|assuring|promising|committing|dedicating|devoting|pledging|vowing|swearing|declaring|proclaiming|announcing|stating|asserting|affirming|confirming|acknowledging|recognizing|accepting|embracing|welcoming|inviting|encouraging|supporting|endorsing|approving|validating|legitimizing|authorizing|empowering|enabling|facilitating|helping|assisting|aiding|serving|contributing|participating|engaging|involving|including|incorporating|integrating|uniting|connecting|linking|joining|combining|merging|fusing|blending|harmonizing|synchronizing|coordinating|organizing|arranging|planning|designing|creating|building|developing|constructing|manufacturing|producing|delivering|providing|supplying|offering|presenting|showcasing|featuring|highlighting|emphasizing|promoting|advancing|supporting|endorsing|recommending|suggesting|proposing|presenting|offering|providing|giving|sharing|contributing|donating|investing|funding|sponsoring|backing|supporting|helping|assisting|serving|benefiting|enriching|enhancing|improving|bettering|upgrading|advancing|progressing|developing|growing|expanding|evolving|transforming|revolutionizing|changing|shifting|moving|progressing|advancing|succeeding|winning|achieving|accomplishing|fulfilling|completing|finishing|concluding|ending|closing|sealing|securing|protecting|defending|maintaining|preserving|sustaining|continuing|persisting|persevering|enduring|lasting|surviving|thriving|flourishing|prospering|succeeding|excelling|outstanding|performing|delivering|executing|implementing|realizing|actualizing|manifesting|creating|producing|generating|developing|building|constructing|establishing|founding|starting|launching|initiating|beginning)\b/gi) || []).length;
        const wordCount = text.split(/\s+/).length;
        
        return Math.min(1.0, dominanceWords / wordCount * 8);
    }
    
    calculateEngagement(text) {
        const engagementIndicators = [
            /\?+/g,  // Questions
            /!+/g,   // Exclamations
            /you|your|we|us|our/gi,  // Personal pronouns
            /\b(discover|explore|learn|find|see|watch|click|try|get|start|begin|join|share|connect|engage|participate|contribute|help|support|follow|subscribe|sign up|register|download|access|unlock|reveal|uncover|experience|enjoy|benefit|gain|achieve|succeed|win|master|improve|enhance|upgrade|optimize|maximize|boost|accelerate|transform|change|evolve|grow|develop|advance|progress|move|go|come|visit|check|view|read|listen|watch|observe|notice|realize|understand|comprehend|grasp|appreciate|value|love|like|enjoy|prefer|choose|select|pick|decide|determine|consider|think|reflect|contemplate|imagine|envision|visualize|picture|see|feel|sense|experience|taste|touch|hear|smell|perceive|detect|recognize|identify|spot|notice|observe|watch|monitor|track|follow|pursue|seek|search|hunt|look|find|discover|uncover|reveal|expose|show|display|present|demonstrate|illustrate|explain|describe|tell|share|communicate|express|convey|transmit|send|deliver|provide|offer|give|contribute|donate|invest|spend|pay|buy|purchase|acquire|obtain|get|receive|accept|take|grab|catch|capture|seize|hold|keep|retain|maintain|preserve|protect|defend|guard|shield|cover|wrap|embrace|hug|welcome|greet|meet|encounter|face|confront|challenge|overcome|defeat|beat|win|triumph|succeed|achieve|accomplish|fulfill|complete|finish|end|conclude|close|stop|pause|rest|relax|calm|peace|quiet|silence|still|steady|stable|secure|safe|protected|defended|guarded|shielded|covered|wrapped|embraced|welcomed|accepted|included|involved|engaged|participating|contributing|helping|supporting|assisting|serving|benefiting|enriching|enhancing|improving|bettering|upgrading|advancing|progressing|developing|growing|expanding|evolving|transforming|changing|shifting|moving|flowing|streaming|rushing|racing|flying|soaring|climbing|rising|ascending|elevating|lifting|raising|boosting|amplifying|magnifying|strengthening|empowering|enabling|facilitating|accelerating|expediting|streamlining|optimizing|maximizing|perfecting|mastering|excelling|surpassing|exceeding|transcending|overcoming|conquering|defeating|winning|succeeding|achieving|accomplishing|fulfilling|realizing|actualizing|manifesting|creating|producing|generating|developing|building|constructing|establishing|founding|starting|launching|initiating|beginning|opening|unveiling|revealing|introducing|presenting|showcasing|demonstrating|proving|validating|confirming|verifying|certifying|guaranteeing|assuring|promising|committing|dedicating|devoting|pledging|vowing|swearing|declaring|proclaiming|announcing|stating|asserting|affirming|confirming|acknowledging|recognizing|accepting|embracing|welcoming|inviting|encouraging|supporting|endorsing|approving|validating|legitimizing|authorizing|empowering|enabling|facilitating|helping|assisting|aiding|serving|contributing|participating|engaging|involving|including|incorporating|integrating|uniting|connecting|linking|joining|combining|merging|fusing|blending|harmonizing|synchronizing|coordinating|organizing|arranging|planning|designing|creating|building|developing|constructing|manufacturing|producing|delivering|providing|supplying|offering|presenting|showcasing|featuring|highlighting|emphasizing|promoting|advancing|supporting|endorsing|recommending|suggesting|proposing|presenting|offering|providing|giving|sharing|contributing|donating|investing|funding|sponsoring|backing|supporting|helping|assisting|serving|benefiting|enriching|enhancing|improving|bettering|upgrading|advancing|progressing|developing|growing|expanding|evolving|transforming|revolutionizing|changing|shifting|moving|progressing|advancing|succeeding|winning|achieving|accomplishing|fulfilling|completing|finishing|concluding|ending|closing|sealing|securing|protecting|defending|maintaining|preserving|sustaining|continuing|persisting|persevering|enduring|lasting|surviving|thriving|flourishing|prospering|succeeding|excelling|outstanding|performing|delivering|executing|implementing|realizing|actualizing|manifesting|creating|producing|generating|developing|building|constructing|establishing|founding|starting|launching|initiating|beginning)\b/gi
        ];
        
        let totalMatches = 0;
        engagementIndicators.forEach(pattern => {
            const matches = text.match(pattern);
            if (matches) totalMatches += matches.length;
        });
        
        const wordCount = text.split(/\s+/).length;
        return Math.min(1.0, totalMatches / wordCount * 4);
    }
    
    calculateTechnical(text) {
        const technicalMatches = (text.match(this.sentimentPatterns.technical) || []).length;
        const wordCount = text.split(/\s+/).length;
        
        return Math.min(1.0, technicalMatches / wordCount * 6);
    }
    
    calculateCreative(text) {
        const creativeMatches = (text.match(this.sentimentPatterns.creative) || []).length;
        const wordCount = text.split(/\s+/).length;
        
        return Math.min(1.0, creativeMatches / wordCount * 4);
    }
    
    calculateUrgency(text) {
        const urgencyMatches = (text.match(this.sentimentPatterns.urgency) || []).length;
        const wordCount = text.split(/\s+/).length;
        
        return Math.min(1.0, urgencyMatches / wordCount * 8);
    }
    
    calculateComplexity(text) {
        const avgWordLength = text.split(/\s+/).reduce((sum, word) => sum + word.length, 0) / text.split(/\s+/).length;
        const sentenceCount = text.split(/[.!?]+/).length;
        const avgSentenceLength = text.split(/\s+/).length / sentenceCount;
        
        // Complexity based on word length and sentence structure
        const complexity = (avgWordLength / 15) + (avgSentenceLength / 50);
        return Math.min(1.0, complexity);
    }
    
    hashText(text) {
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
            const char = text.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }
    
    setupInteractionTracking() {
        // Track scroll patterns
        document.addEventListener('wheel', (e) => {
            const velocity = Math.abs(e.deltaY);
            this.interactionPatterns.scrollVelocityHistory.push(velocity);
            if (this.interactionPatterns.scrollVelocityHistory.length > 20) {
                this.interactionPatterns.scrollVelocityHistory.shift();
            }
            
            // High scroll velocity indicates urgency/scanning behavior
            const avgVelocity = this.interactionPatterns.scrollVelocityHistory.reduce((a, b) => a + b, 0) / this.interactionPatterns.scrollVelocityHistory.length;
            if (avgVelocity > 100) {
                this.emotionalState.urgency = Math.min(1.0, this.emotionalState.urgency + 0.1);
                this.emotionalState.engagement = Math.max(0.0, this.emotionalState.engagement - 0.05);
            }
        });
        
        // Track click frequency (engagement indicator)
        document.addEventListener('click', () => {
            this.interactionPatterns.clickFrequency++;
            this.interactionPatterns.lastInteractionTime = performance.now();
            
            // Frequent clicks indicate high engagement
            this.emotionalState.engagement = Math.min(1.0, this.emotionalState.engagement + 0.2);
            this.emotionalState.arousal = Math.min(1.0, this.emotionalState.arousal + 0.1);
        });
        
        // Track dwell time on elements
        let mouseenterTime = 0;
        document.addEventListener('mouseenter', (e) => {
            if (e.target.classList.contains('article-card') || e.target.tagName === 'ARTICLE') {
                mouseenterTime = performance.now();
            }
        }, true);
        
        document.addEventListener('mouseleave', (e) => {
            if (e.target.classList.contains('article-card') || e.target.tagName === 'ARTICLE') {
                const dwellTime = performance.now() - mouseenterTime;
                this.interactionPatterns.dwellTimes.push(dwellTime);
                if (this.interactionPatterns.dwellTimes.length > 10) {
                    this.interactionPatterns.dwellTimes.shift();
                }
                
                // Long dwell times indicate deep engagement
                if (dwellTime > 2000) { // 2+ seconds
                    this.emotionalState.engagement = Math.min(1.0, this.emotionalState.engagement + 0.15);
                    this.emotionalState.dominance = Math.min(1.0, this.emotionalState.dominance + 0.1);
                }
            }
        }, true);
        
        // Track focus changes (attention patterns)
        document.addEventListener('visibilitychange', () => {
            this.interactionPatterns.focusChanges++;
            if (document.hidden) {
                this.emotionalState.engagement *= 0.8; // Reduce engagement when tab loses focus
            } else {
                this.emotionalState.engagement = Math.min(1.0, this.emotionalState.engagement + 0.1); // Boost when returning
            }
        });
    }
    
    updateEmotionalState(analysis) {
        // Smooth emotional state transitions
        const smoothingFactor = 0.3;
        
        Object.keys(analysis).forEach(emotion => {
            if (this.emotionalState.hasOwnProperty(emotion)) {
                this.emotionalState[emotion] = 
                    this.emotionalState[emotion] * (1 - smoothingFactor) + 
                    analysis[emotion] * smoothingFactor;
            }
        });
        
        // Apply emotional state to visual parameters
        this.applyEmotionalParameters();
    }
    
    applyEmotionalParameters() {
        Object.keys(this.emotionalMappings).forEach(emotion => {
            const emotionValue = this.emotionalState[emotion];
            const mapping = this.emotionalMappings[emotion];
            
            if (mapping && emotionValue !== undefined) {
                const parameterValue = typeof mapping.mapping === 'function' 
                    ? mapping.mapping(emotionValue)
                    : emotionValue * mapping.mapping;
                
                this.updateVisualParameter(mapping.parameter, parameterValue, emotion);
            }
        });
    }
    
    updateVisualParameter(parameter, value, emotionSource) {
        switch(parameter) {
            case 'baseColor':
                if (typeof value === 'object' && value.hueShift !== undefined) {
                    this.reactivityBridge?.updateCSSProperty('--emotion-hue-shift', `${value.hueShift}deg`);
                    this.reactivityBridge?.updateCSSProperty('--emotion-saturation', value.saturation.toFixed(3));
                }
                break;
                
            case 'speed':
                this.homeMaster?.overrideParameters({ speed: value });
                this.reactivityBridge?.updateCSSProperty('--emotion-speed', value.toFixed(3));
                break;
                
            case 'dimension':
                this.homeMaster?.overrideParameters({ dimension: value });
                this.reactivityBridge?.updateCSSProperty('--dimensional-depth', value.toFixed(3));
                break;
                
            case 'intensity':
                this.homeMaster?.overrideParameters({ intensity: value });
                this.reactivityBridge?.updateCSSProperty('--emotion-intensity', value.toFixed(3));
                break;
                
            case 'geometry':
                if (this.homeMaster) {
                    const newSection = value > 0.5 ? 1 : 0; // Tech vs Home
                    this.homeMaster.updateInteraction('section', { section: newSection });
                }
                break;
                
            case 'morphFactor':
                this.homeMaster?.overrideParameters({ complexity: value });
                this.reactivityBridge?.updateCSSProperty('--emotion-morph', value.toFixed(3));
                break;
                
            case 'glitchIntensity':
                this.reactivityBridge?.updateCSSProperty('--chaos-intensity', value.toFixed(3));
                if (value > 0.5) {
                    this.reactivityBridge?.triggerEffect('reality-glitch');
                }
                break;
                
            case 'density':
                this.homeMaster?.overrideParameters({ density: value });
                this.reactivityBridge?.updateCSSProperty('--emotion-density', value.toFixed(3));
                break;
        }
    }
    
    startEmotionalUpdateLoop() {
        const update = () => {
            // Apply emotional decay over time
            this.applyEmotionalDecay();
            
            // Check for inactivity and adjust emotions accordingly
            this.handleInactivityEmotions();
            
            // Update coherence based on emotional stability
            this.updateEmotionalCoherence();
            
            // Continue loop
            requestAnimationFrame(update);
        };
        
        requestAnimationFrame(update);
        console.log('🔄 SemanticReactivityEngine emotional update loop started');
    }
    
    applyEmotionalDecay() {
        const decayRates = {
            arousal: 0.98,
            urgency: 0.95,
            engagement: 0.99,
            technical: 0.997,
            creative: 0.997,
            complexity: 0.998
        };
        
        Object.keys(decayRates).forEach(emotion => {
            if (this.emotionalState.hasOwnProperty(emotion)) {
                this.emotionalState[emotion] *= decayRates[emotion];
            }
        });
    }
    
    handleInactivityEmotions() {
        const timeSinceLastInteraction = performance.now() - this.interactionPatterns.lastInteractionTime;
        
        if (timeSinceLastInteraction > 10000) { // 10 seconds of inactivity
            // Reduce arousal and engagement, increase tranquility
            this.emotionalState.arousal *= 0.98;
            this.emotionalState.engagement *= 0.97;
            this.emotionalState.urgency *= 0.95;
            
            // Boost coherence during calm periods
            this.emotionalState.coherence = Math.min(1.0, this.emotionalState.coherence + 0.002);
        }
    }
    
    updateEmotionalCoherence() {
        // Calculate emotional volatility
        const volatility = Math.abs(this.emotionalState.valence) + 
                          this.emotionalState.arousal + 
                          this.emotionalState.urgency;
        
        // High volatility reduces coherence, stability increases it
        if (volatility > 1.5) {
            this.emotionalState.coherence *= 0.99;
        } else {
            this.emotionalState.coherence = Math.min(1.0, this.emotionalState.coherence + 0.001);
        }
        
        // Apply coherence to system
        this.homeMaster?.overrideParameters({ coherence: this.emotionalState.coherence });
    }
    
    // Public API methods
    getEmotionalState() {
        return { ...this.emotionalState };
    }
    
    getContentAnalysisHistory() {
        return [...this.contentAnalysis.analysisHistory];
    }
    
    getInteractionPatterns() {
        return {
            scrollVelocityHistory: [...this.interactionPatterns.scrollVelocityHistory],
            clickFrequency: this.interactionPatterns.clickFrequency,
            averageDwellTime: this.interactionPatterns.dwellTimes.length > 0 
                ? this.interactionPatterns.dwellTimes.reduce((a, b) => a + b, 0) / this.interactionPatterns.dwellTimes.length
                : 0,
            focusChanges: this.interactionPatterns.focusChanges,
            timeSinceLastInteraction: performance.now() - this.interactionPatterns.lastInteractionTime
        };
    }
    
    manuallyAnalyzeText(text) {
        const analysis = this.analyzeSentiment(text);
        this.updateEmotionalState(analysis);
        return analysis;
    }
    
    setEmotionalOverride(emotions) {
        Object.assign(this.emotionalState, emotions);
        this.applyEmotionalParameters();
    }
    
    reset() {
        this.emotionalState = {
            valence: 0.0,
            arousal: 0.0,
            dominance: 0.0,
            engagement: 0.0,
            coherence: 1.0,
            technical: 0.0,
            creative: 0.0,
            urgency: 0.0,
            complexity: 0.0
        };
        
        this.interactionPatterns = {
            scrollVelocityHistory: [],
            clickFrequency: 0,
            dwellTimes: [],
            focusChanges: 0,
            lastInteractionTime: performance.now()
        };
        
        console.log('🔄 SemanticReactivityEngine reset to baseline emotional state');
    }
}

export default SemanticReactivityEngine;