import csvToJson from 'csvtojson';
import fs from 'fs';
import express from 'express';
import {v4 as uuidv4} from 'uuid';

// Convert csv file to json format
csvToJson ()
  .fromFile ('users.csv')
  .then (users => {
    fs.writeFile ('users.json', JSON.stringify (users, null, 4), err => {
      if (err) {
        console.log (err);
      }
      console.log (users);
    });
  })
  .catch (err => console.log (err));

// Backend

const app = express ();

const selectedFields = ['Name', 'Age'];

fs.readFile ('./users.json', (err, data) => {
  if (err) {
    console.log (err);
  }
  let usersData = JSON.parse (data);

  // Make post request
  app.post ('/', (req, res) => {
    const newUser = {
      Index: '90',
      Year: '2020',
      Age: '25',
      Name: 'Eyiyemi',
      Movie: 'Ayo ni',
      field6: '',
    };
    // Insert the new data and check if there is/are selected field(s)
    usersData.push (newUser);

    // if there is/are no selected field(s)
    if (selectedFields.length === 0) {
      return res.json ({
        conversion_key: uuidv4 (),
        json: usersData,
      });
    } else {
      function handleObject (OriginalArr, prop) {
        let newArr = [];
        let obj = {};

        for (let i in OriginalArr) {
          for (let j in prop) {
            obj[prop[j]] = OriginalArr[i][prop[j]];
          }
          newArr.push ({...obj});
        }
        return res.json ({
          conversion_key: uuidv4 (),
          json: newArr,
        });
      }
      handleObject (usersData, selectedFields);
    }
  });
});

const PORT = 5000;

app.listen (PORT, () => console.log (`Server running on port ${PORT}`));
