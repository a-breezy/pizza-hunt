// create variable to hold db connection
let db;

// establish a connection to IndexedDB database called 'pizza_hunt' and set it to version 1
// 'open' creates the connection, takes two parameters: db name and version of db
const request = indexedDB.open("pizza_hunt", 1);

// this event will emit if the db version changes
request.onupgradeneeded = function (event) {
	// save a reference to the db
	const db = event.target.result;
	// create an object store (table) called 'new_pizza', set it to auto-increment primary key of sorts
	db.createObjectStore("new_pizza", { autoIncrement: true });
};

request.onsuccess = function (event) {
	// when db is successful - save a reference in global variable
	db = event.target.result;

	// check if app is online, if true run uploadPizza() and send db data to api
	if (navigator.online) {
		uploadPizza();
	}
};

request.onerror = function (event) {
	// log error
	console.log(event.target.errorCode);
};

// code for if no internet when submitting a new pizza
function saveRecord(record) {
	// open a new transaction with db with read/write permissions
	// transaction is a temporary connection to the db
	const transaction = db.transaction(["new_pizza"], "readwrite");

	// access object store for 'new_pizza'
	const pizzaObjectStore = transaction.objectStore("new_pizza");

	// add record to store with add method
	pizzaObjectStore.add(record);
}

function uploadPizza() {
	// open a transaction on db
	const transaction = db.transaction(["new_pizza"], "readwrite");

	// access object store
	const pizzaObjectStore = transaction.objectStore("new_pizza");

	// get all records from store and set to a variable
	const getAll = pizzaObjectStore.getAll();

	// after successful getAll
	getAll.onsuccess = function () {
		// if data in db store, send to api server
		if (getAll.result.length > 0) {
			// go into this route and post the following data
			fetch("/api/pizzas", {
				method: "POST",
				body: JSON.stringify(getAll.result),
				headers: {
					Accept: "application/json, text/plain, */*",
					"Content-Type": "application/json",
				},
			})
				.then((response) => response.json())
				.then((serverResponse) => {
					if (serverResponse.message) {
						throw new Error(serverResponse);
					}
					// open transaction
					const transaction = db.transaction(["new_pizza"], "readwrite");
					// access the new_pizza object store
					const pizzaObjectStore = transaction.objectStore("new_pizza");
					// clear all items in store
					// because they've been uploaded to server
					pizzaObjectStore.clear();

					alert("All saved pizzas have been submitted!");
				})
				.catch((err) => {
					console.log(err);
				});
		}
	};
}
// listen for app coming back online
window.addEventListener("online", uploadPizza);
