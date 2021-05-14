let myImage = document.querySelector('img');

myImage.onclick = function() {
    let mySrc = myImage.getAttribute('src');
    if(mySrc === 'images/fpga.jpeg') {
      myImage.setAttribute('src','images/eye.jpeg');
    } else {
      myImage.setAttribute('src','images/fpga.jpeg');
    }
}


const inputElement = document.getElementById("input");
inputElement.addEventListener("change", handleFiles, false);
function handleFiles() {
  const fileList = this.files; /* now you can work with the file list */

  console.log("Number of selected files:".concat(fileList.length.toString()));
}

function updateFileTable()
{
  oFiles = this.files;
  nFiles = oFiles.length;

  var FilelistArray =[];

  for (var i=0; i<nFiles; i++)
  {
    var data = [];
    size=Math.ceil(oFiles[i].size/1024)

    data.push(oFiles[i].name);
    data.push(size.toString().concat("KB"));

    FilelistArray.push(data);

  }

  document.getElementById("file_table").innerHTML = makeFilelistTable(FilelistArray)
}

  function makeFilelistTable(myArray) {
    var result = "<table border=0>";
    for(var i=0; i<myArray.length; i++)
    {
        result += "<tr>";
        for(var j=0; j<myArray[i].length; j++)
        {
            if(j==1)
              result += '<td  style="text-align:right">' + myArray[i][j] + '</td>';
            else
              result += "<td>"+myArray[i][j]+"</td>";
        }
        result += "</tr>";
    }
    result += "</table>";

    return result;
}

document.getElementById("input").addEventListener("change", updateFileTable, false);

function Parse(){

  const fileList = inputElement.files
  var reader_util = new FileReader();
  reader_util.onload = function(e) {
    // The file's text will be printed here
    file_content        = e.target.result
    file_lines          = file_content.split('\n')//Split file into array of lines

    file_content_no_ws  = file_content.replace(/ /g, ""); //Remove whitespaces from file
    file_lines_no_ws    = file_content_no_ws.split('\n')//Split file into array of lines

    InfoArray = []
    ResourceArray = []

    for (var i=0; i<file_lines_no_ws.length; i++)
    {
      for (var k=0; k<Targets.length; k++)
      {
        if(file_lines_no_ws[i].includes(Targets[k][0]))
        {
          line_parts       = file_lines[i].split('|')
          line_parts_no_ws = file_lines_no_ws[i].split('|')

          if(Targets[k][2] == 'info'){
            let property = line_parts[1].substring(line_parts[1].indexOf(":") + 1)
            let item = new Info(Targets[k][1], Targets[k][0], property);
            InfoArray.push(item)
          }
          else if(Targets[k][2] == 'rsrc'){
            let item = new Resource(Targets[k][1], Targets[k][0], line_parts_no_ws[2], line_parts_no_ws[4], line_parts_no_ws[5]);
            ResourceArray.push(item)
          }

          //console.table(Targets)
          Targets.splice(k,1)//Remove search target from array to avoidmultiple entries

        }
      }
    }

    document.getElementById("info_table").innerHTML = makeInfoTable(InfoArray)
    document.getElementById("resource_table").innerHTML = makeResourceTable(ResourceArray)
    console.log(InfoArray)
    console.log(ResourceArray)
    console.log(ResourceArray[2].getUtilization)
  };

  for (var i=0;i<fileList.length;i++)
  {
    if(fileList[i].name.includes('_utilization_placed.rpt')){
      reader_util.readAsText(fileList[i])

    }
  }
}

document.getElementById("parse_button").addEventListener("click", Parse, false);

var Targets = [
  ['|Date:'           , 'Build Time',    'info'],
  ['|ToolVersion:'    , 'Tool Version',  'info'],
  ['|Host:'           , 'Host Machine',  'info'],
  ['|Design:'         , 'Design Name',   'info'],
  ['|Device:'         , 'Device',        'info'],
  ['|SliceLUTs|'      , 'LUT',           'rsrc'],
  ['|SliceRegisters|' , 'Register',      'rsrc'],
  ['|RAMB36/FIFO*|'   , 'RAMB36',        'rsrc'],
  ['|RAMB18|'         , 'RAMB18',        'rsrc'],
  ['|BondedIOB|'      , 'I/O',           'rsrc'],
  ['|MMCME2_ADV|'     , 'MMCM',          'rsrc'],
  ['|PLLE2_ADV|'      , 'PLL',           'rsrc']
];

class Info {
  constructor(name, target, property ) {
    this.name       = name;
    this.target     = target;
    this.property   = property;
  }
}

class Resource {
  constructor(name, target, used, available, util ) {
    this.name       = name;
    this.target     = target;
    this.used       = used;
    this.available  = available;
    this.util       = util;
  }

  // Methods
  getUtilization() {
    return parseFloat(this.util)
  }
}

function makeFilelistTable(myArray) {
  var result = '<table border=0 class="table_list">'
  for(var i=0; i<myArray.length; i++)
  {
      result += "<tr>";
      for(var j=0; j<myArray[i].length; j++)
      {
          if(j==1)
            result += '<td  style="text-align:right">' + myArray[i][j] + '</td>';
          else
            result += "<td>"+myArray[i][j]+"</td>";
      }
      result += "</tr>";
  }
  result += "</table>";
  return result;
}

function makeInfoTable(myArray) {
  var result = '<table border=0 class="table_info">';
  for(var i=0; i<myArray.length; i++)
  {
      result += "<tr>";
      result += "<td>" + myArray[i].name + "</td>";
      result += "<td>"+ myArray[i].property + "</td>";
      result += "</tr>";
  }
  result += "</table>";
  return result;
}

function makeResourceTable(myArray) {
  var result = '<table border=0 class="table_resource">';
  result += "<tr>";
  result += "<td>" + "Resource Category" + "</td>";
  for(var i=0; i<myArray.length; i++)
  {

      result += "<td>" + myArray[i].name + "</td>";

  }
  result += "</tr>";

  result += "<tr>";
  result += "<td>" + "Used/All" + "</td>";
  for(var i=0; i<myArray.length; i++)
  {
      result += "<td>" + myArray[i].used + " / " + myArray[i].available + "</td>";

  }
  result += "</tr>";

  result += "<tr>";
  result += "<td>" + "Utilization" + "</td>";
  for(var i=0; i<myArray.length; i++)
  {

      result += "<td>" + myArray[i].util + "%"+ "</td>";

  }
  result += "</tr>";

  result += "</table>";
  return result;
}