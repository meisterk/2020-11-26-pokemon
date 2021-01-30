const PokemonApp = {
    data() {
        return {
            // --- Daten des neuen Pokemons ---                    
            name: 'Pikachu',
            typ1: 'Wasser',
            typ2: 'Elektro',
            gender: 'w',
            donnerblitz: false,
            voltoball: true,
            surfer: false,

            // --- Liste aller Pokemons ---
            pokemonList: [
                { id: 0, name: 'Voltoball', typ1: 'Elektro', typ2: 'Wasser', gender: 'd', donnerblitz: true, voltoball: true, surfer: false, attacken: 'Donnerblitz, Voltoball' },
                { id: 1, name: 'Relaxo', typ1: 'Normal', typ2: 'Normal', gender: 'm', donnerblitz: false, voltoball: false, surfer: true, attacken: 'Surfer' }
            ],

            // --- Variablen zum Sichtbarmachen
            displayFormular: false,
            displayStatistik: true,
            displayListe: true,
            displayUpdate: false,

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
            this.displayStatistik = false;
            this.displayListe = false;
            this.displayFormular = true;            
            this.displayUpdate = false;
        },

        statistikUndListeAnzeigen() {
            this.displayStatistik = true;
            this.displayListe = true;
            this.displayFormular = false;
            this.displayUpdate = false;
        },

        updateAnzeigen(){
            this.displayStatistik = false;
            this.displayListe = false;
            this.displayFormular = false;
            this.displayUpdate = true;            
        },

        // ### Handler für Buttons ###
        buttonHinzufuegen() {
            // neues Pokemon erzeugen
            const newPokemon = {
                id: this.nextId,
                name: this.name,
                typ1: this.typ1,
                typ2: this.typ2,
                gender: this.gender,
                donnerblitz: this.donnerblitz,
                voltoball: this.voltoball,
                surfer: this.surfer,
                attacken: this.attackenliste
            };

            // neues Pokemon an Liste anhängen
            this.pokemonList.push(newPokemon);

            // Statistik und Liste anzeigen
            this.statistikUndListeAnzeigen();

            // Daten persistent speichern
            this.speichern();
        },

        buttonAenderungenSpeichern(index) {
            // neues Pokemon erzeugen
            const newPokemon = {
                id: this.nextId,
                name: this.name,
                typ1: this.typ1,
                typ2: this.typ2,
                gender: this.gender,
                donnerblitz: this.donnerblitz,
                voltoball: this.voltoball,
                surfer: this.surfer,
                attacken: this.attackenliste
            };

            // altes Pokemon durch neues ersetzen
            this.pokemonList[index] = newPokemon;

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
            this.name = aktuellesPokemon.name;
            this.typ1 = aktuellesPokemon.typ1;
            this.typ2 = aktuellesPokemon.typ2;
            this.gender = aktuellesPokemon.gender;
            this.donnerblitz = aktuellesPokemon.donnerblitz;
            this.voltoball = aktuellesPokemon.voltoball;
            this.surfer = aktuellesPokemon.surfer;

            this.aktuellerIndex = index;

            // GUI anzeigen
            this.updateAnzeigen();
        },

        buttonCancel(){
            // GUI anzeigen
            this.statistikUndListeAnzeigen();
        },

        // Statistik und Liste anzeigen

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