export const LANGUAGE_STORAGE_KEY = "aesir-language";
export const LANGUAGE_KEYS = ["en", "traditional", "simplified"];

const sharedEnglish = {
  languageLabel: "EN",
  languageSelector: "Select language",
  nav: {
    items: [["Research", "research"], ["Method", "method"], ["Deployment", "evidence"], ["Projects", "projects"], ["Leadership", "leadership"]],
    contact: "Contact",
    contactAesir: "Contact AESIR",
    backToTop: "Back to top",
    primaryLabel: "Primary navigation",
    mobileLabel: "Mobile navigation",
    open: "Open navigation",
    close: "Close navigation",
  },
  sectionNavigation: {
    label: "Page section navigation",
    items: [
      ["Intro", "top"],
      ["Research", "research"],
      ["Method", "method"],
      ["Deployment", "evidence"],
      ["Projects", "projects"],
      ["Leadership", "leadership"],
      ["Contact", "contact"],
    ],
  },
  hero: {
    headline: "Evidence for an\ninclusive future.",
    description: "AESIR bridges human neurodiversity and frontier technology, translating industrial-grade AR, VR, AI, and public-policy research into measurable public value.",
  },
  heroEvidence: {
    sectionLabel: "AESIR in public dialogue",
    imageAlt: "Ernest HS CHAN speaking during an industry panel",
    credentialsLabel: "AESIR credentials",
    credentials: ["Global social technology", "AR · VR · AI · Public policy", "APAC field deployment"],
  },
  thesis: {
    title: "Immersive pragmatism in practice.",
    intro: "Research earns its value when it survives contact with the real world.",
    statement: "Scientific discovery, proven through deployment.",
    body: "Built by practical innovators behind a globally recognised social-technology startup, AESIR's footprint connects rigorous data science, human-computer interaction, public policy, and industrial execution. Our fellows do not merely theorise technology; they build, test, and translate it into inclusive digital infrastructure and measurable socioeconomic wellbeing.",
  },
  research: {
    title: "Three research areas shaping human-centred technology.",
    intro: "Each area connects a structural challenge with a research agenda and a pathway to field deployment.",
    areasLabel: "AESIR research areas",
    sectionsLabel: "research sections",
    navigationLabel: "Research section navigation",
    previous: "Previous",
    complete: "Complete",
    built: "What AESIR has already built",
  },
  method: {
    title: "From evidence to measurable public value.",
    intro: "AESIR treats research, engineering, validation, and adoption as one continuous practice.",
    steps: [
      ["Research", "Frame a human problem with scientific, market, and policy context."],
      ["Prototype", "Turn evidence into testable XR, AI, and interaction architectures."],
      ["Field Validation", "Work with real users, institutions, practitioners, and communities."],
      ["Public Value", "Measure adoption, inclusion, wellbeing, and commercial scalability."],
    ],
  },
  evidence: {
    title: "Applied programmes, partnerships, and public outcomes.",
    intro: "A growing body of participatory research, cross-sector collaboration, and deployment-led learning.",
    imageAlt: "AESIR and programme partners at an inclusive AI deployment",
    outputs: [
      { title: "Social innovation ventures", description: "Happy Kingdom and Smart Sports moved inclusive learning and active-ageing concepts into funded, public-facing programmes rather than stopping at presentation-stage prototypes." },
      { title: "Health and rehabilitation", description: "Work ranges from mixed-reality AED rehearsal and asthma-care support to elderly fall-prevention games, VR mental-wellness programmes, and assistive learning tools." },
      { title: "Education and public knowledge", description: "Projects with universities and education partners translate research into AR comics, sustainability games, language resources, heritage experiences, and interactive classroom platforms." },
      { title: "Cross-sector deployment", description: "AESIR has built experiences for NGOs, schools, universities, public bodies, healthcare teams, and commercial partners—testing the same technology under very different user and governance conditions." },
    ],
  },
  projects: {
    title: "Field deployments across technology and society.",
    intro: "AESIR has delivered projects across diverse sectors and real-world contexts, translating research and emerging technology into practical applications for organisations, communities, and everyday life.",
    all: "All",
    searchLabel: "Search projects",
    searchPlaceholder: "Search the archive",
    filterLabel: "Filter projects by category",
    browseAll: "Browsing the complete field archive",
    browseCategory: (category) => `Browsing ${category}`,
    matches: (query, category) => `Showing matches for “${query}”${category ? ` in ${category}` : ""}`,
    view: "View project",
    empty: "No projects match this search. Try another title or category.",
    fewer: "Show fewer projects",
    more: "Explore more projects",
    mediaAlt: (title) => `${title} project media`,
  },
  leadership: {
    title: "Built by practitioners across sectors and communities.",
    intro: "AESIR was built by social entrepreneurs working across AI, AR, VR, gaming, inclusive education, public innovation, and human-centred technology. The practice connects technical delivery with the realities of classrooms, clinics, community organisations, public programmes, and cross-sector partnerships.",
    featureTitle: "Clinical empathy, industrial execution.",
    featureBody: "AESIR's research practice grows from years of building with schools, NGOs, hospitals, businesses, and public institutions. That field experience turns inclusion from an abstract principle into a design and deployment requirement.",
    featureAlt: "AESIR Co-Founder Ernest HS CHAN reading an augmented-reality positive psychology playbook",
    photoLabels: ["Public dialogue", '"AI for All" Inclusive Programme', "Hong Kong ICT Awards", "Cross-sector practice"],
    photoAlts: ["Ernest HS CHAN speaking during a public panel discussion", "AESIR and programme partners at the AI for All Inclusive Programme", "Ernest HS CHAN and participants at the 2021 Hong Kong ICT Awards ceremony", "Business practicum participants and cross-sector partners"],
    archiveAlts: ["Ernest HS CHAN with Elon Musk between the China and Hong Kong flags", "Community counselling and virtual reality programme partners", "AESIR presentation moment", "Founder speaking at an applied training session", "AESIR founders presenting a Happy Kingdom book at a social innovation space", "AESIR founders interview portrait", "AESIR at the DBS-NUS Social Venture Challenge Asia Awards Ceremony 2016", "Ernest presenting the Happy Kingdom book with a guest", "Lion Rock Daily coverage of youth employment research", "AESIR founders with the Happy Kingdom book on a staircase"],
  },
  contact: {
    titleBefore: "Build",
    titleWith: "with",
    titleAfter: "AESIR",
    body: "Connect with AESIR about research collaboration, applied innovation, institutional programs, or technology deployment.",
    action: "Contact AESIR",
  },
  footer: "Evidence-based immersive intelligence.",
  seo: {
    title: "AESIR | Evidence-Based Immersive Intelligence",
    description: "AESIR bridges human neurodiversity and frontier technology through evidence-based immersive intelligence, applied XR, AI, HCI, and public innovation.",
  },
};

