import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();

export default class MainController {
  static async setProductStatus(req, res) {
    const { list } = req.body;

    const filePath = path.join(__dirname, 'api/data', 'linelist.json');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      try {
        const result = JSON.parse(data);

        result.map((product) => {
          const found = list.find(
            (item) =>
              item.pattern + item.color === product.pattern + product.color
          );
          if (found) {
            product.status = 'true';
          }
        });

        fs.writeFile(
          filePath,
          JSON.stringify(result, null, 2),
          (writeError) => {
            if (writeError) {
              console.error(writeError);
              res.status(500).json({ error: 'Error writing file' });
            } else {
              return { messsage: 'status updated' };
            }
          }
        );

        res.status(200).json({ messsage: 'status updated' });
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        res.status(500).json({ error: 'Invalid JSON format' });
      }
    });
  }

  static getProducts(req, res) {
    const filePath = path.join(__dirname, 'api/data', 'linelist.json');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      try {
        const result = JSON.parse(data);
        res.json(result);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        res.status(500).json({ error: 'Invalid JSON format' });
      }
    });
  }

  static getObservations(req, res) {
    const filePath = path.join(__dirname, 'api/data', 'observation.json');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      try {
        const result = JSON.parse(data);
        res.json(result);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        res.status(500).json({ error: 'Invalid JSON format' });
      }
    });
  }

  static writeObservations(req, res) {
    const filePath = path.join(__dirname, 'api/data', 'observation.json');
    const { observations } = req.body;
    console.log('observations', observations);

    let result = [];
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      try {
        const file = JSON.parse(data);

        file.map((item) => {
          result.push(item);
        });

        const newObservations = [...result, ...observations];

        fs.writeFile(
          filePath,
          JSON.stringify(newObservations, null, 2),
          (writeError) => {
            if (writeError) {
              console.error(writeError);
              res.status(500).json({ error: 'Error writing file' });
            } else {
              return { messsage: 'status updated' };
            }
          }
        );

        res.json({ messsage: 'observations written' });
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
      }
    });
  }
}
