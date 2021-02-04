const PokemonApp = {
    data() {
        return {
            // --- Daten des neuen Pokemons --- 
            newPokemon: {                   
                name: 'Pikachu',
                typ1: 'Wasser',
                typ2: 'Elektro',
                gender: 'w',
                donnerblitz: false,
                voltoball: true,
                surfer: false
            },

            // Daten des Pokemons, welches upgedated wird
            updatePokemon: {},

            // --- Liste aller Pokemons ---
            pokemonList: [
                { id: 0, name: 'Voltoball', typ1: 'Elektro', typ2: 'Wasser', gender: 'd', donnerblitz: true, voltoball: true, surfer: false, attacken: 'Donnerblitz, Voltoball' },
                { id: 1, name: 'Relaxo', typ1: 'Normal', typ2: 'Normal', gender: 'm', donnerblitz: false, voltoball: false, surfer: true, attacken: 'Surfer' }
            ],

            // --- Variablen zum Sichtbarmachen
            display: {
                Formular: false,
                Statistik: true,
                Liste: true,
                Update: false
            },

            // --- für Update
            aktuellerIndex: -1
        }
    },

    computed: {
        // --- berechnete Datenfelder ---
        // --- werden zwischengespeichert ---
        anzahlPokemons() {
            return this.pokemonList.length;
        },

        anzahlMaennlich() {
            let anzahl = 0;
            for (let i = 0; i < this.pokemonList.length; i++) {
                if (this.pokemonList[i].gender === 'm') {
                    anzahl++;
                }
            }
            return anzahl;
        },

        anzahlWeiblich() {
            let anzahl = 0;
            for (let i = 0; i < this.pokemonList.length; i++) {
                if (this.pokemonList[i].gender === 'w') {
                    anzahl++;
                }
            }
            return anzahl;
        },

        anteilWeiblichProzent() {
            const prozentWert = 100 * this.anzahlWeiblich / this.anzahlPokemons;
            const prozentWertGerundet = prozentWert.toFixed(0);
            return prozentWertGerundet;
        },

        anzahlDivers() {
            let anzahl = 0;
            for (let i = 0; i < this.pokemonList.length; i++) {
                if (this.pokemonList[i].gender === 'd') {
                    anzahl++;
                }
            }
            return anzahl;
        },

        nextId() {
            // maximale Id + 1
            let maximaleId = -1;
            for (let i = 0; i < this.pokemonList.length; i++) {
                if (this.pokemonList[i].id > maximaleId) {
                    maximaleId = this.pokemonList[i].id;
                }
            }
            return maximaleId + 1;
        },

        attackenliste() {
            let text = '';
            if (this.donnerblitz) {
                text += 'Donnerblitz ';
            }
            if (this.voltoball) {
                text += 'Voltoball ';
            }
            if (this.surfer) {
                text += 'Surfer ';
            }
            return text;
        }
    },

    methods: {
        // ### Komponenten anzeigen und verstecken ###
        formularAnzeigen() {
            this.display.Statistik = false;
            this.display.Liste = false;
            this.display.Formular = true;            
            this.display.Update = false;
        },

        statistikUndListeAnzeigen() {
            this.display.Statistik = true;
            this.display.Liste = true;
            this.display.Formular = false;
            this.display.Update = false;
        },

        updateAnzeigen(){
            this.display.Statistik = false;
            this.display.Liste = false;
            this.display.Formular = false;
            this.display.Update = true;            
        },

        // ### Handler für Buttons ###
        buttonHinzufuegen() {
            // neues Pokemon erzeugen
            const newPokemon = {
                id: this.nextId,
                name: this.newPokemon.name,
                typ1: this.newPokemon.typ1,
                typ2: this.newPokemon.typ2,
                gender: this.newPokemon.gender,
                donnerblitz: this.newPokemon.donnerblitz,
                voltoball: this.newPokemon.voltoball,
                surfer: this.newPokemon.surfer,
                attacken: this.newPokemon.attackenliste // FEHLER!
            };

            // neues Pokemon an Liste anhängen
            this.pokemonList.push(newPokemon);

            // Statistik und Liste anzeigen
            this.statistikUndListeAnzeigen();

            // Daten persistent speichern
            this.speichern();
        },

        buttonLoeschen(id) {
            // Pokemon mit der id von Liste enfernen
            let index = -1;
            for (let i = 0; i < this.pokemonList.length; i++) {
                if (this.pokemonList[i].id === id) {
                    index = i;
                }
            }
            this.pokemonList.splice(index, 1);

            // Daten persistent speichern
            this.speichern();
        },

        buttonUpdate(id){
            // Daten des Pokemon mit id holen
            let index = -1;
            for (let i = 0; i < this.pokemonList.length; i++) {
                if (this.pokemonList[i].id === id) {
                    index = i;
                }
            }
            let aktuellesPokemon = this.pokemonList[index];

            // Daten vom Pokemon auf GUI übertragen
            this.updatePokemon.id = aktuellesPokemon.id;
            this.updatePokemon.name = aktuellesPokemon.name;
            this.updatePokemon.typ1 = aktuellesPokemon.typ1;
            this.updatePokemon.typ2 = aktuellesPokemon.typ2;
            this.updatePokemon.gender = aktuellesPokemon.gender;
            this.updatePokemon.donnerblitz = aktuellesPokemon.donnerblitz;
            this.updatePokemon.voltoball = aktuellesPokemon.voltoball;
            this.updatePokemon.surfer = aktuellesPokemon.surfer;

            this.aktuellerIndex = index;

            // GUI anzeigen
            this.updateAnzeigen();
        },

        buttonAenderungenSpeichern(index) {
            // neues Pokemon erzeugen als Kopie
            const newPokemon = Object.assign({}, this.updatePokemon);

            /*
            Umständlicher Quellcode zum Erzeugen einer Kopie
            const newPokemon = {
                id: this.updatePokemon.id,
                name: this.updatePokemon.name,
                typ1: this.updatePokemon.typ1,
                typ2: this.updatePokemon.typ2,
                gender: this.updatePokemon.gender,
                donnerblitz: this.updatePokemon.donnerblitz,
                voltoball: this.updatePokemon.voltoball,
                surfer: this.updatePokemon.surfer,
                attacken: this.updatePokemon.attackenliste
            };
            */            

            // altes Pokemon durch neues ersetzen
            this.pokemonList[index] = newPokemon;

            // Statistik und Liste anzeigen
            this.statistikUndListeAnzeigen();

            // Daten persistent speichern
            this.speichern();
        },
        
        buttonCancel(){
            // GUI anzeigen
            this.statistikUndListeAnzeigen();
        },        

        // ### Persistenz: localStorage ###
        speichern() {
            // Komplettes Array mit Pokemons im 'localStorage' speichern
            const text = JSON.stringify(this.pokemonList);
            localStorage.setItem('pokemonliste', text);            
        },

        laden() {
            // Daten aus 'localStorage' laden
            if (localStorage.getItem('pokemonliste')) {
                let dataString = localStorage.getItem('pokemonliste');
                this.pokemonList = JSON.parse(dataString);
            } else {
                this.pokemonList = [];
            }
        }
    },

    mounted() {
        // Persistent gespeicherte Daten laden
        this.laden();
    }
};
Vue.createApp(PokemonApp).mount('#pokemon-app');