#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const arg = require('arg');

const args = arg(
    {
        // Types
        '--help': Boolean,
        '--version': Boolean,

        // Aliases
        '-v': '--version'
    },
    {
        permissive: true
    }
);

if (args['--version']) {
    const packageJson = require('./package.json');
    const {name, version} = packageJson;
    console.log(`${name} v${version}`);
    process.exit(0);
}

const printHelp = function () {
    console.log([
        'Example usage:',
        '    $ print-markdown README.md    # Print README.md',
        '    $ markdown README.md          # Print README.md',
        '',
        'Command line options:',
        '    $ print-markdown              # Show help',
        '    $ markdown                    # Show help',
        '    $ markdown --help             # Show help',
        '    $ markdown --version          # Show version details',
        '    $ markdown -v                 # Alias for --version'
    ].join('\n'));
};

if (args['--help']) {
    printHelp();
    process.exit(0);
}

const relativeFilePaths = args['_'];

if (relativeFilePaths.length) {
    for (const relativeFilePath of relativeFilePaths) {
        const marked = require('marked');
        const TerminalRenderer = require('marked-terminal');

        marked.setOptions({
            renderer: new TerminalRenderer()
        });

        const cwd = process.cwd();
        const fullFilePathToUse = path.resolve(cwd, relativeFilePath);
        let fileContents;

        try {
            fileContents = fs.readFileSync(fullFilePathToUse, 'UTF-8');
        } catch (e) {
            console.error(`Error: Unable to read file at path ${fullFilePathToUse}`);
        }

        if (typeof fileContents === 'string') {
            console.log(
                marked(
                    fileContents
                )
            );
        }
    }
} else {
    printHelp();
}
