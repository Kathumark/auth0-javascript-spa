window.addEventListener('load', function() {

  var auth = new auth0.WebAuth({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
    redirectUri: 'http://localhost:8080',
    responseType: 'token id_token'
  });

  document.getElementById('btn-login').addEventListener('click', function() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    auth.client.login({
      realm: 'Username-Password-Authentication',
      username: username,
      password: password,
    }, function(err, authResult) {
      if (err) {
        alert("something went wrong: " + err.message);
        return
      }
      if (authResult && authResult.idToken && authResult.accessToken) {
        setUser(authResult);
        show_logged_in();
      }
    });
  });

  document.getElementById('btn-register').addEventListener('click', function() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    auth.redirect.signupAndLogin({
      connection: 'Username-Password-Authentication',
      email: username,
      password: password,
    }, function(err) {
      if (err) alert("something went wrong: " + err.message);
    });
  });

  document.getElementById('btn-google').addEventListener('click', function() {
    auth.authorize({
      connection: 'google-oauth2'
    });
  });

  document.getElementById('btn-logout').addEventListener('click', function() {
     localStorage.removeItem('access_token');
     localStorage.removeItem('id_token');
     window.location.href = "/";
  });

  var show_logged_in = function(username) {
    document.querySelector('form.form-signin').style.display = "none";
    document.querySelector('div.logged-in').style.display = "block";
  }

  var show_sign_in = function() {
    document.querySelector('div.logged-in').style.display = "none";
    document.querySelector('form.form-signin').style.display = "block";
  }

  var parseHash = function() {
    var token = localStorage.getItem('id_token');
    if (token) {
      show_logged_in();
    } else {
      auth.parseHash(function(err, authResult) {
        if (authResult && authResult.accessToken && authResult.idToken) {
          window.location.hash = '';
          setUser(authResult);
          show_logged_in();
        } else if (authResult && authResult.error) {
          alert('error: ' + authResult.error);
          show_sign_in();
        }
      });
      
    }
  }

  var setUser = function(authResult) {
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
  }

  parseHash();

});
