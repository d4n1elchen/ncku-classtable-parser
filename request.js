var request = require('request');
var iconv = require('iconv-lite');

var stu_no = '';
var passwd = '';
var id_no = 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3';

var j = request.jar()
var request = request.defaults({encoding:null,jar: j})

function get(stu_no, passwd, callback) {
  var form = {
    stu_no: stu_no,
    passwd: passwd,
    id_no: id_no
  }

  request('http://course.ncku.edu.tw/course/login.php', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      //console.log(j) // watch jar
      login(form, callback);
    }
  })
}

function logout() {
  request('http://course.ncku.edu.tw/course/logout.php',
  function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var str = iconv.decode(new Buffer(body), "big5");
      //console.log(str);
    }
  });// logout request
}

function login(form, callback) {
  request.post({
      url:'http://course.ncku.edu.tw/course/login.php',
      form: form
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var str = iconv.decode(new Buffer(body), "big5");
        console.log("login response length: " + str.length); // login success when str.length < 80

        if(str.length < 80) {
          request('http://course.ncku.edu.tw/course/schedule.php',
            function (error, response, body) {
              if (!error && response.statusCode == 200) {
                var str = iconv.decode(new Buffer(body), "big5");
                //console.log(str);
                logout();
                return callback(str);
              }
            })// schedule request
        }else if(str.length > 300 && str.length < 320){
          logout();
          login(form, callback);
        }else{
          return callback(-1);
        }

      }
    });// login request
}

module.exports = get;
