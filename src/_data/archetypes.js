const fs = require('fs');
const path = require('path');

module.exports = () => {
  const files = fs.readdirSync(path.join(__dirname, 'archetypes'));
  const archetypes = files.map((file) => {
    const data = fs.readFileSync(path.join(__dirname, `archetypes/${file}`));
    return JSON.parse(data);
  });

  return archetypes;
};
