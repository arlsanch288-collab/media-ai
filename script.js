
// ==========================================
// MEDIA AI - COMPLETE FRONTEND JAVASCRIPT
// ==========================================


// ==========================================
// GLOBAL VARIABLES
// ==========================================

let selectedQuality = "1080p";


// ==========================================
// 1. SWITCH TOOL
// ==========================================

function switchTool(toolId, button) {

    document
        .querySelectorAll(".tool-section")
        .forEach(section => {

            section.classList.add("hidden");

        });


    const section =
        document.getElementById(toolId);


    if (section) {

        section.classList.remove("hidden");

    }


    document
        .querySelectorAll(".tool-tab")
        .forEach(btn => {

            btn.classList.remove(
                "tool-active"
            );

        });


    if (button) {

        button.classList.add(
            "tool-active"
        );

    }

}


// ==========================================
// 2. TOAST
// ==========================================

function toast(message) {

    alert(message);

}


// ==========================================
// 3. QUALITY SELECTOR
// ==========================================

function selectQuality(quality, button) {

    // --------------------------------------
    // Support both:
    // selectQuality("1080p", this)
    // and old selectQuality(this)
    // --------------------------------------

    if (
        typeof quality === "object" &&
        quality !== null
    ) {

        button = quality;

        quality =
            button.innerText.trim();

    }


    document
        .querySelectorAll(".quality-btn")
        .forEach(btn => {

            btn.classList.remove(
                "border-violet-500",
                "bg-violet-500/15",
                "text-violet-300"
            );

            btn.classList.add(
                "border-white/10",
                "text-gray-400"
            );

        });


    if (button) {

        button.classList.remove(
            "border-white/10",
            "text-gray-400"
        );


        button.classList.add(
            "border-violet-500",
            "bg-violet-500/15",
            "text-violet-300"
        );

    }


    selectedQuality =
        quality || "1080p";


    console.log(
        "Selected Quality:",
        selectedQuality
    );

}


// ==========================================
// 4. IMAGE PREVIEW
// ==========================================

function previewImage(input, previewId) {

    const preview =
        document.getElementById(previewId);


    if (!preview) {

        console.error(
            "Preview element not found:",
            previewId
        );

        return;

    }


    if (
        !input.files ||
        !input.files.length
    ) {

        preview.innerHTML = "";

        preview.classList.add(
            "hidden"
        );

        return;

    }


    const file =
        input.files[0];


    // --------------------------------------
    // IMAGE CHECK
    // --------------------------------------

    if (!file.type.startsWith("image/")) {

        toast(
            "Please select an image file."
        );

        input.value = "";

        preview.innerHTML = "";

        preview.classList.add(
            "hidden"
        );

        return;

    }


    // --------------------------------------
    // SIZE CHECK
    // --------------------------------------

    if (
        file.size >
        10 * 1024 * 1024
    ) {

        toast(
            "Image size must be less than 10MB."
        );

        input.value = "";

        preview.innerHTML = "";

        preview.classList.add(
            "hidden"
        );

        return;

    }


    const imageURL =
        URL.createObjectURL(file);


    preview.innerHTML = `

        <div
            class="rounded-2xl overflow-hidden border border-white/10 bg-black/30 p-2"
        >

            <div
                class="w-full h-56 flex items-center justify-center"
            >

                <img
                    src="${imageURL}"
                    alt="Selected image"
                    class="w-full h-full object-contain rounded-xl"
                >

            </div>

        </div>


        <div
            class="mt-3 flex items-center justify-between gap-3"
        >

            <p
                class="text-xs text-gray-400 truncate"
            >
                ${escapeHTML(file.name)}
            </p>

            <p
                class="text-xs text-gray-500 whitespace-nowrap"
            >
                ${(file.size / 1024 / 1024).toFixed(2)} MB
            </p>

        </div>

    `;


    preview.classList.remove(
        "hidden"
    );

}


// ==========================================
// 5. URL VALIDATION
// ==========================================

function isValidURL(url) {

    try {

        const parsed =
            new URL(url);


        return (
            parsed.protocol === "http:" ||
            parsed.protocol === "https:"
        );

    } catch {

        return false;

    }

}


// ==========================================
// 6. HTML ESCAPE
// ==========================================