const englishResearchAreas = [
  {
    id: "society", title: "Society 5.0", subtitle: "Human-Centric Cyber-Physical Frameworks",
    summary: "Designing public infrastructure that uses advanced technology to expand human agency, access, and quality of life.",
    stages: [
      { id: "description", label: "Description", title: "Technology organised around human wellbeing.", body: ["Society 5.0 describes a human-centred cyber-physical society in which data, intelligent systems, and the built environment work together to improve daily life. Rather than treating automation as the final goal, it asks whether technology expands participation, dignity, independence, and access to essential services.", "For AESIR, this is especially relevant to Asia's super-ageing population, unequal access to care, and the rising public cost of long-term elderly and disability support. The research connects smart-city strategy with the lived realities of older adults, neurodivergent communities, caregivers, and people who are often excluded by conventional digital infrastructure."] },
      { id: "focus", label: "Research Focus", title: "Moving smart cities beyond automated efficiency.", body: ["AESIR studies how cities can progress from Industry 4.0 efficiency towards public systems that are measurable, inclusive, and responsive to different human capabilities. The work examines how spatial computing can make services understandable in place, how edge computing can support timely interaction, and how decentralised data models can reduce dependence on a single point of control.", "The research also explores active-ageing frameworks, zero-barrier municipal environments, remote mental-wellness support, and public-learning systems that turn complex health or sustainability knowledge into practical action. The central question is not only whether a system works, but who can use it, what burden it removes, and how it contributes to long-term public value."] },
      { id: "application", label: "Applied Direction", title: "Turning civic frameworks into public experiences.", body: ["AESIR translates this agenda into programmes that can be tested with real communities and institutions. Smart Sports applies gerontechnology and movement-based interaction to preventive exercise for older adults, while mixed-reality AED and CPR training gives learners a safe, repeatable environment for practising emergency decisions before a real incident occurs.", "Interactive environmental learning projects extend the same principle into citizen science and public education. Together, these deployments create an applied foundation for evaluating participation, comprehension, accessibility, and adoption—evidence that can inform more inclusive healthcare, community services, and smart-city infrastructure."] },
    ],
    tags: ["Smart Cities", "Active Ageing", "Public Infrastructure"],
    cases: [
      { title: "Smart Sports for active ageing", description: "AESIR has applied gerontechnology and sports training to preventive exercise for older adults. The work turns movement into an approachable, repeatable experience designed around participation rather than clinical intimidation." },
      { title: "Mixed-reality emergency training", description: "A HoloLens AED and CPR simulation created with VTC lets learners practise when and how to use an automated external defibrillator inside a safe, repeatable scenario before facing a real emergency." },
      { title: "Public learning through place and data", description: "Tree Portal uses a citizen-science approach to make urban-tree knowledge accessible, while environmental web games translate university research on ocean protection, water filtration, and sustainability into public learning tools." },
    ],
  },
  {
    id: "ax", title: "AX", subtitle: "AI Transformation",
    summary: "Redesigning institutions, workflows, and human performance for an era in which AI becomes foundational infrastructure.",
    stages: [
      { id: "description", label: "Description", title: "AI transformation is organisational, not merely digital.", body: ["AX marks the shift from digitising existing records and services to treating AI as a foundational layer of organisational and public infrastructure. It changes how decisions are prepared, how work is distributed, how knowledge moves through a team, and how autonomous systems coordinate with human judgement.", "This transition creates opportunities for faster analysis and more adaptive services, but it also changes attention, responsibility, and the experience of work. AESIR approaches AX as a human-systems challenge: transformation succeeds only when technical capability, governance, cognitive wellbeing, and operational behaviour are designed together."] },
      { id: "focus", label: "Research Focus", title: "Designing for the AI–human co-working era.", body: ["AESIR's research centres on cognitive ergonomics: how people understand, supervise, and sustain attention while working with intelligent systems. Neural-feedback concepts, micro-expression analytics, movement data, and behavioural signals can help reveal cognitive load, loss of focus, uncertainty, or emotional fatigue that conventional productivity measures fail to capture.", "The aim is to develop evidence-led models for feedback timing, task allocation, explainability, and human oversight. By connecting interaction data with organisational behaviour, the research asks how AI can support performance without creating hidden burnout, deskilling, or decision processes that people can no longer interpret or challenge."] },
      { id: "application", label: "Applied Direction", title: "Building practical test beds for responsible AX.", body: ["AESIR's portfolio provides real interfaces through which these questions can be tested. Camera-based sports and exercise systems use pose, hand, skeleton, and depth tracking to interpret movement without physical controllers, creating immediate examples of how AI feedback must remain accurate, legible, and motivating.", "Applied AI systems extend the research into recognition, communication, and automated response. These deployments support the development of scalable AX blueprints in which performance data, user experience, escalation rules, and meaningful human control are considered from the beginning."] },
    ],
    tags: ["Cognitive Ergonomics", "Human-AI Work", "Behavioural Analytics"],
    cases: [
      { title: "Camera-based movement intelligence", description: "Web-based sports and exercise prototypes use pose, skeleton, hand, and depth tracking to interpret movement without physical controllers. These systems explore how AI feedback can stay immediate, legible, and motivating." },
      { title: "AI-assisted language learning", description: "VocabGO combines camera object recognition with AR labelling, while the archive also spans Cantonese speech training and language-learning assistants—an applied foundation for studying attention, feedback, and cognitive load." },
      { title: "Conversational service interfaces", description: "AESIR has prototyped automated social-media conversations across common messaging channels, examining how organisations can respond faster while keeping tone, escalation, and human oversight visible." },
    ],
  },
  {
    id: "neuro", title: "NEURO Business Futures", subtitle: "Immersive Neurodiversity & Inclusive Tech Markets",
    summary: "Developing scalable immersive systems for neurodivergent learning, assessment, wellbeing, and inclusive technology markets.",
    stages: [
      { id: "description", label: "Description", title: "Inclusive technology built around cognitive difference.", body: ["NEURO Business Futures investigates how immersive environments and generative AI can support neurodivergent learning, communication, assessment, and wellbeing. Multi-sensory VR can present information through space, movement, sound, and guided interaction, creating non-pharmacological pathways that adapt to different ways of processing the world.", "The programme considers Autism, Dyslexia, Dementia, ADHD, and related cognitive conditions without reducing people to a diagnosis. Its purpose is to connect clinical empathy with technology design, then examine how assistive systems can move from isolated prototypes into trustworthy services, sustainable markets, and accessible learning or care environments."] },
      { id: "focus", label: "Research Focus", title: "Turning interaction patterns into personalised support.", body: ["AESIR studies cognitive spatial data, kinetic movement, eye-gaze variation, attention patterns, and responses to multi-sensory feedback. These signals can help researchers and practitioners understand how an individual navigates a task, where cognitive friction appears, and which form of guidance supports participation without adding unnecessary pressure.", "The research combines these observations with personalised gamified protocols, practitioner review, and the design of repeatable clinical-learning environments. It also examines the economics and delivery systems behind assistive technology, because an intervention has limited public value if it cannot be maintained, adopted by practitioners, or scaled across schools, NGOs, clinics, and families."] },
      { id: "application", label: "Applied Direction", title: "Extending a validated base of immersive inclusion.", body: ["Happy Kingdom, Hong Kong's AR positive-psychology playbook, supports children's emotional literacy through stories, play, and guided practice. My Living Diary was co-designed with an autism counsellor, speech therapist, and occupational therapist to help children rehearse everyday vocabulary, communication, and independent-living situations.", "AESIR's VR speech centre adds repeatable public-speaking and social-interaction rehearsal with audio review for practitioners. Together with established NGO, education, and care networks, these projects form a practical testing base for more personalised immersive protocols and for studying how inclusive technology can achieve clinical relevance, user trust, and sustainable deployment."] },
    ],
    tags: ["Neurodiversity", "Clinical Learning", "Assistive Technology"],
    cases: [
      { title: "Happy Kingdom AR Playbook", description: "Hong Kong's AR positive-psychology playbook was developed to support children's emotional literacy through guided stories, play, and at-home practice. The programme was recognised as a funded social-innovation venture." },
      { title: "My Living Diary", description: "Co-designed with an autism counsellor, speech therapist, and occupational therapist, this AR life-education package helps children practise everyday vocabulary, communication, and independent-living situations." },
      { title: "VR speech and social rehearsal", description: "A Unity-based VR speech centre simulates public-speaking and social-interaction situations for children with autism, with audio recording that gives practitioners a repeatable way to review participation and progress." },
    ],
  },
];

