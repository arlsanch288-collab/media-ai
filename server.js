// ==========================================
// MEDIA AI - BACKEND SERVER
// ==========================================

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const http = require("http");
const https = require("https");
const sharp = require("sharp");


// ==========================================
// APP CONFIG
// ==========================================

const app = express();

// Local: 3000
// Render: Render ka provided PORT
const PORT = process.env.PORT || 3000;


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors({
    origin: "*"
}));

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


// ==========================================
// DOWNLOAD FOLDER
// ==========================================

const downloadsFolder = path.join(
    __dirname,
    "downloads"
);

if (!fs.existsSync(downloadsFolder)) {
    fs.mkdirSync(downloadsFolder, {
        recursive: true
    });
}


// ==========================================
// STATIC FILES
// ==========================================

app.use(express.static(__dirname));

app.use(
    "/downloads",
    express.static(downloadsFolder)
);


// ==========================================
// HOME PAGE
// ==========================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "index.html"
        )
    );

});


// ==========================================
// FAVICON
// ==========================================

app.get("/favicon.ico", (req, res) => {

    res.status(204).end();

});


// ==========================================
// MULTER
// ==========================================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(
            null,
            downloadsFolder
        );

    },

    filename: (req, file, cb) => {

        const cleanName =
            file.originalname.replace(
                /[^a-zA-Z0-9._-]/g,
                "_"
            );

        cb(
            null,
            `upload_${Date.now()}_${cleanName}`
        );

    }

});


const upload = multer({
    storage
});


// ==========================================
// HELPER
// ==========================================

function isHttpUrl(url) {

    try {

        const parsed = new URL(url);

        return (
            parsed.protocol === "http:" ||
            parsed.protocol === "https:"
        );

    } catch {

        return false;

    }

}


// ==========================================
// PLATFORM DETECTION
// ==========================================

function detectPlatform(url) {

    try {

        const hostname =
            new URL(url)
                .hostname
                .toLowerCase();

        if (
            hostname.includes("youtube.com") ||
            hostname.includes("youtu.be")
        ) {
            return "youtube";
        }

        if (
            hostname.includes("instagram.com") ||
            hostname.includes("instagr.am")
        ) {
            return "instagram";
        }

        if (
            hostname.includes("tiktok.com") ||
            hostname.includes("vm.tiktok.com") ||
            hostname.includes("vt.tiktok.com")
        ) {
            return "tiktok";
        }

        return "direct";

    } catch {

        return "unknown";

    }

}


// ==========================================
// DIRECT VIDEO DOWNLOAD
// ==========================================

function downloadDirectVideo(
    url,
    outputPath
) {

    return new Promise(
        (resolve, reject) => {

            const client =
                url.startsWith("https://")
                    ? https
                    : http;


            console.log(
                "[DIRECT] Connecting:",
                url
            );


            const request =
                client.get(
                    url,
                    {
                        headers: {

                            "User-Agent":
                                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/154 Safari/537.36",

                            "Accept":
                                "video/mp4,video/*,*/*;q=0.8"

                        }
                    },

                    response => {

                        console.log(
                            "[DIRECT] HTTP STATUS:",
                            response.statusCode
                        );


                        // ==================================
                        // REDIRECT
                        // ==================================

                        if (
                            response.statusCode >= 300 &&
                            response.statusCode < 400 &&
                            response.headers.location
                        ) {

                            response.resume();

                            const redirectURL =
                                new URL(
                                    response.headers.location,
                                    url
                                ).toString();


                            return downloadDirectVideo(
                                redirectURL,
                                outputPath
                            )
                                .then(resolve)
                                .catch(reject);

                        }


                        // ==================================
                        // HTTP ERROR
                        // ==================================

                        if (
                            response.statusCode < 200 ||
                            response.statusCode >= 300
                        ) {

                            response.resume();

                            return reject(
                                new Error(
                                    `Remote server returned HTTP ${response.statusCode}`
                                )
                            );

                        }


                        const contentType =
                            response.headers[
                                "content-type"
                            ] || "";


                        console.log(
                            "[DIRECT] CONTENT TYPE:",
                            contentType
                        );


                        // ==================================
                        // CREATE FILE
                        // ==================================

                        const fileStream =
                            fs.createWriteStream(
                                outputPath
                            );


                        response.pipe(
                            fileStream
                        );


                        response.on(
                            "error",
                            error => {

                                fileStream.destroy();

                                if (
                                    fs.existsSync(
                                        outputPath
                                    )
                                ) {

                                    fs.unlinkSync(
                                        outputPath
                                    );

                                }

                                reject(error);

                            }
                        );


                        fileStream.on(
                            "finish",
                            () => {

                                fileStream.close(
                                    () => {

                                        resolve({
                                            contentType
                                        });

                                    }
                                );

                            }
                        );


                        fileStream.on(
                            "error",
                            error => {

                                if (
                                    fs.existsSync(
                                        outputPath
                                    )
                                ) {

                                    fs.unlinkSync(
                                        outputPath
                                    );

                                }

                                reject(error);

                            }
                        );

                    }
                );


            // ======================================
            // TIMEOUT
            // ======================================

            request.setTimeout(
                120000,
                () => {

                    request.destroy(
                        new Error(
                            "Download timed out."
                        )
                    );

                }
            );


            // ======================================
            // REQUEST ERROR
            // ======================================

            request.on(
                "error",
                error => {

                    if (
                        fs.existsSync(
                            outputPath
                        )
                    ) {

                        fs.unlinkSync(
                            outputPath
                        );

                    }

                    reject(error);

                }
            );

        }
    );

}


