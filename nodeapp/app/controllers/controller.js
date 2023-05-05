const testFolder = "E:/";
const fs = require("fs");
const path = require("path");
const uuid = require("uuid/v4");

exports.allfolderlist = (req, res) => {
  try {
    const selected = req.query.selected;
    const result = getDirectories(selected);
    res.status(200).json({ data: result });
  } catch (error) {
    // log on console
    console.log(error);

    res.status(500).json({
      message: "Error!",
      error: error,
    });
  }
};

exports.getfilesdetails = (req, res) => {
  try {
    const selected = req.query.selected;
    res.status(200).json({ data: getTotalSize(selected) });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error!",
      error: error,
    });
  }
};

const getDirectories = function (dirPath, temparrayOfFiles, parentId) {
  files = fs.readdirSync(dirPath);

  let arrayOfFiles = temparrayOfFiles || [];

  files.forEach(function (file) {
    if (
      file.includes("$Recycle.Bin") !== true &&
      file.includes("$RECYCLE.BIN") !== true &&
      file.includes("Classification") !== true &&
      file.includes("Shared Gadgets") !== true &&
      file.includes("Configuration") !== true &&
      file.includes("System Volume Information") !== true &&
      file.includes("WindowsApps") !== true &&
      file.includes("CrashReports") !== true &&
      file.includes("WindowsAIK") !== true &&
      file.includes("RSA") !== true &&
      file.includes("SystemKeys") !== true &&
      file.includes("Documents and Settings") !== true &&
      file.includes("DumpStack") !== true &&
      file.includes("hiberfil") !== true &&
      file.includes("pagefile.sys") !== true &&
      file.includes("Application Data") !== true &&
      file.includes("Desktop") !== true &&
      file.includes("Documents") !== true &&
      file.includes("Microsoft") !== true &&
      file.includes("Packages") !== true &&
      file.includes("ProgramData") !== true &&
      file.includes("SfDevCluster") !== true &&
      file.includes("swapfile.sys") !== true &&
      file.includes("Users") !== true &&
      file.includes("Windows") !== true
    ) {
      const id = uuid();
      if (fs.statSync(dirPath + "/" + file).isDirectory()) {
        arrayOfFiles.push({
          id: id,
          Name: file,
          ParentID: parentId || "7c10a0d2-6740-4cba-8bd4-a7f2d3c340000",
          fullpath: path.join(dirPath, file).replace(/\\/g, "/") + "/",
          ResourceType: "Folder",
        });
        getDirectories(dirPath + "/" + file, arrayOfFiles, id);
      }
    }
  });

  return arrayOfFiles;
};

const getAllFiles = function (dirPath, temparrayOfFiles) {
  files = fs.readdirSync(dirPath);

  let arrayOfFiles = temparrayOfFiles || [];

  files.forEach(function (file) {
    if (
      file.includes("$Recycle.Bin") !== true &&
      file.includes("$RECYCLE.BIN") !== true &&
      file.includes("Classification") !== true &&
      file.includes("Shared Gadgets") !== true &&
      file.includes("Configuration") !== true &&
      file.includes("System Volume Information") !== true &&
      file.includes("WindowsApps") !== true &&
      file.includes("CrashReports") !== true &&
      file.includes("WindowsAIK") !== true &&
      file.includes("RSA") !== true &&
      file.includes("SystemKeys") !== true &&
      file.includes("Documents and Settings") !== true &&
      file.includes("DumpStack") !== true &&
      file.includes("hiberfil") !== true &&
      file.includes("pagefile") !== true &&
      file.includes("Application Data") !== true &&
      file.includes("Desktop") !== true &&
      file.includes("Documents") !== true &&
      file.includes("Microsoft") !== true &&
      file.includes("Packages") !== true &&
      file.includes("ProgramData") !== true &&
      file.includes("SfDevCluster") !== true &&
      file.includes("swapfile.sys") !== true &&
      file.includes("Users") !== true &&
      file.includes("Windows") !== true
    ) {
      if (fs.statSync(dirPath + "/" + file).isDirectory()) {
        arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
      } else {
        arrayOfFiles.push(path.join(dirPath, file));
      }
    }
  });

  return arrayOfFiles;
};

const convertBytes = function (bytes) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  if (bytes == 0) {
    return "n/a";
  }

  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));

  if (i == 0) {
    return bytes + " " + sizes[i];
  }

  return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i];
};

const getTotalSize = function (directoryPath) {
  const arrayOfFiles = getAllFiles(directoryPath);

  let totalSize = 0;

  arrayOfFiles.forEach(function (filePath) {
    totalSize += fs.statSync(filePath).size;
  });

  let totalExtension = [];
  let totalnoneExtension = [];
  let extensionlist = [];

  arrayOfFiles.forEach(function (filePath) {
    const Extension = filePath
      .substring(filePath.lastIndexOf("."))
      ?.indexOf(".");
    const Extensiontype = filePath.substring(filePath.lastIndexOf("."));

    if (Extension === 0) {
      totalExtension.push(filePath);
      const flag = extensionlist.some(
        (el) => el === Extensiontype.replace(".", "")
      );
      if (!flag) extensionlist.push(Extensiontype.replace(".", ""));
    } else {
      totalnoneExtension.push(filePath);
    }
  });

  return {
    // Flelist: arrayOfFiles,
    Totalfiles: arrayOfFiles.length,
    TotalSize: convertBytes(totalSize),
    // Extensionfiles: totalExtension,
    TotalExtension: totalExtension.length,
    // NoneExtensionfiles: totalnoneExtension,
    TotalnoneExtension: totalnoneExtension.length,
    Extensionlist: extensionlist,
  };
};
