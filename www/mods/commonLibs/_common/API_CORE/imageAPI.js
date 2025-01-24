/**
 * @namespace MATTIE.imageAPI
 * @description the api for handling image related things, currently only saves bitmap to file.
 */
MATTIE.imageAPI = MATTIE.imageAPI || {};


MATTIE.imageAPI.saveBitmapToFile = function saveBitmapToFile(bitmap, outputPath) {
    var path = require("path");
    var fs = require('fs');

    bitmap.addLoadListener(() => {
        // Ensure the Bitmap is ready
        if (!bitmap.isReady()) {
            console.error("Bitmap is not ready to be saved.");
            return;
        }

        try {
            // Get the underlying canvas
            const canvas = bitmap._canvas;
    
            // Convert the canvas to a Base64 data URL
            const dataUrl = canvas.toDataURL("image/png"); // PNG format
    
            // Extract the Base64 data portion (strip off the 'data:image/png;base64,' part)
            const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, "");
    
            // Decode the Base64 string into binary data
            const buffer = Buffer.from(base64Data, "base64");
    
            // Ensure the output directory exists
            const outputDir = path.dirname(outputPath);
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }
    
            // Write the binary data to the file
            fs.writeFileSync(outputPath, buffer);
            console.log(`Image saved to: ${outputPath}`);
        } catch (error) {
            console.error("Failed to save the bitmap:", error);
        }
    });

    
}