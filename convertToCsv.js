const { convertArrayToCSV } = require('convert-array-to-csv');
const converter = require('convert-array-to-csv');
 
const header = ['runLogCode', 'runLogCount', 'totalTestCase', 'testCasePassed', 'testCaseFailed', 'testCasePending', 'projectId', 'testCaseList', 'leadBy', 'remark', 'status', 'createdBy', 'createdOn', 'modifiedBy', 'modifiedOn'];
const dataArrays = [
  [1, 'Mark', 'Otto', '@mdo'],
  [2, 'Jacob', 'Thornton', '@fat'],
  [3, 'Larry', 'the Bird', '@twitter'],
];

const csvFromArrayOfArrays = convertArrayToCSV(dataArrays, {
  header,
  separator: ';'
});