function escapeHTML(value) {

    return String(value ?? "")
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


// ==========================================
// 7. PLATFORM DETECTION
// ==========================================

function detectMediaPlatform(url) {

    try {

        const hostname =
            new URL(url)
                .hostname
                .toLowerCase();


        if (
            hostname.includes("youtube.com") ||
            hostname.includes("youtu.be")
        ) {

            return "YouTube";

        }


        if (
            hostname.includes("instagram.com") ||
            hostname.includes("instagr.am")
        ) {

            return "Instagram";

        }


        if (
            hostname.includes("tiktok.com") ||
            hostname.includes("vm.tiktok.com") ||
            hostname.includes("vt.tiktok.com")
        ) {

            return "TikTok";

        }


        if (
            hostname.includes("twitter.com") ||
            hostname.includes("x.com")
        ) {

            return "X/Twitter";

        }


        return "Direct Media";

    } catch {

        return "Unknown";

    }

}


// ==========================================
// 8. PLATFORM STATUS
// ==========================================

function updatePlatformStatus() {

    const platformInput =
        document.getElementById(
            "videoURL"
        );


    const platformStatus =
        document.getElementById(
            "platformStatus"
        );


    if (
        !platformInput ||
        !platformStatus
    ) {

        return;

    }


    const url =
        platformInput.value.trim();


    if (!url) {

        platformStatus.textContent = "";

        platformStatus.className =
            "mt-3 text-sm text-gray-500";

        return;

    }


    if (!isValidURL(url)) {

        platformStatus.textContent =
            "⚠️ Invalid HTTP/HTTPS URL";

        platformStatus.className =
            "mt-3 text-sm text-red-400";

        return;

    }


    const platform =
        detectMediaPlatform(url);


    // --------------------------------------
    // DIRECT MEDIA
    // --------------------------------------

    if (
        platform === "Direct Media"
    ) {

        platformStatus.textContent =
            "✓ Direct Media detected — ready to download";

        platformStatus.className =
            "mt-3 text-sm text-green-400";

        return;

    }


    // --------------------------------------
    // YOUTUBE
    // --------------------------------------

    if (
        platform === "YouTube"
    ) {

        platformStatus.textContent =
            "ℹ YouTube detected — authorized/API integration required";

        platformStatus.className =
            "mt-3 text-sm text-yellow-400";

        return;

    }


    // --------------------------------------
    // INSTAGRAM
    // --------------------------------------

    if (
        platform === "Instagram"
    ) {

        platformStatus.textContent =
            "ℹ Instagram detected — authorized/API integration required";

        platformStatus.className =
            "mt-3 text-sm text-yellow-400";

        return;

    }


    // --------------------------------------
    // TIKTOK
    // --------------------------------------

    if (
        platform === "TikTok"
    ) {

        platformStatus.textContent =
            "ℹ TikTok detected — authorized/API integration required";

        platformStatus.className =
            "mt-3 text-sm text-yellow-400";

        return;

    }


    // --------------------------------------
    // X / TWITTER
    // --------------------------------------

    if (
        platform === "X/Twitter"
    ) {

        platformStatus.textContent =
            "ℹ X/Twitter detected — authorized/API integration required";

        platformStatus.className =
            "mt-3 text-sm text-yellow-400";

        return;

    }

}


// ==========================================
// 9. DOWNLOAD VIDEO
// ==========================================

async function downloadVideo(event) {

    if (event) {

        event.preventDefault();

        event.stopPropagation();

    }


    console.log(
        "================================="
    );

    console.log(
        "FETCH MEDIA CLICKED"
    );


    const urlInput =
        document.getElementById(
            "videoURL"
        );


    const result =
        document.getElementById(
            "videoResult"
        );


    if (!urlInput) {

        toast(
            "Video URL input not found."
        );

        return;

    }


    if (!result) {

        toast(
            "Result container not found."
        );

        return;

    }


    const url =
        urlInput.value.trim();


    console.log(
        "Sending URL:",
        url
    );


    console.log(
        "Selected Quality:",
        selectedQuality
    );


    // --------------------------------------
    // EMPTY
    // --------------------------------------

    if (!url) {

        toast(
            "Please paste a video URL first."
        );

        urlInput.focus();

        return;

    }


    // --------------------------------------
    // URL VALIDATION
    // --------------------------------------

    if (!isValidURL(url)) {

        toast(
            "Please enter a valid HTTP/HTTPS URL."
        );

        urlInput.focus();

        return;

    }


    const platform =
        detectMediaPlatform(url);


    console.log(
        "Detected Platform:",
        platform
    );


    // --------------------------------------
    // LOADING
    // --------------------------------------

    result.classList.remove(
        "hidden"
    );


    result.innerHTML = `

        <div
            class="rounded-2xl bg-violet-500/10 border border-violet-500/20 p-5"
        >

            <div
                class="flex items-center gap-3"
            >

                <div
                    class="w-5 h-5 border-2 border-violet-400 border-t-transparent rounded-full animate-spin"
                ></div>

                <p
                    class="text-sm text-violet-300 font-semibold"
                >
                    Processing media...
                </p>

            </div>


            <div
                class="mt-3 space-y-1"
            >

                <p
                    class="text-xs text-gray-400"
                >
                    Platform:
                    ${escapeHTML(platform)}
                </p>

                <p
                    class="text-xs text-gray-400"
                >
                    Quality:
                    ${escapeHTML(selectedQuality)}
                </p>

            </div>

        </div>

    `;


    // --------------------------------------
    // REQUEST
    // --------------------------------------

    try {

        const response =
            await fetch(
                "/api/extract-media",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        url: url,

                        quality:
                            selectedQuality

                    })

                }
            );


        console.log(
            "Server HTTP Status:",
            response.status
        );


        let data;


        try {

            data =
                await response.json();

        } catch {

            throw new Error(
                `Server returned HTTP ${response.status} with an invalid response.`
            );

        }


        console.log(
            "Server Response:",
            data
        );


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.error ||
                `Server error: HTTP ${response.status}`
            );

        }


        // --------------------------------------
        // DOWNLOAD URL
        // --------------------------------------

        const downloadURL =
            data.downloadUrl ||
            data.download_url ||
            data.url;


        if (!downloadURL) {

            throw new Error(
                "Server ne download link return nahi kiya."
            );

        }


        const title =
            escapeHTML(
                data.title ||
                "Media Video"
            );


        const fileName =
            escapeHTML(
                data.fileName ||
                "video.mp4"
            );


        const responseType =
            data.type ||
            platform;


        const actualQuality =
            escapeHTML(
                data.actualQuality ||
                data.quality ||
                selectedQuality
            );


        // --------------------------------------
        // SUCCESS
        // --------------------------------------

        result.innerHTML = `

            <div
                class="rounded-2xl bg-green-500/10 border border-green-500/20 p-5"
            >

                <div
                    class="flex items-center gap-2"
                >

                    <div
                        class="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center"
                    >
                        ✓
                    </div>

                    <div>

                        <p
                            class="text-sm text-green-400 font-bold"
                        >
                            Video Ready
                        </p>

                        <p
                            class="text-xs text-gray-500"
                        >
                            Your media file is ready.
                        </p>

                    </div>

                </div>


                <div
                    class="mt-4 p-4 rounded-xl bg-black/20 border border-white/5 space-y-2"
                >

                    <p
                        class="text-xs text-gray-400"
                    >
                        <span class="text-gray-600">
                            Type:
                        </span>

                        ${escapeHTML(responseType)}

                    </p>


                    <p
                        class="text-xs text-gray-400"
                    >
                        <span class="text-gray-600">
                            Title:
                        </span>

                        ${title}

                    </p>


                    <p
                        class="text-xs text-gray-400"
                    >
                        <span class="text-gray-600">
                            Quality:
                        </span>

                        ${actualQuality}

                    </p>

                </div>


                <!-- DOWNLOAD -->

                <a
                    href="${escapeHTML(downloadURL)}"
                    download="${fileName}"
                    class="flex items-center justify-center gap-2 mt-4 w-full py-3.5 rounded-xl bg-green-500 hover:bg-green-400 text-black font-bold transition shadow-lg shadow-green-500/20"
                >

                    <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >

                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        ></path>

                    </svg>

                    Download ${actualQuality}

                </a>


                <!-- OPEN -->

                <a
                    href="${escapeHTML(downloadURL)}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="block text-center mt-2 w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm transition"
                >
                    Open Media
                </a>

            </div>

        `;


        console.log(
            "DOWNLOAD READY:",
            downloadURL
        );


    } catch (error) {

        console.error(
            "EXTRACTION ERROR:",
            error
        );


        result.innerHTML = `

            <div
                class="rounded-2xl bg-red-500/10 border border-red-500/20 p-5"
            >

                <div
                    class="flex items-center gap-2"
                >

                    <span
                        class="text-red-400 text-lg"
                    >
                        !
                    </span>

                    <p
                        class="text-sm text-red-400 font-bold"
                    >
                        Download Failed
                    </p>

                </div>


                <p
                    class="text-xs text-gray-400 mt-3 break-words"
                >
                    ${escapeHTML(error.message)}
                </p>


                <button
                    type="button"
                    onclick="downloadVideo(event)"
                    class="mt-4 w-full py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 text-sm font-semibold transition"
                >
                    Try Again
                </button>

            </div>

        `;

    }

}


