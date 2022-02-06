[![Netlify Status](https://api.netlify.com/api/v1/badges/2c36d7ba-5f25-4840-a2fd-c27d5d2b3736/deploy-status)](https://app.netlify.com/sites/plantle/deploys)

# plantle

A plant-based word game, based on [Wordle (the original)](https://www.powerlanguage.co.uk/wordle/), but with solutions restricted to the following categories:

- herbs and spices
- fruit, veg, beans and mushrooms
- flowers, bushes, trees and crops

# stack

- frontend in Svelte
- deployed via Netlify
- Supabase backend db for words
- WordsAPI dictionary lookup

# todo

## v0.1

- [x] build word matrix and keyboard
- [x] implement game logic
- [x] basic styling
- [x] hardcoded solution
- [x] basic logging and monitoring

## v0.2

- [x] integrate real dictionary lookup API
- [x] select words
- [x] integrate backend database for words with daily changes
- [x] integrate site analytics

## v0.3

- [x] highlight keyboard with correct/present/used letters
- [x] use localStorage to store results and number hints used
- [x] restrict users from playing more than once per day (aside from clearing cache)
- [x] link to github
- [x] new colour scheme
- [x] allow convenient sharing

## v0.4

- [ ] statistics
- [ ] category based hints
- [ ] design overhaul
- [ ] improve responsiveness
- [ ] add more words to supabase table
- [ ] improve logging/monitoring

# screenshot

![plantle](files/2022-02-06-0438.png 'plantle')
