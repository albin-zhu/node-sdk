// Simple test for client functionality in Deno
import { Client, AppType, Domain } from './mod.ts';

// Test basic client instantiation
try {
    const client = new Client({
        appId: 'test_app_id',
        appSecret: 'test_app_secret',
        domain: Domain.Feishu,
        appType: AppType.SelfBuild
    });

    console.log('✅ Client created successfully');
    console.log('App ID:', client.appId);
    console.log('Domain:', client.domain);
    console.log('App Type:', client.appType);

    // Test formatPayload method
    const payload = await client.formatPayload(
        {
            data: { test: 'data' },
            headers: { 'Custom-Header': 'value' }
        },
        {
            lark: {},
            params: { param1: 'value1' }
        }
    );

    console.log('✅ FormatPayload works');
    console.log('Formatted payload:', JSON.stringify(payload, null, 2));

} catch (error) {
    console.error('❌ Error testing client:', error);
}

console.log('🚀 Basic client test completed!');