// ==========================================
// 10. PHOTO ENHANCER
// ==========================================

async function enhancePhoto() {

    const input =
        document.getElementById(
            "photoInput"
        );


    const result =
        document.getElementById(
            "photoPreview"
        );


    if (
        !input ||
        !input.files ||
        !input.files.length
    ) {

        toast(
            "Please upload a photo first."
        );

        return;

    }


    if (!result) {

        console.error(
            "photoPreview element not found."
        );

        return;

    }


    const file =
        input.files[0];


    // --------------------------------------
    // SIZE
    // --------------------------------------

    if (
        file.size >
        10 * 1024 * 1024
    ) {

        toast(
            "Image size must be less than 10MB."
        );

        return;

    }


    // --------------------------------------
    // ORIGINAL IMAGE
    // --------------------------------------

    const originalURL =
        URL.createObjectURL(file);


    // --------------------------------------
    // LOADING
    // --------------------------------------

    result.classList.remove(
        "hidden"
    );


    result.innerHTML = `

        <div
            class="rounded-2xl border border-fuchsia-500/20 bg-fuchsia-500/5 p-5"
        >

            <div
                class="flex items-center gap-3"
            >

                <div
                    class="w-5 h-5 border-2 border-fuchsia-400 border-t-transparent rounded-full animate-spin"
                ></div>

                <div>

                    <p
                        class="text-sm text-fuchsia-300 font-semibold"
                    >
                        Enhancing your photo...
                    </p>

                    <p
                        class="text-xs text-gray-500 mt-1"
                    >
                        Please wait while MediaAI processes your image.
                    </p>

                </div>

            </div>

        </div>

    `;


    // --------------------------------------
    // FORM DATA
    // --------------------------------------

    const formData =
        new FormData();


    formData.append(
        "image",
        file
    );


    formData.append(
        "mode",
        "photo"
    );


    try {

        const response =
            await fetch(
                "/api/enhance-image",
                {
                    method: "POST",

                    body: formData
                }
            );


        console.log(
            "Enhancement HTTP Status:",
            response.status
        );


        let data;


        try {

            data =
                await response.json();

        } catch {

            throw new Error(
                `Server returned HTTP ${response.status} with an invalid response.`
            );

        }


        console.log(
            "Enhancement Response:",
            data
        );


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.error ||
                "Image enhancement failed."
            );

        }


        const enhancedURL =
            data.downloadUrl;


        if (!enhancedURL) {

            throw new Error(
                "Enhanced image download link not received."
            );

        }


        const fileName =
            data.fileName ||
            "enhanced-photo.png";


        // --------------------------------------
        // BEFORE / AFTER
        // --------------------------------------

        result.innerHTML = `

            <div
                class="rounded-2xl border border-white/10 bg-black/20 p-4"
            >

                <!-- HEADER -->

                <div
                    class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4"
                >

                    <div>

                        <h3
                            class="text-sm font-bold text-white"
                        >
                            Photo Enhancement Result
                        </h3>

                        <p
                            class="text-xs text-gray-500 mt-1"
                        >
                            Compare original and enhanced image
                        </p>

                    </div>


                    <span
                        class="self-start px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold"
                    >
                        ✓ Enhanced
                    </span>

                </div>


                <!-- IMAGE GRID -->

                <div
                    class="grid grid-cols-1 md:grid-cols-2 gap-4"
                >

                    <!-- ORIGINAL -->

                    <div
                        class="rounded-2xl overflow-hidden border border-white/10 bg-black/40"
                    >

                        <div
                            class="px-4 py-3 border-b border-white/10"
                        >

                            <p
                                class="text-xs font-bold text-gray-300"
                            >
                                ORIGINAL
                            </p>

                        </div>


                        <div
                            class="w-full h-64 sm:h-72 flex items-center justify-center p-3 bg-black/50"
                        >

                            <img
                                src="${originalURL}"
                                alt="Original photo"
                                class="w-full h-full object-contain rounded-xl"
                            >

                        </div>

                    </div>


                    <!-- ENHANCED -->

                    <div
                        class="rounded-2xl overflow-hidden border border-green-500/20 bg-black/40"
                    >

                        <div
                            class="px-4 py-3 border-b border-green-500/20 flex items-center justify-between"
                        >

                            <p
                                class="text-xs font-bold text-green-400"
                            >
                                ENHANCED
                            </p>


                            <span
                                class="text-[10px] text-gray-500"
                            >
                                AI PROCESSED
                            </span>

                        </div>


                        <div
                            class="w-full h-64 sm:h-72 flex items-center justify-center p-3 bg-black/50"
                        >

                            <img
                                src="${escapeHTML(enhancedURL)}"
                                alt="Enhanced photo"
                                class="w-full h-full object-contain rounded-xl"
                            >

                        </div>

                    </div>

                </div>


                <!-- FILE INFO -->

                <div
                    class="mt-4 p-4 rounded-xl bg-white/[0.03] border border-white/5"
                >

                    <div
                        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                    >

                        <div
                            class="min-w-0"
                        >

                            <p
                                class="text-[11px] text-gray-600 uppercase tracking-wider"
                            >
                                Original File
                            </p>

                            <p
                                class="text-xs text-gray-300 font-medium truncate"
                            >
                                ${escapeHTML(file.name)}
                            </p>

                        </div>


                        <div
                            class="sm:text-right"
                        >

                            <p
                                class="text-[11px] text-gray-600 uppercase tracking-wider"
                            >
                                Output
                            </p>

                            <p
                                class="text-xs text-gray-300 font-medium"
                            >
                                PNG • Enhanced
                            </p>

                        </div>

                    </div>

                </div>


                <!-- DOWNLOAD -->

                <a
                    href="${escapeHTML(enhancedURL)}"
                    download="${escapeHTML(fileName)}"
                    class="mt-4 flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black font-bold text-sm transition shadow-lg shadow-green-500/20"
                >

                    <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >

                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        ></path>

                    </svg>

                    Download Enhanced Photo

                </a>

            </div>

        `;


        console.log(
            "PHOTO ENHANCED SUCCESSFULLY"
        );


        console.log(
            "Download URL:",
            enhancedURL
        );


    } catch (error) {

        console.error(
            "PHOTO ERROR:",
            error
        );


        result.innerHTML = `

            <div
                class="rounded-2xl bg-red-500/10 border border-red-500/20 p-5"
            >

                <div
                    class="flex items-center gap-2"
                >

                    <span
                        class="text-red-400 text-lg"
                    >
                        !
                    </span>

                    <p
                        class="text-sm text-red-400 font-semibold"
                    >
                        Enhancement Failed
                    </p>

                </div>


                <p
                    class="text-xs text-gray-400 mt-2 break-words"
                >
                    ${escapeHTML(error.message)}
                </p>


                <button
                    type="button"
                    onclick="enhancePhoto()"
                    class="mt-4 w-full py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 text-sm font-semibold transition"
                >
                    Try Again
                </button>

            </div>

        `;

    }

}


