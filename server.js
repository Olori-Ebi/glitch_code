import csvToJson from 'csvtojson';
import fs from 'fs';
import express from 'express';
import {v4 as uuidv4} from 'uuid';

// Convert csv file to json format
csvToJson ()
  .fromFile ('students.csv')
  .then (students => {
    fs.writeFile ('students.json', JSON.stringify (students, null, 4), err => {
      if (err) {
        console.log (err);
      }
      return students;
    });
  })
  .catch (err => console.log (err));

// Backend

const app = express ();

fs.readFile ('./students.json', (err, data) => {
  if (err) {
    console.log (err);
  }

  fs.readFile ('./payload.json', (error, result) => {
    if (error) {
      console.log (error);
    } else {
      const payload = JSON.parse (result);
      const selectedFields = payload.selectedFields;
      let studentsData = JSON.parse (data);

      // Make post request
      app.post ('/', (req, res) => {
        const newstudent = {
          id: '111114',
          first_name: 'Eyiyemi',
          last_name: 'Brown',
          date_of_birth: '13/1995',
        };

        // Insert the new data and check if there is/are selected field(s)
        studentsData.push (newstudent);

        // if there is/are no selected field(s)
        if (selectedFields.length === 0) {
          return res.json ({
            conversion_key: uuidv4 (),
            json: studentsData,
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
          handleObject (studentsData, selectedFields);
        }
      });
    }
  });
});

const PORT = 6000;

app.listen (PORT, () => console.log (`Server running on port ${PORT}`));
