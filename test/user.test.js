const mongoose = require("mongoose");
const supertest = require("supertest");
const createServer = require("../servers/user_server");
const {User} = require("../models/users");

const app = createServer()
beforeEach((done) => {
	mongoose.connect(
		"mongodb://localhost:27017/candidVote",
		{ useNewUrlParser: true },
		() => done()
	)
})

test("To test: GET /getUsers", async () => {
	const post = await User.create({
		firstname:"Sriram",
        surname:"Sivaraman",
        DOB:'1998-05-14',
        ddress:"241 1st street",
        zip:"N2L123",
        gender:"Male",
        phoneNumber:2268996069
	})

	await supertest(app)
		.get("/api/getUsers")
		.expect(200)
		.then((response) => {
			// Check the response type and length
			expect(Array.isArray(response.body)).toBeTruthy()
			expect(response.body.length).toEqual(1)

			// Check the response data
			expect(response.body[0]._id).toBe(post.id)
			expect(response.body[0].firstname).toBe(post.firstname)
			expect(response.body[0].surname).toBe(post.surname)
            expect(response.body[0].address).toBe(post.address)
            //console.log(typeof(post.DOB));
			expect(JSON.stringify(response.body[0].DOB)).toEqual(JSON.stringify(post.DOB))
            expect(response.body[0].zip).toBe(post.zip)
			expect(response.body[0].gender).toBe(post.gender)
            expect(response.body[0].phoneNumber).toBe(post.phoneNumber)
		})
})

test("GET /api/getUsers/:id", async () => {
	const post = await User.create({
		firstname:"Sriram",
        surname:"Sivaraman",
        DOB:'1998-05-14',
        ddress:"241 1st street",
        zip:"N2L123",
        gender:"Male",
        phoneNumber:2268996069
	})

	await supertest(app)
		.get("/api/getUsers/" + post.id)
		.expect(200)
		.then((response) => {
			expect(response.body._id).toBe(post.id)
			expect(response.body.firstname).toBe(post.firstname)
			expect(response.body.surname).toBe(post.surname)
            expect(response.body.address).toBe(post.address)
			expect(JSON.stringify(response.body.DOB)).toBe(JSON.stringify(post.DOB))
            expect(response.body.zip).toBe(post.zip)
			expect(response.body.gender).toBe(post.gender)
            expect(response.body.phoneNumber).toBe(post.phoneNumber)
		})
})
test("DELETE /api/deleteUser/:id", async () => {
	const post = await User.create({
		firstname:"Sriram",
        surname:"Sivaraman",
        DOB:'1998-05-14',
        ddress:"241 1st street",
        zip:"N2L123",
        gender:"Male",
        phoneNumber:2268996069
	})

	await supertest(app)
		.delete("/api/deleteUser/" + post.id)
		.expect(204)
		.then(async () => {
			expect(await User.findOne({ _id: post.id })).toBeFalsy()
		})
})
test("POST /api/createUser", async () => {
	const data = {
		firstname:"Sriram",
        surname:"Sivaraman",
        DOB:'1998-05-14',
        address:"241 1st street",
        zip:"N2L123",
        gender:"Male",
        phoneNumber:2268996069
	}

	await supertest(app)
		.post("/api/createUser")
		.send(data)
		.expect(200)
		.then(async (response) => {
		
            // Check if the data is in the database
			const post = await User.findOne({ _id: response.body._id })
			expect(post).toBeTruthy()
            expect(post.firstname).toBe(data.firstname)
			expect(post.surname).toBe(data.surname)
            expect(post.address).toBe(data.address)
			expect(JSON.stringify(post.DOB).includes(JSON.stringify(data.DOB)))
            expect(post.zip).toBe(data.zip)
			expect(post.gender).toBe(data.gender)
            expect(post.phoneNumber).toBe(data.phoneNumber)
		})
})

afterEach((done) => {
	mongoose.connection.db.dropDatabase(() => {
		mongoose.connection.close(() => done())
	})
})