// ==========================================
// ROUTE 1
// MEDIA DOWNLOAD
// ==========================================

app.post(
    "/api/extract-media",
    async (req, res) => {

        console.log(
            "\n=========================================="
        );

        console.log(
            "[API] /api/extract-media"
        );


        try {

            const {
                url,
                quality = "1080p"
            } = req.body;


            console.log(
                "[API] URL:",
                url
            );


            console.log(
                "[API] QUALITY:",
                quality
            );


            // ======================================
            // CHECK URL
            // ======================================

            if (!url) {

                return res.status(400).json({

                    success: false,

                    error:
                        "Video URL required."

                });

            }


            if (!isHttpUrl(url)) {

                return res.status(400).json({

                    success: false,

                    error:
                        "Please enter a valid HTTP/HTTPS URL."

                });

            }


            // ======================================
            // DETECT PLATFORM
            // ======================================

            const platform =
                detectPlatform(url);


            console.log(
                "[PLATFORM]:",
                platform
            );


            // ======================================
            // YOUTUBE
            // ======================================

            if (platform === "youtube") {

                console.log(
                    "[TYPE] YouTube"
                );


                return res.status(400).json({

                    success: false,

                    type: "youtube",

                    error:
                        "YouTube downloads require an authorized integration. Direct media URLs are supported."

                });

            }


            // ======================================
            // INSTAGRAM
            // ======================================

            if (platform === "instagram") {

                console.log(
                    "[TYPE] Instagram"
                );


                return res.status(400).json({

                    success: false,

                    type: "instagram",

                    error:
                        "Instagram downloads require an authorized integration. Direct media URLs are supported."

                });

            }


            // ======================================
            // TIKTOK
            // ======================================

            if (platform === "tiktok") {

                console.log(
                    "[TYPE] TikTok"
                );


                return res.status(400).json({

                    success: false,

                    type: "tiktok",

                    error:
                        "TikTok downloads require an authorized integration. Direct media URLs are supported."

                });

            }


            // ======================================
            // DIRECT MEDIA
            // ======================================

            console.log(
                "[TYPE] Direct Media"
            );


            const fileName =
                `media_${Date.now()}.mp4`;


            const outputPath =
                path.join(
                    downloadsFolder,
                    fileName
                );


            try {

                await downloadDirectVideo(
                    url,
                    outputPath
                );


                // Relative URL works locally AND on Render
                const downloadUrl =
                    `/downloads/${fileName}`;


                console.log(
                    "[DIRECT] FILE CREATED:",
                    outputPath
                );


                console.log(
                    "[DIRECT] SUCCESS"
                );


                return res.json({

                    success: true,

                    type: "direct",

                    title:
                        "Direct Media",

                    quality,

                    downloadUrl,

                    fileName

                });


            } catch (error) {

                console.error(
                    "[DIRECT ERROR]:",
                    error.message
                );


                if (
                    fs.existsSync(
                        outputPath
                    )
                ) {

                    fs.unlinkSync(
                        outputPath
                    );

                }


                return res.status(500).json({

                    success: false,

                    error:
                        `Direct video download failed: ${error.message}`

                });

            }

        } catch (error) {

            console.error(
                "[API ERROR]:",
                error.message
            );


            return res.status(500).json({

                success: false,

                error:
                    error.message

            });

        }

    }
);


// ==========================================
// ROUTE 2
// IMAGE ENHANCER
// ==========================================

app.post(
    "/api/enhance-image",
    upload.single("image"),
    async (req, res) => {

        try {

            if (!req.file) {

                return res.status(400).json({

                    success: false,

                    error:
                        "Image file select karein."

                });

            }


            const mode =
                req.body.mode || "photo";


            const inputPath =
                req.file.path;


            const outputFileName =
                `enhanced_${Date.now()}.png`;


            const outputPath =
                path.join(
                    downloadsFolder,
                    outputFileName
                );


            const image =
                sharp(inputPath);


            const metadata =
                await image.metadata();


            const width =
                (metadata.width || 800) * 2;


            const height =
                (metadata.height || 600) * 2;


            // ======================================
            // PHOTO MODE
            // ======================================

            if (
                mode === "photo"
            ) {

                await image
                    .resize(
                        width,
                        height,
                        {
                            kernel:
                                "lanczos3"
                        }
                    )
                    .sharpen({
                        sigma: 1.5
                    })
                    .modulate({
                        brightness: 1.05,
                        saturation: 1.15
                    })
                    .png()
                    .toFile(
                        outputPath
                    );

            }


            // ======================================
            // ANIME MODE
            // ======================================

            else {

                await image
                    .resize(
                        width,
                        height,
                        {
                            kernel:
                                "mitchell"
                        }
                    )
                    .sharpen({
                        sigma: 1
                    })
                    .median(1)
                    .png()
                    .toFile(
                        outputPath
                    );

            }


            // ======================================
            // DOWNLOAD URL
            // ======================================

            const downloadUrl =
                `/downloads/${outputFileName}`;


            return res.json({

                success: true,

                downloadUrl,

                fileName:
                    outputFileName

            });

        } catch (error) {

            console.error(
                "[IMAGE ERROR]:",
                error.message
            );


            return res.status(500).json({

                success: false,

                error:
                    error.message

            });

        }

    }
);


// ==========================================
// SERVER START
// ==========================================

app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log("");

        console.log(
            "=========================================="
        );

        console.log(
            "🚀 MEDIA AI SERVER"
        );

        console.log(
            `MEDIA AI running on port ${PORT}`
        );

        console.log(
            "=========================================="
        );

        console.log(
            "Server is ready."
        );

        console.log("");

    }
);