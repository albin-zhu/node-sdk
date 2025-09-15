/**
 * 飞书 API 基础客户端使用示例
 */

import { FeishuClient } from './simple-client.ts';

async function main() {
    // 创建客户端实例
    const client = new FeishuClient({
        appId: 'cli_a78484ec95fe900b',  // 替换为你的 app_id
        appSecret: 'gthEI9TSA4WmDnCUuFeWweqEi76whocZ',  // 替换为你的 app_secret
        domain: 'feishu'  // 'feishu' 或 'lark'
    });

    try {
        console.log('🚀 开始测试飞书 API...\n');

        // 示例 1: 获取应用信息 (需要权限，跳过)
        console.log('1️⃣ 跳过获取应用信息 (需要管理员权限)\n');

        // 示例 2: 获取表格信息
        console.log('2️⃣ 获取表格信息');
        const sheetInfo = await client.get('/open-apis/sheets/v3/spreadsheets/KQR3sOZZ3hv81LtJX0kclEfEnNb/sheets/iOcwZm');
        console.log(`表格标题: ${sheetInfo.data?.sheet?.title}`);
        console.log(`行数: ${sheetInfo.data?.sheet?.grid_properties?.row_count}`);
        console.log(`列数: ${sheetInfo.data?.sheet?.grid_properties?.column_count}\n`);

        // 示例 3: 读取表格数据
        console.log('3️⃣ 读取表格数据');
        const sheetData = await client.get('/open-apis/sheets/v2/spreadsheets/KQR3sOZZ3hv81LtJX0kclEfEnNb/values/iOcwZm!A1:C3');
        console.log('表格数据:');
        console.log(JSON.stringify(sheetData.data, null, 2));
        console.log();

        // 示例 4: 发送消息 (需要有群聊权限)
        console.log('4️⃣ 发送消息示例 (需要配置群聊ID)');
        try {
            const message = await client.post('/open-apis/im/v1/messages', {
                receive_id: 'your_chat_id',  // 替换为实际的群聊ID
                msg_type: 'text',
                content: JSON.stringify({
                    text: '你好！这是来自 Deno 的消息 🦕'
                })
            }, {
                receive_id_type: 'chat_id'
            });
            console.log('消息发送成功:', message.data?.message_id);
        } catch (error) {
            console.log('消息发送失败 (需要配置正确的群聊ID):', error.message);
        }

        console.log('\n✅ 测试完成！');

    } catch (error) {
        console.error('❌ 错误:', error.message);
    }
}

// 如果直接运行此文件则执行 main 函数
if (import.meta.main) {
    await main();
}