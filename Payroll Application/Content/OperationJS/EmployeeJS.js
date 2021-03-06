﻿//load title
function LoadTitles() {
    var cboTitle = $("#cboTitle");
    $.ajax({
        url: "/Setup/LoadAllTitles",
        type: "GET",
        cache:false
    }).success(function (result) {
        //debugger;
       // cboTitle.empty();
        for (i = 0; i <= result.length - 1; i++) {
            
            var title = result[i];
            var p = new Option(title.Description, title.Code);
            cboTitle.append(p);
        }
    })
}
//load branches
function loadBranches() {
    var cboBranch = $("#cboBranch");
    $.ajax({
        url: "/Setup/LoadAllBranches",
        type: "GET",
        cache: false

    }).success(function (result) {
        for (i = 0; i <= result.length; i++) {
            var branch = result[i];
            var p = new Option(branch.BranchName, branch.BranchCode);
            cboBranch.append(p);
        }
    });
}
//load countries
function loadCountries(dropdownlistID) {
    var nok = $(dropdownlistID);
    //var pCountry = $("#cbocountry");
    //var GCountry = $("#cboGCountry");
    //var nation = $("#cboNation");
    $.ajax({
        url: "/Setup/LoadCountry",
        type: "GET",
        cache:false
    }).success(function (result) {
        for (i = 0; i <= result.length; i++) {
            var count = result[i];
            var p = new Option(count.Name.toUpperCase(), count.Name.toUpperCase());
            nok.append(p);
            //pCountry.append(p);
            //GCountry.append(p);
            //nation.append(p);
        }
    })
}

//load state
function populateStates(ddlCountry, ddlState, txtOtherState) {
    var countryName = $(ddlCountry).val();
    $.ajax({
        url: "/Employee/GetStates",
        type: "GET",
        data: { CountryName: countryName },
        cache: false
    }).success(function (result) {
        if (result.length === 0) {
            $(ddlState).hide();
            $(txtOtherState).show();
        }
        else {
            for (i = 0; i <= result.length; i++) {
                var state = result[i];
                var p = new Option(state.Name.toUpperCase(), state.Name.toUpperCase());
                $(ddlState).append(p);
                $(ddlState).show();
                $(txtOtherState).hide();
            }
        }
    })
}

//load Grade
function populateGrades() {
    var cbolevel = $("#cboLevel");
    $.ajax({
        url: "/Setup/loadAllLevels",
        type: "GET",
        cache:false
    }).success(function (result) {
        for (i = 0; i <= result.length - 1; i++) {
            var level = result[i];
            var p = new Option(level.Description, level.Code);
            cbolevel.append(p);
        }
    })
}
//load the Designation
function populateDesignation() {
    var cbodesg = $("#cbodesignation");
    $.ajax({
        url: "/Setup/LoadAllDesignations",
        type: "GET",
        cache: false
    }).success(function (result) {
        for (i = 0; i <= result.length - 1; i++) {
            var designation = result[i];
            var p = new Option(designation.Description, designation.Code);
            cbodesg.append(p);
        }
    })
}
//load Employment Type
function populateEmploymentType() {
    var cboemp = $("#cboempType");
    $.ajax({
        url: "/Setup/loadAllEmpTypes",
        type: "GET",
        cache: false
    }).success(function (result) {
        for (i = 0; i <= result.length - 1; i++) {
            var emp = result[i];
            var p = new Option(emp.Description, emp.Code);
            cboemp.append(p);
        }
    })
}
//load Department
function populateDept() {
    var cbodept = $("#cbodept");
    $.ajax({
        url: "/Setup/LoadAllDepts",
        type: "GET",
        cache: false
    }).success(function (result) {
        for (i = 0; i <= result.length - 1; i++) {
            var dep = result[i];
            var p = new Option(dep.Description, dep.DeptCode);
            cbodept.append(p);
        }
    })
}
//upload Photo
$("#uploadPhoto").click(function (evt) {
    evt.preventDefault();
    var frmdata = new FormData();
    var files = $("#empfile").get(0).files;
    if (files.length > 0) {
        frmdata.append("MyImages", files[0]);
    }
    else {
        return;
    }
    $("#loading").show();
    $.ajax({
        url: "/Employee/UploadEmployeePhoto",
        type: "POST",
        data: frmdata,
        processData: false,
        contentType: false,
        cache: false
    }).success(function (result) {
        var imgurl = "/EmployeeImages/" + result
        $("#empImage").attr("src", imgurl);
        $("#empImg").val(imgurl);
        $("#loading").hide();
    }).fail(function (error) {
        // $("#lblError").val(error);
        // $("#lblError").show();
        $("#loading").hide();
    })
});
//upload attachment
$("#uploadAttachment").click(function (evt) {
    evt.preventDefault();
    var myFrmdata = new FormData();
    var files = $("#empfileAtt").get(0).files;
    for (var i = 0; i < files.length; i++) {
        myFrmdata.append(files[i].name, files[i]);
    }
    $("#loading").show();
    $.ajax({
        url: "/Employee/UploadEmployeeAttachment",
        type: "POST",
        data: myFrmdata,
        processData: false,
        contentType: false,
        async: false,
        cache: false
    }).success(function (result) {
        if (result != "") {
            $('#FileBrowse').find("*").prop("disabled", true);
            LoadProgressBar(result);
            SaveFileUrl(evt);
            var realFileUrl = "/Attachment/" + result
            $("#empAtt").val(realFileUrl);
            $("#loading").hide();
        }
    }).fail(function (error) {
        $("#lblError").val(error.statusText);
        $("#lblError").show();
        $("#loading").hide();
        })
    alert(realFileUrl);
});

