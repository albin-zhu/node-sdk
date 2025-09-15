// 飞书 Deno SDK 使用示例
import { Client, AppType, Domain } from './mod.ts';

async function main() {
    // 创建客户端实例
    const client = new Client({
        appId: "your_app_id",
        appSecret: "your_app_secret",
        domain: Domain.Feishu,
        appType: AppType.SelfBuild,
    });

    try {
        // 示例 1: 获取应用信息
        console.log('=== 获取应用信息 ===');
        const appInfo = await client.request({
            method: 'GET',
            url: '/open-apis/application/v6/applications/self'
        });
        console.log('应用信息:', JSON.stringify(appInfo, null, 2));

        // 示例 2: 发送消息到群聊
        console.log('\n=== 发送消息示例 ===');
        const message = await client.request({
            method: 'POST',
            url: '/open-apis/im/v1/messages',
            params: {
                receive_id_type: 'chat_id'
            },
            data: {
                receive_id: 'your_chat_id',
                msg_type: 'text',
                content: JSON.stringify({
                    text: 'Hello from Deno! 🦕'
                })
            }
        });
        console.log('消息发送结果:', JSON.stringify(message, null, 2));

        // 示例 3: 获取表格数据
        console.log('\n=== 获取表格数据 ===');
        const sheetData = await client.request({
            method: 'GET',
            url: '/open-apis/sheets/v2/spreadsheets/your_sheet_token/values/Sheet1!A1:C10'
        });
        console.log('表格数据:', JSON.stringify(sheetData, null, 2));

        // 示例 4: 使用用户访问令牌
        console.log('\n=== 使用用户访问令牌 ===');
        const userInfo = await client.request({
            method: 'GET',
            url: '/open-apis/authen/v1/user_info'
        }, {
            lark: {
                [Symbol.for('with-user-access-token')]: 'user_access_token_here'
            }
        });
        console.log('用户信息:', JSON.stringify(userInfo, null, 2));

    } catch (error) {
        console.error('API 调用失败:', error);
    }
}

// 运行示例
if (import.meta.main) {
    await main();
}

export { main };