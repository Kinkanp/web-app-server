const fs = require('fs');
const path = require('path');

const DOMAIN_PATH = path.join(process.cwd(), 'src/domain');
const domains = fs.readdirSync(DOMAIN_PATH);

const rules = domains.map(domain => ({
  'target': `src/domain/${domain}/**/*`,
  'from': `src/domain/!(${domain})/**/*`
}));
console.log(rules);
