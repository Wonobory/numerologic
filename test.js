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

var testNumeros = [1, 2, 3, 4]
var testSignes = ['+', '/', '*']


var tmp = testNumeros[0]

for (var i = 0; i < testSignes.length; i++) {
	tmp = parseResultat(tmp, testNumeros[i+1], testSignes[i])
	console.log(testSignes[i])
}

console.log(tmp)