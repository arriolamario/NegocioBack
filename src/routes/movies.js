const { Router, request } = require('express');
const router = Router();
const _ = require('underscore');

const data = require('../movies.json');
const srvMovies = require('../service/service-movies');
const { Client } = require('pg')

// const client = new Client({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'postgres',
//     password: 'admin',
//     port: 5432,
//   })
//   client.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//   });
//Movies
router.get('/', async (req, res) => {
    const promiseMovies = await client.query("select * from public.movies;");
    res.json(promiseMovies.rows);
});

router.post('/', async (req, res) => {
    const { title, director, year, rating } = req.body;
    if (title && director && year && rating) {
        
        var query = `INSERT INTO public.movies(title, director, year, rating) VALUES (\'${title}\', \'${director}\', ${year}, ${rating}); select * from public.movies;`;
        //var query = `DECLARE @OutputTbl TABLE (ID INT); INSERT INTO public.movies(title, director, year, rating) OUTPUT INSERTED.ID INTO @OutputTbl(ID) VALUES (\'${title}\', \'${director}\', ${year}, ${rating}); `;
        console.log(query);
        var response = await client.query(query);
        await client.query("select * from public.movies;");
        res.json(response[1].rows);
    }
    else {
        res.status(500).json({ "error": "There was an error." });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, director, year, rating } = req.body;
    if (title && director && year && rating) {
        const promiseMovies = await client.query(`update public.movies set title = \'${title}\', director =\'${director}\', year =${year}, rating =${rating} where id = ${id}; select * from public.movies where id = ${id}; `);

        res.json(promiseMovies[1].rows);
    }
    else {
        res.status(500).json({ "error": "There was an error." });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const data = await client.query(`delete from public.movies where id = ${id};`);
    res.send(data);
});

module.exports = router;