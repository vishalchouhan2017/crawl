var TAG = 'function.js';
var dbConfig = require('./Environment/mongoDatabase.js');
var request = require('request');
var cheerio = require('cheerio');
var fun = require('./function.js');
var pageToVisits = "https://www.socialbakers.com/statistics/facebook/pages/total/";
var pageToVisits1 = "https://www.socialbakers.com/statistics/youtube/channels/";
var globalobj = [];
var Excel = require('exceljs');

exports.fb = function(req, callback) {
    try {
        var pageToVisit = pageToVisits;
        if(pageToVisit != null || pageToVisit != undefined || response != undefined){
            console.log("Visiting page " + pageToVisit);
            request(pageToVisit, function(error, response, body) {
                if (error) {
                    console.log("Error: " + error);
                }
                // Check status code (200 is HTTP OK)
                if (response != undefined && response.statusCode === 200) {
                    // Parse the document body
                    var $ = cheerio.load(body);
    
                    var name = $('.show-name').text();
                    name = name.trim().split('\n\t');
                    var array = [];
                    for (i = 0; i < name.length; i++) {
                        name[i] = name[i].trim().split('\t');
                        if (name[i] != "") {
                            array.push(name[i][0]);
                        }
                    }
    
                    var country = $('.show-country').text();
                    country = country.trim().split('\n\t');
                    var countryArray = [];
                    for (i = 0; i < country.length; i++) {
                        country[i] = country[i].trim().split('\t');
                        if (country[i] != "") {
                            countryArray.push(country[i][0]);
                        }
                    }
    
                    var fan = $('.item strong').text();
                    fan = fan.trim().split('\n');
                    var fanArray = [];
                    for (i = 1; i < fan.length - 3; i++) {
                        fan[i] = fan[i].trim().split('\t');
                        if (fan[i] != "") {
                            fanArray.push(fan[i][0]);
                        }
                    }
                    var links = [];
                    var nextLink = "";
                    $('a').each(function(i, elem) {
                        links.push(elem.attribs.href);
                    });
    
                    for (i = 0; i < links.length; i++) {
                        if (links[i].includes("/statistics/facebook/pages/total/page-")) {
                            nextLink = "https://www.socialbakers.com" + links[i];
                        }
                    }
                    var insertObj = [];
                    for (i = 0; i < fanArray.length; i++) {
                        insertObj.push({
                            "name": array[i],
                            "country": countryArray[i],
                            "fanCount": fanArray[i]
                        })
                    }
    
    
                    var db = dbConfig.mongoDbConn;
                    var Coll = db.collection("fbData");
                    Coll.insert(insertObj, function(err, results) {
                        if (err) {
                            if (err.code == 11000) {
                                resJson = {
                                    "http_code": "500",
                                    "message": "data already available"
                                };
                                return callback(false, resJson);
                            } else {
                                resJson = {
                                    "http_code": "500",
                                    "message": "Db error !"
                                };
                                return callback(false, resJson);
                            }
                        } else {
                            pageToVisits = nextLink;
                            if (nextLink) {
                                fun.fb(req, function(err, response) {
                                    if (err) {
                                        // return callback(err, response);
                                    } else {
                                        // return callback(err, response);
                                    }
                                })
                            }
                            resJson = {
                                "http_code": "200",
                                "message": "successfully insert"
                            };
                            return callback(false, resJson);
                        }
                    });
    
                } else {
                    console.log(JSON.stringify(globalobj));
                }
            });
    
        }
       
    } catch (e) {
        console.log(e)
        resJson = {
            "http_code": "500",
            "message": "Error crawling facebook details."
        };
        return callback(e, resJson);
    }
}

