let formats = require('../formats');

/* numbering parser */

let numberingParser = (data, options) => {
    // let abstractNums = data.split('<w:abstractNum w:abstractNumId="3"');
    // console.log(abstractNums.length);
    return;
};

/* styles parser */
let stylesParser = (data, options) => {
    let styles = data.match(formats['wstyle']);
    let styleObjects = [];
    for(let i = 0; i<= styles.length; i++) {
        let type = /w:type="(?<type>.*?)"/gm.exec(styles[i])?.groups.type;
        let styleId = /w:styleId="(?<id>.*?)"/gm.exec(styles[i])?.groups.id;
        let numId = formats['wnumId'].exec(styles[i])?.groups.id;
        let ilvl = formats['wilvl'].exec(styles[i])?.groups.ilvl;
        if(type) {
            styleObjects.push({type: type, styleId, numId, ilvl});
        };
    };
    return styleObjects;
};

/* document parser */
let documentParser = (data, options) => {
    let paras = data.match(formats['wp']);
    let structuredText = '';
    for (let i = 0; i <= paras.length; i++) {
        let extractedText = '';
        let style = '';
        var runs = paras[i]?.match(formats['wr']);
        var styles = paras[i]?.match(formats['wjc']);

        if (styles !== null) {
            let match = formats['attr'].exec(styles?.[0]);
            if (match !== null) {
                style = match.groups.style
            }
        }
        if (runs !== null) {
            runs?.forEach(run => {
                // let text = formats['wt'].exec(run);
                let text = run.match(formats['wt'])?.map(function (val) {
                    return val.replace(/<\/?w:t>/g, '');
                })[0];

                // let bold = formats['wb'].exec(run);
                let bold = run.match(formats['wb'])?.map(function (val) {
                    return formats['wb'].test(val);
                })[0];
                var underline = formats['wu'].exec(run);
                let delText = run.match(formats['wdelText'])?.map(function (val) {
                    return val.replace(/<\/?w:delText>/g, '');
                })?.[0];
                if (text) {
                    extractedText += `<span style='font-weight:${bold ? 'bold' : 'normal'};text-decoration:${(underline !== null) ? 'underline' : 'none'}'>${text}</span>`;
                    bold = false;
                }
                if (delText && options.delText) {
                    extractedText += `<del style='color:red;font-weight:${bold ? 'bold' : 'normal'}'>${delText}</del>`;
                    bold = false;
                }
            })
        }
        structuredText += `<p style='text-align:${style};outline:none'>${extractedText}</p>`;
    }
    return `<div contenteditable=${options.editable}>${structuredText}</div>`;
}

module.exports = {documentParser, stylesParser, numberingParser};