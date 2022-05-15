// funzione che ha accesso agli oggetti di req e res

module.exports = {

    // next è una funzione che chiami quando hai finito di fare quello che volevi fare
    ensureAuth: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        } else {
            // se non ti sei autenticato torna indietro a "http://localhost:3000/", cioè la homepage di login
            res.redirect('/')
        }
    },

    // se ti sei loggato non torni alla homepage, ma a "http://localhost:3000/dashboard"
    ensureGuest: function (req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/dashboard');
        }
    },
}
