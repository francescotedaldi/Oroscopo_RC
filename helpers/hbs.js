const moment = require('moment')

module.exports = {
  formatDate: function (date, format) {
    return moment(date).utc().format(format)
  },
  saveIcon: function (oroscopoUser, loggedUser, oroscopoId, floating = true) {
    
    if (floating) {
      return `<a href="/oroscopi/save/${oroscopoId}" class="btn-floating halfway-fab blue"><i class="fas fa-save fa-small"></i></a>`
    } else {
      return `<a href="/oroscopi/save/${oroscopoId}"><i class="fas fa-save"></i></a>`
    }
  },
  select: function (selected, options) {
    return options
      .fn(this)
      .replace(
        new RegExp(' value="' + selected + '"'),
        '$& selected="selected"'
      )
      .replace(
        new RegExp('>' + selected + '</option>'),
        ' selected="selected"$&'
      )
  },
}
