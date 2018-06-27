/**
 * Created by Arnaud Carrere on 05/12/18.
 */


var myApp;
myApp = myApp || (function () {
        var pleaseWaitDiv = $('#progressModal');
        return {
            showPleaseWait: function() {
                pleaseWaitDiv.modal();
            },
            hidePleaseWait: function () {
                pleaseWaitDiv.modal('hide');
            }
        };
    })();




function getCompanyData(companyId, callback) {
    $.ajax({
        url: "http://localhost:3000/api/company/"+companyId,
        // the URL for the request
        type: "GET",
        // whether this is a POST or GET request
        dataType: "json",
        // the type of data we expect back
        success: function (company) {
            var param = $.param(company);
            console.log(param);
            callback(company);
        },
        error: function (xhr, status) {
            // code run if request fails; raw request and status
            console.log("Sorry, there was a problem!");
        },
        complete: function (xhr, status) {  	// code to run regardless of success or failure
            console.log("The request is complete!");
        }
    });
}

function getAllCompanyData() {
    $.ajax({
        url: "http://localhost:3000/api/company",
        // the URL for the request
        type: "GET",
        // whether this is a POST or GET request
        dataType: "json",
        // the type of data we expect back
        success: function (responseJson) {
             $.each(responseJson, function (i, company) {
                 var param = $.param(company);
                 console.log(param);
                 $('#companies_rows').append(nunjucks.render("company?"+param, {company: company}));
            });
        },
        error: function (xhr, status) {
            // code run if request fails; raw request and status
            console.log("Sorry, there was a problem!");
        },
        complete: function (xhr, status) {  	// code to run regardless of success or failure
            console.log("The request is complete!");
        }
    });
}

function postCompanyData (postData) {
    $.ajax({
        url: "http://localhost:3000/api/company",
        type: "POST",
        dataType: "json",
        data: postData,

        success: function (company) {
            var param = $.param(company);
            console.log(param);
            $('#companies_rows').append(nunjucks.render("company?"+param, {company: company}));
            //postNewIdentity(company["companyId"]);
        },
        error: function (xhr, status) {
            // code run if request fails; raw request and status
            console.log("Sorry, there was a problem!");
        },
        complete: function (xhr, status) {  	// code to run regardless of success or failure
            console.log("The request is complete!");
        }
    });
}

function postNewIdentity (companyId){
    const identity = {
        participant: 'org.acme.sample.Company#'+companyId,
        userID: companyId,
        options: {}
    };
    $.ajax({
        url: "http://localhost:3000/api/system/identities/issue",
        type: "POST",
        dataType: "blob",
        data: identity,
        xhrFields: {
            withCredentials: true
        },

        success: function (card) {
            console.log(card);
        },
        error: function (xhr, status) {
            // code run if request fails; raw request and status
            console.log("Sorry, there was a problem!");
        },
        complete: function (xhr, status) {      // code to run regardless of success or failure
            console.log("The request is complete!");
        }
    });
}

function updateCompanyData(postData, company) {
    $.ajax({
        url: "http://localhost:3000/api/company/"+company,
        type: "PUT",
        dataType: "json",
        data: postData,

        success: function (company) {
            var param = $.param(company);
            console.log(param);
            var companyId = company["companyId"];
            var name = company["companyName"];
            var address = company["address"];
            var touch = company["touch"];
            var siret = company["siret"];
            var children = $('#' + companyId).children();    
            children.eq(0).replaceWith( "<h4>"+name+"</h4>" );
            children.eq(1).replaceWith( "<p>Address : "+address+"</p>" );
            children.eq(2).replaceWith( "<p>SIRET : "+siret+"</p>" );
            children.eq(3).replaceWith( "<p>Touch ID : "+touch+"</p>" );
        },
        error: function (xhr, status) {
            // code run if request fails; raw request and status
            console.log("Sorry, there was a problem!");
        },
        complete: function (xhr, status) {      // code to run regardless of success or failure
            console.log("The request is complete!");
        }
    });
}




function getAccountData(accountId, callback) {
    $.ajax({
        url: "http://localhost:3000/api/account/"+accountId,
        // the URL for the request
        type: "GET",
        // whether this is a POST or GET request
        dataType: "json",
        // the type of data we expect back
        success: function (account) {
            var param = $.param(account);
            console.log(param);
            callback(account);
        },
        error: function (xhr, status) {
            // code run if request fails; raw request and status
            console.log("Sorry, there was a problem!");
        },
        complete: function (xhr, status) {      // code to run regardless of success or failure
            console.log("The request is complete!");
        }
    });
}

