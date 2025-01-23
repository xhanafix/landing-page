class SalesPageGenerator {
    constructor() {
        this.form = document.getElementById('salesPageForm');
        this.generateBtn = document.getElementById('generateBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.salesPageContent = document.getElementById('salesPageContent');
        this.apiKeyInput = document.getElementById('apiKey');
        this.modelSelect = document.getElementById('modelSelect');
        this.progressContainer = document.getElementById('progressContainer');
        this.progress = document.getElementById('progress');
        this.steps = [
            document.getElementById('step1'),
            document.getElementById('step2'),
            document.getElementById('step3')
        ];
        
        this.loadStoredSettings();
        this.initializeEventListeners();
        this.initializeTheme();
    }

    loadStoredSettings() {
        const storedApiKey = CONFIG.getApiKey();
        if (storedApiKey) {
            this.apiKeyInput.value = storedApiKey;
        }

        const storedModel = CONFIG.getSelectedModel();
        this.modelSelect.value = storedModel;
    }

    initializeEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.resetBtn.addEventListener('click', () => this.handleReset());
        this.downloadBtn.addEventListener('click', () => this.handleDownload());
        this.apiKeyInput.addEventListener('change', () => this.handleApiKeyChange());
        this.modelSelect.addEventListener('change', () => this.handleModelChange());
    }

    handleApiKeyChange() {
        const apiKey = this.apiKeyInput.value.trim();
        if (apiKey) {
            CONFIG.setApiKey(apiKey);
        }
    }

    handleModelChange() {
        const selectedModel = this.modelSelect.value;
        CONFIG.setSelectedModel(selectedModel);
    }

    initializeTheme() {
        const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
        const currentTheme = localStorage.getItem('theme');

        if (currentTheme) {
            document.documentElement.setAttribute('data-theme', currentTheme);
            if (currentTheme === 'dark') {
                toggleSwitch.checked = true;
            }
        }

        toggleSwitch.addEventListener('change', (e) => {
            if (e.target.checked) {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    updateProgress(step, progress) {
        this.steps.forEach((s, index) => {
            if (index < step) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });
        this.progress.style.width = `${progress}%`;
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        if (!CONFIG.getApiKey()) {
            alert('Sila masukkan API key terlebih dahulu');
            return;
        }

        this.generateBtn.disabled = true;
        this.generateBtn.textContent = 'Menjana...';
        this.progressContainer.style.display = 'block';
        this.updateProgress(1, 0);

        try {
            // Analysis phase
            this.updateProgress(1, 33);
            const analysisPrompt = this.createAnalysisPrompt();
            const analysis = await AIApi.generateContent(analysisPrompt);
            
            // Generation phase
            this.updateProgress(2, 66);
            const salesPagePrompt = this.createSalesPagePrompt(analysis);
            const content = await AIApi.generateContent(salesPagePrompt);
            
            // Completion phase
            this.updateProgress(3, 100);
            this.displayContent(content);
            this.downloadBtn.disabled = false;

            // Hide progress after a delay
            setTimeout(() => {
                this.progressContainer.style.display = 'none';
                this.updateProgress(0, 0);
            }, 2000);
        } catch (error) {
            alert(`Ralat: ${error.message}`);
            this.progressContainer.style.display = 'none';
            this.updateProgress(0, 0);
        } finally {
            this.generateBtn.disabled = false;
            this.generateBtn.textContent = 'Jana Kandungan';
        }
    }

    createAnalysisPrompt() {
        const productName = document.getElementById('productName').value;
        const description = document.getElementById('description').value;

        return `Sila analisa produk/perkhidmatan ini dan berikan maklumat berikut dalam format JSON:
            Produk: ${productName}
            Penerangan: ${description}

            Sila berikan analisis dalam format JSON seperti berikut:
            {
                "targetAudience": [array 3 sasaran pengguna utama],
                "painPoints": [array 5 masalah utama yang diselesaikan],
                "benefits": [array 5 manfaat utama],
                "features": [array 5 ciri-ciri utama],
                "uniqueSellingPoints": [array 3 kelebihan berbanding pesaing],
                "testimonialProfiles": [array 9 profil testimoni yang sesuai],
                "pricePoint": "cadangan julat harga yang sesuai",
                "marketPosition": "kedudukan dalam pasaran"
            }`;
    }

    createSalesPagePrompt(analysis) {
        const productName = document.getElementById('productName').value;
        const description = document.getElementById('description').value;

        return `Sila jana halaman jualan yang menarik dalam Bahasa Malaysia menggunakan maklumat berikut:

            Produk: ${productName}
            Penerangan: ${description}
            Analisis Pasaran: ${analysis}

            Sila ikut struktur berikut dan gunakan analisis di atas untuk menghasilkan kandungan yang meyakinkan:

            1. Tajuk Utama (yang menarik perhatian)
            2. Tajuk Kecil (yang menjelaskan nilai)
            3. Kandungan Video Jualan (VSL) - skrip penuh
            4. Seruan Tindakan (CTA) yang menarik
            5. Tiga Testimoni (gunakan profil dari analisis)
            6. Tiga Penyelesaian untuk Pelanggan (berdasarkan painPoints)
            7. Tiga Testimoni Tambahan (gunakan profil berbeza)
            8. Proses Terperinci (langkah-langkah penggunaan produk/perkhidmatan)
            9. Butiran Pakej yang Disertakan (dengan nilai setiap komponen)
            10. Seruan Tindakan (CTA) kedua
            11. Tentang Kami (cerita yang meyakinkan)
            12. Tiga Testimoni Akhir (gunakan profil berbeza)
            13. Lima Soalan Lazim (FAQ yang menangani keraguan)
            14. Seruan Tindakan Terakhir (CTA) yang mendesak

            Pastikan:
            - Gunakan bahasa yang meyakinkan dan beremosi
            - Masukkan frasa-frasa yang mendesak tindakan
            - Gunakan statistik dan fakta yang relevan
            - Setiap bahagian mesti menuju ke matlamat jualan
            - Testimoni mestilah spesifik dan believable
            - Gunakan ayat-ayat pendek dan perenggan yang mudah dibaca`;
    }

    displayContent(content) {
        this.salesPageContent.textContent = content;
    }

    handleReset() {
        this.salesPageContent.textContent = '';
        this.downloadBtn.disabled = true;
        this.progressContainer.style.display = 'none';
        this.updateProgress(0, 0);
    }

    handleDownload() {
        const content = this.salesPageContent.textContent;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'halaman-jualan.txt';
        a.click();
        window.URL.revokeObjectURL(url);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new SalesPageGenerator();
}); 