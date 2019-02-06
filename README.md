# gulp-starter
Kick start your gulp file for frontend development.

run:
```
npm install
```
Then create dist and src folder at the save level of gulpfile.js

## Directory structure
-dist <br>
  --assets <br>
    ---js <br>
    ---css <br>
    ---images <br>
-src <br>
  --assets <br>
    ---js <br>
    ---scss <br>
    ---images <br>

Don't forget to change browsync proxy in gulpfile.js
```javascript
server.init({
	proxy: 'http://localhost/wordpress' // change this url to your own
});
```

Then run:
```
gulp dev
```

and you are ready to go
