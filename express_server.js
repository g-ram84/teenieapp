const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("view engine", "ejs");

function generateRandomString() {
	let result = "";
	let characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxy1234567890";
	for (let i = 0; i < 6; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return result;
}

const urlDatabase = {
	b2xVn2: "http://www.lighthouselabs.ca",
	"9sm5xK": "http://www.google.ca"
};

const users = {
	userRandomID: {
		id: "userRandomID",
		email: "user@example.com",
		password: "purple-monkey-dinosaur"
	},
	user2RandomID: {
		id: "user2RandomID",
		email: "user2@example.com",
		password: "dishwasher-funk"
	}
};

app.get("/", (req, res) => {
	res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
	res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
	res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
	const templateVars = {
		urls: urlDatabase,
		username: req.cookies.username
	};
	res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
	const templateVars = {
		username: req.cookies.username
	};
	res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
	const shortURL = req.params.shortURL;
	const templateVars = {
		shortURL,
		longURL: urlDatabase[shortURL],
		username: req.cookies.username
	};
	res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
	const shortURL = req.params.shortURL;
	const longURL = urlDatabase[shortURL];
	res.redirect(longURL);
});

app.get("/register", (req, res) => {
	const templateVars = {
		username: req.cookies.username
	};
	res.render("registration", templateVars);
});

app.post("/urls/", (req, res) => {
	let shortURL = generateRandomString();
	let longURL = req.body.longURL;
	if (!/^https?:\/\//i.test(longURL)) {
		longURL = "http://" + longURL;
	}
	urlDatabase[shortURL] = longURL;
	res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
	const shortURL = req.params.shortURL;
	delete urlDatabase[shortURL];
	res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {
	const shortURL = req.params.shortURL;
	const longURL = req.body.longURL;
	urlDatabase[shortURL] = longURL;
	res.redirect(`/urls/${shortURL}`);
});

app.post("/login", (req, res) => {
	res.cookie("username", req.body.login);
	res.redirect("/urls");
});

app.post("/logout", (req, res) => {
	res.clearCookie("username");
	res.redirect("/urls/new");
});

app.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}`);
});
