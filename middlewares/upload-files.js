const AWS = require("aws-sdk");

const multiparty = require("multiparty");
const fs = require("fs");
const config = require("../config");
const ID = config.aws.id;
const SECRET = config.aws.secret;
// The name of the bucket that you have created
const BUCKET_NAME = "extensions-admin";
const s3 = new AWS.S3({
 accessKeyId: ID,
 secretAccessKey: SECRET,
 region: "eu-central-1"
});
const uploadFiles = async (buffer, name, ct) => {
 // Read content from the file
 // console.log(buffer);
 // Setting up S3 upload parameters
 const params = {
  Bucket: BUCKET_NAME,
  Key: name, // File name you want to save as in S3
  Body: buffer,
  ContentType: ct
 };
 // Uploading files to the bucket
 return s3.upload(params).promise();
};

const parseFiles = async (req, res, next) => {
 const form = new multiparty.Form();
 await form.parse(req, async (error, fields, files) => {
  if (error) return res.status(500).json({ message: "could not parse form" });
  const data = {};
  for (const field in fields) {
   data[field] = fields[field][0];
  }
  req.body.fields = { ...data };
  for (const file in files) {
   // console.log(files[file]);
   const buffer = fs.readFileSync(files[file][0].path);
   const i = files[file][0].originalFilename.lastIndexOf(".");
   const ext = i ? files[file][0].originalFilename.substr(i + 1) : "jpeg";
   // eslint-disable-next-line prefer-regex-literals
   const name = data.name.replace(new RegExp(" ", "g"), "");
   const filename = `${name + Date.now()}.${ext}`;
   const result = await uploadFiles(buffer, filename, files[file][0].headers["content-type"]);
   req.body.fields[file] = result.Location;
  }
  next();
 });
};

module.exports = parseFiles;