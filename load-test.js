// THÔNG TIN CẦN THIẾT
const API_URL = 'http://localhost:3001/submissions';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQG9qLmNvbSIsInN1YiI6IjI2NjRhMjFiLTExYTYtNGIwMi1hMGMyLThkYWVjZmYwYzJmNCIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc3ODEyNDA3MywiZXhwIjoxNzc4MjEwNDczfQ.PA6sJvj4ZMcpF0TF_sOwasQEAriWElGWzNoKreeceIY';
const PROBLEM_ID = 'de731441-459f-4f6b-ae6e-df5b438d3d48';

const code = `
a, b = map(int, input().split())
print(a + b)
`;

async function stressTest(total) {
    console.log(`🧨 BẮT ĐẦU STRESS TEST: Gửi ồ ạt ${total} bài cùng một lúc...`);
    
    let successCount = 0;
    let failCount = 0;

    // Tạo mảng 1000 Promise gửi bài cùng lúc
    const requests = Array.from({ length: total }).map((_, i) => 
        fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN}`
            },
            body: JSON.stringify({
                problemId: PROBLEM_ID,
                code: code,
                language: 'python'
            })
        })
        .then(res => {
            if (res.ok) successCount++;
            else failCount++;
        })
        .catch(err => {
            failCount++;
        })
    );

    console.log('⏳ Đang bắn yêu cầu... vui lòng đợi trong giây lát...');
    
    // Đợi toàn bộ 1000 bài được gửi đi
    await Promise.all(requests);

    console.log('\n🏁 TỔNG KẾT STRESS TEST:');
    console.log(`✅ Server đã nhận thành công: ${successCount} bài`);
    console.log(`❌ Thất bại do quá tải mạng/socket: ${failCount} bài`);
    console.log('\n👉 Kiểm tra AWS Lambda Console ngay để thấy hàng nghìn container được khởi tạo!');
}

stressTest(1000);
