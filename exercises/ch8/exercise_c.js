// Given the following helper functions:
//
//   // showWelcome :: User -> String
//   const showWelcome = compose(concat('Welcome '), prop('name'));
//
//   // checkActive :: User -> Either String User
//   const checkActive = function checkActive(user) {
//     return user.active
//       ? Either.of(user)
//       : left('Your account is not active');
//   };
//
// Write a function that uses `checkActive` and `showWelcome` to grant access or return the error.

// eitherWelcome :: User -> Either String String
const eitherWelcome = undefined;
