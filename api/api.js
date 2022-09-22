const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');
const express = require('express');
const fs = require('fs');
const uuid = require('uuid4');
const util = require('util');

const jwt = require('jsonwebtoken');
const multer = require('multer');

const Admin = require('./models/Admin');
const Article = require('./models/Article');

const verificarTokenAdmin = require('./helper/auth.js');

////////////////////////////////////////////////////////////////////

var upload = multer();
app = express();

////////////////////////////////////////////////////////////////////

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static('uploads'));

////////////////////////////////////////////////////////////////////

app.get('/', async (req, res) => {
	res.send('api online articles')
});

app.post('/login', async (req, res) => {

	res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", 'POST');

	const username = req.body.username;
	const password = req.body.password;

        const result = await Admin.findOne({ where: {username: username} });

	const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
	
	if (result) {
        	if(result.password == hashedPassword) {
                	const id = result.id
                        const token = jwt.sign({id}, process.env.TOKEN_SECRET, {
                        	expiresIn: '180d',
                        });

                        delete result.dataValues['password'];

                        res.json({auth: true, message: 'Autentificado com sucesso!', token: token, result: result.dataValues});

		} else {
                        res.json({auth: false, message: 'Nome/senha errados!'});
                }
	} else {
                res.json({auth: false, message: 'Usuário não existe'});
	}

})

app.get('/isAdmin', verificarTokenAdmin, async (req, res) => {
	res.json({auth: true});
})

app.post('/publish', verificarTokenAdmin, upload.array('images'), async (req, res) => {

	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", 'POST');
	
	try {

		const title = req.body.title;
		const paragraphs = req.body.paragraphs;
		const images = req.files;

		console.log(paragraphs);

		var folder_path = uuid()

		var dir = __dirname + '/uploads/' + folder_path;
	
		if (!fs.existsSync(dir)) {
    			fs.mkdirSync(dir, 0744);
		}

		const filename = dir + '/article.json';

		const obj = {"paragraphs": []};

		if (Array.isArray(paragraphs)) {
			for (let a = 0; a < paragraphs.length; a++) {

				obj.paragraphs.push(paragraphs[a]);

				/*fs.appendFile(filename, paragraphs[a] + '\n', function (err) {
                			if (err) return console.log(err);
                                        //
                		});*/

			}
        	} else {
			obj.paragraphs.push(paragraphs);
		}	

		var json = JSON.stringify(obj);

		fs.writeFile(filename, json, 'utf8', function (err) {
                        if (err) return console.log(err);
                                //
                });


		if (Array.isArray(images)) {
            		for (let a = 0; a < images.length; a++) {   
				fs.writeFile(dir + '/' + a + '.jpeg', images[a].buffer, function (err) {
					if (err) return console.log(err);
                		})
            		}
		} else {
			fs.writeFile(dir + '/' + a + '.jpeg', images[0].buffer, function (err) {
                        	if (err) return console.log(err);
                        })

		}

		await Article.create({
                	title: title,
                	folder_path: folder_path,
                	adminId: req.admin_id,
        	})
		.then(function(success) {
			res.send("Livro cadastrado com sucesso");
		})
		.catch(function (err) {
			res.send("Erro: " + err);
		})

		res.send('ok');

	} catch (err) {
		console.log(err);
	}
})

app.get('/get-articles', async (req, res) => {

	const articles = await Article.findAll({attributes: ['id', 'title', 'folder_path', 'adminId']})

	return res.json(articles);
})

app.get('/get-article/:id', async (req, res) => {

	const readdir = util.promisify(fs.readdir);

	const id = req.params.id;

	const article = await Article.findOne( {attributes: ['id', 'title', 'folder_path', 'adminId'] , where: {id: id} } );

	const obj = require('./uploads/' + article.folder_path + '/article.json');

	var images = [];

        const files = await readdir('./uploads/' + article.folder_path);
  	
	files.map(
        	(file) => { if (file.includes('.jpeg') || file.includes('.jpg')) { images.push(file) } }
        )

        return res.json({id: article.id, title: article.title, folder_path: article.folder_path, adminId: article.adminId, images: images, paragraphs: obj.paragraphs});


})

app.listen(8080, function() {
	console.log('api rodando na porta 8080');
})
