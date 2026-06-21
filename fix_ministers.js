const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./data/settings.json', 'utf8'));

const missingMinisters = [
  { name: "Smt. Sunetra Ajit Pawar", designation: "Hon'ble Deputy Chief Minister, Maharashtra State", category: "minister", image: "/images/authority-1.jpg" },
  { name: "Smt. Madhuri Misal", designation: "Hon'ble Minister Of State Medical Education Maharashtra State", category: "minister", image: "/images/authority-3.jpg" }
];

data.authorities.splice(3, 0, missingMinisters[0]);
data.authorities.splice(5, 0, missingMinisters[1]);

fs.writeFileSync('./data/settings.json', JSON.stringify(data, null, 2));
