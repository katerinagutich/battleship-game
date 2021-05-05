let model = {
    boardSize: 10,
    level: 1,
    shipsNumber: 0,
    shipsSunk: 0,
    shipLength: 3,
    ships: [
        {locations: [0, 0, 0], hits: ["", "", ""]},
        {locations: [0, 0, 0], hits: ["", "", ""]},
        {locations: [0, 0, 0], hits: ["", "", ""]},
        {locations: [0, 0, 0], hits: ["", "", ""]},
        {locations: [0, 0, 0], hits: ["", "", ""]}
    ],
    fire(guess) {
        for (let i = 0; i < this.shipsNumber; i++) {
            let ship = this.ships[i];
            let index = ship.locations.indexOf(guess);
            if (index > -1) {
                ship.hits[index] = "hit";
                get(guess).classList.add("hit")
                if (this.isSunk(ship)) {
                    this.shipsSunk++;
                }
                return true;
            }
        }
        get(guess).classList.add("miss")
        return false;
    },
    isSunk(ship) {
        for (let i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== "hit") {
                return false;
            }
        }
        return true;
    },
    generateShipLocations() {
        let locations;
        for (let i = 0; i < this.shipsNumber; i++) {
            do {
                locations = this.generateShip()
            } while (model.collision(locations))
            this.ships[i].locations = locations;
        }

    },
    generateShip() {
        let direction = Math.floor(Math.random() * 2);
        let row, col;

        if (direction === 1) {
            // horizontal ship
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength))
        } else {
            // vertical ship
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
            col = Math.floor(Math.random() * this.boardSize)
        }

        let newShipLocations = [];
        for (let i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + "" + (col + i))
            } else {
                newShipLocations.push((row + i) + "" + col)
            }
        }
        return newShipLocations;
    },
    collision(locations) {
        for (let i = 0; i < this.shipsNumber; i++) {
            let ship = model.ships[i];
            for (let j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) > -1 ) {
                    return true;
                }
            }
        }
        return false;
    }
}

let controller = {
    usedGuesses: 0,
    leftGuesses: 0,
    processGuess(guess) {
        this.usedGuesses++
        this.leftGuesses--
        get("leftGuesses").innerText = this.leftGuesses
        if (this.leftGuesses !== 0) {
            let hit = model.fire(guess)
            if (hit && model.shipsSunk === model.shipsNumber) {
                document.querySelector(".text").innerText =
                    `Congratulations! You've won in ${this.usedGuesses} guesses.`
            }
        } else {
            document.querySelector(".text").innerText =
                `Sorry, you failed :(`
        }
    }
}

window.onload = function() {

    function changeLevel(shipsNumber = 5, leftGuesses = 50) {

        controller.usedGuesses = 0
        model.shipsNumber = shipsNumber
        controller.leftGuesses = leftGuesses
        get("leftGuesses").innerText = controller.leftGuesses
        model.generateShipLocations();
        let cells = document.querySelectorAll('td')
        for (let cell of cells) {
            cell.classList.remove('hit')
            cell.classList.remove('miss')
        }
    }

    function initGame() {
        let cells = document.querySelectorAll('td')
        for (let cell of cells) {
            cell.addEventListener('click', function(e) {
                let guess = e.target.id
                controller.processGuess(guess)
            })
        }
    }

    initGame()
    changeLevel()

    get('restart').addEventListener('click', function() {
        changeLevel()
    })
    get('easyLevel').addEventListener('click', function() {
        changeLevel()
    })
    get('normalLevel').addEventListener('click', function() {
        changeLevel(3, 40)
    })
    get('hardLevel').addEventListener('click', function() {
        changeLevel(1,20)
    })

}

function get(id) {
    return document.getElementById(id)
}


