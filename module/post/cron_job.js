import PostRepository from "./post.repository.js";
import cron, { schedule } from 'node-cron';

cron.schedule('0 0 * * *', async () => {
    console.log("Cron Job Running at 00:00:", new Date());

    try {
        const expiredPosts = await PostRepository.getExpiredPosts();

        for (const post of expiredPosts) {
            await PostRepository.update(post.id, { status: 'EXPIRED' });
        }

        console.log(`Đã cập nhật ${expiredPosts.length} bài viết hết hạn.`);
    } catch (error) {
        console.error("Cron job error:", error);
    }
});

// cron.schedule('* * * * *', () => {
//     console.log('Cronjob chạy mỗi 1 phút:', new Date().toLocaleString());
//     // Gọi hàm check expired bài viết ở đây
// });