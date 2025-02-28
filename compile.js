const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const cppFolder = path.join(__dirname, "./cpp");
const dllFolder = path.join(__dirname, "./dll");

// Ensure the DLL folder exists
if (!fs.existsSync(dllFolder)) {
    fs.mkdirSync(dllFolder, { recursive: true });
}

// Find all `.cpp` files in the `cpp` directory
const cppFiles = fs.readdirSync(cppFolder).filter(file => file.endsWith(".cpp"));

if (cppFiles.length === 0) {
    console.log("No C++ files found to compile.");
    process.exit(0);
}

console.log("Compiling C++ files...");

cppFiles.forEach(file => {
    const inputFile = path.join(cppFolder, file);
    const outputFile = path.join(dllFolder, file.replace(".cpp", ".dll"));

    try {
        execSync(`g++ -shared -o "${outputFile}" "${inputFile}" -luser32 -lpsapi`, { stdio: "inherit" });
        console.log(`Compiled: ${file} -> ${outputFile}`);
    } catch (error) {
        console.error(`Error compiling ${file}:`, error.message);
        process.exit(1);
    }
});

console.log("C++ compilation complete.");
