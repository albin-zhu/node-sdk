import { Client, AppType, Domain } from './mod.ts';

if(import.meta.main){
    const client = new Client({
        appId: "cli_a78484ec95fe900b",
        appSecret: "gthEI9TSA4WmDnCUuFeWweqEi76whocZ",
        disableTokenCache: false,
        domain: Domain.Feishu,
        appType: AppType.SelfBuild,
    });

    try {
        // 使用基础的 request 方法调用飞书 API
        // 获取表格工作表信息
        const response = await client.request({
            method: 'GET',
            url: `/open-apis/sheets/v3/spreadsheets/KQR3sOZZ3hv81LtJX0kclEfEnNb/sheets/iOcwZm`
        });

        console.log('✅ API 调用成功');
        console.log('响应数据:', JSON.stringify(response, null, 2));
    } catch (error) {
        console.error('❌ API 调用失败:', error);
    }
}