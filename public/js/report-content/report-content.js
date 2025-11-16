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
                            <span class="svg-icon svg-icon-primary svg-icon-2x">
                                <svg id="btn_approved_report" data-id="${report.post_id}" 
                                    data-report='${JSON.stringify(report.reports)}'
                                    style="cursor: pointer; width: 36px !important; height: 36px !important;" 
                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                    <title>Phê duyệt</title>
                                    <path fill="green"
                                        d="M320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576zM438 209.7C427.3 201.9 412.3 204.3 404.5 215L285.1 379.2L233 327.1C223.6 317.7 208.4 317.7 199.1 327.1C189.8 336.5 189.7 351.7 199.1 361L271.1 433C276.1 438 282.9 440.5 289.9 440C296.9 439.5 303.3 435.9 307.4 430.2L443.3 243.2C451.1 232.5 448.7 217.5 438 209.7z"/>
                                </svg>
                            </span>

                            <span class="svg-icon svg-icon-primary svg-icon-2x">
                                <svg id="btn_rejected_report" data-id="${report.post_id}" 
                                    style="cursor: pointer; width: 36px !important; height: 36px !important;" 
                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                    <title>Từ chối</title>
                                    <path fill="red"
                                        d="M320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM231 231C240.4 221.6 255.6 221.6 264.9 231L319.9 286L374.9 231C384.3 221.6 399.5 221.6 408.8 231C418.1 240.4 418.2 255.6 408.8 264.9L353.8 319.9L408.8 374.9C418.2 384.3 418.2 399.5 408.8 408.8C399.4 418.1 384.2 418.2 374.9 408.8L319.9 353.8L264.9 408.8C255.5 418.2 240.3 418.2 231 408.8C221.7 399.4 221.6 384.2 231 374.9L286 319.9L231 264.9C221.6 255.5 221.6 240.3 231 231z"/>
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

    $(document).on('click', '#btn_rejected_report', function() {
        const postId = $(this).data('id');
        Swal.fire({
            title: 'Bạn chắc chắn muốn từ chối báo cáo này?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy bỏ',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: `/api/report/update-status?postId=${postId}`,
                    type: 'PUT',
                    headers: {
                        'Authorization': sessionStorage.getItem('token')
                    },
                    contentType: 'application/json',
                    data: JSON.stringify({
                        status: 'REJECTED'
                    }),
                    success: function(res) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Từ chối báo cáo thành công',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        loadContentReport(currentPage, pageSize, searchText);
                    },
                    error: function(err) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Lỗi!',
                            text: 'Không thể từ chối báo cáo.',
                        });
                        console.error('Không thể từ chối báo cáo:', err);
                    }
                });
            }
        });
    });

    $(document).on('click', '#btn_approved_report', function() {
        const postId = $(this).data('id');
        const reports = JSON.parse($(this).attr('data-report'));

        // Tạo options từ reportData.reports (mỗi report có violation_id)
        const optionsHtml = (reports || []).map(r => `
            <option value="${r.violation_id}">${r.violation_name}</option>
        `).join('');

        const htmlEdit = `
            <div class="modal-body">
                <form id="userForm">
                    <div class="form-group">
                        <label>Danh mục vi phạm:</label>
                        <select id="violation_select" class="form-control">
                            <option value="">--Chọn--</option>
                            ${optionsHtml}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Lý do phê duyệt:</label>
                        <textarea id="reason_approved" class="form-control" rows="4"></textarea>
                    </div>
                </form>
            </div>
        `;

        $('#modalContent_body').html(htmlEdit);
        $('#exampleModalCenter').modal('show');

        $(document).off('click', '#btn_approved_report').on('click', '#btn_approved_report', async  function() {
            $.ajax({
                url: `/api/report/update-status?postId=${postId}`,
                type: 'PUT',
                headers: {
                    'Authorization': sessionStorage.getItem('token')
                },
                contentType: 'application/json',
                data: JSON.stringify({
                    status: 'APPROVED',
                    violationId: $('#violation_select').val(),
                    reason: $('#reason_approved').val()
                }),
                success: function(res) {
                    $('#exampleModalCenter').modal('hide');
                    Swal.fire({
                        icon: 'success',
                        title: 'Phê duyệt tố cáo thành công',
                        showConfirmButton: false,
                        timer: 1500
                    }).then(() => {
                        loadContentReport(currentPage, pageSize, searchText);
                    });
                },
                error: function(err) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi!',
                        text: 'Không thể Phê duyệt tố cáo.',
                    });
                    console.error('Không thể Phê duyệt tố cáo:', err);
                }
            });
        });
    });

});
