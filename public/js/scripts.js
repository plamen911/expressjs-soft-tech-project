$(function () {
  $('[data-user="quick-info"]').tooltip()

  $('#emailList').on('click', '.removeEmail', function (e) {
    e.preventDefault()
    $(this).closest('li').remove()
  })
  $('#addEmail').on('click', function (e) {
    e.preventDefault()
    var s = '<li>' +
        '<div class="input-group">' +
        '<input type="email" name="emails[]" value="" placeholder="E-mail" class="form-control"> ' +
        '<div class="input-group-btn">' +
        '<a href="#" class="btn removeEmail">' +
        '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>' +
        '</a>' +
        '</div>' +
        '</div>' +
        '</li>';
    $('#emailList').append(s)
  })

  $('#phoneList').on('click', '.removePhone', function (e) {
    e.preventDefault()
    $(this).closest('li').remove()
  })

  $('#addPhone').on('click', function (e) {
    e.preventDefault()
    var s = '<li>' +
        '<div class="input-group my-group">' +
        '<input type="tel" name="phoneNum[]" value="" placeholder="Phone" class="form-control">' +
        '<select name="phoneType[]" class="form-control">' +
        '<option value="">- select -</option>';
    ['Work', 'Home', 'Mobile', 'Fax'].forEach(function (item) {
      s += '<option value="' + item + '">' + item + '</option>'
    })
    s += '</select> ' +
      '<div class="input-group-btn">' +
      '<a href="#" class="btn removePhone">' +
      '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>' +
      '</a>' +
      '</div>' +
      '</div>' +
      '</li>';
    $('#phoneList').append(s)
  })

  if ($('.globalMessages').length) {
    window.setTimeout(function () {
      $('.globalMessages').fadeTo(500, 0).slideUp(500, function () {
        $(this).remove()
      })
    }, 3000)
  }
})

