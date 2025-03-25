import fs from 'fs';
import path from 'path';
import csv2json from 'csvtojson';

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

  static uploadFile(req, res) {
    const file = req.file;

    if (!file) {
      const error = new Error('Please upload a file');
      error.httpStatusCode = 400;
      return res.status(400).json({ error: 'Please upload a file' });
    }

    const dir = path.join(__dirname, 'uploads');

    const filePath = path.join(dir, file.filename);

    if (filePath) {
      csv2json({
        noheader: false,
        headers: ['pattern', 'color', 'name', 'status'],
        delimiter: ';',
      })
        .fromFile(filePath)
        .then((jsonObj) => {
          try {
            if (jsonObj.length > 0) {
              fs.writeFile(
                path.join(__dirname, 'api/data', 'linelist.json'),
                JSON.stringify(jsonObj, null, 2),
                (writeError) => {
                  if (writeError) {
                    console.error(writeError);
                    res.status(500).json({ error: 'Error writing file' });
                  } else {
                    return { messsage: 'status updated' };
                  }
                }
              );
            }
          } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            res.status(500).json({ error: 'Invalid JSON format' });
          }
        });
    }

    const emptyTable = [];

    fs.writeFile(
      path.join(__dirname, 'api/data', 'observation.json'),
      JSON.stringify(emptyTable, null, 2),
      (writeError) => {
        if (writeError) {
          console.error(writeError);
          res.status(500).json({ error: 'Error writing file' });
        } else {
          return { messsage: 'status updated' };
        }
      }
    );

    fs.readdir(dir, (err, files) => {
      if (err) {
        console.error(err);
        return;
      }
      files.forEach((file) => {
        fs.unlink(path.join(dir, file), (deleteError) => {
          if (deleteError) {
            console.error(deleteError);
            return;
          }
        });
      });
    });

    res.json({ messsage: 'file uploaded & observations deleted' });
  }
}
