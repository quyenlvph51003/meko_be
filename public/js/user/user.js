let currentPage = 0;
let pageSize = parseInt($('#page-size-selector').val());

function formatDate(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
}

function loadUsers(page = 0, size = pageSize) {
    $.ajax({
        url: '/api/user/search',
        method: 'GET',
        contentType: 'application/json',
        data: {
            page: page,
            size: size
        },
        success: function(res) {
            const tbody = $('#kt_datatable1_body');
            tbody.empty();
            res.data.content.forEach(user => {
                const createdAt = formatDate(user.created_at);
                const updatedAt = formatDate(user.updated_at);
                const lockBtn = user.is_active == 1
                    ? `<button class="btn btn-danger btn-sm btn-lock" data-id="${user.id}" data-status="0">
                            <i class="fa fa-lock p-0"></i>
                    </button>`
                    : `<button class="btn btn-success btn-sm btn-lock" data-id="${user.id}" data-status="1">
                            <i class="fa fa-unlock p-0"></i>
                    </button>`;

                tbody.append(`
                    <tr style="line-height: 100px;">
                        <td>${user.id}</td>
                        <td>
                            ${
                            user.avatar
                                ? `<img style="border-radius: 16px;width:80px;height:80px;object-fit:cover;" src="${user.avatar}" alt="">`
                                : `<img style="border-radius: 16px;width:80px;height:80px;object-fit:cover;" src="/img/user-default.png" alt="">`
                            }
                        </td>
                        <td>${user.username}</td>
                        <td>${user.email}</td>
                        <td>${user.address_name}</td>
                        <td>${user.role == 1 ? 'Admin' : 'User'}</td>
                        <td>${user.is_active == 1 ? '<span class="label label-success label-pill label-inline mr-2">Hoạt động</span>' : '<span class="label label-danger label-pill label-inline mr-2">Đã khoá</span>'}</td>
                        <td>${createdAt}</td>
                        <td>${updatedAt}</td>
                        <td style="text-align: center;padding-left:0;">
                            <span class="svg-icon svg-icon-primary svg-icon-2x"><!--begin::Svg Icon | path:C:\wamp64\www\keenthemes\themes\metronic\theme\html\demo1\dist/../src/media/svg/icons\Communication\Write.svg-->
                                <svg id="btn_edit_user" data-id="${user.id}" class="btn-edit-user" style="cursor: pointer; width: 36px !important;height: 36px !important;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                        <rect x="0" y="0" width="24" height="24"/>
                                        <path d="M12.2674799,18.2323597 L12.0084872,5.45852451 C12.0004303,5.06114792 12.1504154,4.6768183 12.4255037,4.38993949 L15.0030167,1.70195304 L17.5910752,4.40093695 C17.8599071,4.6812911 18.0095067,5.05499603 18.0083938,5.44341307 L17.9718262,18.2062508 C17.9694575,19.0329966 17.2985816,19.701953 16.4718324,19.701953 L13.7671717,19.701953 C12.9505952,19.701953 12.2840328,19.0487684 12.2674799,18.2323597 Z" fill="#000000" fill-rule="nonzero" transform="translate(14.701953, 10.701953) rotate(-135.000000) translate(-14.701953, -10.701953) "/>
                                        <path d="M12.9,2 C13.4522847,2 13.9,2.44771525 13.9,3 C13.9,3.55228475 13.4522847,4 12.9,4 L6,4 C4.8954305,4 4,4.8954305 4,6 L4,18 C4,19.1045695 4.8954305,20 6,20 L18,20 C19.1045695,20 20,19.1045695 20,18 L20,13 C20,12.4477153 20.4477153,12 21,12 C21.5522847,12 22,12.4477153 22,13 L22,18 C22,20.209139 20.209139,22 18,22 L6,22 C3.790861,22 2,20.209139 2,18 L2,6 C2,3.790861 3.790861,2 6,2 L12.9,2 Z" fill="#000000" fill-rule="nonzero" opacity="0.3"/>
                                    </g>
                                </svg>
                            </span>
                            <span>${lockBtn}</span>
                        </td>
                    </tr>
                `);
            });
            // cập nhật phân trang
            $('#current-page').text(res.data.pagination.currentPage + 1);
            $('#total-pages').text(res.data.pagination.totalPages);

            const start = res.data.pagination.totalElements === 0 ? 0 : res.data.pagination.currentPage * res.data.pagination.size + 1;
            const end = Math.min((res.data.pagination.currentPage + 1) * res.data.pagination.size, res.data.pagination.totalElements);

            $('#pagination-text').text(`Hiển thị ${start}-${end} của ${res.data.pagination.totalElements} bản ghi`);

            $('#prev-page').prop('disabled', res.data.pagination.currentPage <= 0);
            $('#next-page').prop('disabled', res.data.pagination.currentPage >= res.data.pagination.totalPages - 1);
        },
        error: function(err) {
            console.error('Không thể tải danh sách user:', err);
        }
    });
}

