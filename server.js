if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config({ path: '.env' })
}

const express = require('express');
const articleRouter = require('./routes/articles');
const app = express();
const mongoose = require('mongoose');
const Article = require('./models/article');
const methodOverride = require('method-override');
mongoose.connect((process.env.DB_URL), {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', error => console.log('connected to mongoose'))

app.set('view engine', 'ejs');


app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));


app.get('/', async (req, res) => {
    const articles = await Article.find().sort({
        createdAt: 'desc'
    });
    res.render('articles/index', { articles: articles }).catch((e) => { console.error(e); process.exit(1) });
});


app.use('/articles', articleRouter);


app.listen(process.env.PORT || 3000)