exports.youTube = function(req, callback) {
    try {
        var pageToVisit = pageToVisits1;
        if(pageToVisit != null || pageToVisit != undefined || response != undefined){
            console.log("Visiting page " + pageToVisit);
            request(pageToVisit, function(error, response, body) {
                if (error) {
                    console.log("Error: " + error);
                }
                // Check status code (200 is HTTP OK)
                console.log("Status code: " + response.statusCode);
                if (response != undefined && response.statusCode === 200) {
                    // Parse the document body
                    var $ = cheerio.load(body);
                    var name = $('.name').text();
                    name = name.trim().split('\n\t');
                    var array = [];
                    for (i = 0; i < name.length; i++) {
                        name[i] = name[i].trim().split('\t');
                        if (name[i] != "") {
                            if (!parseInt(name[i]))
                                array.push(name[i][0]);
                        }
                    }
                   
                    var fan = $('.item').text();
                    fan = fan.trim().split('\n');
                    var fanArray = [];
                    for (i = 35; i < fan.length - 90; i++) {
                        fan[i] = fan[i].trim().split('\t');
                        if (fan[i] != "") {
                            fanArray.push(fan[i][0]);
                        }
                    }
                    for(i=0;i<fanArray.length;i++){
                     if(fanArray[i] == "Subscribers"){
                      fanArray.splice(i,1);
                      i--;
                     }
                     if(fanArray[i] == "Total uploaded video views"){
                      fanArray.splice(i,1);
                      i--;
                     }
                       if(fanArray[i] == fanArray[i+1]){
                      fanArray.splice(i,1);
                      i--;
                     }
                    }
    
                    var links = [];
                    var nextLink = "";
                    $('a').each(function(i, elem) {
                        links.push(elem.attribs.href);
                    });
    
    
                    for (i = 0; i < links.length; i++) {
                        // console.log(links[i]);
                        if (links[i].includes("/statistics/youtube/channels/page-")) {
                            nextLink = "https://www.socialbakers.com" + links[i];
                            console.log("nextlink"+nextLink);
                        }
                    }
                    // console.log("sdfsdf"+nextLink);
    
                    var insertObj = [];
                    for (i = 0; i < fanArray.length; i=i+4) {
                        insertObj.push({
                            "name": fanArray[i+1],
                            "subscriber": fanArray[i+2],
                            "views": fanArray[i+3]
                        })
                    }
    
                    var db = dbConfig.mongoDbConn;
                    var Coll = db.collection("youTubeData");
                    Coll.insert(insertObj, function(err, results) {
                        if (err) {
                            if (err.code == 11000) {
                                resJson = {
                                    "http_code": "500",
                                    "message": "data already available"
                                };
                                return callback(false, resJson);
                            } else {
                                resJson = {
                                    "http_code": "500",
                                    "message": "Db error !"
                                };
                                return callback(false, resJson);
                            }
                        } else {
                            pageToVisits1 = nextLink;
                            if (nextLink) {
                                fun.youTube(req, function(err, response) {
                                    if (err) {
                                        // return callback(err, response);
                                    } else {
                                        // return callback(err, response);
                                    }
                                })
                            }
                        }
                    });
    
                } else {
                    console.log(JSON.stringify(globalobj));
                }
            });
        }else{
            resJson = {
                "http_code": "200",
                "message": "successfully insert"
            };
            return callback(false, resJson);
        }        
       

    } catch (e) {
        console.log(e)
        resJson = {
            "http_code": "500",
            "message": "Error crawling youtube details."
        };
        return callback(e, resJson);
    }
}

exports.downloadFbExcel = function(req, callback) {
    try {
        var db = dbConfig.mongoDbConn;
        var Coll = db.collection("fbData");
        Coll.find().toArray(function(err, result) {
            if (err) {
                resJson = {
                    "http_code": "500",
                    "message": "Error retriving mongoDatabase."
                };
                callback(err, resJson);
            } else {
                if (!result[0]) {
                    resJson = {
                        "http_code": "404",
                        "message": "data not found"
                    };
                    callback(err, resJson);
                } else if (result.length) {
                    var pathToCreate = "/usr/NodeJslogs/fbData" + ".xlsx";

                    createExcel(result, pathToCreate, "fbData", function(err, result) {
                        if (!err) {
                            console.log(" successful created excel report.");
                            resJson = {
                                "http_code": "200",
                                "message": pathToCreate,
                            };
                            return callback(false, resJson);
                        } else {
                            console.log(" error while creating excel report.");
                        }
                    });

                }
            }
        })



    } catch (e) {
        resJson = {
            "http_code": "500",
            "message": "error while creating excel report." + e
        };
        return callback(e, resJson);
    }
}