function getAllAccountData(accountTable, accountRoute) {
    
    $.ajax({
        url: "http://localhost:3000/api/account",
        type: "GET",
        dataType: "json",

        success: function (responseJson) {
            $('#'+accountTable+' > tbody').empty();
            $.each(responseJson, function (i, account) {
                //clean up company string since it is a references containing #
                var company = account["company"];
                company = company.substring(company.indexOf("#") + 1);
                getCompanyData(company, function(output){
                    company = output["companyName"];
                    account["company"] = company;
                    var param = $.param(account);
                    console.log(param);
                    $('#'+accountTable+' > tbody:last-child').append(nunjucks.render(accountRoute+"?"+param, {account: account}));
                });
            });
        },
        error: function (xhr, status) {
            // code run if request fails; raw request and status
            console.log("Sorry, there was a problem!");
        },
        complete: function (xhr, status) {  	// code to run regardless of success or failure
            console.log("The request is complete!");
        }
    });
}

function getToManageAccountData(accountListTable, accountRoute, modalElm, company) {
    $.ajax({
        url: "http://localhost:3000/api/account",
        // the URL for the request
        type: "GET",
        // whether this is a POST or GET request
        dataType: "json",
        // the type of data we expect back
        success: function (responseJson) {
            $('#'+accountListTable+' > tbody').empty();
            $.each(responseJson, function (i, account) {
                var companyAccount = account["company"];
                companyAccount = companyAccount.substring(companyAccount.indexOf("#") + 1);
                if (companyAccount == company) {
                    //clean up producer string since it is a references containing #
                    account["company"] = companyAccount;
                    var param = $.param(account);
                    console.log(param);
                    $('#'+accountListTable+' > tbody:last-child').append(nunjucks.render(accountRoute+"?"+param, {account: account}));
                }
            });
        },
        error: function (xhr, status) {
            // code run if request fails; raw request and status
            console.log("Sorry, there was a problem!");
        },
        complete: function (xhr, status) {      // code to run regardless of success or failure
            console.log("The request is complete!");
            if(modalElm !== null) {
                modalElm.find('.modal-body').css({
                    display: 'table'
                });
            }
        }
    });
}

function postAccountData (postData) {
    $.ajax({
        url: "http://localhost:3000/api/account",
        // the URL for the request
        type: "POST",
        // whether this is a POST or GET request
        dataType: "json",
        data: postData,
        // the type of data we expect back
        success: function (account) {
            myApp.hidePleaseWait();
            var company = account["company"];
            var accountId = account["accountId"];
            var companyId = company.substring(company.indexOf("#") + 1);
            account["company"] = $('#'+companyId).children(":first").text();
            var param = $.param(account);
            console.log(param);
            $('#accountTable > tbody:last-child').append(nunjucks.render("account?"+param, {account: account}));
            
            var iban = account["iban"];
            $("td:contains("+iban+")").parent().each(function (i,x) {
                var colorStr = '#f2ff68'; // color of highlight
                $(this).css("background-color",colorStr);
                setTimeout(function(){
                    $(x).css("background-color","transparent"); // reset background
                    $(x).effect("highlight", {color: colorStr}, 3000); // animate
                },500);
            });

            var postTransaction = {};
            postTransaction["$class"] = "org.acme.sample.AwaitingTransaction";
            postTransaction["account"] = "resource:org.acme.sample.Account#"+accountId;
            postTransaction["company"] = "resource:org.acme.sample.Company#"+companyId;
            postAwaitingAccountData(postTransaction);
        },
        error: function (xhr, status) {
            // code run if request fails; raw request and status
            console.log("Sorry, there was a problem!");
        },
        complete: function (xhr, status) {  	// code to run regardless of success or failure
            console.log("The request is complete!");
        }
    });
}

function searchForAccount() {
  // Declare variables
  var input, filter, table, tr, td, i;
  input = document.getElementById("search");
  filter = input.value.toUpperCase();
  table = document.getElementById("accountTable");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[2];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}