const chineseResearchAreas = {
  traditional: [
    {
      id: "society", title: "Society 5.0", subtitle: "以人為本的虛實融合框架", summary: "設計運用先進科技的公共基礎設施，擴展人的自主性、服務可及性與生活質素。",
      stages: [
        { id: "description", label: "簡介", title: "科技應以人的福祉為核心。", body: ["Society 5.0 描繪一個以人為本的虛實融合社會，讓數據、智能系統與建成環境協同運作，改善日常生活。它不把自動化視為終點，而是追問科技能否擴大參與、維護尊嚴、提升自主性，並改善人們獲取基本服務的機會。", "對 AESIR 而言，這尤其關乎亞洲人口超高齡化、照護資源不均，以及長期長者與殘疾支援所帶來日益增加的公共成本。研究將智慧城市策略與長者、神經多樣性群體、照顧者，以及經常被傳統數碼基礎設施排除的人士的真實生活經驗連結起來。"] },
        { id: "focus", label: "研究重點", title: "讓智慧城市超越自動化效率。", body: ["AESIR 研究城市如何由追求 Industry 4.0 的效率，進一步發展為可量度、具共融性，並能回應不同人類能力的公共系統。研究探討空間運算如何令服務在實際場景中更容易理解、邊緣運算如何支援即時互動，以及去中心化數據模型如何減少對單一控制點的依賴。", "研究亦涵蓋積極樂齡框架、無障礙城市環境、遙距心理健康支援，以及將複雜健康或可持續發展知識轉化為實際行動的公共學習系統。核心問題不只是系統能否運作，而是誰能使用、它能減輕甚麼負擔，以及如何創造長期公共價值。"] },
        { id: "application", label: "應用方向", title: "將城市框架轉化為公共體驗。", body: ["AESIR 將這些研究方向轉化為可在真實社群和機構中測試的計劃。Smart Sports 將樂齡科技與動作互動應用於長者預防性運動；混合實境 AED 及 CPR 訓練則讓學習者在真正緊急事故發生前，於安全、可重複的環境中練習關鍵應變決策。", "互動環境學習項目把同一理念延伸至公民科學與公共教育。這些實踐共同建立一個應用基礎，用以評估參與度、理解程度、可及性及採用情況，並為更具共融性的醫療、社區服務及智慧城市基礎設施提供實證。"] },
      ],
      tags: ["智慧城市", "積極樂齡", "公共基礎設施"],
      cases: [
        { title: "Smart Sports：積極樂齡運動", description: "AESIR 將樂齡科技與運動訓練應用於長者預防性運動，讓動作練習成為更容易參與、可重複，而且以參與感而非臨床壓力為核心的體驗。" },
        { title: "混合實境緊急應變訓練", description: "AESIR 與 VTC 建立 HoloLens AED 及 CPR 模擬系統，讓學習者在面對真實緊急事故前，於安全且可重複的情境中練習何時以及如何使用自動體外心臟去顫器。" },
        { title: "透過場域與數據推動公共學習", description: "Tree Portal 以公民科學方式讓城市樹木知識更容易理解；環境網頁遊戲則將大學有關海洋保育、水質過濾及可持續發展的研究轉化為公共學習工具。" },
      ],
    },
    {
      id: "ax", title: "AX", subtitle: "AI 轉型", summary: "重新設計機構、工作流程與人類表現，以迎接 AI 成為基礎設施的新時代。",
      stages: [
        { id: "description", label: "簡介", title: "AI 轉型是組織變革，而不只是數碼化。", body: ["AX 代表由單純將既有紀錄和服務數碼化，轉向把 AI 視為組織與公共基礎設施的核心層。它改變決策如何準備、工作如何分配、知識如何在團隊中流動，以及自主系統如何與人的判斷協作。", "這種轉變帶來更快速分析與更具適應性的服務，同時亦改變人的注意力、責任分配及工作體驗。AESIR 將 AX 視為一項人類系統挑戰：只有當技術能力、治理、認知健康及營運行為被共同設計，轉型才能真正成功。"] },
        { id: "focus", label: "研究重點", title: "為 AI 與人類協作的新時代而設計。", body: ["AESIR 的研究聚焦於認知人體工學：人在與智能系統合作時，如何理解系統、進行監督並維持注意力。神經回饋概念、微表情分析、動作數據及行為訊號，有助揭示傳統生產力指標難以捕捉的認知負荷、注意力流失、不確定性或情緒疲勞。", "研究目標是建立以實證為本的回饋時機、任務分配、可解釋性及人工監督模型。透過將互動數據與組織行為連結，AESIR 探討 AI 如何支援工作表現，同時避免隱性倦怠、技能退化，或形成使用者已無法理解及質疑的決策流程。"] },
        { id: "application", label: "應用方向", title: "建立負責任 AX 的實際測試環境。", body: ["AESIR 的項目組合提供真實介面，讓這些研究問題可以實際測試。以鏡頭為基礎的運動及訓練系統利用姿態、手部、骨架和深度追蹤，在毋須實體控制器的情況下理解動作，直接展示 AI 回饋為何必須保持準確、清晰且具有激勵作用。", "應用 AI 系統進一步將研究延伸至辨識、溝通與自動回應。這些實踐支援可擴展 AX 藍圖的建立，從一開始便將表現數據、使用者體驗、升級處理規則及有意義的人類控制納入設計。"] },
      ],
      tags: ["認知人體工學", "人機協作", "行為分析"],
      cases: [
        { title: "鏡頭式動作智能", description: "網頁運動及訓練原型利用姿態、骨架、手部和深度追蹤，在沒有實體控制器的情況下理解人體動作，研究如何令 AI 回饋保持即時、清晰且具有激勵作用。" },
        { title: "AI 輔助語言學習", description: "VocabGO 結合鏡頭物件辨識與 AR 標籤；AESIR 的項目亦涵蓋粵語語音訓練及語言學習助手，形成研究注意力、回饋及認知負荷的應用基礎。" },
        { title: "對話式服務介面", description: "AESIR 曾在常用訊息平台原型化自動社交媒體對話，研究機構如何在加快回應速度的同時，仍然保持語氣、升級處理機制及人工監督的透明度。" },
      ],
    },
    {
      id: "neuro", title: "NEURO Business Futures", subtitle: "沉浸式神經多樣性與共融科技市場", summary: "開發可擴展的沉浸式系統，支援神經多樣性人士的學習、評估、身心健康，以及共融科技市場的發展。",
      stages: [
        { id: "description", label: "簡介", title: "以認知差異為核心設計共融科技。", body: ["NEURO Business Futures 研究沉浸式環境與生成式 AI 如何支援神經多樣性人士的學習、溝通、評估及身心健康。多感官 VR 可以透過空間、動作、聲音與引導式互動呈現資訊，建立能適應不同資訊處理方式的非藥物介入路徑。", "計劃涵蓋自閉症、讀寫障礙、認知障礙症、專注力不足／過度活躍症，以及其他相關認知狀況，但不會將一個人簡化為某項診斷。目標是把臨床同理心與科技設計連結起來，並研究輔助系統如何由單一原型發展成值得信賴的服務、可持續市場，以及容易接觸的學習與照護環境。"] },
        { id: "focus", label: "研究重點", title: "將互動模式轉化為個人化支援。", body: ["AESIR 研究認知空間數據、動態動作、視線差異、注意力模式，以及對多感官回饋的反應。這些訊號能協助研究人員及專業人士理解個別使用者如何完成任務、認知阻力在哪裏出現，以及甚麼形式的引導最能支援參與而不增加不必要壓力。", "研究把這些觀察與個人化遊戲化流程、專業人員評估，以及可重複的臨床學習環境設計結合。同時亦研究輔助科技背後的經濟與服務交付模式，因為如果一項介入無法持續維護、獲專業人士採用，或擴展至學校、NGO、診所及家庭，其公共價值便非常有限。"] },
        { id: "application", label: "應用方向", title: "擴展經實踐驗證的沉浸式共融基礎。", body: ["Happy Kingdom 是香港的 AR 正向心理學互動手冊，透過故事、遊戲及引導練習支援兒童的情緒素養。My Living Diary 則與自閉症輔導老師、言語治療師及職業治療師共同設計，協助兒童練習日常詞彙、溝通及獨立生活情境。", "AESIR 的 VR 語言訓練中心加入可重複的公開演說及社交互動練習，並提供錄音讓專業人員進行評估。配合既有的 NGO、教育與照護網絡，這些項目形成一個實際測試基礎，可進一步發展個人化沉浸式流程，並研究共融科技如何取得臨床相關性、使用者信任及可持續部署。"] },
      ],
      tags: ["神經多樣性", "臨床學習", "輔助科技"],
      cases: [
        { title: "Happy Kingdom AR 正向心理學互動手冊", description: "香港的 AR 正向心理學互動手冊，透過引導故事、遊戲及家庭練習支援兒童情緒素養，並獲社會創新資助計劃認可。" },
        { title: "My Living Diary 生活教育日誌", description: "與自閉症輔導老師、言語治療師及職業治療師共同設計，透過 AR 生活教育支援兒童練習日常詞彙、溝通及獨立生活情境。" },
        { title: "VR 語言與社交情境訓練", description: "以 Unity 建立的 VR 語言訓練中心，為自閉症兒童模擬公開演說及社交互動情境，並透過錄音功能讓專業人員重複檢視參與及進度。" },
      ],
    },
  ],
  simplified: [],
};

