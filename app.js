// ---------------
// Vorname:
// Nachname:
// Klasse: T3A
// ---------------
const PokemonApp = {
    data() {
        return {
            // ####### View, GUI #########################
            // --- Daten des Formulars "Neues Pokemon" --- 
            newPokemon: {},

            // --- Daten des Update-Formulars ---
            updatePokemon: {},

            // --- Variablen zum Sichtbarmachen
            display: {
                statistik: true,
                liste: true,
                formNew: false,
                formUpdate: false
            },

            // ####### Model #########################
            // --- Liste aller Pokemons ---
            pokemonList: []
        }
    },

    computed: {
        // --- berechnete Datenfelder ---
        // --- werden zwischengespeichert ---
        // ##### für Statistik ##############
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

        // ##### für neues Pokemon ##############
        nextId() {
            // maximale Id + 1
            let maximaleId = -1;
            for (let i = 0; i < this.pokemonList.length; i++) {
                if (this.pokemonList[i].id > maximaleId) {
                    maximaleId = this.pokemonList[i].id;
                }
            }
            return maximaleId + 1;
        }

        
    },

    methods: {
        // ### GUI: Komponenten anzeigen und verstecken ###
        formNewAnzeigen() {
            this.display.statistik = false;
            this.display.liste = false;
            this.display.formNew = true;            
            this.display.formUpdate = false;            
        },

        statistikUndListeAnzeigen() {
            this.display.statistik = true;
            this.display.liste = true;
            this.display.formNew = false;
            this.display.formUpdate = false;
        },

        updateAnzeigen(){
            this.display.statistik = false;
            this.display.liste = false;
            this.display.formNew = false;
            this.display.formUpdate = true;            
        },

        // ### Handler für Buttons ###
        buttonNew(){
            // Standardwerte für neues Pokemon einstellen
            this.newPokemon = {                   
                   name: 'Pikachu',
                typ1: 'Wasser',
                typ2: 'Elektro',
                gender: 'w',
                donnerblitz: false,
                voltoball: true,
                surfer: false
            };

            // Formular zur Eingabe anzeigen
            this.formNewAnzeigen();
        },

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
                surfer: this.newPokemon.surfer                
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
            const index = this.getIndexFromId(id);
            this.pokemonList.splice(index, 1);

            // Daten persistent speichern
            this.speichern();
        },

        buttonUpdate(id){
            // Daten des Pokemon mit id holen
            const index = this.getIndexFromId(id);
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
            
            // GUI anzeigen
            this.updateAnzeigen();
        },

        buttonAenderungenSpeichern(id) {
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
            const index = this.getIndexFromId(id);            
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
        
        // ### Hilfsmethoden
        getIndexFromId(id){
            let index = -1; // falls id nicht gefunden wird
            for (let i = 0; i < this.pokemonList.length; i++) {
                if (this.pokemonList[i].id === id) {
                    index = i;
                    break;
                }
            }
            return index;
        },

        attackenliste(pokemon) {
            let text = '';
            if (pokemon.donnerblitz) {
                text += 'Donnerblitz ';
            }
            if (pokemon.voltoball) {
                text += 'Voltoball ';
            }
            if (pokemon.surfer) {
                text += 'Surfer ';
            }
            return text;
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