exports.downloadYouTubeExcel = function(req, callback) {
    try {
        var db = dbConfig.mongoDbConn;
        var Coll = db.collection("youTubeData");
        Coll.find().toArray(function(err, result) {
            if (err) {
                resJson = {
                    "http_code": "500",
                    "message": "Error retriving mongoDatabase."
                };
                callback(err, resJson);
            } else {
                if (!result[0]) {
                    resJson = {
                        "http_code": "404",
                        "message": "data not found"
                    };
                    callback(err, resJson);
                } else if (result.length) {
                    var pathToCreate = "/usr/NodeJslogs/youtube" + ".xlsx";
                    console.log(JSON.stringify(result));

                    createExcel1(result, pathToCreate, "youtube", function(err, result) {
                        if (!err) {
                            console.log(" successful created excel report.");
                            resJson = {
                                "http_code": "200",
                                "message": pathToCreate,
                            };
                            return callback(false, resJson);
                        } else {
                            console.log(" error while creating excel report.");
                        }
                    });

                }
            }
        })



    } catch (e) {
        resJson = {
            "http_code": "500",
            "message": "error while creating excel report."
        };
        return callback(e, resJson);
    }
}

var mySheet = null;
var mySheet1 = null;

function createExcel(result, pathToCreate, sheetName, callback) {

    console.log(" Starting creation of Excel.");

    var workbook = new Excel.Workbook();
    var sheet = workbook.addWorksheet(sheetName);
    mySheet = sheet;

    var rowNum = 2;

    var Obj = {
        sheet: sheet,
        value: "Name",
        rowNo: rowNum,
        colNo: 1,
        textColor: "AA808080",
        size: 10,
        bold: true,
        vAlign: "middle",
        hAlign: "center"
    };
    createCell(Obj);

    var country = {
        sheet: sheet,
        value: "country",
        rowNo: rowNum,
        colNo: 2,
        textColor: "AA808080",
        size: 10,
        bold: true,
        vAlign: "middle",
        hAlign: "center"
    };
    createCell(country);

    var country = {
        sheet: sheet,
        value: "fanCount",
        rowNo: rowNum,
        colNo: 3,
        textColor: "AA808080",
        size: 10,
        bold: true,
        vAlign: "middle",
        hAlign: "center"
    };
    createCell(country);

    rowNum = rowNum + 1;
    var newArray = [];
    var lookupObject = {};
    for (var i in result) {
        lookupObject[result[i]["name"]] = result[i];
    }

    for (i in lookupObject) {
        newArray.push(lookupObject[i]);
    }

    for (i = 0; i < newArray.length; i++) {
        var name1 = {
            sheet: sheet,
            value: result[i].name,
            rowNo: rowNum,
            colNo: 1,
            textColor: "AA808080",
            size: 10,
            bold: true,
            vAlign: "middle",
            hAlign: "center"
        };
        createCell(name1);

        var country1 = {
            sheet: sheet,
            value: result[i].country,
            rowNo: rowNum,
            colNo: 2,
            textColor: "AA808080",
            size: 10,
            bold: true,
            vAlign: "middle",
            hAlign: "center"
        };

        createCell(country1);

        var fanCount1 = {
            sheet: sheet,
            value: result[i].fanCount,
            rowNo: rowNum,
            colNo: 3,
            textColor: "AA808080",
            size: 10,
            bold: true,
            vAlign: "middle",
            hAlign: "center"
        };
        createCell(fanCount1);
        rowNum++;

    }

    workbook.xlsx.writeFile(pathToCreate)
        .then(function(err) {
            if (!err) {
                callback(false, pathToCreate);
            } else {
                callback(true, "Creating and Writing to excel file failed");
            }
        });

}