chineseResearchAreas.simplified = [
  {
    id: "society", title: "Society 5.0", subtitle: "以人为本的信息物理融合框架", summary: "设计运用先进科技的公共基础设施，拓展人的自主性、服务可及性与生活质量。",
    stages: [
      { id: "description", label: "简介", title: "科技应以人的福祉为核心。", body: ["Society 5.0 描绘一个以人为本的信息物理融合社会，让数据、智能系统与建成环境协同运行，改善日常生活。它不把自动化视为终点，而是追问科技能否扩大参与、维护尊严、提升自主性，并改善人们获取基本服务的机会。", "对 AESIR 而言，这尤其关系到亚洲人口超老龄化、照护资源不均，以及长期老年人与残障支持带来的持续公共成本。研究将智慧城市战略与老年人、神经多样性群体、照护者，以及经常被传统数字基础设施排除的人群的真实生活经验连接起来。"] },
      { id: "focus", label: "研究重点", title: "让智慧城市超越自动化效率。", body: ["AESIR 研究城市如何从追求 Industry 4.0 的效率，进一步发展为可衡量、具包容性，并能回应不同人类能力的公共系统。研究探讨空间计算如何让服务在实际场景中更容易理解、边缘计算如何支持即时交互，以及去中心化数据模型如何减少对单一控制点的依赖。", "研究还涵盖积极老龄化框架、无障碍城市环境、远程心理健康支持，以及将复杂健康或可持续发展知识转化为实际行动的公共学习系统。核心问题不只是系统能否运行，而是谁能够使用、它能够减轻什么负担，以及如何创造长期公共价值。"] },
      { id: "application", label: "应用方向", title: "将城市框架转化为公共体验。", body: ["AESIR 将这些研究方向转化为可在真实社区和机构中测试的项目。Smart Sports 将老龄科技与动作交互应用于老年人预防性运动；混合现实 AED 和 CPR 训练则让学习者在真正的紧急事故发生前，于安全、可重复的环境中练习关键应变决策。", "互动环境学习项目把同一理念延伸至公民科学与公共教育。这些实践共同建立一个应用基础，用于评估参与度、理解程度、可及性和采用情况，并为更具包容性的医疗、社区服务和智慧城市基础设施提供实证。"] },
    ],
    tags: ["智慧城市", "积极老龄化", "公共基础设施"],
    cases: [
      { title: "Smart Sports：积极老龄化运动", description: "AESIR 将老龄科技与运动训练应用于老年人预防性运动，让动作练习成为更容易参与、可重复，并以参与感而非临床压力为核心的体验。" },
      { title: "混合现实紧急应变训练", description: "AESIR 与 VTC 建立 HoloLens AED 和 CPR 模拟系统，让学习者在面对真实紧急事故前，于安全且可重复的情境中练习何时以及如何使用自动体外除颤器。" },
      { title: "通过场域与数据推动公共学习", description: "Tree Portal 以公民科学方式让城市树木知识更容易理解；环境网页游戏则将大学有关海洋保护、水质过滤与可持续发展的研究转化为公共学习工具。" },
    ],
  },
  {
    id: "ax", title: "AX", subtitle: "AI 转型", summary: "重新设计机构、工作流程与人类表现，以迎接 AI 成为基础设施的新时代。",
    stages: [
      { id: "description", label: "简介", title: "AI 转型是组织变革，而不只是数字化。", body: ["AX 代表从单纯将既有记录和服务数字化，转向把 AI 视为组织与公共基础设施的核心层。它改变决策如何准备、工作如何分配、知识如何在团队中流动，以及自主系统如何与人的判断协作。", "这种转变带来更快速的分析与更具适应性的服务，同时也改变人的注意力、责任分配及工作体验。AESIR 将 AX 视为一项人类系统挑战：只有当技术能力、治理、认知健康与运营行为被共同设计，转型才能真正成功。"] },
      { id: "focus", label: "研究重点", title: "为 AI 与人类协作的新时代而设计。", body: ["AESIR 的研究聚焦于认知人体工学：人在与智能系统合作时，如何理解系统、进行监督并维持注意力。神经反馈概念、微表情分析、动作数据与行为信号，有助于揭示传统生产力指标难以捕捉的认知负荷、注意力流失、不确定性或情绪疲劳。", "研究目标是建立基于实证的反馈时机、任务分配、可解释性和人工监督模型。通过将交互数据与组织行为连接，AESIR 探讨 AI 如何支持工作表现，同时避免隐性倦怠、技能退化，或形成用户已经无法理解和质疑的决策流程。"] },
      { id: "application", label: "应用方向", title: "建立负责任 AX 的实际测试环境。", body: ["AESIR 的项目组合提供真实界面，让这些研究问题可以实际测试。基于摄像头的运动与训练系统利用姿态、手部、骨架和深度追踪，在无需实体控制器的情况下理解动作，直接展示 AI 反馈为何必须保持准确、清晰且具有激励作用。", "应用 AI 系统进一步将研究延伸至识别、沟通与自动响应。这些实践支持可扩展 AX 蓝图的建立，从一开始便将表现数据、用户体验、升级处理规则和有意义的人类控制纳入设计。"] },
    ],
    tags: ["认知人体工学", "人机协作", "行为分析"],
    cases: [
      { title: "摄像头动作智能", description: "网页运动及训练原型利用姿态、骨架、手部和深度追踪，在没有实体控制器的情况下理解人体动作，研究如何让 AI 反馈保持即时、清晰且具有激励作用。" },
      { title: "AI 辅助语言学习", description: "VocabGO 结合摄像头物体识别与 AR 标签；AESIR 的项目也涵盖粤语语音训练与语言学习助手，形成研究注意力、反馈和认知负荷的应用基础。" },
      { title: "对话式服务界面", description: "AESIR 曾在常用消息平台原型化自动社交媒体对话，研究机构如何在加快响应速度的同时，仍然保持语气、升级处理机制与人工监督的透明度。" },
    ],
  },
  {
    id: "neuro", title: "NEURO Business Futures", subtitle: "沉浸式神经多样性与包容性科技市场", summary: "开发可扩展的沉浸式系统，支持神经多样性人群的学习、评估、身心健康，以及包容性科技市场的发展。",
    stages: [
      { id: "description", label: "简介", title: "以认知差异为核心设计包容性科技。", body: ["NEURO Business Futures 研究沉浸式环境与生成式 AI 如何支持神经多样性人群的学习、沟通、评估与身心健康。多感官 VR 可以通过空间、动作、声音与引导式交互呈现信息，建立能够适应不同信息处理方式的非药物干预路径。", "项目涵盖自闭症、阅读障碍、认知障碍、注意缺陷多动障碍，以及其他相关认知状况，但不会将一个人简化为某项诊断。目标是把临床同理心与科技设计连接起来，并研究辅助系统如何从单一原型发展成值得信赖的服务、可持续市场，以及容易获取的学习与照护环境。"] },
      { id: "focus", label: "研究重点", title: "将交互模式转化为个性化支持。", body: ["AESIR 研究认知空间数据、动态动作、视线差异、注意力模式，以及对多感官反馈的反应。这些信号能帮助研究人员和专业人士理解个别用户如何完成任务、认知阻力在哪里出现，以及什么形式的引导最能支持参与而不增加不必要的压力。", "研究把这些观察与个性化游戏化流程、专业人员评估，以及可重复的临床学习环境设计结合。同时也研究辅助科技背后的经济与服务交付模式，因为如果一项干预无法持续维护、获得专业人士采用，或扩展至学校、NGO、诊所和家庭，其公共价值便非常有限。"] },
      { id: "application", label: "应用方向", title: "扩展经实践验证的沉浸式包容基础。", body: ["Happy Kingdom 是香港的 AR 积极心理学互动手册，通过故事、游戏与引导练习支持儿童的情绪素养。My Living Diary 则与自闭症辅导老师、语言治疗师及职业治疗师共同设计，帮助儿童练习日常词汇、沟通与独立生活情境。", "AESIR 的 VR 语言训练中心加入可重复的公开演讲与社交互动练习，并提供录音让专业人员进行评估。结合既有的 NGO、教育与照护网络，这些项目形成一个实际测试基础，可进一步发展个性化沉浸式流程，并研究包容性科技如何获得临床相关性、用户信任与可持续部署。"] },
    ],
    tags: ["神经多样性", "临床学习", "辅助科技"],
    cases: [
      { title: "Happy Kingdom AR 积极心理学互动手册", description: "香港的 AR 积极心理学互动手册，通过引导故事、游戏与家庭练习支持儿童情绪素养，并获得社会创新资助项目认可。" },
      { title: "My Living Diary 生活教育日志", description: "与自闭症辅导老师、语言治疗师与职业治疗师共同设计，通过 AR 生活教育帮助儿童练习日常词汇、沟通与独立生活情境。" },
      { title: "VR 语言与社交情境训练", description: "以 Unity 建立的 VR 语言训练中心，为自闭症儿童模拟公开演讲与社交互动情境，并通过录音功能让专业人员重复检视参与和进度。" },
    ],
  },
];

