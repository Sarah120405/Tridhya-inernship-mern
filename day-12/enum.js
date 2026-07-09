"use strict";
// With enum — only valid values allowed
var Status;
(function (Status) {
    Status[Status["Active"] = 0] = "Active";
    Status[Status["Inactive"] = 1] = "Inactive";
    Status[Status["Pending"] = 2] = "Pending";
})(Status || (Status = {}));
let userStatus = Status.Inactive;
console.log("User Status using enum: ", userStatus);
var Role;
(function (Role) {
    Role["Admin"] = "ADMIN";
    Role["Author"] = "AUTHOR";
    Role["Reader"] = "READER";
    Role["Vendor"] = "VENDOR";
})(Role || (Role = {}));
function checkAccess(role) {
    if (role === Role.Admin)
        return "Full access";
    if (role === Role.Author)
        return "Can publish";
    return "Read only";
}
console.log(checkAccess(Role.Admin));
console.log(checkAccess(Role.Reader));
