var append = function(text) {
  data.appendChild(document.createTextNode(text));
};

const downloadFile = ({ data, filename }) => {
  const blob = new Blob([data], {
    type: "application/octet-binary"
  });
  const url = URL.createObjectURL(blob);

  chrome.downloads.download({ url, filename });
};



function BackTo() {
    var backtodate=document.getElementById("backtohistory").value;
    if (backtodate==="") {
      backtodate="2000-01-01T00:00";
    }
    //alert(backtodate)
    backtoformat = new Date(backtodate);
    backtoformatted = backtoformat
      .toISOString()
      .replace("T", " ")
      .replace(/\.\d+Z/, "");

    //alert(backtoformatted);
};

var download = function(format) {

  document.getElementById("content").innerText = "preparing file...";

  chrome.history.search(
    {
      text: "",
      // 'maxResults': 100,
      maxResults: 1000000,
      startTime: 0
    },
    function(res) {
      window.res = res;

      var text, filename;

      // put the data in a hidden div so chrome doesn't crash
      if (format === "csv") {
        filename = "history.csv";

        // header row
        var keys = Object.keys(res[0]);
        append("Last Visit Time (UTC)," + keys.join(","));

        var row, time, value;
        for (var i = 0; i < res.length; i++) {
          row = "";

          // convert time for excel
          time = new Date(res[i]["lastVisitTime"]);
          formatted = time
            .toISOString()
            .replace("T", " ")
            .replace(/\.\d+Z/, "");
          row += formatted + ",";
          
          //row += formatted + ",";

          for (var j = 0; j < keys.length; j++) {
            value = res[i][keys[j]].toString();
            value = value.replace(/"/g, '""');
            if (value.search(/("|,|\n)/g) >= 0) value = '"' + value + '"';
            row += value;
            if (j !== keys.length - 1) row += ",";
          }
          if (formatted > backtoformatted) {
            append("\n" + row);
          }
        }
      }else {
        filename = "history.json";

       // backtodate = document.getElementById("backtohistory").value;
       // if (backtodate==="") {
       //   backtodate="2000-01-01T00:00";
      //  }
       // backtoformat = new Date(backtodate).getTime();
      //  alert(backtoformat);

          append("[");
          for (var i = 0; i < res.length; i++) {
          //  formattedtime = new Date(res[i]["lastVisitTime"]).getTime();
            
          ///  alert(formattedtime);

            text = JSON.stringify(res[i]);
            //if (formattedtime > backtodate) {
              if (i !== res.length - 1) text = text + ",";
                append(text);
             // }
          }
            append("]");
      }

      const isoDate = new Date().toISOString().substr(0, 10);

      downloadFile({
        filename: isoDate + "_" + filename,
        data: data.innerText
      });

     // window.close();
    }
  );
};


document.addEventListener("DOMContentLoaded", function() {
  window.data = document.getElementById("data");
 window.jsonButton = document.getElementById("json");
  window.csvButton = document.getElementById("csv");

  jsonButton.onclick = function() {
    try {
      alert(backtoformatted);
    } catch (error) {
      alert("Date is not defined!!!");
    }
    download("json");
  };

  csvButton.onclick = function() {
    BackTo();
    download("csv");
  };

});
