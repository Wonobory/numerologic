const express = require('express')
const app = express()

const path = require('path')
const cors = require('cors')

const colors = require('colors') 
const { promisify } = require('util')
const bodyParser = require('body-parser')

const numeros = [1, 2, 3, 4, 6, 7, 8, 9]
const simbols = ["+", "*", "/", "-", "^"]

var resultats = calcularResultats() 


app.use(cors({ origin: '*' }));
app.use(function(req, res, next){
    res.header('Acess-Control-Allow-Origin', "*")
    res.header('Acess-Control-Allow-Methods', "GET,PUT,POST,DELETE")
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next()
})

app.use(bodyParser.json());
app.use(express.static('public'))

const server = app.listen(6969, function() {
  console.log('Server modo facherito 😎👍');
});


app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname + '/index.html'));
})

app.post("/data", (req, res) => {
	res.status(200).send(resultats)
})

function generarNumeros(nombreNumeros, nombreSimbols) {
	var numeros2 = numeros
	var simbols2 = simbols
	
	var toReturn = [[], []]
	for (var i = 0; i < nombreNumeros; i++) {
		var rnd = Math.floor(Math.random() * numeros2.length)
		toReturn[0].push(numeros2[rnd])
		numeros2.splice(rnd, 1)
	}
	
	for (var i = 0; i < nombreSimbols; i++) {
		var rnd = Math.floor(Math.random() * simbols2.length)
		toReturn[1].push(simbols2[rnd])
		simbols2.splice(rnd, 1)
	}
	
	return toReturn
}

function parseResultat(num1, num2, sim) {
	if (sim == "+") {
		return num1 + num2
	} else if (sim == "*") {
		return num1 * num2
	} else if (sim == "/") {
		return num1 / num2
	} else if (sim == "-") {
		return num1 - num2
	} else if (sim == "^") {
		return Math.pow(num1, num2)
	}
}


function calcularCombinacionsNumeros(numeros) {
	var megaArray = [];

	function permute(str, l, r) {
		if (l == r) {
			var tmp = str.split("")
			for (var x = 0; x < tmp.length; x++) {
				tmp[x] = parseInt(tmp[x])
			}
			megaArray.push(tmp)
		} else {
			for (let i = l; i <= r; i++) {
				str = swap(str, l, i)
				permute(str, l + 1, r)
				str = swap(str, l, i)
			}
		}
	}
	 
	function swap(a, i, j) {
		let temp
		let charArray = a.split("")
		temp = charArray[i]
		charArray[i] = charArray[j]
		charArray[j] = temp
		return (charArray).join("")
	}

	let str = numeros
	let n = str.length
	permute(str, 0, n-1)

	return megaArray
}

function calcularCombinacionsSignes(signes) {
	var megaArray = [];

	function permute(str, l, r) {
		if (l == r) {
			var tmp = str.split("")
			megaArray.push(tmp)
		} else {
			for (let i = l; i <= r; i++) {
				str = swap(str, l, i)
				permute(str, l + 1, r)
				str = swap(str, l, i)
			}
		}
	}
	 
	function swap(a, i, j) {
		let temp
		let charArray = a.split("")
		temp = charArray[i]
		charArray[i] = charArray[j]
		charArray[j] = temp
		return (charArray).join("")
	}

	let str = signes
	let n = str.length
	permute(str, 0, n-1)

	return megaArray
}

function calcularResultats() {
	var numeros2 = generarNumeros(5,4)
	var numerosTmp = ""
	var signesTmp = ""
	
	var resultats = []
	
	for (var i = 0; i < numeros2[0].length; i++) {
		numerosTmp += numeros2[0][i].toString()
	}
	
	for (var i = 0; i < numeros2[1].length; i++) {
		signesTmp += numeros2[1][i].toString()
	}
	
	combinacionsNumeros = calcularCombinacionsNumeros(numerosTmp)
	combinacionsSignes = calcularCombinacionsSignes(signesTmp)
	
	for (var i = 0; i < combinacionsNumeros.length; i++) {
		for (var x = 0; x < combinacionsSignes.length; x++) {
		
			var tmp = combinacionsNumeros[i][0]
			
			for (var z = 0; z < combinacionsSignes[x].length; z++) {
				tmp = parseResultat(tmp, combinacionsNumeros[i][z+1], combinacionsSignes[x][z])
			}
			
			if (resultats[tmp] == null) {
				resultats[tmp] = []
				resultats[tmp].push([combinacionsNumeros[i], combinacionsSignes[x]])
			} else {
				resultats[tmp].push([combinacionsNumeros[i], combinacionsSignes[x]])
			}
		}
	}
	
	resultats = Object.entries(resultats)
	resultats.sort((a, b) => {
		return b[1].length - a[1].length
	})
	
	if (resultats[0][0] == 0) {
		console.log("Els numeros escollits són: " + numeros2[0])
		console.log("Els signes escollits són: " + numeros2[1])
		
		console.log("El número a buscar és: " + resultats[1][0].toString().blue)
		
		console.log("Hi han " + resultats[1][1].length.toString().green + " respostes correctes")
		

		var toReturn = {
			numero: resultats[1][0],
			numeros: numeros2[0],
			signes: numeros2[1],
			resultatsTotals: resultats[1][1].length
		}
		return toReturn
	} else {
		console.log("Els numeros escollits són: " + numeros2[0])
		console.log("Els signes escollits són: " + numeros2[1])
		
		console.log("El número a buscar és: " + resultats[0][0].toString().blue)
		
		console.log("Hi han " + resultats[0][1].length.toString().green + " respostes correctes")

		console.log("Hi han " + resultats.length.toString().red + " resultats possibles")
		
		var toReturn = {
			numero: resultats[0][0],
			numeros: numeros2[0],
			signes: numeros2[1],
			resultatsTotals: resultats[0][1].length,
			resultats: resultats[0][1]
		}

		return toReturn
	}
}