function SaveFileUrl(evt) {
    evt.preventDefault();
    var RegID = $("#txtRegId").val();
    var fileUrl = $("#empAtt").val();
    attachment = {
        RegistrationID: RegID, FileUrl: fileUrl
    }
    $.ajax({
        url: "/Employee/SaveUrl",
        data: attachment,
        type: "POST"
    }).success(function (result) {
        if (result.status) {
            $("#lblSuccessMsg").html("Uploading completed. /n Attachment successfully!");
            $("#lblSuccessMsg").show();
            $("#loading").hide();
        }
    }).fail(function (error) {
        $("#lblErrorMsg").html(error.Desc);
        $("#lblErrorMsg").show();
        $("#loading").hide();
    });
}

//Progress bar Function
function LoadProgressBar(result) {
    var progressLabel = $(".progress-label");
    var progressbar = $("#progressbar-5");
    progressbar.show();
    $("#progressbar-5").progressbar({
        //value: false,
        complete: function () {
            progressLabel.text("Loading Completed!");
            progressbar.progressbar("value", 0);
            //progressLabel.text("");
            progressbar.hide();
            $('#FileBrowse').find("*").prop("disabled", false);
        },
        change: function () {
            progressLabel.text(
                progressbar.progressbar("value") + "%");
        }
    });
    function progress() {
        var val = progressbar.progressbar("value") || 0;
        progressbar.progressbar("value", val + 1);
        if (val < 99) {
            setTimeout(progress, 25);
        }
    }
    setTimeout(progress, 100);
}

//checkbox event
$('#chkNokAbove').click(function () {
    if ($(this).is(':checked')) {
        $("#txtnokaddress").val($("#txtaddress").val());
    }
    else {
        $("#txtnokaddress").val("");
    }
});

//checkbox event
$('#chkGAbove').click(function () {
    if ($(this).is(':checked')) {
        $("#txtGaddress").val($("#txtaddress").val());
    }
    else {
        $("#txtGaddress").val("");
    }
});
$('#chkRAbove').click(function () {
    if ($(this).is(':checked')) {
        $("#txtGaddress").val($("#txtaddress").val());
    }
    else {
        $("#txtGaddress").val("");
    }
});

$('#chkRAbove').click(function () {
    if ($(this).is(':checked')) {
        $("#txtRaddress").val($("#txtaddress").val());
    }
    else {
        $("#txtRaddress").val("");
    }
});

//New button click 
$("#NewRecord").click(function (evt) {
    evt.preventDefault();
    $("#loading").show();
    $.ajax({
        url: "/Employee/GetRegistrationNo",
        type: "GET",
        cache: false
    }).success(function (result) {
        $("#txtRegId").val(result.RegistrationID);
        $("#txtStaffNo").val(result.StaffNo);
        ClearPersonalInformation();
        $("#loading").hide();
    }).fail(function (error) {
        $("#loading").hide();
    })
});

