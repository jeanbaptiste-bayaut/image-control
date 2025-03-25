import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();
const dir = path.join(__dirname, '/api/logs');

export const logWritter = (req, res, next) => {
  const { method, url, body } = req;
  const date = new Date();
  if (url === '/api/products/observations') {
    body.observations.forEach((product) => {
      const log = `${date} - ${method} - ${url} - ${JSON.stringify(
        product
      )};\n`;
      fs.writeFile(path.join(dir, 'app.log'), log, { flag: 'a+' }, (err) => {
        if (err) {
          console.error(err);
        }
      });
    });
  } else {
    const log = `${date} - ${method} - ${url} - ${body.list[0].pattern}-${body.list[0].color};\n`;
    fs.writeFile(path.join(dir, 'app.log'), log, { flag: 'a+' }, (err) => {
      if (err) {
        console.error(err);
      }
    });
  }
  next();
};
