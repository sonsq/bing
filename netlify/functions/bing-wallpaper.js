// netlify/functions/bing-proxy.js
const fetch = require('node-fetch');

exports.handler = async (event) => {
  try {
    // 获取必应API数据（添加模拟浏览器请求头）
    const apiResponse = await fetch('https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://www.bing.com/'
      }
    });
    
    const data = await apiResponse.json();
    const baseUrl = data.images[0].urlbase;

    // 生成多分辨率URL（验证必应最新URL格式）
    const resolutions = {
      pc: '_1920x1080',
      pad: '_1366x768',
      mobile: '_1080x1920',
      uhd: '_UHD'  // 添加4K分辨率备用
    };

    // 返回包含版权信息的完整数据
    return {
      statusCode: 200,
      body: JSON.stringify({
        pc: `https://www.bing.com${baseUrl}${resolutions.pc}.jpg`,
        pad: `https://www.bing.com${baseUrl}${resolutions.pad}.jpg`,
        mobile: `https://www.bing.com${baseUrl}${resolutions.mobile}.jpg`,
        uhd: `https://www.bing.com${baseUrl}${resolutions.uhd}.jpg`,
        copyright: data.images[0].copyright
      })
    };
  } catch (error) {
    console.error('Bing API Error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: '服务暂不可用' }) };
  }
};
