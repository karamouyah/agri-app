const fs = require('fs');

let buf = fs.readFileSync('shared/algeria-locations.json');

// Remove any BOM or leading weird characters
while (buf.length > 0 && buf[0] !== 123 && buf[0] !== 91) { 
  buf = buf.slice(1);
}

let text = buf.toString('utf8');

// Try a proper decoding from mis-encoded utf8
let decoded;
try {
   let fixedStr = Buffer.from(text, 'binary').toString('utf8');
   // If the fixed version actually contains correct arabic/french names, keep it
   if (fixedStr.includes('Sétif') || fixedStr.includes('Béjaïa')) {
      text = fixedStr;
      console.log("Successfully decoded from binary/latin1 representation.");
   } else {
     // do manual replacements again just to be 100% sure
     text = text.replace(/SÃ©tif/g, "Sétif");
     text = text.replace(/SaÃ¯da/g, "Saïda");
     text = text.replace(/AbbÃ¨s/g, "Abbès");
     text = text.replace(/MÃ©dÃ©a/g, "Médéa");
     text = text.replace(/BÃ©jaÃ¯a/g, "Béjaïa");
     text = text.replace(/TÃ©bessa/g, "Tébessa");
     text = text.replace(/Tizi Ouzou/g, "Tizi Ouzou");
     text = text.replace(/BÃ©char/g, "Béchar");
     text = text.replace(/Chlef/g, "Chlef");
     text = text.replace(/Guelma/g, "Guelma");
     text = text.replace(/M\'Sila/g, "M'Sila"); 
     text = text.replace(/Oran/g, "Oran");
     text = text.replace(/AÃ¯n/g, "Aïn");
     text = text.replace(/Ã©/g, "é");
     text = text.replace(/Ã¯/g, "ï");
     text = text.replace(/Ã¨/g, "è");
     text = text.replace(/Ã¢/g, "â");
     text = text.replace(/Ã´/g, "ô");
     text = text.replace(/Ã»/g, "û");
     text = text.replace(/Ã§/g, "ç");
   }
} catch(e) {
}

fs.writeFileSync('shared/algeria-locations.json', text, 'utf8');
console.log("JSON cleaned and saved!");