//clear personal information
function ClearPersonalInformation() {
    // $("#txtRegId").val();
  // $("#txtStaffNo").val();
   // var imgurl = $("#empImg").val();
     $("#txtsurname").val("");
     $("#txtmiddlename").val("");
    $("#txtfirstname").val("");
     $("#txtdob").val("");
     $("#txtspouseName").val("");
     $("#txtdisabilityDesc").val("");
     $("#txtstate").val("");
}

function LoadExperience(reg) {
    var RegID = $(reg).val();
    $.ajax({
        url: "/Employee/LoadExpInfo",
        type: "POST",
        data: { RegistID: RegID}
    }).success(function (data) {
        $("#experienceDataList").html(data);
        $("#ExperienceList").DataTable({
            "pageLength": 20
        });
    })
}
function DeleteExperience(Id) {
    bootbox.confirm({
        size: "small",
        message: "Are you sure you want to delete this record?",
        callback: function (result) {
            if (result) {
                $.ajax({
                    url: "/Employee/DeleteExperience",
                    type: "POST",
                    data: { ID: Id }
                }).success(function (data) {
                    LoadExperience();
                })
            }
        }
    });
}
//edit experience
function EditExperience(Id) {
    $.ajax({
        url: "/Employee/GetExperienceData",
        type: "GET",
        data: { ID: Id },
        cache: false
    }).success(function (data) {
        $("#txtcompName").val(data.CompName);
        $("#txtjobPosition").val(data.JobPosition);
        $("#txtdJoined").val(data.DJoined);
        $("#txtdLeft").val(data.DLeft);
    })
}
//Saving Personal Information
$("#SavePersonal").click(function (evt) {
    evt.preventDefault();
    var RegID = $("#txtRegId").val();
    var staffNo = $("#txtStaffNo").val();
    var titleCode = $("#cboTitle").val();
    var imgurl = $("#empImg").val();
    var surname = $("#txtsurname").val();
    var middleName = $("#txtmiddlename").val();
    var firstName = $("#txtfirstname").val();
    var dateofbirth = $("#txtdob").val();
    var marital = $("#cboMarital").val();
    var nationality = $("#cboNation").val();
    var state = "";
    var religion = $("#cboReligion").val();
    var spouse = $("#txtspouseName").val();
    var disability = $("#cboDisability").val();
    var disability_desc = $("#txtdisabilityDesc").val();
    var gender = $("#cboGender").val();
    if (RegID.length === 0) {
        $("#lblErrorMsg").val("Registration ID cannot be blank! Click New button");
        $("#lblErrorMsg").show();
        return;
    }
    else if (staffNo.length === 0) {
        $("#lblErrorMsg").val("Staff Number cannot be blank!");
        $("#lblErrorMsg").show();
        $("#txtStaffNo").focus();
        return;
    }
    else if (surname.length === 0) {
        $("#lblErrorMsg").val("Surname cannot be blank!");
        $("#lblErrorMsg").show();
        $("#txtsurname").focus();
        return;
    }
    else if (firstName.length === 0) {
        $("#lblErrorMsg").val("First Name cannot be blank!");
        $("#lblErrorMsg").show();
        $("#txtfirstname").focus();
        return;
    }
    if ($("#txtstate").is(":visible")) {
        state = $("#txtstate").val();
    }
    else {
         state = $("#cboState").val();
    }
    var personal = {
        RegistrationID: RegID, StaffNo: staffNo, TitleCode: titleCode, Surname: surname,
        MiddleName: middleName, FirstName: firstName, DateofBirth: dateofbirth,
        MaritalStatus: marital, Nationality: nationality, State: state, Gender: gender,
        Religion: religion, SpouseName: spouse, Disability: disability, DisabilityDescription: disability_desc,
        ImageUrl: imgurl, StaffStatus:'REGULAR'
    };
    $("#lblSuccessMsg").hide();
    $("#lblErrorMsg").hide();
    $("#loading").show();
    $.ajax({
        url: "/Employee/SavePersonalInformation",
        data: personal,
        type: "POST"
    }).success(function (result) {
        if (result.status) {
            $("#lblSuccessMsg").html("Personal Information saved successfully!");
            $("#lblSuccessMsg").show();
        }
        $("#loading").hide();
        }).fail(function (error) {
            $("#lblErrorMsg").html(error.Desc);
            $("#lblErrorMsg").show();
        $("#loading").hide();
    });
});

