var socket = io.connect({secure: true}); 
var urlid;

var questiondata = localStorage.getItem("questiondata");
questiondata = (questiondata) ? JSON.parse(questiondata) : [];

auth.onAuthStateChanged(user => {
    if (user) {
        $(document).ready(function() {
            $('[data-toggle="tooltip"]').tooltip();
            var actions = `<a class="add" title="" data-toggle="tooltip" data-original-title="Add"><i class="material-icons"></i></a>
                           <a class="delete" title="" data-toggle="tooltip" data-original-title="Delete"><i class="material-icons"></i></a>`
        
            // Append table with add row form on add new button click
            $(".add-new").click(function() {

                firebase.auth().currentUser.getIdToken(true).then(async function(idToken) {
                    socket.emit('content', [idToken, 6, user]);
                    socket.once('content', async function(data) {
                        if (data[0] == 1) {
                            $(this).attr("disabled", "disabled");
                            var index = $("table tbody tr:last-child").index();
                            var row = await `<tr>` +
                                `<td>${data[1][0]}</td>` +
                                `<td>${data[1][1]}</td>` +
                                `<td>${data[1][2]}</td>` +
                                `<td><input type="text" class="form-control" name="phone1" id="urlid"></td>` +
                                `<td>` + actions + `</td>` +        
                            `</tr>`;
                            $("table").append(row);		
                            $("table tbody tr").eq(index + 1).find(".add, .edit").toggle();
                            $('[data-toggle="tooltip"]').tooltip();
                            urlid = document.getElementById("urlid")
                        }
                    });
                }).catch((error) => {
                    console.log(error.code)
                    auth.signOut()
                });

                // socket.emit('tableactivity1', user);
                // socket.once('tableactivity1', async function(data) {
                //     $(this).attr("disabled", "disabled");
                //     var index = $("table tbody tr:last-child").index();
                //     var row = await `<tr>` +
                //         `<td>${data[0]}</td>` +
                //         `<td>${data[1]}</td>` +
                //         `<td>${data[2]}</td>` +
                //         `<td><input type="text" class="form-control" name="phone1" id="urlid"></td>` +
                //         `<td>` + actions + `</td>` +        
                //     `</tr>`;
                //     $("table").append(row);		
                //     $("table tbody tr").eq(index + 1).find(".add, .edit").toggle();
                //     $('[data-toggle="tooltip"]').tooltip();
                //     urlid = document.getElementById("urlid")
                // });
            });
        
        
            // Add row on add button click
            $(document).on("click", ".add", function() {
                var empty = false;
                var input = $(this).parents("tr").find('input[type="text"]');
                var tr = $(this).parents("tr")
                var addnew = $(".add-new")
                firebase.auth().currentUser.getIdToken(true).then(async function(idToken) {
                    input.each(function() {
                        if(!$(this).val()){
                            $(this).addClass("error");
                            empty = true;
                            console.log("good1")
                        } else{
                            $(this).removeClass("error");
                            console.log("good2")
                        }
                    });
                    tr.find(".error").first().focus();
                    if(!empty) {
                        input.each(function(){
                            tr.html($(this).val());
                            console.log("good3")
                        });			
                        tr.find(".add, .edit").toggle();
                        addnew.removeAttr("disabled");
                        await socket.emit('content', [idToken, 5, user, urlid.value, questiondata[15]])
                        window.location.href='/database';
                    }	
                }).catch((error) => {
                    console.log(error.code)
                    auth.signOut()
                });	
            });     
        
            // Delete row on delete button click
            $(document).on("click", ".delete", async function() {
                var deleteid = $(this).attr('id');
                firebase.auth().currentUser.getIdToken(true).then(async function(idToken) {
                    await socket.emit('content', [idToken, 4, deleteid, questiondata[15]])
                    $(this).parents("tr").remove();
                    $(".add-new").removeAttr("disabled");
                    window.location.href='/database';
                }).catch((error) => {
                    console.log(error.code)
                    auth.signOut()
                });
            });
        });
    }
});