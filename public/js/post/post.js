let currentPage = 0;
let pageSize = parseInt($('#page-size-selector').val());
let searchText = '';

function formatDate(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
}

function loadPost(page=0, size=pageSize,searchText = '') {
    $.ajax({
        url: `/api/post/search-post?page=${page}&size=${size}`,
        method: 'POST',
        contentType: 'application/json',
        headers: {
            'Authorization': sessionStorage.getItem('token')
        },
        data: JSON.stringify({
            searchText: searchText
        }),
        success: function(res) {
            const tbody = $('#kt_datatable1_body');
            tbody.empty();
            res.data.content.forEach(post => {
                tbody.append(`
                    <tr style="line-height: 100px;">
                        <td>${post.id}</td>
                        <td>${post.userNamePoster}</td>
                        <td>
                            <div class="d-flex flex-column">
                                ${
                                    (post.categories || [])
                                    .map((cat, index) => {
                                        const colors = ['success', 'danger', 'warning', 'info', 'primary']; 
                                        const color = colors[index % colors.length]; 
                                        return `<span class="m-1 label label-${color} label-pill label-inline mr-2">${cat}</span>`;
                                    })
                                    .join(' ')
                                }
                            </div>
                        </td>
                        <td><img style="border-radius: 16px;width:80px;height:80px;object-fit:cover;" src="${post.images[0]}" alt=""></td>
                        <td>${post.title}</td>
                        <td>${post.description}</td>
                        <td>${post.address}</td>
                        <td>${post.price}</td>
                        <td>
                            ${
                                post.status === "VIOLATION" 
                                ? '<span class="label label-danger label-pill label-inline mr-2">Vi phạm</span>'
                                : post.status === "APPROVED"
                                ? '<span class="label label-success label-pill label-inline mr-2">Phê duyệt</span>'
                                : post.status === "PENDING"
                                ? '<span class="label label-primary label-pill label-inline mr-2">Chờ duyệt</span>'
                                : post.status === "HIDDEN"
                                ? '<span class="label label-secondary label-pill label-inline mr-2">Ẩn tin</span>'
                                : post.status === "REJECTED"
                                ? '<span class="label label-warning label-pill label-inline mr-2">Từ chối</span>'
                                : ''
                            }
                        </td>
                        <td>${formatDate(post.expiredAt)}</td>
                        <td>
                            ${
                                post.isPinned == 1
                                ? '<span class="label label-success label-pill label-inline mr-2">Đã ghim</span>'
                                : '<span class="label label-danger label-pill label-inline mr-2">Chưa ghim</span>'
                            }
                        </td>
                        <td style="text-align: center;padding-left:0;">
                            <span class="svg-icon svg-icon-primary svg-icon-2x"><!--begin::Svg Icon | path:C:\wamp64\www\keenthemes\themes\metronic\theme\html\demo1\dist/../src/media/svg/icons\Communication\Write.svg-->
                                <svg id="btn_edit_post" data-id="${post.id}" class="btn-edit-post" style="cursor: pointer; width: 36px !important;height: 36px !important;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
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
        loadPost(currentPage, pageSize, searchText);
    }
});

$('#next-page').on('click', function() {
    currentPage++;
    loadPost(currentPage, pageSize, searchText);
});

$('#page-size-selector').on('change', function() {
    pageSize = parseInt($(this).val());
    currentPage = 0;
    loadPost(currentPage, pageSize, searchText);
});

$(document).ready(function() {
    loadPost(currentPage, pageSize);

    $(document).on('click', '.btn-edit-post', function() {
        const postId = $(this).data('id');
        $.ajax({
            url: '/api/post/detail/' + postId,
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
                                <label>Hình ảnh</label>
                                <div class="mb-3">
                                    ${
                                        res.data.images[0]
                                            ? `<img id="img_category" style="width:120px;height:120px;object-fit:cover;" src="${res.data.images[0]}" alt="">`
                                            : `<img style="width:120px;height:120px;object-fit:cover;" src="/img/user-default.png" alt="">`
                                    }
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Tên tác giả:</label>
                                <input value="${res.data.userNamePoster}" type="text" class="form-control" readonly>
                            </div>

                            <div class="form-group">
                                <label>Tiêu đề:</label>
                                <input value="${res.data.title}" type="text" class="form-control" readonly>
                            </div>

                            <div class="form-group">
                                <label>Mô tả:</label>
                                <textarea class="form-control" rows="4" readonly>${res.data.description}</textarea>
                            </div>

                            <div class="form-group">
                                <label>Giá:</label>
                                <input value="${res.data.price}" type="text" class="form-control" readonly>
                            </div>

                            <div class="form-group">
                                <label>Địa chỉ:</label>
                                <input value="${res.data.address}" type="text" class="form-control" readonly>
                            </div>

                            <div class="form-group">
                                <label>Số điện thoại:</label>
                                <input value="${res.data.phoneNumber}" type="text" class="form-control" readonly>
                            </div>

                            <div class="form-group">
                                <label>Trạng thái:</label>
                                <select id="status_post_edit" class="form-control">
                                    <option value="PENDING" ${res.data.status === 'PENDING' ? 'selected' : ''}>Chờ duyệt</option>
                                    <option value="VIOLATION" ${res.data.status === 'VIOLATION' ? 'selected' : ''}>Vi phạm</option>
                                    <option value="APPROVED" ${res.data.status === 'APPROVED' ? 'selected' : ''}>Phê duyệt</option>
                                    <option value="REJECTED" ${res.data.status === 'REJECTED' ? 'selected' : ''}>Từ chối</option>
                                    <option value="HIDDEN" ${res.data.status === 'HIDDEN' ? 'selected' : ''}>Ẩn tin</option>
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

                const status = res.data.status;
                const $select = $('#status_post_edit');

                if (status === 'VIOLATION') {
                    // Chỉ hiển thị "Vi phạm" và khóa select
                    $select.find('option').hide();
                    $select.find('option[value="VIOLATION"]').show();
                    $select.val('VIOLATION');
                    $select.prop('disabled', true);
                    $select.css({
                        'appearance': 'none',          
                        '-webkit-appearance': 'none',
                        '-moz-appearance': 'none',
                        'background-color': '#dc3545', 
                        'color': 'white',         
                        'background-image': 'none',   
                        'cursor': 'not-allowed'        
                    });
                } else if (status === 'PENDING') {
                    // Chỉ hiển thị 3 option: Chờ duyệt, Phê duyệt, Từ chối
                    $select.find('option').hide();
                    $select.find('option[value="PENDING"]').show();
                    $select.find('option[value="APPROVED"]').show();
                    $select.find('option[value="REJECTED"]').show();
                    $select.prop('disabled', false);
                } else if (status === 'APPROVED') {
                    // Chỉ hiển thị 2 option: ẩn tin, phê duyệt
                    $select.find('option').hide();
                    $select.find('option[value="APPROVED"]').show();
                    $select.find('option[value="HIDDEN"]').show();
                    $select.prop('disabled', false);
                } else if (status === 'REJECTED') {
                    // Chỉ hiển thị 2 option: Từ chối, chờ duyệt
                    $select.find('option').hide();
                    $select.find('option[value="PENDING"]').show();
                    $select.prop('disabled', false);
                } else if (status === 'HIDDEN') {
                    // Chỉ hiển thị 2 option: ẩn tin, phê duyệt
                    $select.find('option').hide();
                    $select.find('option[value="HIDDEN"]').show();
                    $select.find('option[value="APPROVED"]').show();
                    $select.prop('disabled', false);
                } else {
                    // Các trạng thái khác thì hiển thị đầy đủ, cho phép chọn
                    $select.find('option').show();
                    $select.prop('disabled', false);
                }

                $(document).on('change', '#status_post_edit', function () {
                    const selected = $(this).val();

                    $('#reasonContainer').remove();

                    if (selected === 'REJECTED') {
                        const reasonHtml = `
                            <div id="reasonContainer" class="form-group mt-3">
                                <label>Lý do từ chối:</label>
                                <input id="reasonInput" type="text" class="form-control" placeholder="Nhập lý do..." required>
                            </div>
                        `;
                        $(this).closest('.form-group').after(reasonHtml);
                    }
                });

                $(document).off('click', '#btn_save_edit').on('click', '#btn_save_edit', async  function() {

                    const status = $('#status_post_edit').val();
                    const reason = $('#reasonInput').val() || '';
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
                        url: '/api/post/update-status/' + postId,
                        type: 'PUT',
                        data: {
                            status: status,
                            reasonReject: reason
                        },
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
                            loadPost(currentPage, pageSize, searchText);
                        },
                        error: function(err) {
                            Swal.close();
                            Swal.fire({
                                icon: 'error',
                                title: 'Thất bại!',
                                text: err.responseJSON?.message || 'Không thể thay đổi trạng thái bài viết. Vui lòng thử lại!',
                                confirmButtonText: 'Đóng'
                            });
                            console.error('Không thể thay đổi trạng thái bài viết:', err);
                        }
                    });
                });
            },
            error: function(err) {
                console.error('Không thể lấy thông tin chi tiết bài viết:', err);
            }
        });
    });

    $(document).on('click', '#kt_search_4', function(e) {
        e.preventDefault();

        const searchText = $('#input_search').val().trim();
        currentPage = 0;
        loadPost(currentPage, pageSize, searchText);
    });

    $(document).on('click', '#kt_reset_4', function(e) {
        e.preventDefault();
        $('#input_search').val('');
        searchText = '';
        loadPost(currentPage, pageSize, searchText);
    });

});
