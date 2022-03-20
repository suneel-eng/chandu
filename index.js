const StreamZip = require('node-stream-zip');
const { documentParser } = require('./parser/parser');

module.exports = class Document {
    constructor(file, options = {
        editable: false,
        delText: false
    }) {
        this.file = file;
        this.options = options;
    }

    extractAsHTML() {
        return new Promise((resolve, reject) => {
            const zip = new StreamZip({
                file: this.file,
                storeEntries: true
            });

            let chunks = [],
                content = '',
                components = '',
                styleChunks = [],
                styleContent = '',
                styleComponents = '';

            zip.on('error', (err) => {
                reject(err);
            });

            zip.on('ready', () => {

                // read document.xml file
                zip.stream('word/document.xml', (err, stream) => {
                    if (err) reject(reject(err));

                    stream.on('data', function (chunk) {
                        chunks.push(chunk)
                    });

                    stream.on('end', () => {
                        content = Buffer.concat(chunks)
                        zip.close()
                        components = content.toString();
                        let text = documentParser(components, this.options);
                        resolve(text);
                    });
                });
            });
        });
    };
};