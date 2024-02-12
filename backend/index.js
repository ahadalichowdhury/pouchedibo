const app = require("./app")
require("dotenv").config();
app.get('/firebase-messaging-sw.js', function(req, res) {
	res.set('Content-Type', 'text/javascript');
	res.sendFile(path.join(__dirname, 'firebase-messaging-sw.js'));
  });
  
app.listen(process.env.PORT || 8000, ()=>{
	console.log(`server started successfully in ${process.env.PORT }`)
})

