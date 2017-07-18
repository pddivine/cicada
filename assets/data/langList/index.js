const fs = require('fs');
const root = require('node-root.pddivine');

// From: http://www-01.sil.org/iso639-3/download.asp
const langIso639 = fs.readFileSync(`${root}/assets/data/langList/iso-639-3_Name_Index_20170217.tab`, { encoding: 'UTF-8'});

module.exports = langIso639.split('\n').reduce( (acc, cur) => {
  const [id, name, invertedName] = cur.split('\t');
  return (acc[id] = { name, invertedName }) && acc;
}, {});