// ==========================================
// 11. ANIME UPSCALER
// ==========================================

async function upscaleAnime() {

    const input =
        document.getElementById(
            "animeInput"
        );


    const result =
        document.getElementById(
            "animePreview"
        );


    if (
        !input ||
        !input.files ||
        !input.files.length
    ) {

        toast(
            "Please upload anime artwork first."
        );

        return;

    }


    if (!result) {

        console.error(
            "animePreview element not found."
        );

        return;

    }


    const file =
        input.files[0];


    // --------------------------------------
    // SIZE
    // --------------------------------------

    if (
        file.size >
        10 * 1024 * 1024
    ) {

        toast(
            "Image size must be less than 10MB."
        );

        return;

    }


    const formData =
        new FormData();


    formData.append(
        "image",
        file
    );


    formData.append(
        "mode",
        "anime"
    );


    // --------------------------------------
    // LOADING
    // --------------------------------------

    result.classList.remove(
        "hidden"
    );


    result.innerHTML = `

        <div
            class="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5"
        >

            <div
                class="flex items-center gap-3"
            >

                <div
                    class="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"
                ></div>

                <div>

                    <p
                        class="text-sm text-cyan-300 font-semibold"
                    >
                        Upscaling anime artwork...
                    </p>

                    <p
                        class="text-xs text-gray-500 mt-1"
                    >
                        MediaAI is processing your artwork.
                    </p>

                </div>

            </div>

        </div>

    `;


    try {

        const response =
            await fetch(
                "/api/enhance-image",
                {
                    method: "POST",

                    body: formData
                }
            );


        let data;


        try {

            data =
                await response.json();

        } catch {

            throw new Error(
                `Server returned HTTP ${response.status} with an invalid response.`
            );

        }


        console.log(
            "Anime Response:",
            data
        );


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.error ||
                "Anime upscaling failed."
            );

        }


        const downloadURL =
            data.downloadUrl;


        if (!downloadURL) {

            throw new Error(
                "Anime download link not received."
            );

        }


        const fileName =
            data.fileName ||
            "upscaled-anime.png";


        // --------------------------------------
        // SUCCESS
        // --------------------------------------

        result.innerHTML = `

            <div
                class="rounded-2xl border border-green-500/20 bg-green-500/5 p-4"
            >

                <div
                    class="rounded-2xl overflow-hidden border border-white/10 bg-black/40"
                >

                    <div
                        class="w-full h-72 flex items-center justify-center p-3"
                    >

                        <img
                            src="${escapeHTML(downloadURL)}"
                            alt="Upscaled anime artwork"
                            class="w-full h-full object-contain rounded-xl"
                        >

                    </div>

                </div>


                <div
                    class="mt-4 flex items-center gap-2"
                >

                    <span
                        class="text-green-400"
                    >
                        ✓
                    </span>

                    <p
                        class="text-sm text-green-400 font-semibold"
                    >
                        Anime Artwork Upscaled
                    </p>

                </div>


                <a
                    href="${escapeHTML(downloadURL)}"
                    download="${escapeHTML(fileName)}"
                    class="mt-4 flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-green-500 hover:bg-green-400 text-black font-bold transition"
                >

                    <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >

                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        ></path>

                    </svg>

                    Download Upscaled Image

                </a>

            </div>

        `;


    } catch (error) {

        console.error(
            "ANIME ERROR:",
            error
        );


        result.innerHTML = `

            <div
                class="rounded-2xl bg-red-500/10 border border-red-500/20 p-5"
            >

                <p
                    class="text-sm text-red-400 font-semibold"
                >
                    Anime Upscaling Failed
                </p>


                <p
                    class="text-xs text-gray-400 mt-2 break-words"
                >
                    ${escapeHTML(error.message)}
                </p>


                <button
                    type="button"
                    onclick="upscaleAnime()"
                    class="mt-4 w-full py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 text-sm font-semibold transition"
                >
                    Try Again
                </button>

            </div>

        `;

    }

}


// ==========================================
// 12. DOM READY
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "================================="
        );

        console.log(
            "MEDIA AI JS LOADED"
        );

        console.log(
            "================================="
        );


        // ==================================
        // VIDEO INPUT
        // ==================================

        const videoInput =
            document.getElementById(
                "videoURL"
            );


        if (videoInput) {

            videoInput.addEventListener(
                "input",
                () => {

                    updatePlatformStatus();

                }
            );


            videoInput.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key === "Enter"
                    ) {

                        event.preventDefault();

                        downloadVideo(event);

                    }

                }
            );


            updatePlatformStatus();

        }


        // ==================================
        // SERVER / FRONTEND READY
        // ==================================

        console.log(
            "Frontend initialized successfully."
        );

    }
);
