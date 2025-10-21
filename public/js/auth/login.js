$('#btn_login').on('click', function(e) {
    e.preventDefault();

    const data = {
      email: $('#username').val(),
      password: $('#password').val()
    };

    $.ajax({
      url: '/api/auth/login',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: function(res) {
        if (res.success) {
          sessionStorage.setItem('token', res.data.token);
          sessionStorage.setItem('refreshToken', res.data.refreshToken);

          window.location.href = '/admin/dashboard';
        } else {
          alert(res.message);
        }
      },
      error: function(xhr, status, error) {
        console.error('Login error:', error);
        alert(xhr.responseJSON.message|| error);
      }
    });
  });