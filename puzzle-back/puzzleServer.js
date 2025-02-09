import express, { urlencoded, json } from 'express';
const app = express();

import helmet from 'helmet';
app.use(helmet({ crossOriginResourcePolicy: false }))

app.use(urlencoded({ limit: '20mb', extended: true }));

import cors from 'cors';
app.use(cors());

app.use(json());

import pkg from 'sqlite3';
const { Database } = pkg;
const db = new Database('puzzleapp.db', (error) => {
    if (error) {
        console.log(error.message);
        return ({ message: 'Database not available ' + error.message });
    }
});

app.listen(8080, () => {
    console.log('App available at localhost:8080');
});

app.get('/', (req, res) => {
    return res.status(200).json({ message: 'Listening' });
});

app.get('/puzzle/collection', (req, res) => {
    db.all('SELECT * FROM puzzle WHERE ownership_status = ?', ['Owned'], (error, result) => {
        if (error) {
            console.log(error.message);
            return res.status(400).json({ message: error.message });
        }
        return res.status(200).json(result);
    });
});

app.get('/puzzle/wishlist', (req, res) => {
    db.all('SELECT * FROM puzzle WHERE ownership_status = ?', ['Wishlisted'], (error, result) => {
        if (error) {
            console.log(error.message);
            return res.status(400).json({ message: error.message });
        }
        if (typeof (result) == 'undefined') {
            return res.status(404).json({ message: 'No puzzles found' });
        }
        return res.status(200).json(result);
    });
});

app.get('/puzzle/archive', (req, res) => {
    db.all('SELECT * FROM puzzle WHERE ownership_status = ?', ['Previously owned'], (error, result) => {
        if (error) {
            console.log(error.message);
            return res.status(400).json({ message: error.message });
        }
        if (typeof (result) == 'undefined') {
            return res.status(404).json({ message: 'No puzzles found' });
        }
        return res.status(200).json(result);
    });
});

app.get('/puzzle/statistics', async (req, res) => {
    try {
        const ownership_status_result = await new Promise((resolve, reject) => {
            db.all('SELECT ownership_status FROM puzzle', (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            });
        });
        const ownership_status = ownership_status_result.reduce((acc, row) => {
            const status = row.ownership_status;
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        const owned_completion_status_result = await new Promise((resolve, reject) => {
            db.all('SELECT completion_status FROM puzzle WHERE ownership_status = ?', ['Owned'], (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            });
        });
        const owned_completion_status = owned_completion_status_result.reduce((acc, row) => {
            const status = row.completion_status;
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        const owned_pieces_result = await new Promise((resolve, reject) => {
            db.all('SELECT pieces FROM puzzle WHERE ownership_status = ?', ['Owned'], (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            });
        });
        const owned_pieces = owned_pieces_result.reduce((acc, row) => {
            const status = row.pieces;
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        const owned_brand_result = await new Promise((resolve, reject) => {
            db.all('SELECT brand FROM puzzle WHERE ownership_status = ?', ['Owned'], (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            });
        });
        const owned_brand = owned_brand_result.reduce((acc, row) => {
            const status = row.brand;
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        return res.status(200).json({ ownership_status, owned_completion_status, owned_pieces, owned_brand });
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({ message: error.message });
    }
});

app.get('/puzzle/:id', (req, res) => {
    let id = req.params.id;

    db.get('SELECT * FROM puzzle WHERE id = ?', [id], (error, result) => {
        if (error) {
            console.log(error.message);
            return res.status(400).json({ message: error.message });
        }
        if (typeof (result) == 'undefined') {
            return res.status(404).json({ message: 'No puzzles found' });
        }
        return res.status(200).json(result);
    });
});

app.delete('/puzzle/:id', (req, res) => {
    let id = req.params.id;

    db.run('DELETE FROM puzzle WHERE id = ?', [id], function (error) {
        if (error) {
            console.log(error.message);
            return res.status(400).json({ message: error.message });
        }
        if (this.changes === 0) {
            console.log('No puzzles found');
            return res.status(404).json({ message: 'No puzzles found' });
        }
        return res.status(200).json({ message: 'Puzzle successfully deleted' });
    });
});

import multer, { diskStorage } from 'multer';

const storage = diskStorage({
    destination: (req, file, callback) => {
        callback(null, './images');
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
});

const upload = multer({ storage: storage })

app.post('/puzzle', upload.single('image'), (req, res) => {
    let puzzle = req.body;

    let fileName = 'pieces.png';
    if (req.file) {
        fileName = req.file.originalname;
    }

    db.run('INSERT INTO puzzle (title,brand,ean,pieces,image,image_url,ownership_status,completion_status,description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [puzzle.title, puzzle.brand, puzzle.ean, puzzle.pieces, fileName, puzzle.image_url, puzzle.ownership_status, puzzle.completion_status, puzzle.description], (error) => {
            if (error) {
                console.log(error.message);
                return res.status(400).json({ message: error.message });
            }
            return res.status(200).json({ message: 'New puzzle successfully added' });
        });
});

app.put('/puzzle/:id', upload.single('image'), (req, res) => {
    let id = req.params.id;
    let puzzle = req.body;

    let fileName = puzzle.image;
    if (req.file) {
        fileName = req.file.originalname;
    }

    db.run('UPDATE puzzle SET title=?, brand=?, ean=?, pieces=?, image=?, image_url=?, ownership_status=?, completion_status=?, description=? WHERE id=?',
        [puzzle.title, puzzle.brand, puzzle.ean, puzzle.pieces, fileName, puzzle.image_url, puzzle.ownership_status, puzzle.completion_status, puzzle.description, id], (error) => {
            if (error) {
                console.log(error.message);
                return res.status(400).json({ message: error.message });
            }
            return res.status(200).json({ message: 'Puzzle successfully edited' });
        });
});

app.get('/download/:image', (req, res) => {
    let file = './images/' + req.params.image;
    res.download(file);
});

app.get('*', (req, res) => {
    return res.status(404).json({ message: 'Resource not available' });
});