function createExcel1(result, pathToCreate, sheetName, callback) {

    console.log(" Starting creation of youtube Excel.");

    var workbook = new Excel.Workbook();
    var sheet = workbook.addWorksheet(sheetName);
    mySheet1 = sheet;

    var rowNum = 2;

    var Obj = {
        sheet: sheet,
        value: "Name",
        rowNo: rowNum,
        colNo: 1,
        textColor: "AA808080",
        size: 10,
        bold: true,
        vAlign: "middle",
        hAlign: "center"
    };
    createCell(Obj);

    var subscriber = {
        sheet: sheet,
        value: "subscriber",
        rowNo: rowNum,
        colNo: 2,
        textColor: "AA808080",
        size: 10,
        bold: true,
        vAlign: "middle",
        hAlign: "center"
    };
    createCell(subscriber);

    var views = {
        sheet: sheet,
        value: "views",
        rowNo: rowNum,
        colNo: 3,
        textColor: "AA808080",
        size: 10,
        bold: true,
        vAlign: "middle",
        hAlign: "center"
    };
    createCell(views);

    rowNum = rowNum + 1;
    var newArray = [];
    var lookupObject = {};
    for (var i in result) {
        lookupObject[result[i]["name"]] = result[i];
    }

    for (i in lookupObject) {
        newArray.push(lookupObject[i]);
    }

    for (i = 0; i < newArray.length; i++) {
        var name1 = {
            sheet: sheet,
            value: result[i].name,
            rowNo: rowNum,
            colNo: 1,
            textColor: "AA808080",
            size: 10,
            bold: true,
            vAlign: "middle",
            hAlign: "center"
        };
        createCell(name1);

        var subscriber1 = {
            sheet: sheet,
            value: result[i].subscriber,
            rowNo: rowNum,
            colNo: 2,
            textColor: "AA808080",
            size: 10,
            bold: true,
            vAlign: "middle",
            hAlign: "center"
        };

        createCell(subscriber1);

        var views1 = {
            sheet: sheet,
            value: result[i].views,
            rowNo: rowNum,
            colNo: 3,
            textColor: "AA808080",
            size: 10,
            bold: true,
            vAlign: "middle",
            hAlign: "center"
        };
        createCell(views1);
        rowNum++;

    }

    workbook.xlsx.writeFile(pathToCreate)
        .then(function(err) {
            if (!err) {
                callback(false, pathToCreate);
            } else {
                callback(true, "Creating and Writing to excel file failed");
            }
        });

}

function generateCell(value, rowNum, colNum, bold, bgColor, toMerge, mergingCells) {
    //console.log("toMerge",toMerge);
    //console.log("mergingCells",mergingCells);

    bold = bold || false;
    bgColor = bgColor || 'FFFFFFFF';
    var inquiryInfoObj = {
        sheet: mySheet,
        value: value,
        rowNo: rowNum,
        colNo: colNum,
        bold: bold,
        bgColor: bgColor,
        merge: toMerge,
        mergeCells: mergingCells
    };

    createCell(inquiryInfoObj);
}

function createCell(cellObj) {
    var sheet = cellObj.sheet;
    var row = sheet.getRow(cellObj.rowNo);
    var col = row.getCell(cellObj.colNo);
    if (typeof cellObj.value === 'number') {
        col.value = cellObj.value;
    } else {
        col.value = (cellObj.value || "") + "";
    }

    cellObj.vAlign = cellObj.vAlign || "middle";
    cellObj.hAlign = cellObj.hAlign || "right";
    col.alignment = {
        vertical: cellObj.vAlign,
        horizontal: cellObj.hAlign
    };

    cellObj.textColor = cellObj.textColor || "AA000000";

    cellObj.family = cellObj.family || 4;
    cellObj.size = cellObj.size || 0;
    cellObj.bold = cellObj.bold || false;

    //if(!cellObj.noBorder){
    row.border = {
        top: {
            style: 'thin'
        },
        left: {
            style: 'thin'
        },
        bottom: {
            style: 'thin'
        },
        right: {
            style: 'thin'
        }
    };
    //}

    col.font = {
        name: 'Arial',
        color: {
            argb: cellObj.textColor
        },
        family: cellObj.family,
        size: cellObj.size,
        bold: cellObj.bold
    };

    cellObj.merge = cellObj.merge || false;
    if (cellObj.merge) {
        //console.log("cellObj--",cellObj);
        //console.log("--->>>",cellObj.mergeCells);
        sheet.mergeCells(cellObj.mergeCells);
    }

    cellObj.type = cellObj.type || 'none';
    cellObj.pattern = cellObj.pattern || 'solid';
    cellObj.bgColor = cellObj.bgColor || 'FFFFFFFF';
    col.fill = {
        type: cellObj.type,
        pattern: cellObj.pattern,
        fgColor: {
            argb: cellObj.bgColor
        }
    };
}

function getExcelChar(num) {
    var rem = num % 26;
    var asciiCode = 65 + rem;
    return String.fromCharCode(asciiCode);
}