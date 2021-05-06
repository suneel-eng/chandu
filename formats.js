module.exports = {
    wbody: /<w:body(|\s+[^>]*)>(?<body>.*?)<\/w:body\s*>/gm, // mateches body
    wstyle: /<w:style(|\s+[^>]*)>(?<style>.*?)<\/w:style\s*>/gm, // mateches styles
    wsectPr: /<w:sectPr(|\s+[^>]*)>(?<section>.*?)<\/w:sectPr\s*>/gm, // mateches sections
    wt: /<w:t(|\s+[^>]*)>(?<text>.*?)<\/w:t\s*>/gm, // mateches texts,
    textWt: /(<w:(?<delete>del|ins)(.*?)>)?(<w:run(.*?)*>)<w:(t|delText)(.*?)*>(.*?)<\/w:(t|delText)><\/w:run>(<\/w:(del|ins)>)?/gm, // perfect text parser
    wdelText: /<w:delText(|\s+[^>]*)>(?<delText>.*?)<\/w:delText\s*>/gm, // mateches deleted texts (strike through)
    wr: /<w:r(|\s+[^>]*)>(.*?)<\/w:r\s*>/gm, // matches runs
    wrPr: /<w:rPr(|\s+[^>]*)>(.*?)<\/w:rPr\s*>/gm, // matches run properties
    wp: /<w:p(|\s+[^>]*)>(.*?)<\/w:p\s*>/gm, // matches paragraphs
    wpPr: /<w:pPr(|\s+[^>]*)>(.*?)<\/w:pPr\s*>/gm, // matches paragraph properties
    wnumPr: /<w:numPr(|\s+[^>]*)>(.*?)<\/w:numPr\s*>/gm, // matches num properties
    wjc: /<w:jc(?<style>|\s+[^>]*) (.*?)\/\s*>/gm, // matches alignments
    wb: /<w:b\/\s*>/gm, // matches bold styles,
    wnumId: /<w:numId w:val="(?<id>.*?)"\/>/gm, // matches numIds
    wilvl: /<w:ilvl w:val="(?<ilvl>.*?)"\/>/gm, // matches ilvls
    wcolor: /<w:color(?<color>|\s+[^>]*) (.*?)\/\s*>/gm, // matches colors
    wu: /<w:u(|\s+[^>]*) (.*?)\/\s*>/gm, // matches underlines
    wtbl: /<w:tbl(|\s+[^>]*)>(.*?)<\/w:tbl\s*>/gm, // matches tables
    wtblPr: /<w:tbl(|\s+[^>]*)>(.*?)<\/w:tbl\s*>/gm, // matches table properties
    wtblW: /<w:tblW(|\s+[^>]*) (.*?)\/\s*>/gm, // matches table width
    wtr: /<w:tr(|\s+[^>]*)>(.*?)<\/w:tr\s*>/gm, // matches rows
    wtc: /<w:tc(|\s+[^>]*)>(.*?)<\/w:tc\s*>/gm, // matches columns
    attr: /(\S+)=["']?(?<style>(?:.(?!["']?\s+(?:\S+)=|\s*\/?[>"']))+.)["']?/gm // matches attributes
}