//save Contact Information
$("#SaveCont").click(function (evt) {
    evt.preventDefault();
    var RegID = $("#txtRegId").val();
    var staffNo = $("#txtStaffNo").val();
    var address = $("#txtaddress").val();
    var city = $("#txtcity").val();
    var country = $("#cbocountry").val();
    var state = "";
    var lga = $("#txtlga").val();
    var landmark = $("#txtlandmark").val();
    if ($("#txtstateAdd").is(":visible")) {
        state = $("#txtstateAdd").val();
    }
    else {
        state = $("#cboStateAdd").val();
    }
    var mobileNo = $("#txtMobileNo").val();
    var mobileNo2 = $("#txtMobileNo2").val();
    var workPhoneNo = $("#txtWorkPhone").val();
    var email = $("#txtemail").val();
    var emailWork = $("#txtemailwork").val();
    if (address.length === 0) {
        $("#lblErrorMsg").val("Address cannot be blank!");
        $("#lblErrorMsg").show();
        $("#txtaddress").focus();
        return;
    }
    var contact = {
        RegistrationID: RegID, StaffNo: staffNo, Address: address, City: city, Country: country, State: state, LGA: lga,
        Landmark: landmark, MobileNo: mobileNo, MobileNo2: mobileNo2, WorkPhoneNo: workPhoneNo, Email: email, WorkEmail: emailWork
    };
    $("#lblSuccessMsg").hide();
    $("#lblErrorMsg").hide();
    $("#loading").show();
    $.ajax({
        url: "/Employee/SaveEmployeeContactInformation",
        data: contact,
        type: "POST"
    }).success(function (result) {
        if (result.status) {
            $("#lblSuccessMsg").html("Contact Information saved successfully!");
            $("#lblSuccessMsg").show();
        }
        $("#loading").hide();
    }).fail(function (error) {
        $("#lblErrorMsg").html(error.Desc);
        $("#lblErrorMsg").show();
        $("#loading").hide();
    });

});
//Next Of Kin  
$("#SaveKin").click(function (evt) {
    evt.preventDefault();
    var RegID = $("#txtRegId").val();
    var nokName = $("#txtnokName").val();
    var nokPhoneNo = $("#txtnokPhoneNo").val();
    var nokRelationship = $("#txtnokRelationship").val();
    var nokaddress = $("#txtnokaddress").val();
    var nokcountry = $("#cbocountry").val();
    var Nstate = "";
    var sosName = $("#txtsosName").val();
    var sosPhoneNo = $("#txtsosPhoneNo").val();
    if ($("#txtnokstate").is(":visible")) {
        Nstate = $("#txtnokstate").val();
    }
    else {
        Nstate = $("#cboStateAdd").val();
    }
    if (nokName === null || nokName === '') {
        $("#lblErrorMsg").val("Fullname cannot be blank!");
        $("#lblErrorMsg").show();
        $("#txtnokName").focus();
        return;
    }
    if (nokaddress.length === 0) {
        $("#lblErrorMsg").val("Address cannot be blank!");
        $("#lblErrorMsg").show();
        $("#txtnokaddress").focus();
        return;
    }
    var nextofKin = {
        RegistrationID: RegID, FullName: nokName, PhoneNo: nokPhoneNo, Address: nokaddress, Country: nokcountry, State: Nstate,
        Relationship: nokRelationship, Name: sosName, Contact: sosPhoneNo
    };
    $("#lblSuccessMsg").hide();
    $("#lblErrorMsg").hide();
    $("#loading").show();
    $.ajax({
        url: "/Employee/SaveEmployeeNextofKinInformation",
        data: nextofKin,
        type: "POST"
    }).success(function (result) {
        if (result.status) {
            $("#lblSuccessMsg").html("Next of Kin Information saved successfully!");
            $("#lblSuccessMsg").show();
        }
        $("#loading").hide();
    }).fail(function (error) {
        $("#lblErrorMsg").html(error.Desc);
        $("#lblErrorMsg").show();
        $("#loading").hide();
    });
});