function postCertifiedAccountData (postData) {
    $.ajax({
        url: "http://localhost:3000/api/CertifiedTransaction",
        // the URL for the request
        type: "POST",
        // whether this is a POST or GET request
        dataType: "json",
        data: postData,
        // the type of data we expect back
        success: function (certified) {
            myApp.hidePleaseWait();
            var param = $.param(certified);
            console.log(param);

            var account = certified["account"];
            account = account.substring(account.indexOf("#") + 1);
            getAccountData(account, function(output){
                account = output["iban"];
                var status = $("td:contains("+account+")").next();
                status.replaceWith( "<td>Certified</td>" );

                $("td:contains("+account+")").parent().each(function (i,x) {
                    var colorStr = '#00b208'; // color of highlight
                    $(this).css("background-color",colorStr);
                    setTimeout(function(){
                        $(x).css("background-color","#b2ffb6"); // reset background
                        $(x).effect("highlight", {color: colorStr}, 3000); // animate
                    },500);
                });
            });

            var txId = certified["transactionId"];
            getTransactionData(txId)
        },
        error: function (xhr, status) {
            // code run if request fails; raw request and status
            console.log("Sorry, there was a problem!");
        },
        complete: function (xhr, status) {  	// code to run regardless of success or failure
            console.log("The request is complete!");
        }
    });
}

function postRejectedAccountData (postData) {
    $.ajax({
        url: "http://localhost:3000/api/RejectedTransaction",
        // the URL for the request
        type: "POST",
        // whether this is a POST or GET request
        dataType: "json",
        data: postData,
        // the type of data we expect back
        success: function (rejected) {
            myApp.hidePleaseWait();
            var param = $.param(rejected);
            console.log(param);

            var account = rejected["account"];
            account = account.substring(account.indexOf("#") + 1);
            getAccountData(account, function(output){
                account = output["iban"];
                var status = $("td:contains("+account+")").next();
                status.replaceWith( "<td>Rejected</td>" );

                $("td:contains("+account+")").parent().each(function (i,x) {
                    var colorStr = '#e20000'; // color of highlight
                    $(this).css("background-color",colorStr);
                    setTimeout(function(){
                        $(x).css("background-color","#fcb5b5"); // reset background
                        $(x).effect("highlight", {color: colorStr}, 3000); // animate
                    },500);
                });
            });

            var txId = rejected["transactionId"];
            getTransactionData(txId)
        },
        error: function (xhr, status) {
            // code run if request fails; raw request and status
            console.log("Sorry, there was a problem!");
        },
        complete: function (xhr, status) {      // code to run regardless of success or failure
            console.log("The request is complete!");
        }
    });
}

function postAwaitingAccountData (postData) {
    $.ajax({
        url: "http://localhost:3000/api/AwaitingTransaction",
        // the URL for the request
        type: "POST",
        // whether this is a POST or GET request
        dataType: "json",
        data: postData,
        // the type of data we expect back
        success: function (awaiting) {
            var param = $.param(awaiting);
            console.log(param);

            var txId = awaiting["transactionId"];
            getTransactionData(txId)
        },
        error: function (xhr, status) {
            // code run if request fails; raw request and status
            console.log("Sorry, there was a problem!");
        },
        complete: function (xhr, status) {      // code to run regardless of success or failure
            console.log("The request is complete!");
        }
    });
}




function getAllTransactionData() {
    $.ajax({
        url: "http://localhost:3000/api/system/historian",
        // the URL for the request
        type: "GET",
        // whether this is a POST or GET request
        dataType: "json",
        // the type of data we expect back
        success: function (responseJson) {

            responseJson.sort(function(a,b){
                // Turn your strings into dates, and then subtract them
                // to get a value that is either negative, positive, or zero.
                return new Date(a.timestamp) - new Date(b.timestamp);
            });

            $.each(responseJson, function (i, transaction) {
                //var txId = transaction["transactionId"];
                var classType = transaction["$class"];
                var eventEmitted = transaction["eventsEmitted"];
                var timestamp = new Date(transaction["transactionTimestamp"]);
                transaction["timestamp"] = timestamp.toUTCString();

                var param = $.param(transaction);
                console.log(param);
                //if(classType.indexOf("Watched") >= 0) {
                if(eventEmitted && eventEmitted.length){
                    $('ul.transactions').append(nunjucks.render("transaction?" + param, {transaction: transaction}));
                }
            });
        },
        error: function (xhr, status) {
            // code run if request fails; raw request and status
            console.log("Sorry, there was a problem!");
        },
        complete: function (xhr, status) {  	// code to run regardless of success or failure
            console.log("The request is complete!");
        }
    });
}

