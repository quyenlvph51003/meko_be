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
                                ? `<img style="width:80px;height:80px;object-fit:cover;" src="${user.avatar}" alt="">`
                                : `<img style="width:80px;height:80px;object-fit:cover;" src="/img/user-default.png" alt="">`
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
                                <svg style="width: 36px !important;height: 36px !important;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
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

$(document).ready(function() {
    loadUsers();
});


