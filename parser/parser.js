const cheerio = require('cheerio');
const { textParser } = require('./text-parser');

/* document parser */
let documentParser = (data, options) => {
    // console.log(data);
    let html = '';
    const $ = cheerio.load(data, {
        xml: {
            normalizeWhitespace: true,
          },
    });
    const body = $('w\\:body');
    const _paras = body['0'].children;
    for(let i = 0; i < _paras.length; i++) {
        if(_paras[i].name === 'w:tbl') {
            let tableRows = _paras[i].children.filter(child => child.name === 'w:tr');
            let rows = '';
            tableRows.forEach(row => {
                let columns = '';
                let tableColumns = row.children.filter(child => child.name === 'w:tc');
                tableColumns.forEach(col => {
                    let colText = '';
                    col.children.forEach(child => {
                        colText += textParser(child);
                    })
                    columns += `<td style="padding: 10px;">${colText}</td>`;
                })
                rows += `<tr>${columns}</tr>`;
            });

            html += `<table border="1" style="border-collapse: collapse;">${rows}</table>`;
        }

        if(_paras[i].name === 'w:p') {
            html += `<div>${textParser(_paras[i])}</div>`;
        }
    }

    return `<div contenteditable=${options.editable}>${html}</div>`;
}

module.exports = {documentParser };