//Saving Guarantor
$("#AddGua").click(function (evt) {
    evt.preventDefault();
    var RegID = $("#txtRegId").val();
    var GName = $("#txtGName").val();
    var GPhoneNo = $("#txtGPhoneNo").val();
    var Gaddress = $("#txtGaddress").val();
    var Gcountry = $("#txtGcountry").val();
    var Gustate = "";
    var GPaylevel = $("#txtGPayLevel").val();
    if ($("#txtGState").is(":visible")) {
        Gustate = $("#txtGState").val();
    }
    else {
        Gustate = $("#cboGState").val();
    }
    if (GName === null || GName === '') {
        $("#lblErrorMsg").val("Fullname cannot be blank!");
        $("#lblErrorMsg").show();
        $("#txtnokName").focus();
        return;
    }
    if (Gaddress.length === 0) {
        $("#lblErrorMsg").val("Address cannot be blank!");
        $("#lblErrorMsg").show();
        $("#txtnokaddress").focus();
        return;
    }
    if (GPaylevel.length === 0) {
        $("#lblErrorMsg").val("Pay Level cannot be blank!");
        $("#lblErrorMsg").show();
        $("#txtnokaddress").focus();
        return;
    }
    var guarantor = {
        RegistrationID: RegID, GFullName: GName, GPhoneNo: GPhoneNo, GPayLevel: GPaylevel, GAddress: Gaddress, GCountry: Gcountry, GState: Gustate
    };
    $("#lblSuccessMsg").hide();
    $("#lblErrorMsg").hide();
    $("#loading").show();
    $.ajax({
        url: "/Employee/SaveGuarantorInformation",
        data: guarantor,
        type: "POST"
    }).success(function (result) {
        if (result.status) {
            $("#lblSuccessMsg").html("Guarantor Information saved successfully!");
            $("#lblSuccessMsg").show();
            $("#loading").hide();
        }
    }).fail(function (error) {
        $("#lblErrorMsg").html(error.Desc);
        $("#lblErrorMsg").show();
        $("#loading").hide();
    });
    $(".clear").val('');
});

//Add References
$("#AddRef").click(function (evt) {
    evt.preventDefault();
    var RegID = $("#txtRegId").val();
    var RName = $("#txtRName").val();
    var RPhoneNo = $("#txtRPhoneNo").val();
    var Raddress = $("#txtRaddress").val();
    var Rcountry = $("#txtRcountry").val();
    var Restate = "";
    var RJobPosition = $("#txtRJobPosition").val();
    if ($("#txtRState").is(":visible")) {
        Restate = $("#txtRState").val();
    }
    else {
        Gustate = $("#cboRState").val();
    }
    if (RName === null || RName === '') {
        $("#lblErrorMsg").val("Fullname cannot be blank!");
        $("#lblErrorMsg").show();
        $("#txtRName").focus();
        return;
    }
    if (Raddress.length === 0) {
        $("#lblErrorMsg").val("Address cannot be blank!");
        $("#lblErrorMsg").show();
        $("#txtRaddress").focus();
        return;
    }
    if (RJobPosition.length === 0) {
        $("#lblErrorMsg").val("Address cannot be blank!");
        $("#lblErrorMsg").show();
        $("#txtRJobPosition").focus();
        return;
    }
    var reference = {
        RegistrationID: RegID, RFullName: RName, RPhoneNo: RPhoneNo, RAddress: Raddress, RCountry: Rcountry, RState: Restate,
        RJobPosition: RJobPosition
    };
    $("#lblSuccessMsg").hide();
    $("#lblErrorMsg").hide();
    $("#loading").show();
    $.ajax({
        url: "/Employee/SaveReferenceInformation",
        data: reference,
        type: "POST"
    }).success(function (result) {
        if (result.status) {
            $("#lblSuccessMsg").html("Reference Information saved successfully!");
            $("#lblSuccessMsg").show();
            $("#loading").hide();
        }
    }).fail(function (error) {
        $("#lblErrorMsg").html(error.Desc);
        $("#lblErrorMsg").show();
        $("#loading").hide();
    });
    $(".clear").val('');
});


