
function loadContent() {
    Swal.fire({
        title: 'Đang xử lý...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        onOpen: () => {
            swal.showLoading();
        }
    });
    $.ajax({
        url: '/api/violation/get-all',
        method: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': sessionStorage.getItem('token')
        },
        data: {
            isActive: 1,
        },
        success: function(res) {
            Swal.close();
            const tbody = $('#kt_datatable1_body');
            tbody.empty();
            res.data.forEach(category => {
                tbody.append(`
                    <tr style="line-height: 100px;">
                        <td>${category.id}</td>
                        <td>${category.name}</td>
                        <td style="text-align: center;padding-left:0;">
                            <span class="svg-icon svg-icon-primary svg-icon-2x"><!--begin::Svg Icon | path:C:\wamp64\www\keenthemes\themes\metronic\theme\html\demo1\dist/../src/media/svg/icons\Communication\Write.svg-->
                                <svg id="btn_edit_category" data-id="${category.id}" class="btn-edit-category" style="cursor: pointer; width: 36px !important;height: 36px !important;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                        <rect x="0" y="0" width="24" height="24"/>
                                        <path d="M12.2674799,18.2323597 L12.0084872,5.45852451 C12.0004303,5.06114792 12.1504154,4.6768183 12.4255037,4.38993949 L15.0030167,1.70195304 L17.5910752,4.40093695 C17.8599071,4.6812911 18.0095067,5.05499603 18.0083938,5.44341307 L17.9718262,18.2062508 C17.9694575,19.0329966 17.2985816,19.701953 16.4718324,19.701953 L13.7671717,19.701953 C12.9505952,19.701953 12.2840328,19.0487684 12.2674799,18.2323597 Z" fill="#000000" fill-rule="nonzero" transform="translate(14.701953, 10.701953) rotate(-135.000000) translate(-14.701953, -10.701953) "/>
                                        <path d="M12.9,2 C13.4522847,2 13.9,2.44771525 13.9,3 C13.9,3.55228475 13.4522847,4 12.9,4 L6,4 C4.8954305,4 4,4.8954305 4,6 L4,18 C4,19.1045695 4.8954305,20 6,20 L18,20 C19.1045695,20 20,19.1045695 20,18 L20,13 C20,12.4477153 20.4477153,12 21,12 C21.5522847,12 22,12.4477153 22,13 L22,18 C22,20.209139 20.209139,22 18,22 L6,22 C3.790861,22 2,20.209139 2,18 L2,6 C2,3.790861 3.790861,2 6,2 L12.9,2 Z" fill="#000000" fill-rule="nonzero" opacity="0.3"/>
                                    </g>
                                </svg>
                            </span>
                            <span>
                                <button class="btn btn-danger btn-sm btn-lock" data-name="${category.name}" data-id="${category.id}" data-status="0">
                                    <i class="fa fa-lock p-0"></i>
                                </button>
                            </span>
                        </td>
                    </tr>
                `);
            });
        },
        error: function(err) {
            console.error('Không thể tải danh sách category:', err);
        }
    });
}

function addCategory() {
    Swal.fire({
        title: 'Đang xử lý...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        onOpen: () => {
            swal.showLoading();
        }
    });
    $.ajax({
        url: '/api/violation/create',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            name: $('#name_category').val(),
        }),
        headers: {
            'Authorization': sessionStorage.getItem('token')
        },
        success: function(res) {
            Swal.close();
            Swal.fire({
                icon: 'success',
                title: 'Thành công!',
                text: res.message,
                timer: 2000,
                showConfirmButton: false
            });
            $('#exampleModalCenter').modal('hide');
            loadContent();
        },
        error: function(err) {
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Thất bại!',
                text: err.responseJSON?.message || 'Không thể thêm danh mục. Vui lòng thử lại!',
                confirmButtonText: 'Đóng'
            });
            console.error('Không thể thêm danh mục:', err);
        }
    });
}

$(document).ready(function() {
    loadContent();

    $('.btn-add-category').on('click', function() {
        const htmlAdd = `
            <div class="modal-header">
                <h5 class="modal-title">Thêm danh mục</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <i aria-hidden="true" class="ki ki-close"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="categoryForm">
                    <div class="form-group">
                        <label>Tên danh mục:</label>
                        <input id="name_category" type="text" name="nameCategory" class="form-control" placeholder="Nhập tên danh mục" required>
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

    $(document).on('click', '.btn-edit-category', function() {
        const categoryId = $(this).data('id');
        $.ajax({
            url: '/api/violation/detail/' + categoryId,
            type: 'GET',
            headers: {
                'Authorization': sessionStorage.getItem('token')
            },
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
                            <div class="form-group">
                                <label>Tên danh mục:</label>
                                <input value="${res.data.name}" id="name_category_edit" type="text" name="nameCategory" class="form-control" placeholder="Nhập danh mục" required>
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

                $(document).off('click', '#btn_save_edit').on('click', '#btn_save_edit', async  function() {
                    $.ajax({
                        url: '/api/violation/update/' + categoryId,
                        type: 'PUT',
                        contentType: 'application/json',
                        data: JSON.stringify({
                            name: $('#name_category_edit').val(),
                        }),
                        headers: {
                            'Authorization': sessionStorage.getItem('token')
                        },
                        success: function(res) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Thành công!',
                                text: res.message,
                                timer: 2000,
                                showConfirmButton: false
                            }).then(() => {
                                $('#exampleModalCenter').modal('hide');
                                loadContent();
                            });
                        },
                        error: function(err) {
                            Swal.fire({
                                icon: 'error',
                                title: 'Thất bại!',
                                text: err.responseJSON?.message || 'Không thể chỉnh sửa thông tin danh mục. Vui lòng thử lại!',
                                confirmButtonText: 'Đóng'
                            });
                            console.error('Không thể chỉnh sửa thông tin danh mục:', err);
                        }
                    });
                });
            },
            error: function(err) {
                console.error('Không thể lấy thông tin chi tiết danh mục:', err);
            }
        });
    });

    $(document).on('click', '#btn_save_add', function() {
        addCategory();
    });

    $(document).on('click', '.btn-lock', function() {
        const categoryId = $(this).data('id');
        const status = $(this).data('status');
        const name = $(this).data('name');
        Swal.fire({
            title: 'Xác nhận khoá danh mục',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy bỏ',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: '/api/violation/update/' + categoryId,
                    type: 'PUT',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        isActive: status,
                        name: name,
                    }),
                    headers: {
                        'Authorization': sessionStorage.getItem('token')
                    },
                    success: function(res) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Thành công!',
                            text: res.message,
                            timer: 2000,
                            showConfirmButton: false
                        }).then(() => {
                            $('#exampleModalCenter').modal('hide');
                            loadContent();
                        });
                    },
                    error: function(err) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Thất bại!',
                            text: err.responseJSON?.message || 'Không thể chỉnh sửa thông tin danh mục. Vui lòng thử lại!',
                            confirmButtonText: 'Đóng'
                        });
                        console.error('Không thể chỉnh sửa thông tin danh mục:', err);
                    }
                });
            }
        });
    });

});
