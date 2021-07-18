var socket = io.connect({secure: true}); 

var searchinput = document.getElementById("searchinput")
var loadingicon = document.getElementById("loadingicon");
var resultsearch = document.getElementById("resultsearch")
var pagearr = []
var pageid = document.getElementById("pageid")

var fbut;
var sbut;
var tbut;
var butarr1;

var fbutname;
var sbutname;
var tbutname;
var butarr2;

var next;
var previous;

var config = {
    apiKey: "AIzaSyBhMXBMkDgf5rmg6XEpRllsGCalgdoxQtk",
    authDomain: "test-project-899c2.firebaseapp.com",
    databaseURL: "https://test-project-899c2-default-rtdb.firebaseio.com",
    projectId: "test-project-899c2",
    storageBucket: "test-project-899c2.appspot.com",
    messagingSenderId: "200667215684",
    appId: "1:200667215684:web:3d03b2275c1c664bfa0911",
    measurementId: "G-PTDY828H1D"
};
firebase.initializeApp(config);
firebase.analytics();
const auth = firebase.auth();

document.getElementById('homeBody').style.visibility = "hidden";
auth.onAuthStateChanged(user => {
    if (user) {
        firebase.auth().currentUser.getIdToken(false).then(function(idToken) {
            socket.emit('authtok', idToken)  
        })

        socket.on('authtok', function(data) {
            if (data == user.uid) {
                document.getElementById('homeBody').style.visibility = "visible";
                console.log("user signed in")
        
                searchinput.addEventListener("keyup", function(event) {
                    event.preventDefault();
                    if (event.keyCode === 13) {
                        search()
                    }
                });
        
                buttonsearch.onclick = function(){search()};
        
                var startv;
                var currentsearch = 0;
                async function search() {
                    if ((currentsearch == 0) || (currentsearch != searchinput.value)) {
                        resultamount.innerHTML = ""
                        loadingicon.innerHTML = `<div class="spinner-border spinner-border-sm text-success" role="status"><span class="sr-only">Loading...</span></div>`
                        currentsearch = searchinput.value;
                        var arr1 = []
                        var arr2 = []
                        startv = 1;
                        var keydict = [
                            ["unit", "unit"],
                            ["question", "question"],
                            ["q", "question"],
                            ["exam", "exam"],
                            ["year", "exam"],
                            ["paper", "exam"],
                            ["multiple", "multiple"],
                            ["short", "short"]
                        ]
                        function getWords(text){
                            let x = text.replace(/[^A-Za-z0-9]+/g, " ");
                            let newArr = x.trim().split(" ");
                            return newArr;
                        }
                        arr1 = getWords(searchinput.value);    
                        if (arr1.length <= 50) {
                            function replaceKeywords(search) {
                                var length = search.length;
                                for (var i = 0; i < length; i++) {
                                    if ((isNaN(search[i]) == false) || (search[i] == "choice") || (search[i] == "answer")) {
                                        for (var j = 0; j < keydict.length; j++) {
                                            if (search[i-1] == keydict[j][0]) {
                                                search[i-1] = keydict[j][1]+search[i]
                                                Array.prototype.remove = function() {
                                                    var what, a = arguments, L = a.length, ax;
                                                    while (L && this.length) {
                                                        what = a[--L];
                                                        while ((ax = this.indexOf(what)) !== -1) {
                                                            return this.splice(ax, 1);
                                                        }
                                                    }
                                                    return this;
                                                };
                                                search.remove(search[i]);
                                                break;
                                            } 
                                        }
                                    }
                                }
                            }
                        
                            replaceKeywords(arr1)
                            for (var i = 0; i < arr1.length; i++) {
                                arr2.push(arr1[i].toLowerCase())
                            }
                            start = +new Date();
                    
                            function arraysMatch(arr1, arr2) {
                                if (arr1.length !== arr2.length) {
                                    return false;
                                }
                                for (var i = 0; arr1.length < i; i++) {
                                    if (arr1[i] !== arr2[i]) {
                                        return false;
                                    }
                                }
                                return true
                            };
                    
                            if ((arr2[0] !== "") && (arr2.length >= 1)) {
                                socket.emit('search', arr2)
                            } else {
                                loadingicon.innerHTML = ""
                                resultsearch.innerHTML = ""
                                pageid.innerHTML = ""
                            }
                        } else {
                            alert("search can't be greater than 50 words.")
                        }
                    }
                }
                
                socket.on('search', function(data) {
                    console.log(data)
                    searchamount(data.length)
                    var newdata = sortresult(data, 5)
                    console.log(newdata)
                    var end = +new Date();
                    var time = end - start;
                    console.log('search execution time: '+ (time/1000) + 's');
                
                    pagearr = [newdata, 1]
                    console.log(pagearr)
                    pageid.innerHTML = `<nav aria-label="..."><ul class="pagination"><li class="page-item disabled" id="previous" onclick="previousPagelst()"><a class="page-link" href="#">Previous</a></li><li class="page-item active" id="fbut" onclick="checkvalidbutton(document.getElementById('fbutname').innerHTML)"><a class="page-link" href="#" id="fbutname">1</a></li><li class="page-item" id="sbut" onclick="checkvalidbutton(document.getElementById('sbutname').innerHTML)"><a class="page-link" href="#" id="sbutname">2</a></li><li class="page-item" id="tbut" onclick="checkvalidbutton(document.getElementById('tbutname').innerHTML)"><a class="page-link" href="#" id="tbutname">3</a></li><li class="page-item disabled" id="next" onclick="nextPagelst()"><a class="page-link" href="#">Next</a></li></ul></nav>`
                    
                    fbut = document.getElementById("fbut")
                    sbut = document.getElementById("sbut")
                    tbut = document.getElementById("tbut")
                    butarr1 = [fbut, sbut, tbut]
                
                    fbutname = document.getElementById("fbutname")
                    sbutname = document.getElementById("sbutname")
                    tbutname = document.getElementById("tbutname")
                    butarr2 = [fbutname, sbutname, tbutname]
                
                    next = document.getElementById("next")
                    previous = document.getElementById("previous")
                
                    fbut.onclick = function(){checkvalidbutton(document.getElementById('fbutname').innerHTML)};
                    sbut.onclick = function(){checkvalidbutton(document.getElementById('sbutname').innerHTML)};
                    tbut.onclick = function(){checkvalidbutton(document.getElementById('tbutname').innerHTML)};
                    next.onclick = function(){nextPagelst()};
                    previous.onclick = function(){previousPagelst()};
        
                    checkvalidbutton(1); 
                    displayvalidres = pagearr[0].length
                });
                
                function searchamount(input) {
                    var div1 = document.createElement("div");
                    div1.id = "resultbanner"
                    var center1 = document.createElement("center");
                    var span1 = document.createElement("span");
                    span1.className = "text mb-4"
                    span1.style = "margin-left: 20px";
                    span1.innerHTML = input+" amount of results"
                    var hr1 = document.createElement("hr");
                    var br1 = document.createElement("br");
                
                    center1.appendChild(span1);
                    center1.appendChild(hr1)
                    div1.appendChild(center1);
                    resultamount.appendChild(div1);
                }
                
                socket.on('butinfo', async function(data) {
                    console.log(data)
                    resultsearch.innerHTML = ""
                    for (var i = 0; i < data.length; i++) {
                        createButton(data[i][6], data[i][11], data[i][4], data[i][8], data[i][2], data[i][7], data[i][12], data[i][3], data[i])
                    }
                    loadingicon.innerHTML = ``
                });
                
                function createButton(subject, year, section, unit, question, tag, description, region, data) {
                    var widthvar;
                    var offsetval = 50;
                    window.addEventListener('resize', searchResize);
                    function searchResize() {
                        widthvar = resultsearch.offsetWidth;
                        // console.log(widthvar)
                        div4.style.width = widthvar-(offsetval)+"px"
                        marquee1.style.width = widthvar-(offsetval)+"px"
                        marquee1.style.textIndent = -(widthvar-(offsetval))+"px"
                        if (widthvar > 462) {
                            div2.style.height = "75px"
                        } else {
                            div2.style.height = "100px"
                        }
                    }
                
                    var div2  = document.createElement("div");
                    div2.className = "d-flex flex-row justify-content-between mb-3";
                    div2.id = "scrollable"
                    div2.onclick = function () {
                        socket.emit('arrayreq', data);
                        window.location.href='/content';
                    } 
                
                    var div3 = document.createElement("div")
                    div3.className = "d-flex flex-column p-3";
                    div3.style = "height: 80px; font-size: 15px"
                
                    var p1 = document.createElement("p");
                    p1.className = "mb-2";
                    bold1 = document.createElement("b");
                    bold1.id = "bold";
                    bold1.style = `style="border: 1px solid green;"`
                    bold1.innerHTML = `${region} ${subject} Year ${year} ${section} ${unit} Question ${question} ${tag}`;
                
                    var a1 = document.createElement("a");
                    a1.style = "color: grey;";
                    a1.id = "hoverprinc";
                
                    var small1 = document.createElement("small");
                    small1.className = "text-muted";
                
                    var div4 = document.createElement("div");
                    div4.style = "position: absolute; border: 0px solid green; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; height: 20px; max-width: 1100px;";
                    div4.id = "placeholder";
                    div4.innerHTML = `${description}`
                
                    var marquee1 = document.createElement("marquee");
                    marquee1.id = "mymarquee";
                    marquee1.behavior = "scroll";
                    marquee1.direction = "left";
                    marquee1.scrollAmount = "15";
                    marquee1.style = `position: absolute; border: 0px solid green; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; height: 20px; max-width: ${(div2.offsetWidth)-300}px;`;
                    marquee1.innerHTML = `${description}`
                
                    p1.appendChild(bold1)
                    div3.appendChild(p1);
                    div3.appendChild(a1)
                    a1.appendChild(small1);
                    small1.appendChild(div4);
                    small1.appendChild(marquee1);
                    div2.appendChild(div3);
                    resultsearch.appendChild(div2);
                
                    marquee1.stop();
                    marquee1.style.visibility = "hidden";
                
                    a1.addEventListener("mouseenter", function() { 
                        marquee1.style.visibility = "visible";
                        div4.style.visibility = "hidden";
                        marquee1.start();
                    })
                
                    a1.addEventListener("mouseleave", function() { 
                        div4.style.visibility = "visible";
                        marquee1.style.visibility = "hidden";
                        marquee1.stop();
                    })
                
                    widthvar = resultsearch.offsetWidth;
                    div4.style.width = widthvar-(offsetval)+"px"
                    marquee1.style.width = widthvar-(offsetval)+"px"
                    marquee1.style.textIndent = -(widthvar-(offsetval))+"px"
                    if (widthvar > 462) {
                        div2.style.height = "75px"
                    } else {
                        div2.style.height = "100px"
                    }
                
                }
                
                var perpage = 5 
                function sortresult(results, perpage) {
                    var arr = []
                    var temp = []
                    for (var i = 0; i < results.length; i++) {
                        if ((i%perpage == 0) && (i > 0)) {
                            arr.push(temp)
                            temp = []
                        }
                        temp.push(results[i][0])
                    }
                    arr.push(temp)
                    return arr
                }
                
                var pagelst = [1, 2, 3]
                var currentpage = 1;
                
                function checkdis() {
                    for (var i = 0; i < pagelst.length; i++) {
                        if (parseInt(butarr2[i].innerHTML) > pagearr[0].length) { 
                            butarr1[i].className = "page-item disabled"
                        }
                    }
                }
                
                function checkvalidbutton(num) {
                    if (num <= pagearr[0].length) {
                        if (num <= 1) {
                            previous.className = "page-item disabled"
                        } else {
                            previous.className = "page-item"
                        }
                        if (num >= pagearr[0].length) { 
                            next.className = "page-item disabled"
                        } else {
                            next.className = "page-item"
                        }
                    }
                    checkdis()
                    if (num <= pagearr[0].length) { 
                        currentpage = parseInt(num)
                        for (var i = 0; i < pagelst.length; i++) {
                            if (parseInt(butarr2[i].innerHTML) <= pagearr[0].length) { 
                                if (parseInt(butarr2[i].innerHTML) == num) {
                                    butarr1[i].className = "page-item active"
                                } else if (parseInt(butarr2[i].innerHTML) != num) {
                                    butarr1[i].className = "page-item"
                                }
                            } 
                        }
                    }
                    if ((startv == 1) || (currentpage != pagearr[1])) {
                        loadingicon.innerHTML = `<div class="spinner-border spinner-border-sm text-success" role="status"><span class="sr-only">Loading...</span></div>`
                        startv = 0
                        pagearr[1] = currentpage 
                        socket.emit('butinfo', pagearr)
                    }
                }
                
                function nextPagelst() {
                    if (currentpage < pagearr[0].length) { 
                        if (currentpage == pagelst[2]) {
                            for (var i = 0; i < pagelst.length; i++) {
                                pagelst[i] += pagelst.length
                            }    
                            fbutname.innerHTML = pagelst[0]
                            sbutname.innerHTML = pagelst[1]
                            tbutname.innerHTML = pagelst[2]
                            checkdis()
                     
                            currentpage += 1;
                        } else {
                            currentpage += 1;
                        }
                    }
                    checkvalidbutton(currentpage)
                }
                
                function previousPagelst() {
                    if ((currentpage == pagelst[0]) && (pagelst[0] != 1)) {
                        for (var i = 0; i < pagelst.length; i++) {
                            pagelst[i] -= pagelst.length
                        }     
                        fbutname.innerHTML = pagelst[0]
                        sbutname.innerHTML = pagelst[1]
                        tbutname.innerHTML = pagelst[2]
                        currentpage -= 1;
                    } else if (currentpage >= 2) {
                        currentpage -= 1;
                    } else {
                        currentpage = 1;
                    }
                    checkvalidbutton(currentpage)
                }
            } else {
                document.getElementById('homeBody').innerHTML = " Decoding Firebase ID token failed. Make sure you create an account and login to get a valid token. <br> Visit: ___/signup.";
                document.getElementById('homeBody').style.visibility = "visible";
                console.log("user has signed out")
            }
        });
    } else {
        document.getElementById('homeBody').innerHTML = " Decoding Firebase ID token failed. Make sure you create an account and login to get a valid token. <br> Visit: ___/signup.";
        document.getElementById('homeBody').style.visibility = "visible";
        console.log("user has signed out")
        // window.location.href = "/";
    }
});


