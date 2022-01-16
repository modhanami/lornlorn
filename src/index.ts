import app from "./driver/web/app";

require('dotenv').config();

app.listen(4040, () => {
  console.log('Server is running on port 4040');
});