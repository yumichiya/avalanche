(function() { //self-invoking function 

    var stateKey = 'spotify_auth_state';

    /**
     * Obtains parameters from the hash of the URL
     * @return Object
     */
    function getHashParams() {
      var hashParams = {};
      var e, r = /([^&;=]+)=?([^&;]*)/g,
          q = window.location.hash.substring(1);
      while ( e = r.exec(q)) {
         hashParams[e[1]] = decodeURIComponent(e[2]);
      }
      return hashParams;
    }

    /**
     * Generates a random string containing numbers and letters
     * @param  {number} length The length of the string
     * @return {string} The generated string
     */
    function generateRandomString(length) {
      var text = '';
      var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

      for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    };

    var userProfileSource = document.getElementById('user-profile-template').innerHTML,
        userProfileTemplate = Handlebars.compile(userProfileSource),
        userProfilePlaceholder = document.getElementById('user-profile');

    var newReleasesSource = document.getElementById('new-releases-template').innerHTML,
        newReleasesTemplate = Handlebars.compile(newReleasesSource),
        newReleasesPlaceholder = document.getElementById('new-releases');

    var params = getHashParams();

    var access_token = params.access_token,
        state = params.state,
        storedState = localStorage.getItem(stateKey);

    if (access_token && (state == null || state !== storedState)) {
      alert('There was an error during the authentication');
    } else {
      localStorage.removeItem(stateKey);
      if (access_token) {
        $.ajax({ //Login Call
            url: 'https://api.spotify.com/v1/me',
            headers: {
              'Authorization': 'Bearer ' + access_token
            },
            success: function(response) {
              userProfilePlaceholder.innerHTML = userProfileTemplate(response);

              $('#login').hide();
              $('#loggedin').show();
            }
        });

        $.ajax({ //New Releases Call
            url: 'https://api.spotify.com/v1/browse/new-releases',
            headers: {
              'Authorization': 'Bearer ' + access_token
            },
            success: function(response) {
                newReleasesPlaceholder.innerHTML = newReleasesTemplate(response);
            }
        });

        

      } else {
          $('#login').show();
          $('#loggedin').hide();
      }

      document.getElementById('login-button').addEventListener('click', function() {

        var client_id = '4977f5049db14ed99184bd454c05716a'; // Your client id
        var redirect_uri = 'https://yumichiya.github.io/'; // Your redirect uri

        var state = generateRandomString(16);

        localStorage.setItem(stateKey, state);
        var scope = 'user-read-private user-read-email';

        var url = 'https://accounts.spotify.com/authorize';
        url += '?response_type=token';
        url += '&client_id=' + encodeURIComponent(client_id);
        url += '&scope=' + encodeURIComponent(scope);
        url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
        url += '&state=' + encodeURIComponent(state);

        window.location = url;
      }, false);
    }

})();