function dropdowntagfilter(value, id) {
    if (value == "None") {
        switch(id) {
              case 0:
                dropdownMenuButtonsubject.innerHTML = "Subject";
                topicid.innerHTML = '';
                  filterseperator("None");
            break;
              case 1:
                dropdownMenuButtonsource.innerHTML = "Source";
            break;
              case 2:
                dropdownMenuButtonyear.innerHTML = "Year";
            break;
              case 3:
                dropdownMenuButtonunit.innerHTML = "Unit";
            break;
              case 4:
                dropdownMenuButtontopic.innerHTML = "Topic";
            break;
        }	
    } else {
        switch(id) {
              case 0:
                  topicid.innerHTML = '';
                  dropdownMenuButtonsubject.innerHTML = value;

                switch(value) {
                    case "Methods":
                          filterseperator("None");	
                      break;
                    case "Physics":
                          filterseperator("None");
                          filterseperator("Special Relativity");
                          filterseperator("Wave Theory");		
                      break;
                    case "Chemistry":
                          filterseperator("None");
                      break;
                    case "Further":
                          filterseperator("None");
                      break;
                }

                  if (searchinput.value == '') {
                    if (searchinput.value == '') {
                        searchinput.value += value;	
                    } 
                  } else {
                    searchinput.value += " "+value;
                  }
            break;

              case 1:
                  dropdownMenuButtonsource.innerHTML = value;
                  if (searchinput.value == '') {
                    if (searchinput.value == '') {
                        searchinput.value += value;	
                    } 
                  } else {
                    searchinput.value += " "+value;
                  }
            break;

              case 2:
                  dropdownMenuButtonyear.innerHTML = value;
                  if (searchinput.value == '') {
                    if (searchinput.value == '') {
                        searchinput.value += value;	
                    } 
                  } else {
                    searchinput.value += " "+value;
                  }
            break;

              case 3:
                  dropdownMenuButtonunit.innerHTML = value;
                  if (searchinput.value == '') {
                    if (searchinput.value == '') {
                        searchinput.value += value;	
                    } 
                  } else {
                    searchinput.value += " "+value;
                  }
            break;

              case 4:
                  dropdownMenuButtontopic.innerHTML = value;
                  if (searchinput.value == '') {
                    if (searchinput.value == '') {
                        searchinput.value += value;	
                    } 
                  } else {
                    searchinput.value += " "+value;
                  }
            break;
        }
    }
}

function filterseperator(id) {
    var a = document.createElement("a");
    a.className = "dropdown-item btn-sm";
    a.href = "#";
    a.onclick = function () {
        if (id == "None") {
            dropdownMenuButtontopic.innerHTML = "Topic";
        } else {
            dropdownMenuButtontopic.innerHTML = id;

            if (searchinput.value == '') {
                searchinput.value += id;	
              } else {
                searchinput.value += " "+id;
              }
        }
    }
    a.innerHTML = id;
    topicid.appendChild(a);
}