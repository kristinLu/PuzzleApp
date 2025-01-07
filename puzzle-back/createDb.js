// eslint-disable-next-line no-undef
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('puzzleapp.db');

db.serialize(() => {

	let sql = "CREATE TABLE puzzle (" +
		"id integer PRIMARY KEY NOT NULL, " +
		"title text NOT NULL, " +
        "brand text NOT NULL," +
        "ean text," +
        "pieces integer NOT NULL," +
		"image text, " +
		"image_url text, " +
		"ownership_status text NOT NULL, " +
		"completion_status text, " +
		"description text )";

	db.run(sql, (error) => {
		if (error) {
			return console.log(error.message);
		}
		console.log('Table created!');
	});

	sql = "INSERT INTO `puzzle` (`id`, `title`, `brand`, `ean`, `pieces`, `image`, `image_url`, `ownership_status`, `completion_status`, `description`) " +
		" VALUES (1, 'World Landmarks', 'Educa', null, 2000, 'world-landmarks.jpg', 'https://www.educaborras.com/wp-content/uploads/17129_01_high.jpg', 'Owned', 'Completed', null)";
	db.run(sql, (err) => {
		if (err) {
			return console.log(err.message);
		}
		console.log('New row added!');
	});
    
	sql = "INSERT INTO `puzzle` (`id`, `title`, `brand`, `ean`, `pieces`, `image`, `image_url`, `ownership_status`, `completion_status`, `description`) " +
		" VALUES (2, 'Amazing Chameleons', 'Cherry Pazzi', null, 2000, 'amazing-chameleons.jpg', 'https://static.alipson.fr/m244/p459244/p2_FULL.jpg', 'Wishlisted', null, null)";
	db.run(sql, (err) => {
		if (err) {
			return console.log(err.message);
		}
		console.log('New row added!');
	});

	sql = "INSERT INTO `puzzle` (`id`, `title`, `brand`, `ean`, `pieces`, `image`, `image_url`, `ownership_status`, `completion_status`, `description`) " +
		" VALUES (3, 'Wolves in the Forest', 'Ravensburger', null, 1000, 'wolves-in-the-forest.jpg', 'https://www.ravensburger.us/produktseiten/1024/15987.jpg', 'Owned', 'Under construction', null)";
	db.run(sql, (err) => {
		if (err) {
			return console.log(err.message);
		}
		console.log('New row added!');
	});

	db.each("SELECT * FROM puzzle", function (err, row) {
		if (err) {
			return console.log(err.message);
		}
		console.log(row);
	});

	db.close();
});