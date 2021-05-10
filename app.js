// ---------------
// Vorname:
// Nachname:
// Klasse: T4A
// ---------------
const PokemonApp = {
    data() {
        return {
            // ####### View, GUI #########################
            // --- Daten des Formulars "Neues Pokemon" --- 
            newPokemon: {},

            // --- Daten des Update-Formulars ---
            updatePokemon: {},

            // --- Variablen zum Sichtbarmachen der Komponenten ---
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
            return this.anzahlGender('m');
        },

        anzahlWeiblich() {            
            return this.anzahlGender('w');
        },

        anzahlDivers() {            
            return this.anzahlGender('d');
        },
        
        anteilWeiblichProzent() {
            const prozentWert = 100 * this.anzahlWeiblich / this.anzahlPokemons;
            const prozentWertGerundet = prozentWert.toFixed(0);
            return prozentWertGerundet;
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
            // neues Pokemon erzeugen aus Daten des Formulars und id hinzufügen            
            const newPokemon = Object.assign({id: this.nextId}, this.newPokemon);

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
            const aktuellesPokemon = this.pokemonList[index];

            // Daten vom Pokemon auf GUI übertragen
            this.updatePokemon = Object.assign({}, aktuellesPokemon);

            // GUI anzeigen
            this.updateAnzeigen();
        },

        buttonAenderungenSpeichern(id) {
            // neues Pokemon erzeugen als Kopie von updatePokemon
            const newPokemon = Object.assign({}, this.updatePokemon);                 
           
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
        anzahlGender(gender) {
            let anzahl = 0;
            for (let i = 0; i < this.pokemonList.length; i++) {
                if (this.pokemonList[i].gender === gender) {
                    anzahl++;
                }
            }
            return anzahl;
        },

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
        // Beim Start der App:
        // persistent gespeicherte Daten laden
        this.laden();
    }
};
Vue.createApp(PokemonApp).mount('#pokemon-app');