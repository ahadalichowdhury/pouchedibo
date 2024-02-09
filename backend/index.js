const app = require("./app")
require("dotenv").config();

app.listen(process.env.PORT || 8000, ()=>{
	console.log(`server started successfully in ${process.env.PORT }`)
})