const chinese = {
  traditional: {
    languageLabel: "繁中", languageSelector: "選擇語言",
    nav: { items: [["研究", "research"], ["研究方法", "method"], ["實踐應用", "evidence"], ["項目", "projects"], ["團隊", "leadership"]], contact: "聯絡", contactAesir: "聯絡 AESIR", backToTop: "返回頂部", primaryLabel: "主要導覽", mobileLabel: "流動版導覽", open: "開啟導覽", close: "關閉導覽" },
    sectionNavigation: { label: "頁面分段導覽", items: [["簡介", "top"], ["研究", "research"], ["研究方法", "method"], ["實踐應用", "evidence"], ["項目", "projects"], ["團隊", "leadership"], ["聯絡", "contact"]] },
    hero: { headline: "以實證共創\n共融未來。", description: "AESIR 連結人類神經多樣性與前沿科技，將工業級 AR、VR、AI 及公共政策研究轉化為可量度的公共價值。" },
    heroEvidence: { sectionLabel: "AESIR 公共對話現場", imageAlt: "Ernest HS CHAN 在業界座談會上發言", credentialsLabel: "AESIR 實績", credentials: ["全球社會科技", "AR · VR · AI · 公共政策", "亞太地區實地應用"] },
    thesis: { title: "沉浸式務實主義，付諸實踐。", intro: "研究只有經得起真實世界的驗證，才真正產生價值。", statement: "科學發現，以實踐驗證。", body: "AESIR 由打造全球認可社會科技初創企業的實踐型創新者建立，足跡橫跨嚴謹的數據科學、人機互動、公共政策與產業實踐。我們的研究人員不只停留於科技理論，而是親自建構、測試，並將研究轉化為更具共融性的數碼基礎設施，以及可量度的社會與經濟福祉。" },
    research: { title: "三大研究領域，塑造以人為本的科技未來。", intro: "每個領域都將結構性挑戰、研究議程與實地應用路徑連結起來。", areasLabel: "AESIR 研究領域", sectionsLabel: "研究內容", navigationLabel: "研究內容導覽", previous: "上一節", complete: "完成", built: "AESIR 已實現的應用" },
    method: { title: "從實證走向可量度的公共價值。", intro: "AESIR 將研究、工程、驗證與實際採用視為一個連續的實踐過程。", steps: [["研究", "從科學、市場與政策脈絡界定真正的人類需求。"], ["原型開發", "將實證轉化為可測試的 XR、AI 及互動系統架構。"], ["實地驗證", "與真實使用者、機構、專業人士及社群共同測試。"], ["公共價值", "衡量採用程度、共融性、福祉，以及商業擴展能力。"]] },
    evidence: { title: "應用項目、合作夥伴與公共成果。", intro: "持續累積的參與式研究、跨界協作，以及由實踐推動的學習成果。", imageAlt: "AESIR 與共融 AI 項目合作夥伴", outputs: [{ title: "社會創新項目", description: "Happy Kingdom 與 Smart Sports 將共融學習及積極樂齡概念發展成獲資助、真正面向公眾的項目，而不是停留在簡報或概念原型階段。" }, { title: "健康與復康", description: "工作涵蓋混合實境 AED 緊急應變訓練、哮喘照護支援、長者防跌遊戲、VR 心理健康計劃及輔助學習工具。" }, { title: "教育與公共知識", description: "AESIR 與大學及教育夥伴合作，把研究轉化為 AR 漫畫、可持續發展遊戲、語言學習資源、文化保育體驗及互動課堂平台。" }, { title: "跨界實踐", description: "AESIR 曾為 NGO、學校、大學、公共機構、醫療團隊及商業夥伴建立各類體驗，在截然不同的使用者與治理環境中驗證同一類科技。" }] },
    projects: { title: "跨越科技與社會的實地應用。", intro: "AESIR 已在不同產業及真實場景中落地多項項目，將研究與新興科技轉化為服務機構、社群及日常生活的實際應用。", all: "全部", searchLabel: "搜尋項目", searchPlaceholder: "搜尋項目", filterLabel: "按類別篩選項目", browseAll: "正在瀏覽完整項目檔案", browseCategory: (category) => `正在瀏覽「${category}」`, matches: (query, category) => category ? `顯示「${query}」在「${category}」中的搜尋結果` : `顯示「${query}」的搜尋結果`, view: "查看項目", empty: "找不到符合條件的項目，請嘗試其他名稱或類別。", fewer: "顯示較少項目", more: "查看更多項目", mediaAlt: (title) => `${title} 項目媒體` },
    leadership: { title: "由跨界別、深入社群的實踐者共同建立。", intro: "AESIR 由活躍於 AI、AR、VR、遊戲、共融教育、公共創新及以人為本科技領域的社會創業者建立。我們把技術實踐與課室、診所、社區機構、公共項目及跨界合作的真實需求連結起來。", featureTitle: "臨床同理心，產業實踐力。", featureBody: "AESIR 多年來與學校、NGO、醫院、企業及公共機構共同開發項目，逐步建立今天的研究實踐。這些實地經驗令「共融」不再只是抽象理念，而成為設計與落地時必須滿足的核心要求。", featureAlt: "AESIR 聯合創辦人 Ernest HS CHAN 閱讀 AR 正向心理學互動手冊", photoLabels: ["公共對話", "「AI for All」共融計劃", "香港資訊及通訊科技獎", "跨界實踐"], photoAlts: ["Ernest HS CHAN 於公共座談會上發言", "AESIR 與「AI for All」共融計劃合作夥伴", "Ernest HS CHAN 與嘉賓出席 2021 香港資訊及通訊科技獎頒獎典禮", "商業實務課程參加者與跨界合作夥伴"], archiveAlts: ["Ernest HS CHAN 與 Elon Musk 於中國國旗及香港區旗之間合照", "社區輔導與虛擬實境計劃合作夥伴", "AESIR 項目簡報現場", "創辦人於應用培訓活動中發言", "AESIR 創辦人於社會創新場地展示 Happy Kingdom 互動手冊", "AESIR 創辦人訪問合照", "AESIR 出席 2016 DBS-NUS 亞洲社會企業挑戰賽頒獎典禮", "Ernest 與嘉賓展示 Happy Kingdom 互動手冊", "Lion Rock Daily 有關青年就業研究的報道", "AESIR 創辦人於樓梯展示 Happy Kingdom 互動手冊"] },
    contact: { titleBefore: "與 AESIR", titleWith: "", titleAfter: "共創", body: "與 AESIR 聯繫，探索研究合作、應用創新、機構項目或科技落地的合作機會。", action: "聯絡 AESIR" },
    footer: "實證為本的沉浸式智能。",
    seo: { title: "AESIR｜實證為本的沉浸式智能", description: "AESIR 連結人類神經多樣性與前沿科技，透過實證為本的沉浸式智能、XR、AI、HCI 及公共創新，將研究轉化為可量度的公共價值。" },
  },
  simplified: {
    languageLabel: "简中", languageSelector: "选择语言",
    nav: { items: [["研究", "research"], ["研究方法", "method"], ["实践应用", "evidence"], ["项目", "projects"], ["团队", "leadership"]], contact: "联系", contactAesir: "联系 AESIR", backToTop: "返回顶部", primaryLabel: "主导航", mobileLabel: "移动端导航", open: "打开导航", close: "关闭导航" },
    sectionNavigation: { label: "页面分段导航", items: [["简介", "top"], ["研究", "research"], ["研究方法", "method"], ["实践应用", "evidence"], ["项目", "projects"], ["团队", "leadership"], ["联系", "contact"]] },
    hero: { headline: "以实证共创\n包容未来。", description: "AESIR 连接人类神经多样性与前沿科技，将工业级 AR、VR、AI 及公共政策研究转化为可衡量的公共价值。" },
    heroEvidence: { sectionLabel: "AESIR 公共对话现场", imageAlt: "Ernest HS CHAN 在行业座谈会上发言", credentialsLabel: "AESIR 实绩", credentials: ["全球社会科技", "AR · VR · AI · 公共政策", "亚太地区落地应用"] },
    thesis: { title: "沉浸式务实主义，付诸实践。", intro: "研究只有经得起真实世界的验证，才真正产生价值。", statement: "科学发现，以实践验证。", body: "AESIR 由打造全球认可社会科技初创企业的实践型创新者建立，实践横跨严谨的数据科学、人机交互、公共政策与产业落地。我们的研究人员不只停留于科技理论，而是亲自构建、测试，并将研究转化为更具包容性的数字基础设施，以及可衡量的社会与经济福祉。" },
    research: { title: "三大研究领域，塑造以人为本的科技未来。", intro: "每个领域都将结构性挑战、研究议程与实际落地路径连接起来。", areasLabel: "AESIR 研究领域", sectionsLabel: "研究内容", navigationLabel: "研究内容导航", previous: "上一节", complete: "完成", built: "AESIR 已落地的应用" },
    method: { title: "从实证走向可衡量的公共价值。", intro: "AESIR 将研究、工程、验证与实际采用视为一个连续的实践过程。", steps: [["研究", "从科学、市场与政策背景界定真正的人类需求。"], ["原型开发", "将实证转化为可测试的 XR、AI 与交互系统架构。"], ["实地验证", "与真实用户、机构、专业人士和社区共同测试。"], ["公共价值", "衡量采用程度、包容性、福祉，以及商业扩展能力。"]] },
    evidence: { title: "应用项目、合作伙伴与公共成果。", intro: "持续累积的参与式研究、跨界协作，以及由实践推动的学习成果。", imageAlt: "AESIR 与包容性 AI 项目合作伙伴", outputs: [{ title: "社会创新项目", description: "Happy Kingdom 与 Smart Sports 将包容性学习和积极老龄化理念发展成获得资助、真正面向公众的项目，而不是停留在演示或概念原型阶段。" }, { title: "健康与康复", description: "工作涵盖混合现实 AED 紧急应变训练、哮喘照护支持、老年人防跌倒游戏、VR 心理健康项目与辅助学习工具。" }, { title: "教育与公共知识", description: "AESIR 与大学及教育伙伴合作，把研究转化为 AR 漫画、可持续发展游戏、语言学习资源、文化遗产体验及互动课堂平台。" }, { title: "跨界实践", description: "AESIR 曾为 NGO、学校、大学、公共机构、医疗团队与商业伙伴建立各类体验，在截然不同的用户与治理环境中验证同类科技。" }] },
    projects: { title: "跨越科技与社会的实际落地。", intro: "AESIR 已在不同行业与真实场景中落地多个项目，将研究与新兴科技转化为服务机构、社区与日常生活的实际应用。", all: "全部", searchLabel: "搜索项目", searchPlaceholder: "搜索项目", filterLabel: "按类别筛选项目", browseAll: "正在浏览完整项目档案", browseCategory: (category) => `正在浏览“${category}”`, matches: (query, category) => category ? `显示“${query}”在“${category}”中的搜索结果` : `显示“${query}”的搜索结果`, view: "查看项目", empty: "未找到符合条件的项目，请尝试其他名称或类别。", fewer: "收起部分项目", more: "查看更多项目", mediaAlt: (title) => `${title} 项目媒体` },
    leadership: { title: "由跨行业、深入社区的实践者共同建立。", intro: "AESIR 由活跃于 AI、AR、VR、游戏、包容性教育、公共创新与以人为本科技领域的社会创业者建立。我们把技术落地与课堂、诊所、社区机构、公共项目及跨界合作的真实需求连接起来。", featureTitle: "临床同理心，产业执行力。", featureBody: "AESIR 多年来与学校、NGO、医院、企业与公共机构共同开发项目，逐步建立今天的研究实践。这些实地经验让“包容”不再只是抽象理念，而成为设计与落地时必须满足的核心要求。", featureAlt: "AESIR 联合创办人 Ernest HS CHAN 阅读 AR 积极心理学互动手册", photoLabels: ["公共对话", "“AI for All”包容性项目", "香港资讯及通讯科技奖", "跨界实践"], photoAlts: ["Ernest HS CHAN 在公共座谈会上发言", "AESIR 与“AI for All”包容性项目合作伙伴", "Ernest HS CHAN 与嘉宾出席 2021 香港资讯及通讯科技奖颁奖典礼", "商业实践课程参与者与跨界合作伙伴"], archiveAlts: ["Ernest HS CHAN 与 Elon Musk 在中国国旗及香港区旗之间合影", "社区辅导与虚拟现实项目合作伙伴", "AESIR 项目演示现场", "创办人在应用培训活动中发言", "AESIR 创办人在社会创新场地展示 Happy Kingdom 互动手册", "AESIR 创办人访问合影", "AESIR 出席 2016 DBS-NUS 亚洲社会企业挑战赛颁奖典礼", "Ernest 与嘉宾展示 Happy Kingdom 互动手册", "Lion Rock Daily 关于青年就业研究的报道", "AESIR 创办人在楼梯展示 Happy Kingdom 互动手册"] },
    contact: { titleBefore: "与 AESIR", titleWith: "", titleAfter: "共创", body: "与 AESIR 联系，探索研究合作、应用创新、机构项目或科技落地的合作机会。", action: "联系 AESIR" },
    footer: "基于实证的沉浸式智能。",
    seo: { title: "AESIR｜基于实证的沉浸式智能", description: "AESIR 连接人类神经多样性与前沿科技，通过基于实证的沉浸式智能、XR、AI、HCI 与公共创新，将研究转化为可衡量的公共价值。" },
  },
};

export const languages = {
  en: { ...sharedEnglish, researchAreas: englishResearchAreas },
  traditional: { ...chinese.traditional, researchAreas: chineseResearchAreas.traditional },
  simplified: { ...chinese.simplified, researchAreas: chineseResearchAreas.simplified },
};

export const getInitialLanguage = () => {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return LANGUAGE_KEYS.includes(stored) ? stored : "en";
};