$('#prev-page').on('click', function() {
    if (currentPage > 0) {
        currentPage--;
        loadUsers(currentPage, pageSize);
    }
});

$('#next-page').on('click', function() {
    currentPage++;
    loadUsers(currentPage, pageSize);
});

$('#page-size-selector').on('change', function() {
    pageSize = parseInt($(this).val());
    currentPage = 0;
    loadUsers(currentPage, pageSize);
});

function addUser() {
    const data = {
        username: $('#username').val(),
        email: $('#email').val(),
        password: $('#password').val(),
        address_name: $('#address_name').val()
    };

    $.ajax({
        url: '/api/user/create',
        type: 'POST',
        data: data,
        success: function(res) {
            Swal.fire({
                icon: 'success',
                title: 'Thành công!',
                text: res.message,
                timer: 2000,
                showConfirmButton: false
            });
            $('#exampleModalCenter').modal('hide');
            loadUsers();
        },
        error: function(err) {
            Swal.fire({
                icon: 'error',
                title: 'Thất bại!',
                text: err.responseJSON?.message || 'Không thể thêm user. Vui lòng thử lại!',
                confirmButtonText: 'Đóng'
            });
            console.error('Không thể thêm user:', err);
        }
    });
}

$(document).ready(function() {
    loadUsers();

    $('.btn-add-user').on('click', function() {
        const htmlAdd = `
            <div class="modal-header">
                <h5 class="modal-title">Thêm người dùng</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <i aria-hidden="true" class="ki ki-close"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="userForm">
                    <div class="form-group">
                        <label>Username:</label>
                        <input id="username" type="text" name="username" class="form-control" placeholder="Nhập username" required>
                    </div>
                    <div class="form-group">
                        <label>Email:</label>
                        <input id="email" type="email" name="email" class="form-control" placeholder="Nhập email" required>
                    </div>
                    <div class="form-group">
                        <label>Password:</label>
                        <input id="password" type="password" name="password" class="form-control" placeholder="Nhập mật khẩu" required>
                    </div>
                    <div class="form-group">
                        <label>Địa chỉ:</label>
                        <input id="address_name" type="text" name="address_name" class="form-control" placeholder="Nhập địa chỉ">
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-light-primary" data-dismiss="modal">Huỷ</button>
                <button id="btn_save_add" type="button" class="btn btn-primary btn-save-add">Thêm</button>
            </div>
        `;
        $('#modalContent').html(htmlAdd);
        $('#exampleModalCenter').modal('show');
    });

    $(document).on('click', '.btn-edit-user', function() {
        const userId = $(this).data('id');
        $.ajax({
            url: '/api/user/detail/' + userId,
            type: 'GET',
            success: function(res) {
                const htmlEdit = `
                    <div class="modal-header">
                        <h5 class="modal-title">Chỉnh sửa thông tin người dùng</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <i aria-hidden="true" class="ki ki-close"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="userForm">
                            <div class="form-group text-center">
                                <label>Ảnh đại diện:</label>
                                <div class="mb-3">
                                    ${
                                        res.data.avatar
                                            ? `<img style="width:120px;height:120px;object-fit:cover;" src="${res.data.avatar}" alt="">`
                                            : `<img style="width:120px;height:120px;object-fit:cover;" src="/img/user-default.png" alt="">`
                                    }
                                </div>
                                <div class="d-flex justify-content-center">
                                    <input id="avatar_edit" type="file" name="avatar" accept="image/*" class="form-control-file">
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Username:</label>
                                <input value="${res.data.username}" id="username_edit" type="text" name="username" class="form-control" placeholder="Nhập username" required>
                            </div>
                            <div class="form-group">
                                <label>Email:</label>
                                <input value="${res.data.email}" id="email_edit" type="email" name="email" class="form-control" placeholder="Nhập email" required>
                            </div>
                            <div class="form-group">
                                <label>Địa chỉ:</label>
                                <input value="${res.data.address_name}" id="address_name_edit" type="text" name="address_name" class="form-control" placeholder="Nhập địa chỉ">
                            </div>
                            <div class="form-group">
                                <label>Trạng thái:</label>
                                <select id="status_edit" name="status" class="form-control">
                                    <option value="0" ${res.data.is_active == 1 ? 'selected' : ''}>Hoạt động</option>
                                    <option value="1" ${res.data.is_active == 0 ? 'selected' : ''}>Đã khoá</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-light-primary" data-dismiss="modal">Huỷ</button>
                        <button id="btn_save_edit" type="button" class="btn btn-primary btn-save-add">Lưu</button>
                    </div>
                `;
                $('#modalContent').html(htmlEdit);
                $('#exampleModalCenter').modal('show');

                $('#avatar_edit').on('change', function(e) {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            $('#preview_image').attr('src', e.target.result);
                        };
                        reader.readAsDataURL(file);
                    }
                });

                $(document).off('click', '#btn_save_edit').on('click', '#btn_save_edit', async  function() {
                    let avatarUrl = res.data.avatar;
                    const file = $('#avatar_edit')[0].files[0];
                    try {
                        Swal.fire({
                            title: 'Đang xử lý...',
                            text: 'Vui lòng chờ trong giây lát.',
                            allowOutsideClick: false,
                            didOpen: () => {
                                Swal.showLoading();
                            }
                        });
                        // Nếu có ảnh mới thì upload trước
                        if (file) {
                            const formData = new FormData();
                            formData.append('avatar', file);

                            const uploadRes = await $.ajax({
                                url: '/api/user/upload-avatar/' + userId,
                                type: 'PUT',
                                data: formData,
                                processData: false,
                                contentType: false
                            });

                            avatarUrl = uploadRes.data?.avatar_url || avatarUrl;
                        }

                        // Sau khi có link ảnh thì gọi update thông tin
                        const dataEdit = {
                            userId: userId,
                            username: $('#username_edit').val(),
                            email: $('#email_edit').val(),
                            address_name: $('#address_name_edit').val(),
                            is_active: $('#status_edit').val(),
                            avatar_url: avatarUrl
                        };

                        const updateRes = await $.ajax({
                            url: '/api/user/update-user',
                            type: 'PUT',
                            data: dataEdit
                        });

                        Swal.fire({
                            icon: 'success',
                            title: updateRes.message || 'Cập nhật thành công!',
                            showConfirmButton: false,
                            timer: 2000
                        });

                        $('#exampleModalCenter').modal('hide');
                        loadUsers();

                    } catch (err) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Lỗi!',
                            text: err.responseJSON?.message || 'Không thể cập nhật user.',
                            confirmButtonText: 'Đóng'
                        });
                        console.error('Lỗi khi cập nhật user:', err);
                    }
                });
            },
            error: function(err) {
                console.error('Không thể thêm user:', err);
            }
        });
    });

    $(document).on('click', '#btn_save_add', function() {
        addUser();
    });

});


