# Web Version of Fauna Board Game

I'm trying to recreate the **Fauna** board game as a web version. I already have the backend for `getRandomAnimalCard`.

---

## Contents

- 1 game board
- 180 animal cards with 360 animals
- 1 card box
- 42 guess pieces in the 6 players’ colours
- 30 black evaluation pieces
- 1 starting player’s lion
- 1 accompanying booklet with information on all the animals in the game

---

## The Animal Cards

At the start of the game, players decide if they want to play with:

- The simpler animals (green card margin)  
**or**  
- The more exotic animals (black card margin)  

You may also mix both types of cards. Put the chosen cards into the card box.

### Card Layout:

**Upper half of the card (visible during placement phase):**

- Animal class
- Name / Scientific name
- Illustration of the animal
- Number of areas where the animal is found naturally
- Measures for players to estimate:
  - Weight
  - Length (head and body, without tail)
  - Total length (with tail)
  - Height (standing animal)
  - Tail length

**Lower half of the card (revealed during evaluation):**

- Areas where the animal lives
- World map highlighting the correct areas
- Average values for the required measures

---

## Aim of the Game

Each round, players estimate **one animal’s natural habitat and its measurements**.

- Players take turns placing guess pieces on the world map or on one of the scales.
- At the end of each round, points are awarded for correct guesses.
- Wrong guesses score no points.
- The player with the most victory points at the end wins the game.

---

## How to Play

The game is played over several rounds.  
**Each round consists of:**

1. Placing the guess pieces
2. Evaluation
3. Changing the starting player and starting a new round

---

### I. Placing the Guess Pieces

- All players look at the first animal card (upper half only) in the card box.
- Each player may hold the card box but **cannot pull out the card**.
- The starting player begins, others follow **clockwise**.

**On their turn, a player must place one guess piece:**

- On an unoccupied **area on the board**,  
**or**
- On a **vacant space of a scale**.

#### Placing on an Area:

- Players may place a guess piece in any **land or marine area** not already occupied by their own or an opponent’s piece.
- Marine areas include adjacent islands unless marked separately.

**Examples:**

- Mississippi, Mexico, and Central America = land areas  
- Caribbean = marine area (including its islands)

#### Placing on a Scale:

- A player may place a piece on any **vacant space of a relevant scale**.
- Not all scales are relevant for every animal. Check the upper half of the card.

#### Continuing Placement or Passing:

- After each round of placement, starting again with the starting player, players may either:

  - Place another piece  
  **or**
  - Pass their turn

- Once a player passes, they cannot place again during this round.

- When all players have passed, proceed to the **Evaluation Phase**.

---

### II. Evaluation

- Pull the animal card fully out of the card box.

#### Analysing the Areas:

- Use **black evaluation pieces** to mark the correct areas shown on the card.

- **Scoring (per correct area):**

| Number of Correct Areas | Direct Hit | Adjacent Area |
|-------------------------|------------|---------------|
| 1                       | 12 points  | 8 points      |
| 2                       | 10 points  | 5 points      |
| 3–4                     | 8 points   | 4 points      |
| 5–8                     | 6 points   | 2 points      |
| 9–16                    | 4 points   | 1 point       |
| 17+                     | 3 points   | –             |

- **Adjacent areas:**  
Two areas are adjacent if:

  - They share a common frontier  
  **or**
  - They border each other as land/marine areas.

**Examples:**

- Rocky Mountains and Great Plains = adjacent (land)  
- Caribbean (marine) and Guyana (land) = adjacent

#### Analysing the Scales:

For each correct placement on a scale:

| Type          | Points  |
|---------------|---------|
| Direct Hit    | 7 points|
| Adjacent Space| 3 points|

**Example:**  
If the Grevy’s zebra weighs between 350–430 kg, the space between 200 and 500 is correct.  
- Red on correct space → 7 points  
- Blue and Green on adjacent spaces → 3 points each  
- Green on "1 to 2 tons" → 0 points  

#### Wrongly Placed Guess Pieces:

- Correct and adjacent guess pieces are returned to players.
- Wrong pieces go to a **stock next to the board**.
- These cannot be recovered until later.

---

### III. Change of Starting Player and New Round

- If no one has reached the winning score, pass the **starting player’s lion** to the next player (clockwise).

- Each player takes back **one guess piece from the stock**, if available.

- If a player has fewer than **3 guess pieces**, they refill up to 3 for the next round.

---

## End of the Game

The game ends when **one player reaches or surpasses the victory threshold** at the end of a round:

| Number of Players | Victory Point Goal |
|-------------------|--------------------|
| 2–3 players       | 120 points         |
| 4–5 players       | 100 points         |
| 6 players         | 80 points          |

If there's a tie, all tied players share the victory.

---
