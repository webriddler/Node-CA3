const fs = require("fs");
const chalk = require("chalk");

const getData = function () {
  return loadData();
};

const findPassword = function (siteName) {
  let jsonData = loadData();
  const index = jsonData.findIndex((entry) => entry.site_name === siteName.toLowerCase());
  if (index >= 0) {
    return jsonData[index].password;
  } else {
    return false;
  }
};

const deleteData = function (siteName) {
  let jsonData = loadData();
  const dataToKeep = jsonData.filter((entry) => entry.site_name != siteName);

  if (jsonData.length > dataToKeep.length) {
    saveData(dataToKeep);
    console.log(`Entry for ${siteName} deleted successfully.`);
    return true;
  } else {
    console.log(chalk.red(`No entry found for ${siteName}.`));
    return false;
  }
};

const addData = function (username, site_name, password, validity) {
  let today = new Date().toISOString().slice(0, 10);
  const data = loadData();
  const duplicateData = data.filter(function (site_data) {
    return site_data.site_name === site_name;
  });

  if (duplicateData.length === 0) {
    if (!validity) {
      validity = 0;
      var expired = false;
    } else {
      var expired = true;
    }

    data.push({
      site_name: site_name.toLowerCase(),
      username: username.toLowerCase(),
      password: password,
      validity: validity,
      expired: expired,
      created_on: today,
    });
    console.log("Site Name: " + site_name);
    console.log("Username: " + username);
    console.log("Password: " + password);
    console.log("Validity (in days): " + validity);
    console.log("Created on: " + today);
    saveData(data);
    console.log(chalk.green("New Password added!"));
    return true;
  } else {
    console.log(chalk.red("Website Password already present!"));
    return false;
  }
};

const saveData = function (jsonData) {
  const dataJSON = JSON.stringify(jsonData, null, 2);
  fs.writeFileSync("passwords.json", dataJSON);
};

const loadData = function () {
  try {
    const dataBuffer = fs.readFileSync("passwords.json");
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
  } catch (e) {
    return [];
  }
};

const expiring = function (days = 10) {
  let jsonData = loadData();
  const currentDate = new Date();
  const expirationDate = new Date(
    currentDate.getTime() + days * 24 * 60 * 60 * 1000
  );
  const expiringPasswords = jsonData.filter((entry) => {
    // const createdDate = new Date(entry.created_on);
    const validityExpirationDate = new Date(entry.validity);
    return validityExpirationDate <= expirationDate && entry.expired;
  });
  if (expiringPasswords.length > 0) {
    return expiringPasswords;
  } else {
    return false;
  }
};

module.exports = {
  getData: getData,
  addData: addData,
  expiring: expiring,
  findPassword: findPassword,
  deleteData: deleteData,
};
