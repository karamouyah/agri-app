import fs from 'fs';

const filepath = 'shared/algeria-locations.json';
let text = fs.readFileSync(filepath, 'utf8');

console.log("Doing ultimate manual replacements...");
text = text.replace(/SÃ©tif/g, "Sétif");
text = text.replace(/SaÃ¯da/g, "Saïda");
text = text.replace(/AbbÃ¨s/g, "Abbès");
text = text.replace(/MÃ©dÃ©a/g, "Médéa");
text = text.replace(/BÃ©jaÃ¯a/g, "Béjaïa");
text = text.replace(/TÃ©bessa/g, "Tébessa");
text = text.replace(/BÃ©char/g, "Béchar");
text = text.replace(/AÃ¯n/g, "Aïn");
text = text.replace(/Ã©/g, "é");
text = text.replace(/Ã¯/g, "ï");
text = text.replace(/Ã¨/g, "è");
text = text.replace(/Ã¢/g, "â");
text = text.replace(/Ã´/g, "ô");
text = text.replace(/Ã»/g, "û");
text = text.replace(/Ã§/g, "ç");

// Write back
fs.writeFileSync(filepath, text, 'utf8');
console.log("Locations encoding fixed properly this time.");