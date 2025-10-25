let currentPage = 0;
let pageSize = parseInt($('#page-size-selector').val());

function loadCategories(page = 0, size = pageSize) {
    $.ajax({
        url: '/api/category/search',
        method: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': sessionStorage.getItem('token')
        },
        data:{
            page: page,
            size: size
        },
        success: function(res) {
            const tbody = $('#kt_datatable1_body');
            tbody.empty();
            res.data.content.forEach(category => {
                tbody.append(`
                    <tr style="line-height: 100px;">
                        <td>${category.id}</td>
                        <td>
                            ${
                            category.avatar
                                ? `<img style="border-radius: 16px;width:80px;height:80px;object-fit:cover;" src="${category.avatar}" alt="">`
                                : `<img style="border-radius: 16px;width:80px;height:80px;object-fit:cover;" src="/img/category-default.png" alt="">`
                            }
                        </td>
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
            console.error('Không thể tải danh sách category:', err);
        }
    });
}

$('#prev-page').on('click', function() {
    if (currentPage > 0) {
        currentPage--;
        loadCategories(currentPage, pageSize);
    }
});

$('#next-page').on('click', function() {
    currentPage++;
    loadCategories(currentPage, pageSize);
});

$('#page-size-selector').on('change', function() {
    pageSize = parseInt($(this).val());
    currentPage = 0;
    loadCategories(currentPage, pageSize);
});

function addCategory() {
    $('#avatar_category').on('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                $('#preview_image').attr('src', e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });
    const file = $('#avatar_category')[0].files[0];
    const formData = new FormData();
    formData.append('avatar', file);
    formData.append('name', $('#name_category').val());

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
        url: '/api/category/create',
        type: 'POST',
        processData: false,
        contentType: false,
        data: formData,
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
            loadCategories(currentPage, pageSize);
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
    loadCategories(currentPage, pageSize);

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
                        <label>Hình ảnh:</label>
                        <div class="d-flex justify-content-center">
                            <input id="avatar_category" type="file" name="avatar" accept="image/*" class="form-control-file">
                        </div>
                    </div>
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
            url: '/api/category/detail/' + categoryId,
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
                            <div class="form-group text-center">
                                <label>Hình ảnh:</label>
                                <div class="mb-3">
                                    ${
                                        res.data.avatar
                                            ? `<img id="img_category" style="width:120px;height:120px;object-fit:cover;" src="${res.data.avatar}" alt="">`
                                            : `<img style="width:120px;height:120px;object-fit:cover;" src="/img/user-default.png" alt="">`
                                    }
                                </div>
                                <div class="d-flex justify-content-center">
                                    <input id="avatar_category_edit" type="file" name="avatar_category_edit" accept="image/*" class="form-control-file">
                                </div>
                            </div>
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

                let fileEdit = null;
                $('#avatar_category_edit').on('change', function(e) {
                    fileEdit = e.target.files[0];
                    if (fileEdit) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            $('#img_category').attr('src', e.target.result);
                        };
                        reader.readAsDataURL(fileEdit);
                    }
                });

                $(document).off('click', '#btn_save_edit').on('click', '#btn_save_edit', async  function() {
                    const formData = new FormData();
                    if (fileEdit) {
                        formData.append('avatar', fileEdit);
                    } else {
                        // Nếu KHÔNG chọn ảnh mới → lấy ảnh cũ (URL hiện tại)
                        const imgSrc = $('#img_category').attr('src');
                        const blob = await fetch(imgSrc).then(res => res.blob()); // tải ảnh cũ về
                        const fileName = imgSrc.split('/').pop(); // lấy tên file từ URL
                        formData.append('avatar', blob, fileName); // gửi như file thật
                    }
                    
                    formData.append('name', $('#name_category_edit').val());

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
                        url: '/api/category/update/' + categoryId,
                        type: 'PUT',
                        processData: false,
                        contentType: false,
                        data: formData,
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
                            loadCategories(currentPage, pageSize);
                        },
                        error: function(err) {
                            Swal.close();
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

});