// Saving Employment Info
$("#SaveEmployment").click(function (evt) {
    evt.preventDefault();
    var RegID = $("#txtRegId").val();
    var staffNo = $("#txtStaffNo").val();
    var branch = $("#cboBranch").val();
    var dateJoined = $("#txtdateJoined").val();
    var level = $("#cboLevel").val();
    var dateStarted = $("#txtdateStarted").val();
    var designation = $("#cbodesignation").val();
    var empType = $("#cboempType").val();
    var dept = $("#cbodept").val();
    var jobDescription = $("#txtjobDescription").val();
    
    var employment = {
        RegistrationID: RegID, StaffNo: staffNo, Branch: branch, DateJoined: dateJoined, EmpLevel: level, DateStarted: dateStarted, Designation: designation,
        EmploymentType: empType, Department: dept, JobDescription: jobDescription
    };
    $("#lblSuccessMsg").hide();
    $("#lblErrorMsg").hide();
    $("#loading").show();
    $.ajax({
        url: "/Employee/SaveEmployeeEmploymentInfo",
        data: employment,
        type: "POST"
    }).success(function (result) {
        if (result.status) {
            $("#lblSuccessMsg").html("Employment Information saved successfully!");
            $("#lblSuccessMsg").show();
        }
        $("#loading").hide();
    }).fail(function (error) {
        $("#lblErrorMsg").html(error.Desc);
        $("#lblErrorMsg").show();
        $("#loading").hide();
        });
});

$("#searchRecord").click(function (evt) {
    evt.preventDefault();
    $("#loading").show();
    $.ajax({
        url: "/Employee/StaffList",
        type: "POST"
    }).success(function (result) {

        $("#listofEmployee").html(result);
        $("#loading").hide();
        $("#popupStaffList").modal("show");
        $("#TablestaffList").DataTable({
            "pageLength": 20

        });
    }).fail(function (error) {
        $("#loading").hide();
    });
});

//Adding Experience
$("#addExp").click(function (evt) {
    evt.preventDefault();
    var RegID = $("#txtRegId").val();
    var compName = $("#txtcompName").val();
    var jobPosition = $("#txtjobPosition").val();
    var dJoined = $("#txtdJoined").val();
    var dLeft = $("#txtdLeft").val();

    if (compName.length == 0) {
        $("#lblErrorMsg").show();
        $("#txtcompName").focus();
        return;
    }

    var experience = {
        RegistrationID: RegID, CompName: compName, JobPosition: jobPosition, DJoined: dJoined, DLeft: dLeft
    };
    $("#lblSuccessMsg").hide();
    $("#lblErrorMsg").hide();
    $("#loading").show();
    $.ajax({
        url: "/Employee/SaveEmployeeExperience",
        data: experience,
        type: "POST"
    }).success(function (result) {
        if (result.status) {
            $("#lblSuccessMsg").html("Experience Infomation saved successfully!");
            $("#lblSuccessMsg").show();
            LoadExperience();
        }
    }).fail(function (error) {
        $("#lblErrorMsg").html(error.Desc);
        $("#lblErrorMsg").show();
        $("#loading").hide();
    });
    $(".clear").val('');
});
// Saving Qualification
$("#addQualifi").click(function (evt) {
    evt.preventDefault();
    var RegID = $("#txtRegId").val();
    var instiAtt = $("#txtinstiAtt").val();
    var edudegree = $("#txtedudegree").val();
    var OthQuali = $("#txtOthQuali").val();
    var year = $("#txtyear").val();
    var qualification = {
        RegistrationID: RegID, Institution: instiAtt, EducationQua: edudegree, Year: year, OtherQuali: OthQuali
    };
    $("#lblSuccessMsg").hide();
    $("#lblErrorMsg").hide();
    $("#loading").show();
    $.ajax({
        url: "/Employee/SaveEmployeeQualificaton",
        data: qualification,
        type: "POST"
    }).success(function (result) {
        if (result.status) {
            $("#lblSuccessMsg").html("Qualification Infomation saved successfully!");
            $("#lblSuccessMsg").show();
            LoadQualification();
            $("#txtOthQuali").hide();
        }
    }).fail(function (error) {
        $("#lblErrorMsg").html(error.Desc);
        $("#lblErrorMsg").show();
        $("#loading").hide();
    });
    $(".clear").val('');
});

