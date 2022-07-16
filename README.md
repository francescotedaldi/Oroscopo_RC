# Oroscopo_RC

## Autori
Questa applicazione è stata sviluppata interamente da studenti del corso di Reti di Calcolatori dell' università di Roma "La Sapienza".
- Francesco Tedaldi - 1852733
- Daniele Teodori - 1657325
- Giovanni Milletti - 1884164

## Architettura
![alt text](https://github.com/francescotedaldi/Oroscopo_RC/blob/main/Architettura_OroscopoRC.png)

## Caratteristiche del progetto e requisiti

- Containerizzazione dell'intero progetto (uso di Docker);
- Utilizzo di Nginx che svolge il ruolo di web server;
- Utilizzo di due container Node che svolgono il ruolo di application server;
- Nginx è in grado di comunicare sulla porta 443 in https (Inserimento requisiti di sicurezza);
- Viene utilizzato il protocollo asincrono SMTP per lo scambio di email e rabbitmq per verificare l'avvenuto login (utilizzo di almeno un protocollo asincrono);
- Viene fatto l'accesso a due servizi REST tra cui Google (utilizzo di almeno due servizi REST di terze parti);
- Il servizio rest di Google è acceduto tramite OAUTH2.0 (utilizzo di OAUTH);
- Sono implementati dei test tramite Mocha e Chai (automazione del processo di test);
- E' implementata una forma di CI/CD tramite github actions (utilizzo delle github actions);
- Offre API documentate tramite APIDOC (creazione API)

## Scopo del progetto

Il progetto consiste in un portale nel quale si accede tramite Google che permette di creare un diario personale con l'aggiunta di un oroscopo preso dal sito ['ohmanda.com/api/horoscope/'](http://ohmanda.com/api/horoscope/) e permette di salvarlo sul proprio Google Calendar come evento.

## configurazione

Spostarsi nella cartella config e compilare i campi del file dati_sensibili.env nel seguente modo:

```
PORT = 3000
MONGO_URI = mongodb+srv://teddyfra:1312@oroscoporc.bymuw.mongodb.net/OroscopoRC?retryWrites=true&w=majority
GOOGLE_CLIENT_ID = il tuo client id
GOOGLE_CLIENT_SECRET = il tuo client secret
URL_API = 'http://ohmanda.com/api/horoscope/'
SERVER_MAIL = email da associare al server
SERVER_SECRET = password della mail associata al server
```

**IMPORTANTE**: i valori di GOOGLE_CLIENT_ID e di GOOGLE_CLIENT_SECRET devono essere presi dalla sezione credenziali di [Google Cloud Console](https://console.cloud.google.com/apis/) creandone di nuove.
Sulla mail inserita in SERVER_MAIL attivare la verifica in due fattori e nel SERVER_SECRET inserire l'apposita chiave generata. 

## Installazione e utilizzo

- Per prima cosa scaricare e installare Git, Docker e Nodejs sul proprio computer;
- Clonare la repository tramite il comando:
```
git clone https://github.com/francescotedaldi/Oroscopo_RC.git
```
- Spostarsi nella cartella Oroscopo_RC e installare le dipendenze con il seguente comando:
```
npm install
```
- Per far partire l'applicazione la prima volta usare seguente comando:
```
docker-compose up --build -d
```
- Per chiudere l'applicazione usare il seguente comando:
```
docker-compose stop
```
- Ora per avviare normalmente l'applicazione usare:
```
docker-compose start -d
```

## Test

Per avviare i test posizionarsi nella cartella Oroscopo_RC e digitare il seguente comando:
```
npm test
```

## Documentazione Api

Le Api sono state documentate tramite ApiDoc. Per consultare la documentazione recarsi nella cartella 'docs' e aprire il file 'index.html'.