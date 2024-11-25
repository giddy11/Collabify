//check for token
const token = localStorage.getItem('accessToken');
console.log(token);
if(!token) {
  window.location.href = './signin.html';
}