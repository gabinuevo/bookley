process.env.NODE_ENV = 'test';

const request = require("supertest");

const app = require("../app");

let db = require("../db");

beforeEach(async () => {
    await db.query(`
        INSERT INTO books (isbn,
            amazon_url,
            author,
            language,
            pages,
            publisher,
            title,
            year)
        VALUES ('069116118', 'http://a.co/eobPtX2', 'Matthew Lane', 'english', 264, 'Princeton University Press', 'Power-Up: Unlocking the Hidden Mathematics in Video Games', 2017)
    `);
});

describe("POST /books", function () {
    test("Adds one book", async function () {
        const response = await request(app)
            .post("/books")
            .send({
                "isbn": "069117118",
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Matthew Lane",
                "language": "english",
                "pages": 264,
                "publisher": "Princeton University Press",
                "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                "year": 2017
            });
        expect(response.statusCode).toEqual(201);
        expect(response.body).toEqual({
            "book": {
                "isbn": "069117118",
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Matthew Lane",
                "language": "english",
                "pages": 264,
                "publisher": "Princeton University Press",
                "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                "year": 2017
            }
        });

        const response1 = await request(app).get("/books");

        expect(response1.body.books.length).toEqual(2);
    })
})

afterEach(async () => {
    await db.query(`DELETE FROM books`);
});

afterAll(async function () {
    // close db connection
    await db.end();
});