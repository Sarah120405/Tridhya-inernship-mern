// With enum — only valid values allowed
enum Status {
  Active, // 0
  Inactive, //1
  Pending, //2
}
let userStatus = Status.Inactive;
console.log("User Status using enum: ", userStatus);

enum Role {
  Admin = "ADMIN",
  Author = "AUTHOR",
  Reader = "READER",
  Vendor = "VENDOR",
}

function checkAccess(role: Role): string {
  if (role === Role.Admin) return "Full access";
  if (role === Role.Author) return "Can publish";
  return "Read only";
}

console.log(checkAccess(Role.Admin));
console.log(checkAccess(Role.Reader));