function getTransactionData(txId, callback) {
    $.ajax({
        url: "http://localhost:3000/api/system/historian/"+txId,
        // the URL for the request
        type: "GET",
        // whether this is a POST or GET request
        dataType: "json",
        // the type of data we expect back
        success: function (transaction) {
            //var txId = transaction["transactionId"];
            var classType = transaction["$class"];
            var eventEmitted = transaction["eventsEmitted"];
            var timestamp = new Date(transaction["transactionTimestamp"]);
            transaction["timestamp"] = timestamp.toUTCString();

            var param = $.param(transaction);
            console.log(param);
            //if(classType.indexOf("Watched") >= 0) {
            if(eventEmitted && eventEmitted.length){
                $('ul.transactions').append(nunjucks.render("transaction?" + param, {transaction: transaction}));

                var colorStr = '#43ff2c'; // color of highlight
                $('ul.transactions > li.'+txId+' div').each(function (i,x) {
                    $(this).css("background-color",colorStr);
                    setTimeout(function(){
                        $(x).css("background-color","#FFFFE0"); // reset background
                        $(x).effect("highlight", {color: colorStr}, 3500); // animate
                    },500);
                });
            }
        },
        error: function (xhr, status) {
            // code run if request fails; raw request and status
            console.log("Sorry, there was a problem!");
        },
        complete: function (xhr, status) {  	// code to run regardless of success or failure
            console.log("The request is complete!");
        }
    });
}




function getFormDataAsJSON($form){
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}




$(document).ready(function() {
    var env = new nunjucks.Environment(new nunjucks.WebLoader('../template'));

    //GET all companies from the blockchain
    getAllCompanyData();

    //GET all accounts from the blockchain
    getAllAccountData("accountTable", "account");

    //GET all transactions from the blockchain
    getAllTransactionData();



    //POST a company to the blockchain
    $("#companyFormSubmit").on('click', function() {
        $("#companyForm").submit();
    });
    $('#companyForm').on('submit', function(e){
        e.preventDefault();
        var postData = getFormDataAsJSON($(this));
        postCompanyData(postData);
    });

    $('#companyModal').on('show.bs.modal', function(e) {
        $(this).find('#companyId').val(Date.now());
    });



    //PUT (update) a company to the blockchain
    $("#companyUpdateFormSubmit").on('click', function() {
        $("#companyUpdateForm").submit();
    });
    $('#companyUpdateForm').on('submit', function(e){
        e.preventDefault();
        var postData = getFormDataAsJSON($(this));
        var company = postData["companyId"];
        delete postData["companyId"];
        updateCompanyData(postData, company);
    });

    $('#companyUpdateModal').on('show.bs.modal', function(e) {
        var company = $(e.relatedTarget).attr("data-company");
        var children = $('#' + company).children();    
        var name = children.eq(0).val();
        var address = children.eq(1).val();
        var siret = children.eq(2).val();
        $(this).find('#companyInputName').val(name);
        $(this).find('#companyInputAddress').val(address);
        $(this).find('#companyInputSiret').val(siret);
        $(this).find('#companyId').val(company);
    });



    //POST an account to the blockchain
    $("#accountFormSubmit").on('click', function() {
        $("#accountForm").submit();
    });
    $('#accountForm').on('submit', function(e){
        e.preventDefault();
        var postData = getFormDataAsJSON($(this));
        myApp.showPleaseWait();
        postAccountData(postData);
    });

    $('#accountModal').on('show.bs.modal', function(e) {
        var company = $(e.relatedTarget).attr("data-company");
        $(this).find('#accountId').val(company+"_"+Date.now());
        $(this).find('#company').val("resource:org.acme.sample.Company#" + company);
    });

    $('#accountListModal').on('show.bs.modal', function(e) {
        var company = $(e.relatedTarget).attr("data-company");

        //GET assets from the blockchain
        getToManageAccountData("accountListTable", "manage", $(this), company);
    });



    $(document).on('click', ".certify-btn" , function() {
        var account = $(this).attr("data-account");
        var company = $(this).attr("data-company");
        var postData = {};
        postData["$class"] = "org.acme.sample.CertifiedTransaction";
        postData["account"] = "resource:org.acme.sample.Account#"+account;
        postData["company"] = "resource:org.acme.sample.Company#"+company;

        myApp.showPleaseWait();
        postCertifiedAccountData(postData);
    });

    $(document).on('click', ".reject-btn" , function() {
        var account = $(this).attr("data-account");
        var company = $(this).attr("data-company");
        var postData = {};
        postData["$class"] = "org.acme.sample.RejectedTransaction";
        postData["account"] = "resource:org.acme.sample.Account#"+account;
        postData["company"] = "resource:org.acme.sample.Company#"+company;

        myApp.showPleaseWait();
        postRejectedAccountData(postData);
    });

});

