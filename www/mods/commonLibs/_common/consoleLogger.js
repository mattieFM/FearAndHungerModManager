/*:
 * @plugindesc Writes console output to console.txt
 * @author Copilot
 */

(function() {
    // Only run if we are in a Node.js/NW.js environment where 'require' is available
    if (typeof require === 'function') {
        const fs = require('fs');
        const path = require('path');
        
        // Write to console.txt in the current working directory (usually the game folder)
        const logPath = path.join(process.cwd(), 'console.txt');

        // Clear the log file on startup so it contains only logs from the current session
        try {
            fs.writeFileSync(logPath, '--- Console Log Started ---\n');
        } catch(e) {
            // Cannot use console.error here safely if we are about to override it, 
            // but the original console isn't overridden yet.
            if (console.error) console.error("Failed to initialize console.txt", e);
        }

        function writeToFile(level, args) {
            try {
                const message = Array.from(args).map(arg => {
                    if (arg === undefined) return 'undefined';
                    if (arg === null) return 'null';
                    try {
                        if (arg instanceof Error) {
                            return arg.stack || arg.message;
                        }
                        return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
                    } catch(e) {
                        return '[Object]';
                    }
                }).join(' ');
                
                const timestamp = new Date().toISOString();
                const logLine = `[${timestamp}] [${level}] ${message}\n`;
                
                fs.appendFileSync(logPath, logLine);
            } catch (e) {
                // Fail silently to avoid recursion or crashing
            }
        }

        const originalLog = console.log;
        const originalWarn = console.warn;
        const originalError = console.error;
        const originalInfo = console.info;

        console.log = function() {
            writeToFile('LOG', arguments);
            if (originalLog) originalLog.apply(console, arguments);
        };

        console.warn = function() {
            writeToFile('WARN', arguments);
            if (originalWarn) originalWarn.apply(console, arguments);
        };

        console.error = function() {
            writeToFile('ERROR', arguments);
            if (originalError) originalError.apply(console, arguments);
        };

        console.info = function() {
            writeToFile('INFO', arguments);
            if (originalInfo) originalInfo.apply(console, arguments);
        };

        console.log("Console logging to file initialized at: " + logPath);
    }
})();