// Saving medical history
$("#SaveMed").click(function (evt) {
    evt.preventDefault();
    var RegID = $("#txtRegId").val();
    var bgroup = $("#txtbgroup").val();
    var genot = $("#txtgenot").val();
    var weight = $("#txtweight").val();
    var height = $("#txtheight").val();
    var smoke = "";
    var drink = "";
    var allergies = $("#txtallergies").val();
    var medHistory = "";
    var medComm = $("#txtmedComm").val();
    if ($("#chksmokeyes").is(':checked')) {
        smoke = "Yes";
    }
    else if ($("#chksmokeno").is(':checked')) {
        smoke = "No";
    }
    else {
        $("#smokeInd").focus();
        $("#lblErrorMsg").html("Please indicate where appropiate");
        $("#lblErrorMsg").show();
    }
    if ($("#chksocial").is(':checked')) {
        drink = "Social Drinker";
    }
    else if ($("#chkmoderate").is(':checked')) {
        drink = "Moderate Drinker";
    }
    else if ($("#chkheavy").is(':checked')) {
        drink = "Heavy Drinker";
    }
    else if ($("#chknodrink").is(':checked')) {
        drink = "No";
    }
    if ($("#chkHBP").is(':checked')) {
        medHistory = "HBP";
    }
    else if ($("#chkAsmathic").is(':checked')) {
        medHistory = "Asmathic";
    }
    else if ($("#chkDiabetic").is(':checked')) {
        medHistory = "Diabetic";
    }
    else if ($("#chkCancer").is(':checked')) {
        medHistory = "Cancer";
    }
    else if ($("#chkTerminal").is(':checked')) {
        medHistory = "Terminal Disease";
    }
    else if ($("#chkOther").is(':checked')) {
        medHistory = "Others";
    }
    var history = {
        RegistrationID: RegID, BGroup: bgroup, Genotype: genot, Weight: weight, Height: height, Smoke: smoke, Drink: drink, 
        Allergies: allergies, MedHistory: medHistory, Comments: medComm
    };
    $("#lblSuccessMsg").hide();
    $("#lblErrorMsg").hide();
    $("#loading").show();
    $.ajax({
        url: "/Employee/SaveMedicalHistory",
        data: history,
        type: "POST"
    }).success(function (result) {
        if (result.status) {
            $("#lblSuccessMsg").html("Medical History saved successfully!");
            $("#lblSuccessMsg").show();
            $("#loading").hide();
        }
    }).fail(function (error) {
        $("#lblErrorMsg").html(error.Desc);
        $("#lblErrorMsg").show();
        $("#loading").hide();
    });
});

//Populating the table
function LoadQualification() {
    var RegID = $("#txtRegId");
    $.ajax({
        url: "/Employee/LoadQualificationInfo",
        type: "POST",
        data: { RegistID: RegID}
    }).success(function (data) {
        $("#quaDataList").html(data);
        $("#QualificationList").DataTable({
            "pageLength": 20
        });
    })
}
//Delete Qualification
function DeleteQualification(Id) {
    bootbox.confirm({
        size: "small",
        message: "Are you sure you want to delete this?",
        callback: function (result) {
            if (result) {
                $.ajax({
                    url: "/Employee/DeleteQualification",
                    type: "POST",
                    data: { ID: Id }
                }).success(function (data) {
                    LoadQualification();
                })
            }
        }
    });
}
//edit Qualification
function EditQualification(Id) {
    $.ajax({
        url: "/Employee/GetQuaData",
        type: "GET",
        data: { ID: Id },
        cache: false
    }).success(function (data) {
        $("#txtinstiAtt").val(data.Institution);
        $("#txtedudegree").val(data.EducationQua);
        $("#txtOthQuali").val(data.EducationQua);
        $("#txtyear").val(data.Year);
    })
}




//validate the numeric input
function validateNumericInput(inputBox) {
    //keypress event
    $(inputBox).keydown(function (event) {

        if (event.shiftKey == true) {
            event.preventDefault();
        }

        if ((event.keyCode >= 48 && event.keyCode <= 57) ||
            (event.keyCode >= 96 && event.keyCode <= 105) ||
            event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 37 ||
            event.keyCode == 39 || event.keyCode == 46 || event.keyCode == 190) {

        } else {
            event.preventDefault();
        }

        if ($(this).val().indexOf('.') != -1 && event.keyCode == 190){
            event.preventDefault();
        //if a decimal has been added, disable the "."-button
        }
    });
}