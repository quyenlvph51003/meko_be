let currentPage = 0;
let pageSize = parseInt($('#page-size-selector').val());
let searchText = '';

function loadContentReport(page = 0, size = pageSize, searchText = '') {
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
        url: `/api/report/search?page=${page}&size=${size}`,
        method: 'POST',
        contentType: 'application/json',
        headers: {
            'Authorization': sessionStorage.getItem('token')
        },
        data: JSON.stringify({
            searchText: searchText,
            status: 'PENDING'
        }),
        success: function(res) {
            Swal.close();
            const tbody = $('#kt_datatable1_body');
            tbody.empty();
            res.data.content.forEach(report => {
                tbody.append(`
                    <tr style="line-height: 100px;">
                        <td>${report.report_summary_id}</td>
                        <td><img style="border-radius: 16px;width:80px;height:80px;object-fit:cover;" src="${report.images[0]}" alt=""></td>
                        <td>
                            <div class="d-flex flex-column">
                                ${
                                    (report.categories || [])
                                    .map((cat, index) => {
                                        const colors = ['success', 'danger', 'warning', 'info', 'primary']; 
                                        const color = colors[index % colors.length]; 
                                        return `<span class="m-1 label label-${color} label-pill label-inline mr-2">${cat}</span>`;
                                    })
                                    .join(' ')
                                }
                            </div>
                        </td>
                        <td>${report.title}</td>
                        <td>${report.username}</td>
                        <td>
                            ${
                                (report.reports || [])
                                .map((report) => {
                                    return report.reason;
                                })
                                .join(' ')
                            }
                        </td>
                        <td>${report.total_reports}</td>
                        <td>
                            <span class="label label-warning label-pill label-inline mr-2">Chờ duyệt</span>
                        </td>
                        <td style="text-align: center;padding-left:0;">
                            <span class="svg-icon svg-icon-primary svg-icon-2x"><!--begin::Svg Icon | path:C:\wamp64\www\keenthemes\themes\metronic\theme\html\demo1\dist/../src/media/svg/icons\Communication\Write.svg-->
                                <svg id="btn_edit_report" data-id="${report.report_summary_id}" class="btn-edit-report" style="cursor: pointer; width: 36px !important;height: 36px !important;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
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
        loadContentReport(currentPage, pageSize, searchText);
    }
});

$('#next-page').on('click', function() {
    currentPage++;
    loadContentReport(currentPage, pageSize, searchText);
});

$('#page-size-selector').on('change', function() {
    pageSize = parseInt($(this).val());
    currentPage = 0;
    loadContentReport(currentPage, pageSize, searchText);
});

$(document).ready(function() {
    loadContentReport(currentPage, pageSize, searchText);

    $(document).on('click', '#kt_search_4', function(e) {
        e.preventDefault();

        const searchText = $('#input_search').val().trim();
        currentPage = 0;
        loadContentReport(currentPage, pageSize, searchText);
    });

    $(document).on('click', '#kt_reset_4', function(e) {
        e.preventDefault();
        $('#input_search').val('');
        searchText = '';
        loadContentReport(currentPage, pageSize, searchText);
    });

    // $(document).on('click', '.btn-lock', function() {
    //     const categoryId = $(this).data('id');
    //     const status = $(this).data('status');
    //     const titleText = status == 1 ? 'Xác nhận khóa danh mục?' : 'Xác nhận mở khóa danh mục?';
    //     Swal.fire({
    //         title: titleText,
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonText: 'Đồng ý',
    //         cancelButtonText: 'Hủy bỏ',
    //         reverseButtons: true
    //     }).then((result) => {
    //         if (result.isConfirmed) {
    //             $.ajax({
    //                 url: '/api/category/update-is-active/' + categoryId,
    //                 type: 'PUT',
    //                 headers: {
    //                     'Authorization': sessionStorage.getItem('token')
    //                 },
    //                 success: function(res) {
    //                     const message =res.data.is_active == 1
    //                         ? 'Mở khóa danh mục thành công!'
    //                         : 'Khóa danh mục thành công!';
    //                     Swal.fire({
    //                         icon: 'success',
    //                         title: message,
    //                         showConfirmButton: false,
    //                         timer: 1500
    //                     });
    //                     loadContentReport(currentPage, pageSize, searchText);
    //                 },
    //                 error: function(err) {
    //                     Swal.fire({
    //                         icon: 'error',
    //                         title: 'Lỗi!',
    //                         text: 'Không thể cập nhật danh mục.',
    //                     });
    //                     console.error('Không thể cập nhật danh mục:', err);
    //                 }
    //             });
    //         }
    //     });
    // });

});
