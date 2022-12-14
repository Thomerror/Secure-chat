const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.js')

const app = express();
const PORT = process.env.PORT || 5000

require('dotenv').config();

app.use(cors());                // allow cross-origin requests
app.use(express.json());        // allow to pass json payload from FE to BE
app.use(express.urlencoded()); 

app.get('/', (req, res) => {
    res.send("Hello, Server speaking!");
});

app.use('/auth', authRoutes);

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));